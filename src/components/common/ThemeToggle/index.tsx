"use client";

// import { useTheme } from "@/features/theme/hooks/useTheme";
import { memo } from "react";
import { useTheme } from "next-themes";
const ThemeToggle = memo(() => {
  // const { mode, toggleTheme } = useTheme();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className={`
        relative w-20 h-10 rounded-full p-1 transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        ${
          currentTheme === "dark"
            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            : "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
        }
      `}
      aria-label={`Switch to ${
        currentTheme === "dark" ? "light" : "dark"
      } mode`}
    >
      <span className="sr-only">
        {currentTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"}
      </span>
      <span
        className={`
          absolute inset-0.5 w-9 h-9 rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out flex items-center justify-center
          ${
            currentTheme === "dark"
              ? "translate-x-10 bg-gray-900"
              : "translate-x-0"
          }
        `}
      >
        {currentTheme === "dark" ? (
          <div className="w-6 h-6 text-yellow-300"> 🌙 </div>
        ) : (
          <div className="w-6 h-6 text-yellow-500"> 🌞 </div>
        )}
      </span>
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
