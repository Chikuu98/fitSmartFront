import React from "react";
import { ChevronDown } from "lucide-react"; // Lucide icon

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  return (
    <div className="relative w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full appearance-none p-2 pr-10 rounded text-sm
          bg-white text-gray-700 border border-neutral-300
          dark:bg-[#1C1C1C] dark:text-[#E0E0E0] dark:border-[#424242]
          focus:outline-none
          transition-colors
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 dark:text-[#E0E0E0]"
      />
    </div>
  );
};

export default CustomSelect;
