"use client";

import type React from "react";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useRouter } from "next/navigation";

interface RoomCreatedAndJoinedData {
  roomGuid: string;
  janusRoomId: number;
  sessionId: string;
}

interface PublishStartedData {
  sessionId: string;
  jsep: string;
}

interface LivestreamFormData {
  title: string;
  description: string;
  category: string;
  isPrivate: boolean;
  scheduledTime?: Date;
  thumbnailUrl?: string;
}

interface LivestreamContextType {
  // Form data
  formData: LivestreamFormData | null;
  setFormData: (data: LivestreamFormData) => void;
  isFormSubmitted: boolean;

  // Connection states
  isConnected: boolean;
  isConnecting: boolean;
  isCreateRoom: boolean;
  isPublish: boolean;

  // References
  signalRConnection: signalR.HubConnection | null;
  sessionId: string | null;
  roomGuid: string | null;
  janusRoomId: number | null;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  peerConnection: RTCPeerConnection | null;

  // Data
  viewerCount: number;

  // Functions
  submitForm: (data: LivestreamFormData) => void;
  createRoom: () => void;
  startPublishing: () => Promise<void>;
  endLive: () => void;
  resetLivestream: () => void;

  // Error handling
  error: string | null;
}

const defaultFormData: LivestreamFormData = {
  title: "",
  description: "",
  category: "Skincare Tutorial",
  isPrivate: false,
};

// Tạo một context instance duy nhất
const LivestreamContext = createContext<LivestreamContextType | undefined>(
  undefined
);

// Tạo một biến global để lưu trữ peerConnection
let globalPeerConnection: RTCPeerConnection | null = null;

