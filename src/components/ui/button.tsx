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
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none";

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
    orange:
      "bg-orange-500 dark:bg-orange-400 text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-300",
    outline:
      "bg-transparent border border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900",
    ghost:
      "bg-transparent text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900",
    link:
      "bg-transparent text-orange-600 dark:text-orange-300 underline px-0 py-0 hover:text-orange-700 dark:hover:text-orange-200",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
