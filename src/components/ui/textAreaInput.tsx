import React from "react";

interface TextAreaInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  disabled = false,
  rows = 3,
}) => {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        className="w-full border border-gray-300 dark:border-gray-600 p-1 rounded text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-orange-200 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
      />
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextAreaInput;
