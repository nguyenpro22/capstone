"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseWebRTCOptions {
  onTrack?: (stream: MediaStream) => void;
  mediaConstraints?: MediaStreamConstraints;
}

export function useWebRTC({
  onTrack,
  mediaConstraints,
}: UseWebRTCOptions = {}) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize peer connection
  const initialize = useCallback(async () => {
    try {
      // Create a new RTCPeerConnection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up ontrack handler
      if (onTrack) {
        pc.ontrack = (event) => {
          onTrack(event.streams[0]);
        };
      }

      setIsInitialized(true);
      return pc;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to initialize WebRTC");
      setError(error);
      console.error("❌ Error initializing WebRTC:", error);
      throw error;
    }
  }, [onTrack]);

  // Get user media and add tracks to peer connection
  const getUserMedia = useCallback(
    async (
      constraints: MediaStreamConstraints = { video: true, audio: true }
    ) => {
      try {
        if (!peerConnectionRef.current) {
          await initialize();
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;

        // Add tracks to peer connection
        if (peerConnectionRef.current) {
          stream.getTracks().forEach((track) => {
            if (peerConnectionRef.current && localStreamRef.current) {
              const sender = peerConnectionRef.current.addTrack(
                track,
                localStreamRef.current
              );

              // Optimize video bitrate if it's a video track
              if (track.kind === "video") {
                const parameters = sender.getParameters();
                if (!parameters.encodings) {
                  parameters.encodings = [{}];
                }
                parameters.encodings[0].maxBitrate = 3000000; // 3 Mbps
                sender.setParameters(parameters).catch(console.error);
              }
            }
          });
        }

        return stream;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to get user media");
        setError(error);
        console.error("❌ Error getting user media:", error);
        throw error;
      }
    },
    [initialize]
  );

  // Create an offer
  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current) {
      throw new Error("Peer connection not initialized");
    }

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      return offer;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create offer");
      setError(error);
      console.error("❌ Error creating offer:", error);
      throw error;
    }
  }, []);

  // Create an answer
  const createAnswer = useCallback(async (offerSdp: string) => {
    if (!peerConnectionRef.current) {
      throw new Error("Peer connection not initialized");
    }

    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription({ type: "offer", sdp: offerSdp })
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      return answer;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create answer");
      setError(error);
      console.error("❌ Error creating answer:", error);
      throw error;
    }
  }, []);

  // Set remote description (for handling an answer)
  const setRemoteAnswer = useCallback(async (answerSdp: string) => {
    if (!peerConnectionRef.current) {
      throw new Error("Peer connection not initialized");
    }

    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSdp })
      );
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to set remote answer");
      setError(error);
      console.error("❌ Error setting remote answer:", error);
      throw error;
    }
  }, []);

  // Clean up resources
  const cleanup = useCallback(() => {
    // Stop all tracks in the local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Close the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsInitialized(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Initialize with media constraints if provided
  useEffect(() => {
    if (mediaConstraints) {
      initialize()
        .then(() => getUserMedia(mediaConstraints))
        .catch(console.error);
    }
  }, [initialize, getUserMedia, mediaConstraints]);

  return {
    peerConnection: peerConnectionRef.current,
    localStream: localStreamRef.current,
    isInitialized,
    error,
    initialize,
    getUserMedia,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    cleanup,
  };
}
