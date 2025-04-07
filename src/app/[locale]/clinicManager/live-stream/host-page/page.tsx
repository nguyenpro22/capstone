"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import HostPageStreamScreen from "@/components/clinicManager/livestream/host-page-stream-screen";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

interface ChatMessage {
  message: string;
  sender?: string;
  timestamp?: string;
}

interface Reaction {
  id: number;
  emoji: string;
  left: number;
  key: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  category?: {
    name: string;
  };
  minPrice: number;
  maxPrice: number;
  discountLivePercent: number;
  visible: boolean;
  images?: string[];
}

interface LivestreamData {
  name: string;
  description?: string;
}

export default function HostLivestreamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get("roomId");

  // Estado para almacenar los datos del livestream
  const [livestreamData, setLivestreamData] = useState<LivestreamData | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const signalR_Connection = useRef<signalR.HubConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const roomGuidRef = useRef<string | null>(null);
  const janusRoomIdRef = useRef<number | null>(null);
  const [view, setView] = useState<number>(0);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isCreateRoom, setIsCreateRoom] = useState<boolean>(false);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [connectionAttempted, setConnectionAttempted] =
    useState<boolean>(false);

  // Thêm state để theo dõi trạng thái kết nối
  const [connectionState, setConnectionState] =
    useState<string>("disconnected");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [joinAttempts, setJoinAttempts] = useState<number>(0);
  const [roomCreationInProgress, setRoomCreationInProgress] =
    useState<boolean>(false);

  const roomCreationAttemptedRef = useRef<boolean>(false);
  const token = getAccessToken() as string;
  const { clinicId, userId } = GetDataByToken(token) as TokenData;
  // Cargar los datos del livestream desde sessionStorage
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("livestreamData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setLivestreamData(parsedData);
        console.log("Loaded livestream data:", parsedData);
      } else {
        console.warn("No livestream data found in sessionStorage");
      }

      const storedImage = sessionStorage.getItem("coverImagePreview");
      if (storedImage) {
        setCoverImagePreview(storedImage);
      }
    } catch (error) {
      console.error("Error loading livestream data:", error);
    }
  }, []);

  // Sử dụng một hàm riêng để kiểm tra kết nối
  const isConnectionReady = () => {
    return (
      signalR_Connection.current !== null &&
      connectionState === "connected" &&
      signalR_Connection.current.state === signalR.HubConnectionState.Connected
    );
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `https://api.beautify.asia/signaling-api/LiveStream/Services?clinicId=${clinicId}&userId=${userId}&roomId=${roomGuidRef.current}`
      );
      const data = await response.json();

      if (data.isSuccess) {
        const services = data.value.map((service: Service) => ({
          ...service,
          visible: false,
        }));
        setServices(services);
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // Define the reactions map
  const reactionsMap: Record<number, { emoji: string; text: string }> = {
    1: { emoji: "👍", text: "Looks great!" },
    2: { emoji: "❤️", text: "Love it!" },
    3: { emoji: "🔥", text: "That's fire!" },
    4: { emoji: "👏", text: "Amazing work!" },
    5: { emoji: "😍", text: "Beautiful!" },
  };

  // Hoàn toàn viết lại phần khởi tạo kết nối SignalR
  useEffect(() => {
    // Si tenemos un roomId en la URL, no necesitamos esperar los datos del livestream
    const canProceed = roomIdParam || livestreamData;

    // Verificar si podemos proceder
    if (!canProceed) {
      console.log("Waiting for livestream data or room ID...");
      return;
    }

    // Prevent multiple connection attempts
    if (connectionAttempted) {
      console.log(
        "Connection already attempted, skipping duplicate connection"
      );
      return;
    }
    setConnectionAttempted(true);

    // Đánh dấu đang trong quá trình kết nối
    setIsConnecting(true);
    setConnectionState("connecting");

    console.log("Initializing SignalR connection...");

    // Limpiar cualquier conexión existente antes de crear una nueva
    if (signalR_Connection.current) {
      console.log("Cleaning up existing connection before creating a new one");
      signalR_Connection.current.stop().catch((err) => {
        console.error("Error stopping existing connection:", err);
      });
      signalR_Connection.current = null;
    }

    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://api.beautify.asia/signaling-api/LivestreamHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Cập nhật state khi trạng thái kết nối thay đổi
    conn.onreconnecting(() => {
      console.log("SignalR reconnecting...");
      setConnectionState("reconnecting");
    });

    conn.onreconnected(() => {
      console.log("SignalR reconnected!");
      setConnectionState("connected");
    });

    conn.onclose(() => {
      console.log("SignalR connection closed");
      setConnectionState("disconnected");
    });

    // Thiết lập các event handler cho các sự kiện từ server
    conn.on(
      "RoomCreatedAndJoined",
      async ({
        roomGuid,
        janusRoomId,
        sessionId,
      }: {
        roomGuid: string;
        janusRoomId: number;
        sessionId: string;
      }) => {
        console.log("✅ RoomCreatedAndJoined:", roomGuid, janusRoomId);
        sessionIdRef.current = sessionId;
        roomGuidRef.current = roomGuid;
        janusRoomIdRef.current = janusRoomId;
        setIsCreateRoom(true);
        setRoomCreationInProgress(false);

        // Después de crear la sala, actualizar la información con los datos del formulario
        if (roomGuid && livestreamData) {
          try {
            console.log("Updating room information:", livestreamData);
            // Aquí podrías hacer una llamada API para actualizar la información de la sala
            // Por ejemplo:
            // await fetch(`https://api.beautify.asia/signaling-api/LiveStream/Rooms/${roomGuid}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     name: livestreamData.name,
            //     description: livestreamData.description,
            //     // otros campos como coverImage si es necesario
            //   })
            // });
          } catch (error) {
            console.error("Error updating room information:", error);
          }
        }

        // Fetch services for this room
        fetchServices();
      }
    );

    conn.on(
      "PublishStarted",
      async ({ sessionId, jsep }: { sessionId: string; jsep: string }) => {
        if (peerConnectionRef.current) {
          sessionIdRef.current = sessionId;
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription({
              type: "answer",
              sdp: jsep,
            })
          );
          setIsPublish(true);
        }
      }
    );

    conn.on("ListenerCountUpdated", async (view: number) => {
      setView(view);
    });

    conn.on("ReceiveMessage", async (message: ChatMessage) => {
      setChatMessage((prev) => [...prev, message]);
    });

    // Updated ReceiveReaction handler
    conn.on("ReceiveReaction", async ({ id }: { id: string | number }) => {
      console.log("Received reaction ID:", id);

      // Convert to number if it's a string
      const reactionId =
        typeof id === "string" ? Number.parseInt(id, 10) : (id as number);

      if (reactionsMap[reactionId]) {
        const reaction: Reaction = {
          id: reactionId,
          emoji: reactionsMap[reactionId].emoji,
          left: Math.floor(Math.random() * 70) + 10, // Random position 10-80% from left
          key: `reaction-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`, // Unique key
        };

        console.log("Adding new reaction:", reaction);
        setActiveReactions((prev) => [...prev, reaction]);

        // Remove the reaction after animation completes
        setTimeout(() => {
          setActiveReactions((prev) =>
            prev.filter((r) => r.key !== reaction.key)
          );
        }, 3000);
      } else {
        console.warn("Received unknown reaction ID:", reactionId);
      }
    });

    conn.on("LivestreamEnded", async () => {
      console.log("🚨 Livestream has ended");
      alert("The livestream has ended");
      // Clean up UI state (if needed)
      setIsCreateRoom(false);
      setIsPublish(false);
      setView(0);
      setChatMessage([]);

      // ✅ Stop and reset local video stream
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop each track (audio + video)
        localVideoRef.current.srcObject = null; // Remove stream reference
      }

      // ✅ Cleanup peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.getSenders().forEach((sender) => {
          peerConnectionRef.current?.removeTrack(sender);
        });
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // ✅ Reset connection states
      roomGuidRef.current = null;
      janusRoomIdRef.current = null;
      sessionIdRef.current = null;

      // Navigate back to host page
      router.push("/clinicManager/live-stream");
    });

    conn.on(
      "UpdateServicePromotion",
      async ({
        id,
        discountLivePercent,
      }: {
        id: string;
        discountLivePercent: number;
      }) => {
        setServices((prev) =>
          prev.map((service) =>
            service.id === id ? { ...service, discountLivePercent } : service
          )
        );
      }
    );

    conn.on("JanusError", async (message: string) => {
      console.error("🚨 Janus Error:", message);
      alert(`Error: ${message}`);
    });

    // Store the connection reference before starting
    signalR_Connection.current = conn;

    // Bắt đầu kết nối
    console.log("Starting SignalR connection...");
    conn
      .start()
      .then(() => {
        console.log("✅ SignalR Connected successfully!");
        setConnectionState("connected");
        setIsConnecting(false);

        // Si tenemos un roomId en la URL, usarlo directamente
        if (
          roomIdParam &&
          !roomCreationAttemptedRef.current &&
          !roomCreationInProgress
        ) {
          console.log("Using existing room ID from URL:", roomIdParam);
          roomCreationAttemptedRef.current = true;

          // Establecer el ID de sala directamente
          roomGuidRef.current = roomIdParam;
          setIsCreateRoom(true);

          // Intentar obtener servicios para esta sala
          fetchServices();

          console.log("Room setup complete with existing ID");
        }
        // Crear una nueva sala solo si tenemos datos del livestream y no hay roomId
        else if (
          livestreamData &&
          !roomCreationAttemptedRef.current &&
          !roomCreationInProgress
        ) {
          console.log(
            "Creating new room with livestream data:",
            livestreamData
          );
          roomCreationAttemptedRef.current = true;
          setRoomCreationInProgress(true);

          conn
            .invoke("HostCreateRoom")
            .then(() => {
              console.log("Room creation request sent successfully");
              // El evento RoomCreatedAndJoined manejará el resto
            })
            .catch((err) => {
              console.error("Error creating room:", err);
              setRoomCreationInProgress(false);
              alert("Failed to create livestream room. Please try again.");
            });
        }
      })
      .catch((err) => {
        console.error("❌ Error connecting to SignalR:", err);
        setConnectionState("error");
        setIsConnecting(false);
        alert(
          "Failed to connect to SignalR. Please refresh the page and try again."
        );
      });

    // Cleanup khi component unmount
    return () => {
      console.log("Cleaning up SignalR connection...");
      if (conn && conn.state === signalR.HubConnectionState.Connected) {
        conn
          .stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((err) =>
            console.error("Error stopping SignalR connection:", err)
          );
      }
    };
  }, [
    livestreamData,
    router,
    connectionAttempted,
    roomCreationInProgress,
    roomIdParam,
  ]);

  // Añadir un nuevo efecto para manejar la desconexión y limpieza cuando el usuario abandona la página
  useEffect(() => {
    // Función para manejar el evento beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Si estamos transmitiendo, intentar detener la transmisión
      if (isPublish && roomGuidRef.current && isConnectionReady()) {
        signalR_Connection
          .current!.invoke("EndLivestream", roomGuidRef.current)
          .catch((err) => {
            console.error("Error ending livestream on page unload:", err);
          });
      }

      // Detener todas las pistas de medios
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Cerrar la conexión peer
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };

    // Añadir el evento
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // También intentar detener la transmisión si el componente se desmonta mientras está transmitiendo
      if (isPublish && roomGuidRef.current && isConnectionReady()) {
        signalR_Connection
          .current!.invoke("EndLivestream", roomGuidRef.current)
          .catch((err) => {
            console.error("Error ending livestream on component unmount:", err);
          });
      }
    };
  }, [isPublish]);

  // Modificar la función endLive para manejar mejor los diferentes IDs de sala
  const endLive = () => {
    if (
      !(
        signalR_Connection.current !== null &&
        connectionState === "connected" &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected
      )
    ) {
      alert("SignalR connection not ready. Please try again.");
      return;
    }

    if (!roomGuidRef.current) {
      alert(
        "No room ID available to end livestream. Please refresh and try again."
      );
      return;
    }

    console.log(
      "Attempting to end livestream with room ID:",
      roomGuidRef.current
    );

    signalR_Connection
      .current!.invoke("EndLivestream", roomGuidRef.current)
      .then(() => {
        console.log("Successfully ended livestream");
        // El evento LivestreamEnded manejará la limpieza y navegación
      })
      .catch((err) => {
        console.error("Error ending livestream:", err);
        alert(
          "Error ending livestream. This may happen if you're not the owner of this livestream or if the session has expired."
        );

        // Opcionalmente, podemos intentar limpiar el estado de la UI para permitir al usuario salir
        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          localVideoRef.current.srcObject = null;
        }

        // Preguntar al usuario si desea volver a la página principal
        if (confirm("Would you like to return to the main page?")) {
          router.push("/clinicManager/live-stream");
        }
      });
  };

  const sendMessage = async (message: string) => {
    if (isConnectionReady() && roomGuidRef.current != null) {
      if (message) {
        signalR_Connection
          .current!.invoke("SendMessage", roomGuidRef.current, message)
          .catch((err) => {
            console.error("Error sending message:", err);
          });
      }
    }
  };

  const startPublishing = async () => {
    if (isConnectionReady()) {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 60 },
          } as MediaTrackConstraints,
          audio: true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
          const sender = peerConnection.addTrack(track, stream);
          if (track.kind === "video") {
            const parameters = sender.getParameters();
            if (!parameters.encodings) {
              parameters.encodings = [{}];
            }
            parameters.encodings[0].maxBitrate = 3000000;
            sender.setParameters(parameters);
          }
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        peerConnectionRef.current = peerConnection;

        if (roomGuidRef.current) {
          signalR_Connection
            .current!.invoke(
              "StartPublish",
              roomGuidRef.current,
              offer.type,
              offer.sdp
            )
            .catch((err) => {
              console.error("Error starting publishing:", err);
              alert("Error starting publishing. Please try again.");
            });
        }
      } catch (error) {
        console.error("🚨 Error starting publishing:", error);
        alert(
          "Error accessing camera and microphone. Please check your permissions and try again."
        );
      }
    } else {
      alert("🚨 SignalR connection not ready yet!");
    }
  };

  const setPromotionService = async (serviceId: string, percent: number) => {
    if (isConnectionReady() && roomGuidRef.current != null) {
      if (serviceId && percent) {
        signalR_Connection
          .current!.invoke(
            "SetPromotionService",
            serviceId,
            roomGuidRef.current,
            Number.parseInt(percent.toString())
          )
          .catch((err) => {
            console.error("Error setting promotion:", err);
          });
      }
    }
  };

  // Sửa lại hàm displayService để sử dụng hàm kiểm tra kết nối mới
  const displayService = async (serviceId: string, isDisplay = true) => {
    console.log(
      `displayService called for service ${serviceId}, isDisplay=${isDisplay}`
    );
    console.log("Connection state:", connectionState);

    if (!isConnectionReady()) {
      console.error("SignalR connection not ready for displayService");
      return;
    }

    if (roomGuidRef.current == null) {
      console.error("Room GUID not set");
      return;
    }

    if (serviceId) {
      console.log(`Displaying service ${serviceId}, isDisplay=${isDisplay}`);
      // Đảm bảo isDisplay là boolean
      const displayValue = Boolean(isDisplay);
      try {
        await signalR_Connection.current!.invoke(
          "DisplayService",
          serviceId,
          roomGuidRef.current,
          displayValue
        );
        console.log(`Service ${serviceId} display status updated successfully`);
      } catch (error) {
        console.error("Error displaying service:", error);
      }
    }
  };

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (
        sessionIdRef.current &&
        signalR_Connection.current !== null &&
        connectionState === "connected" &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected &&
        isCreateRoom &&
        signalR_Connection.current.state ===
          signalR.HubConnectionState.Connected &&
        isCreateRoom
      ) {
        console.log("alive");
        signalR_Connection
          .current!.invoke("KeepAlive", sessionIdRef.current)
          .catch((err) => {
            console.error("Error sending keep alive:", err);
          });
      }
    }, 25000);

    return () => clearInterval(keepAliveInterval);
  }, [isCreateRoom, connectionState]);

  // If we're not in a room yet, show loading
  if (!isCreateRoom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
        <p className="text-rose-800">Setting up your livestream...</p>
        <p className="text-sm text-gray-600 mt-2">
          Connection status: {connectionState}
        </p>
        {roomIdParam ? (
          <p className="text-sm text-amber-600 mt-1">
            Connecting to existing room: {roomIdParam.substring(0, 8)}...
          </p>
        ) : !livestreamData ? (
          <p className="text-sm text-amber-600 mt-1">
            Waiting for livestream data...
          </p>
        ) : null}
        {roomCreationInProgress && (
          <p className="text-sm text-amber-600 mt-1">
            Creating your livestream room...
          </p>
        )}
        {joinAttempts > 0 && (
          <div className="mt-4 text-amber-600 max-w-md text-center">
            <p>
              Having trouble setting up the livestream. Attempting alternative
              methods...
            </p>
            <p className="text-sm mt-2">Attempt: {joinAttempts}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <HostPageStreamScreen
      view={view}
      localVideoRef={localVideoRef}
      startPublishing={startPublishing}
      isPublish={isPublish}
      endLive={endLive}
      chatMessage={chatMessage}
      sendMessage={sendMessage}
      activeReactions={activeReactions}
      setPromotionService={setPromotionService}
      services={services}
      fetchServices={fetchServices}
      setServices={setServices}
      displayService={displayService}
    />
  );
}
