import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeBtn = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className=" flex items-center justify-around h-full ">
      {/* light mode */}
      <button
        onClick={() => setTheme("light")}
        className="flex justify-center items-center gap-1 p-2 rounded-2xl cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
        aria-label="Set light theme"
      >
        <FaSun />
        <p>Light</p>
      </button>
      {/* dark mode */}
      <button
        onClick={() => setTheme("dark")}
        className="flex justify-center items-center p-2 gap-1 rounded-2xl cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
        aria-label="Set dark theme"
      >
        <FaMoon />
        <p>Dark</p>
      </button>
      {/* system default */}
      <button
        onClick={() => setTheme("system")}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 cursor-pointer dark:text-gray-200 transition-colors"
        aria-label="Set system theme"
      >
        <p>System default</p>
      </button>
    </div>
  );
};

export default ThemeBtn;
