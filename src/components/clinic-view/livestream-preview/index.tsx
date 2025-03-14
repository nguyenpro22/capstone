"use client";

import { useState } from "react";
import { Play, Volume2, VolumeX, Maximize, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LivestreamPreviewProps {
  thumbnailUrl: string;
  title: string;
  isLive?: boolean;
  viewerCount?: number;
  onView?: () => void;
}

export function LivestreamPreview({
  thumbnailUrl,
  title,
  isLive = true,
  viewerCount = 0,
  onView,
}: LivestreamPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div
      className="relative w-full h-[300px] rounded-lg overflow-hidden glass-effect"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Thumbnail/Video placeholder */}
      <div className="absolute inset-0 bg-black/20">
        <Image
          src={thumbnailUrl || "/placeholder.svg?height=300&width=400"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Overlay with controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top bar with live indicator and viewer count */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          {isLive && (
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
              <span className="text-xs font-medium bg-red-500/80 text-white px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
          )}

          {viewerCount > 0 && (
            <div className="flex items-center bg-black/50 text-white text-xs px-2 py-1 rounded">
              <Eye className="h-3 w-3 mr-1" />
              {viewerCount} người xem
            </div>
          )}
        </div>

        {/* Center play button */}
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={onView}
              className="bg-primary/90 hover:bg-primary text-white rounded-full h-12 w-12 flex items-center justify-center"
            >
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
          </div>
        )}

        {/* Bottom bar with title and controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
          <div className="text-white">
            <h4 className="font-medium text-sm">{title}</h4>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={onView}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Livestream button (appears on hover) */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          onClick={onView}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Eye className="mr-2 h-4 w-4" />
          Xem Livestream
        </Button>
      </div>
    </div>
  );
}
