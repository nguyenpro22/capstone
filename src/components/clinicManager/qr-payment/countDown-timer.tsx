"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialMinutes: number;
  onExpire?: () => void;
}

export function CountdownTimer({
  initialMinutes,
  onExpire,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setIsExpired(true);
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-1">
        Payment session expires in:
      </p>
      <div
        className={`text-2xl font-medium ${
          isExpired || seconds < 60 ? "text-red-500" : ""
        }`}
      >
        {String(minutes).padStart(2, "0")}:
        {String(remainingSeconds).padStart(2, "0")}
      </div>
    </div>
  );
}
