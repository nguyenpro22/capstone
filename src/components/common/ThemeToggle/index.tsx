"use client";

import { memo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = memo(() => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    );
  }

  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-md transition-opacity duration-1000 ${
          isDark ? "bg-indigo-500/30 opacity-70" : "bg-amber-500/30 opacity-70"
        }`}
      />

      <button
        onClick={toggleTheme}
        className={`
          relative w-14 h-7 rounded-full p-1 transition-all duration-500 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 
          focus:ring-offset-white dark:focus:ring-offset-gray-900 overflow-hidden
        `}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
          initial={false}
          animate={{
            backgroundColor: isDark ? "#1e293b" : "#7dd3fc",
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Day/Night gradient overlay */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={false}
            animate={{
              background: isDark
                ? "linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)"
                : "linear-gradient(to bottom, #0ea5e9 0%, #7dd3fc 100%)",
              opacity: 1,
            }}
            transition={{ duration: 0.6 }}
          />

          {/* DARK MODE ELEMENTS */}
          {isDark && (
            <>
              {/* Stars background */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => {
                  const size = Math.random() * 1 + 0.5;
                  const top = Math.random() * 7;
                  const left = Math.random() * 14;

                  return (
                    <motion.div
                      key={`star-${i}`}
                      className="absolute bg-white rounded-full"
                      initial={{ opacity: 0.1 }}
                      animate={{
                        opacity: [0.1, 0.7, 0.1],
                      }}
                      transition={{
                        duration: 1.5 + Math.random() * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        top: `${top}px`,
                        left: `${left}px`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Moon with craters */}
              <motion.div
                className="absolute rounded-full bg-gray-200"
                initial={false}
                animate={{
                  width: 8,
                  height: 8,
                  top: 3,
                  left: 3,
                  boxShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Moon craters */}
                <motion.div
                  className="absolute rounded-full bg-gray-300/30"
                  style={{
                    width: "2px",
                    height: "2px",
                    top: "1px",
                    right: "2px",
                  }}
                />
                <motion.div
                  className="absolute rounded-full bg-gray-300/30"
                  style={{
                    width: "1.5px",
                    height: "1.5px",
                    top: "4px",
                    right: "5px",
                  }}
                />
              </motion.div>

              {/* Shooting star (reduced to 1) */}
              <AnimatePresence>
                <motion.div
                  key="shooting-star"
                  initial={{
                    x: -3,
                    y: -3,
                    opacity: 0,
                    scale: 0,
                    rotate: 45 + Math.random() * 10,
                  }}
                  animate={{
                    x: 17,
                    y: 10,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 7 + Math.random() * 10,
                  }}
                  style={{
                    top: `${Math.random() * 3}px`,
                    left: `${Math.random() * 7}px`,
                    position: "absolute",
                  }}
                  className="w-4 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                />
              </AnimatePresence>

              {/* Nebula effect */}
              <motion.div
                className="absolute rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, rgba(147,51,234,0.5) 0%, rgba(79,70,229,0.2) 50%, transparent 70%)",
                  width: "20px",
                  height: "20px",
                  top: "-3px",
                  left: "3px",
                }}
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </>
          )}

          {/* LIGHT MODE ELEMENTS */}
          {!isDark && (
            <>
              {/* Sun rays */}
              <motion.div
                className="absolute"
                style={{
                  width: "16px",
                  height: "16px",
                  top: "-1px",
                  right: "0px",
                  background:
                    "radial-gradient(circle, rgba(252,211,77,0.7) 0%, rgba(252,211,77,0.2) 50%, transparent 70%)",
                  borderRadius: "50%",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {/* Sun */}
              <motion.div
                className="absolute rounded-full"
                initial={false}
                animate={{
                  width: 10,
                  height: 10,
                  top: 2,
                  right: 3,
                  backgroundColor: "#fcd34d",
                  boxShadow: "0 0 10px rgba(252, 211, 77, 0.8)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />

              {/* Sun flare effect */}
              <motion.div
                className="absolute rounded-full bg-yellow-200/40"
                style={{
                  width: "4px",
                  height: "4px",
                  top: "5px",
                  right: "6px",
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {/* Clouds (reduced to 2) */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(2)].map((_, i) => {
                  const width = 7 + i * 3;
                  const top = 1.5 + i * 2;
                  const delay = i * 2;
                  const duration = 12 + i * 4;

                  return (
                    <motion.div
                      key={`cloud-${i}`}
                      className="absolute bg-white rounded-full opacity-80"
                      initial={{ left: -width }}
                      animate={{ left: ["-20%", "120%"] }}
                      transition={{
                        duration,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay,
                      }}
                      style={{
                        width: `${width}px`,
                        height: `${width / 2}px`,
                        top: `${top}px`,
                        filter: "blur(1px)",
                        borderRadius: "50%",
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        {/* Border overlay */}
        <div
          className={`
          absolute inset-0 rounded-full border transition-colors duration-500
          ${isDark ? "border-indigo-700" : "border-amber-500"}
        `}
        />

        {/* Toggle knob with icon */}
        <motion.div
          layout
          initial={false}
          animate={{
            x: isDark ? 28 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className={`
            relative z-10 w-5 h-5 rounded-full flex items-center justify-center
            ${
              isDark
                ? "bg-gradient-to-br from-gray-900 to-gray-800 shadow-inner border border-gray-700"
                : "bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-md border border-yellow-400"
            }
          `}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 text-yellow-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 text-amber-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>
    </div>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
