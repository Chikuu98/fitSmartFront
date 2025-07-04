import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl";
  step?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  disabled = false,
  icon,
  size = "sm",
  rounded = "sm",
  step,
}) => {
  // Size classes
  const sizeClasses = {
    sm: "p-1 text-xs",
    md: "p-2 text-sm",
    lg: "p-3 text-base",
  };

  // Rounded classes
  const roundedClasses = {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  // Label size classes
  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`mb-2 ${className}`}>
      <label
        className={`block font-medium mb-1 text-gray-700 dark:text-gray-300 ${labelSizeClasses[size]}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          step={step}
          className={`w-full border border-gray-300 dark:border-gray-600 ${sizeClasses[size]} ${roundedClasses[rounded]} bg-white dark:bg-gray-700 ${
            type === "url"
              ? "text-blue-700 dark:text-blue-300"
              : "text-gray-900 dark:text-gray-100"
          } placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${icon ? "pl-8" : ""}`}
        />
      </div>
      {error && (
        <div
          className={`text-red-600 dark:text-red-400 mt-1 ${labelSizeClasses[size]}`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
