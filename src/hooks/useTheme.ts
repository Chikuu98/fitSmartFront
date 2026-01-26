import { useEffect, useState } from "react";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-color-mode",
      isDarkMode ? "dark" : "light",
    );
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return {
    isDarkMode,
    toggleTheme,
    setIsDarkMode,
  };
};

export const initializeTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute(
      "data-color-mode",
      isDark ? "dark" : "light",
    );

    return isDark;
  }
  return false;
};
