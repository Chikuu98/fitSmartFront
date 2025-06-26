import { useEffect, useState } from "react";

/**
 * Custom hook for managing theme state across the application
 * Ensures theme consistency between pages and components
 */
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    // Apply theme to document
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

/**
 * Utility function to initialize theme on page load
 * Ensures theme is applied immediately without flash
 */
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
