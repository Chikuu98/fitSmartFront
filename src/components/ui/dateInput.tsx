import React from "react";
import { Calendar } from "lucide-react";

interface DateInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
  showIcon?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  name,
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  min,
  max,
  className = "",
  showIcon = true,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
          <div className="flex items-center gap-2">
            {showIcon && (
              <Calendar className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            )}
            <span>{label}</span>
            {required && <span className="text-red-500 text-xs">*</span>}
          </div>
        </label>
      )}
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`
          w-full px-4 py-2.5 
          rounded-lg border 
          bg-white dark:bg-[#1C1C1C] 
          text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600
          transition-colors duration-200
          hover:border-orange-400 dark:hover:border-orange-500
          focus:outline-none 
          focus:border-orange-500 dark:focus:border-orange-400
          focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600
          [&::-webkit-calendar-picker-indicator]:cursor-pointer
          [&::-webkit-calendar-picker-indicator]:opacity-70
          [&::-webkit-calendar-picker-indicator]:hover:opacity-100
        `}
      />
    </div>
  );
};