export function LivestreamProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Form data
  const [formData, setFormDataState] = useState<LivestreamFormData | null>(
    null
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  // Connection states
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCreateRoom, setIsCreateRoom] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // References
  const signalRConnectionRef = useRef<signalR.HubConnection | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roomGuid, setRoomGuid] = useState<string | null>(null);
  const [janusRoomId, setJanusRoomId] = useState<number | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  // Ref để theo dõi xem đã đang tạo phòng hay chưa
  const isCreatingRoomRef = useRef(false);

  // Thêm một ref để theo dõi peerConnection hiện tại
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Data
  const [viewerCount, setViewerCount] = useState<number>(0);

  const setFormData = (data: LivestreamFormData) => {
    setFormDataState(data);
  };

  const submitForm = (data: LivestreamFormData) => {
    setFormData(data);
    setIsFormSubmitted(true);
    // Navigate to host page
    router.push("/clinicManager/live-stream/host-page");
  };

  const resetLivestream = () => {
    // Reset all states
    setIsCreateRoom(false);
    setIsPublish(false);
    setViewerCount(0);
    setSessionId(null);
    setRoomGuid(null);
    setJanusRoomId(null);
    setIsFormSubmitted(false);
    setFormDataState(null);
    isCreatingRoomRef.current = false;

    // Clean up connections
    if (
      signalRConnectionRef.current &&
      signalRConnectionRef.current.state ===
        signalR.HubConnectionState.Connected
    ) {
      signalRConnectionRef.current.stop();
      signalRConnectionRef.current = null;
    }

    // Clean up video stream
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // Clean up peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset global peer connection
    if (globalPeerConnection) {
      globalPeerConnection.close();
      globalPeerConnection = null;
    }

    setPeerConnection(null);

    // Navigate back to livestream manager
    router.push("/clinicManager/live-stream");
  };

  // Sửa lại hàm initializeConnection để không tự động gọi HostCreateRoom
  const initializeConnection = async () => {
    if (!formData) {
      setError("No livestream data found. Please create a livestream first.");
      return null;
    }

    // Nếu đã có kết nối, trả về kết nối hiện tại
    if (
      signalRConnectionRef.current?.state ===
      signalR.HubConnectionState.Connected
    ) {
      return signalRConnectionRef.current;
    }

    setIsConnecting(true);
    setError(null);

    // Tạo kết nối mới
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://beautify.asia/livestreamHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await conn.start();
      console.log("✅ Connected to SignalR");
      signalRConnectionRef.current = conn;
      setIsConnected(true);

      // Register event handlers
      conn.on(
        "RoomCreatedAndJoined",
        ({ roomGuid, janusRoomId, sessionId }: RoomCreatedAndJoinedData) => {
          console.log("✅ RoomCreatedAndJoined:", roomGuid, janusRoomId);
          setSessionId(sessionId);
          setRoomGuid(roomGuid);
          setJanusRoomId(janusRoomId);
          setIsCreateRoom(true);
          setIsConnecting(false);
          isCreatingRoomRef.current = false; // Reset flag sau khi tạo phòng thành công
        }
      );

      // Sửa lại event handler PublishStarted để sử dụng globalPeerConnection
      conn.on(
        "PublishStarted",
        async ({ sessionId, jsep }: PublishStartedData) => {
          console.log("✅ PublishStarted event received", sessionId);
          console.log("Current peerConnectionRef:", peerConnectionRef.current);
          console.log("Current globalPeerConnection:", globalPeerConnection);

          // Sử dụng globalPeerConnection thay vì peerConnectionRef.current
          if (globalPeerConnection) {
            setSessionId(sessionId);
            try {
              await globalPeerConnection.setRemoteDescription(
                new RTCSessionDescription({
                  type: "answer",
                  sdp: jsep,
                })
              );
              console.log("✅ Remote description set successfully");
              setIsPublish(true);
              console.log("✅ isPublish set to true");
            } catch (error) {
              console.error("❌ Error setting remote description:", error);
              setError(
                "Failed to establish media connection. Please try again."
              );
            }
          } else {
            console.error(
              "❌ No peer connection available for PublishStarted event"
            );
            setError(
              "No peer connection available. Please refresh and try again."
            );
          }
        }
      );

      conn.on("ListenerCountUpdated", (count: number) => {
        setViewerCount(count);
      });

      conn.on("LivestreamEnded", () => {
        console.log("🚨 Livestream has ended");
        alert("The livestream has ended");
        resetLivestream();
      });

      conn.on("JanusError", (message: string) => {
        console.error("🚨 Janus Error:", message);
        setError(message);
        setIsConnecting(false);
        isCreatingRoomRef.current = false; // Reset flag khi có lỗi
      });

      return conn;
    } catch (error) {
      console.error("Failed to connect to SignalR:", error);
      setError(
        "Failed to connect to streaming server. Please try again later."
      );
      setIsConnecting(false);
      setIsConnected(false);
      isCreatingRoomRef.current = false; // Reset flag khi có lỗi
      return null;
    }
  };

  // Sửa lại hàm createRoom để chỉ gọi HostCreateRoom một lần
  const createRoom = async () => {
    if (!formData) {
      setError("No livestream data found. Please create a livestream first.");
      return;
    }

    // Nếu đang tạo phòng, không làm gì cả
    if (isCreatingRoomRef.current) {
      console.log("Already creating a room, ignoring duplicate call");
      return;
    }

    // Đánh dấu đang tạo phòng
    isCreatingRoomRef.current = true;
    setIsConnecting(true);

    try {
      // Đảm bảo có kết nối
      const connection =
        signalRConnectionRef.current?.state ===
        signalR.HubConnectionState.Connected
          ? signalRConnectionRef.current
          : await initializeConnection();

      if (!connection) {
        throw new Error("Could not establish connection");
      }

      // Gọi HostCreateRoom
      console.log("Calling HostCreateRoom");
      await connection.invoke("HostCreateRoom");
      console.log("Room creation request sent");
    } catch (error) {
      console.error("Error in createRoom:", error);
      setError("Failed to create streaming room. Please try again.");
      setIsConnecting(false);
      isCreatingRoomRef.current = false; // Reset flag khi có lỗi
    }
  };

  // Sửa lại hàm startPublishing để lưu peerConnection vào biến global
  const startPublishing = async () => {
    console.log("Starting publishing process...");
    setError(null);

    if (
      signalRConnectionRef.current?.state ===
      signalR.HubConnectionState.Connected
    ) {
      try {
        console.log("Getting user media...");
        const constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 60 },
          } as MediaTrackConstraints,
          audio: true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("✅ Got user media stream");

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log("✅ Set local video source");
        }

        console.log("Creating peer connection...");
        const newPeerConnection = new RTCPeerConnection();
        console.log("✅ Created peer connection");

        // Lưu peerConnection vào ref và biến global
        peerConnectionRef.current = newPeerConnection;
        globalPeerConnection = newPeerConnection;
        console.log("Set globalPeerConnection:", globalPeerConnection);

        stream.getTracks().forEach((track) => {
          console.log(`Adding ${track.kind} track to peer connection`);
          newPeerConnection.addTrack(track, stream);
        });

        console.log("Creating offer...");
        const offer = await newPeerConnection.createOffer();
        console.log("✅ Created offer");

        console.log("Setting local description...");
        await newPeerConnection.setLocalDescription(offer);
        console.log("✅ Set local description");

        // Cập nhật state (có thể chậm hơn do React rendering)
        setPeerConnection(newPeerConnection);
        console.log("✅ Updated peer connection state");

        console.log("Invoking StartPublish with roomGuid:", roomGuid);
        await signalRConnectionRef.current.invoke(
          "StartPublish",
          roomGuid,
          offer.type,
          offer.sdp
        );
        console.log("✅ StartPublish request sent");

        // Thêm timeout để kiểm tra nếu không nhận được sự kiện PublishStarted
        setTimeout(() => {
          if (!isPublish) {
            console.log("⚠️ No PublishStarted event received after 5 seconds");
          }
        }, 5000);
      } catch (error) {
        console.error("🚨 Error starting publishing:", error);
        setError(
          `Failed to access camera and microphone: Please check your permissions.`
        );
      }
    } else {
      console.error("🚨 SignalR connection not ready");
      setError("SignalR connection not ready yet. Please refresh the page.");
    }
  };

  const endLive = () => {
    console.log("Ending livestream...");
    if (
      signalRConnectionRef.current?.state ===
      signalR.HubConnectionState.Connected
    ) {
      signalRConnectionRef.current
        .invoke("EndLivestream", roomGuid)
        .then(() => {
          console.log("✅ EndLivestream request sent");
          // Không cần set isPublish = false ở đây vì sẽ được xử lý trong sự kiện LivestreamEnded
        })
        .catch((error) => {
          console.error("❌ Error ending livestream:", error);
          setError("Failed to end livestream. Please try again.");
        });
    } else {
      console.error("🚨 SignalR connection not ready");
      setError("SignalR connection not ready yet. Please refresh the page.");
    }
  };

  // Keep alive interval
  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (
        sessionId &&
        signalRConnectionRef.current &&
        signalRConnectionRef.current.state ===
          signalR.HubConnectionState.Connected &&
        isCreateRoom
      ) {
        console.log("Sending keep alive signal");
        signalRConnectionRef.current.invoke("KeepAlive", sessionId);
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isCreateRoom, sessionId]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (
        signalRConnectionRef.current &&
        signalRConnectionRef.current.state ===
          signalR.HubConnectionState.Connected
      ) {
        signalRConnectionRef.current.stop();
      }

      // Cleanup global peer connection
      if (globalPeerConnection) {
        globalPeerConnection.close();
        globalPeerConnection = null;
      }
    };
  }, []);

  const value = {
    // Form data
    formData,
    setFormData,
    isFormSubmitted,

    // Connection states
    isConnected,
    isConnecting,
    isCreateRoom,
    isPublish,

    // References
    signalRConnection: signalRConnectionRef.current,
    sessionId,
    roomGuid,
    janusRoomId,
    localVideoRef,
    peerConnection,

    // Data
    viewerCount,

    // Functions
    submitForm,
    createRoom,
    startPublishing,
    endLive,
    resetLivestream,

    // Error handling
    error,
  };

  return (
    <LivestreamContext.Provider value={value}>
      {children}
    </LivestreamContext.Provider>
  );
}

export function useLivestream() {
  const context = useContext(LivestreamContext);
  if (context === undefined) {
    throw new Error("useLivestream must be used within a LivestreamProvider");
  }
  return context;
}
