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
  checkCamera: () => Promise<boolean>;

  // Error handling
  error: string | null;
  clearError: () => void;
}

const defaultFormData: LivestreamFormData = {
  title: "",
  description: "",
  category: "Skincare Tutorial",
  isPrivate: false,
};

const LivestreamContext = createContext<LivestreamContextType | undefined>(
  undefined
);

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

  // Thêm một ref để theo dõi xem đã gọi startPublishing chưa
  const isPublishingRef = useRef(false);
  const publishTimeoutIdsRef = useRef<number[]>([]);

  // Data
  const [viewerCount, setViewerCount] = useState<number>(0);

  // Xóa lỗi
  const clearError = () => setError(null);

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
    setError(null);
    isCreatingRoomRef.current = false;
    isPublishingRef.current = false;

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

    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    // Navigate back to livestream manager
    router.push("/clinicManager/live-stream");
  };

  // Kiểm tra camera
  const checkCamera = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Hiển thị video trong một thời gian ngắn để kiểm tra
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Dừng stream sau 3 giây
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
      }, 3000);

      return true;
    } catch (error) {
      console.error("Camera check failed:", error);
      setError(`Không thể truy cập camera: ${(error as Error).message}`);
      return false;
    }
  };

  // Đăng ký các event handler cho SignalR
  const registerSignalRHandlers = (connection: signalR.HubConnection) => {
    // Xóa tất cả các handler hiện có để tránh đăng ký nhiều lần
    connection.off("RoomCreatedAndJoined");
    connection.off("PublishStarted");
    connection.off("ListenerCountUpdated");
    connection.off("LivestreamEnded");
    connection.off("JanusError");

    // Đăng ký lại các handler
    connection.on(
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

    signalRConnectionRef?.current?.on(
      "PublishStarted",
      async ({ sessionId, jsep }: PublishStartedData) => {
        console.log("✅ PublishStarted event received", sessionId);

        // Xóa tất cả các timeout đang chờ
        publishTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
        publishTimeoutIdsRef.current = [];

        // Sử dụng peerConnectionRef.current thay vì peerConnection
        if (peerConnectionRef.current) {
          setSessionId(sessionId);
          try {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: jsep,
              })
            );
            console.log("✅ Remote description set successfully");
            setIsPublish(true);
            clearError(); // Xóa bất kỳ lỗi nào đang hiển thị
            console.log("✅ isPublish set to true");
          } catch (error) {
            console.error("❌ Error setting remote description:", error);
            setError("Không thể thiết lập kết nối media. Vui lòng thử lại.");
          }
        } else {
          console.error(
            "❌ No peer connection available for PublishStarted event"
          );
          setError("Không có kết nối peer. Vui lòng làm mới trang và thử lại.");
        }
      }
    );

    connection.on("ListenerCountUpdated", (count: number) => {
      setViewerCount(count);
    });

    connection.on("LivestreamEnded", () => {
      console.log("🚨 Livestream has ended");
      alert("Livestream đã kết thúc");
      resetLivestream();
    });

    connection.on("JanusError", (message: string) => {
      console.error("🚨 Janus Error:", message);
      setError(message);
      setIsConnecting(false);
      isCreatingRoomRef.current = false; // Reset flag khi có lỗi
      isPublishingRef.current = false; // Reset flag khi có lỗi
    });
  };

  // Sửa lại hàm initializeConnection để không tự động gọi HostCreateRoom
  const initializeConnection = async () => {
    if (!formData) {
      setError(
        "Không tìm thấy dữ liệu livestream. Vui lòng tạo livestream trước."
      );
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
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000]) // Thử kết nối lại với thời gian chờ tăng dần
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await conn.start();
      console.log("✅ Connected to SignalR");
      signalRConnectionRef.current = conn;
      setIsConnected(true);

      // Đăng ký các event handler
      registerSignalRHandlers(conn);

      return conn;
    } catch (error) {
      console.error("Failed to connect to SignalR:", error);
      setError(
        "Không thể kết nối đến máy chủ phát sóng. Vui lòng thử lại sau."
      );
      setIsConnecting(false);
      setIsConnected(false);
      isCreatingRoomRef.current = false; // Reset flag khi có lỗi
      isPublishingRef.current = false; // Reset flag khi có lỗi
      return null;
    }
  };

  // Sửa lại hàm createRoom để chỉ gọi HostCreateRoom một lần
  const createRoom = async () => {
    if (!formData) {
      setError(
        "Không tìm thấy dữ liệu livestream. Vui lòng tạo livestream trước."
      );
      return;
    }

    // Nếu đang tạo phòng, không làm gì cả
    if (isCreatingRoomRef.current) {
      console.log("Đã đang tạo phòng, bỏ qua lệnh gọi trùng lặp");
      return;
    }

    // Đánh dấu đang tạo phòng
    isCreatingRoomRef.current = true;
    setIsConnecting(true);
    setError(null);

    try {
      // Đảm bảo có kết nối
      const connection =
        signalRConnectionRef.current?.state ===
        signalR.HubConnectionState.Connected
          ? signalRConnectionRef.current
          : await initializeConnection();

      if (!connection) {
        throw new Error("Không thể thiết lập kết nối");
      }

      // Gọi HostCreateRoom
      console.log("Calling HostCreateRoom");
      await connection.invoke("HostCreateRoom");
      console.log("Room creation request sent");

      // Thiết lập timeout để kiểm tra nếu không nhận được phản hồi
      setTimeout(() => {
        if (!isCreateRoom && isCreatingRoomRef.current) {
          console.log(
            "⚠️ No RoomCreatedAndJoined event received after 10 seconds"
          );
          setError(
            "Không nhận được phản hồi từ máy chủ sau 10 giây. Vui lòng thử lại."
          );
          setIsConnecting(false);
          isCreatingRoomRef.current = false;
        }
      }, 10000);
    } catch (error) {
      console.error("Error in createRoom:", error);
      setError("Không thể tạo phòng phát sóng. Vui lòng thử lại.");
      setIsConnecting(false);
      isCreatingRoomRef.current = false; // Reset flag khi có lỗi
    }
  };

  // Sửa lại hàm startPublishing để lưu peerConnection vào cả ref và state
  const startPublishing = async () => {
    console.log("Starting publishing process...");
    setError(null);

    // Nếu đang phát sóng, không làm gì cả
    if (isPublishingRef.current) {
      console.log("Đã đang phát sóng, bỏ qua lệnh gọi trùng lặp");
      return;
    }

    // Đánh dấu đang phát sóng
    isPublishingRef.current = true;

    if (
      signalRConnectionRef.current?.state ===
      signalR.HubConnectionState.Connected
    ) {
      try {
        console.log("Getting user media...");

        // Thử với các constraints khác nhau, bắt đầu với chất lượng cao nhất
        // và giảm dần nếu không thành công
        const constraints = [
          // Chất lượng cao (1080p)
          {
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 },
            },
            audio: true,
          },
          // Chất lượng trung bình (720p)
          {
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            },
            audio: true,
          },
          // Chất lượng thấp (480p)
          {
            video: {
              width: { ideal: 854 },
              height: { ideal: 480 },
              frameRate: { ideal: 30 },
            },
            audio: true,
          },
          // Chỉ sử dụng mặc định
          {
            video: true,
            audio: true,
          },
          // Chỉ audio nếu không có camera
          {
            video: false,
            audio: true,
          },
        ];

        let stream = null;
        let errorMessage = "";

        // Thử từng constraint cho đến khi thành công
        for (const constraint of constraints) {
          try {
            stream = await navigator.mediaDevices.getUserMedia(constraint);
            console.log(
              "✅ Got user media stream with constraints:",
              constraint
            );
            break; // Thoát khỏi vòng lặp nếu thành công
          } catch (err) {
            errorMessage = (err as Error).message;
            console.warn(
              "⚠️ Failed to get media with constraints:",
              constraint,
              err
            );
            // Tiếp tục thử với constraint tiếp theo
          }
        }

        if (!stream) {
          throw new Error(
            `Không thể truy cập camera hoặc microphone: ${errorMessage}`
          );
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log("✅ Set local video source");
        }

        console.log("Creating peer connection...");
        const newPeerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });
        console.log("✅ Created peer connection");

        // Lưu peerConnection vào ref ngay lập tức để có thể sử dụng trong event handler
        peerConnectionRef.current = newPeerConnection;

        // Thêm các event listener cho peer connection
        newPeerConnection.onicecandidate = (event) => {
          console.log("ICE candidate:", event.candidate);
        };

        newPeerConnection.oniceconnectionstatechange = () => {
          console.log(
            "ICE connection state:",
            newPeerConnection.iceConnectionState
          );

          // Chỉ hiển thị lỗi nếu trạng thái là failed
          if (newPeerConnection.iceConnectionState === "failed") {
            setError("Kết nối ICE thất bại. Vui lòng thử lại.");
            isPublishingRef.current = false;
          }
          // Trạng thái disconnected có thể là tạm thời, không hiển thị lỗi ngay
          else if (newPeerConnection.iceConnectionState === "disconnected") {
            console.log(
              "⚠️ ICE connection disconnected, may reconnect automatically"
            );
            // Đặt timeout để kiểm tra lại sau 5 giây
            setTimeout(() => {
              if (
                peerConnectionRef.current?.iceConnectionState === "disconnected"
              ) {
                console.log(
                  "❌ ICE connection still disconnected after 5 seconds"
                );
                setError(
                  "Kết nối bị gián đoạn. Vui lòng làm mới trang và thử lại."
                );
              }
            }, 5000);
          }
          // Nếu kết nối thành công, đảm bảo trạng thái isPublish được cập nhật
          else if (
            newPeerConnection.iceConnectionState === "connected" ||
            newPeerConnection.iceConnectionState === "completed"
          ) {
            console.log("✅ ICE connection established successfully");
            setIsPublish(true);
            // Xóa tất cả các timeout đang chờ
            publishTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
            publishTimeoutIdsRef.current = [];
          }
        };

        newPeerConnection.onicegatheringstatechange = () => {
          console.log(
            "ICE gathering state:",
            newPeerConnection.iceGatheringState
          );
        };

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

        const publishTimeoutId = setTimeout(() => {
          if (!isPublish && isPublishingRef.current) {
            console.log("⚠️ No PublishStarted event received after 15 seconds");
            // Kiểm tra xem stream có đang hoạt động không trước khi hiển thị lỗi
            if (
              peerConnectionRef.current?.iceConnectionState === "connected" ||
              peerConnectionRef.current?.iceConnectionState === "completed"
            ) {
              console.log(
                "✅ ICE connection is actually working, ignoring timeout"
              );
              setIsPublish(true); // Cập nhật trạng thái nếu kết nối thực sự đang hoạt động
            } else {
              setError(
                "Không nhận được phản hồi từ máy chủ sau 15 giây. Vui lòng thử lại."
              );
              isPublishingRef.current = false;
            }
          }
        }, 15000); // Tăng thời gian timeout lên 15 giây

        // Lưu ID của timeout để có thể xóa nó nếu nhận được sự kiện PublishStarted
        publishTimeoutIdsRef.current.push(
          publishTimeoutId as unknown as number
        );

        // Thiết lập timeout để kiểm tra nếu không nhận được sự kiện PublishStarted
      } catch (error) {
        console.error("🚨 Error starting publishing:", error);

        // Cung cấp thông báo lỗi thân thiện với người dùng
        let errorMessage = "Không thể bắt đầu phát sóng.";

        if ((error as Error).name === "NotReadableError") {
          errorMessage =
            "Không thể truy cập camera. Camera có thể đang được sử dụng bởi ứng dụng khác hoặc bị ngắt kết nối.";
        } else if ((error as Error).name === "NotAllowedError") {
          errorMessage =
            "Bạn đã từ chối quyền truy cập camera và microphone. Vui lòng cấp quyền và thử lại.";
        } else if ((error as Error).name === "NotFoundError") {
          errorMessage =
            "Không tìm thấy camera hoặc microphone trên thiết bị của bạn.";
        } else if ((error as Error).name === "OverconstrainedError") {
          errorMessage = "Camera của bạn không hỗ trợ độ phân giải yêu cầu.";
        } else if ((error as Error).name === "TypeError") {
          errorMessage = "Lỗi cấu hình: " + (error as Error).message;
        }

        setError(errorMessage);
        isPublishingRef.current = false;
      }
    } else {
      console.error("🚨 SignalR connection not ready");
      setError(
        "Kết nối đến máy chủ phát sóng chưa sẵn sàng. Vui lòng làm mới trang."
      );
      isPublishingRef.current = false;
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
          setError("Không thể kết thúc livestream. Vui lòng thử lại.");
        });
    } else {
      console.error("🚨 SignalR connection not ready");
      setError(
        "Kết nối đến máy chủ phát sóng chưa sẵn sàng. Vui lòng làm mới trang."
      );
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
        signalRConnectionRef.current
          .invoke("KeepAlive", sessionId)
          .catch((err) => {
            console.error("Keep alive error:", err);
            // Nếu keep alive thất bại, thử kết nối lại
            if (
              signalRConnectionRef.current?.state !==
              signalR.HubConnectionState.Connected
            ) {
              initializeConnection();
            }
          });
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isCreateRoom, sessionId]);

  // Theo dõi khi isPublish thay đổi để cập nhật isPublishingRef
  useEffect(() => {
    if (isPublish) {
      // Nếu đã publish thành công, giữ nguyên isPublishingRef = true
    } else {
      // Nếu không còn publish, reset isPublishingRef
      isPublishingRef.current = false;
    }
  }, [isPublish]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Dọn dẹp kết nối SignalR
      if (
        signalRConnectionRef.current &&
        signalRConnectionRef.current.state ===
          signalR.HubConnectionState.Connected
      ) {
        signalRConnectionRef.current.stop();
      }

      // Dọn dẹp stream video
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Dọn dẹp peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
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
    checkCamera,

    // Error handling
    error,
    clearError,
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
