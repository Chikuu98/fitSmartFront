import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "true"
    | "orange"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "rounded-full font-medium transition-colors focus:outline-none inline-flex items-center justify-center";

  const sizeStyles = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  const variants = {
    default:
      "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800",
    red: "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800",
    green:
      "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800",
    yellow:
      "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800",
    blue: "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800",
    true: "bg-gray-900 dark:bg-gray-100 text-gray-50 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white",
    orange: "bg-orange-400 text-white dark:text-orange-100 hover:bg-orange-300",
    outline:
      "bg-transparent border border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900",
    ghost:
      "bg-transparent text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900",
    link: "bg-transparent text-orange-600 dark:text-orange-300 underline px-0 py-0 hover:text-orange-700 dark:hover:text-orange-200",
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variants[variant], 
        (loading || disabled) && "opacity-50 cursor-not-allowed", 
        className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
