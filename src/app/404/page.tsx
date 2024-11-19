"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [typedText, setTypedText] = useState("");
  const fullText = "Trang mà bạn tìm kiếm không tồn tại hoặc đã bị xóa";
  const [position, setPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    setPosition({ top, left });
  }, []);
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background parallax effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-blue-200"
        style={{ zIndex: -1 }}
        animate={{ x: [-50, 50, -50] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Particle animation */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {/* Pulse effect for 404 */}
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 animate-pulse">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Oops! Trang không tồn tại
        </p>
        <div className="text-gray-500 max-w-md mx-auto h-16 flex items-center justify-center">
          <p className="whitespace-pre-wrap">{typedText}</p>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2 }}
            className="inline-block w-0.5 h-5 bg-gray-500 ml-1"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Enhanced button with hover effect */}
        <Button
          onClick={handleBackToHome}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 hover:animate-pulse"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Trở về trang chủ
        </Button>
      </motion.div>

      {/* Animated circles */}
      <div className="mt-16 grid grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Spinning Zap icon */}
      <motion.div
        className="absolute bottom-4 right-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="h-8 w-8 text-yellow-400" />
      </motion.div>

      {/* Glowing background circle */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-200 rounded-full blur-lg opacity-60"
        style={{ width: "400px", height: "400px" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}
