"use client";

import { useEffect, useRef } from "react";

interface ThumbnailGeneratorProps {
  roomId: string;
  onThumbnailGenerated: (thumbnailUrl: string) => void;
}

export default function ThumbnailGenerator({
  roomId,
  onThumbnailGenerated,
}: ThumbnailGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // This component would connect to the livestream and generate a thumbnail
    // For demonstration purposes, we'll create a simple colored thumbnail

    const generateThumbnail = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Set canvas dimensions
          canvas.width = 640;
          canvas.height = 360;

          // If we have a video stream, capture a frame
          if (videoRef.current && videoRef.current.readyState >= 2) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          } else {
            // Otherwise, create a placeholder gradient
            const gradient = ctx.createLinearGradient(
              0,
              0,
              canvas.width,
              canvas.height
            );
            gradient.addColorStop(0, "#f87171");
            gradient.addColorStop(1, "#ec4899");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add room ID text
            ctx.fillStyle = "white";
            ctx.font = "bold 24px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              `Room: ${roomId}`,
              canvas.width / 2,
              canvas.height / 2
            );
          }

          // Convert canvas to data URL and pass it to the callback
          try {
            const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
            onThumbnailGenerated(thumbnailUrl);
          } catch (error) {
            console.error("Error generating thumbnail:", error);
          }
        }
      }
    };

    // Generate thumbnail immediately and then every 10 seconds
    generateThumbnail();
    const intervalId = setInterval(generateThumbnail, 10000);

    return () => {
      clearInterval(intervalId);

      // Clean up video stream if any
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, onThumbnailGenerated]);

  return (
    <div className="hidden">
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} />
    </div>
  );
}
