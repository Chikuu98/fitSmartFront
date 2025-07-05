import React, { useState, useEffect, useMemo } from "react";
import Select, { components } from "react-select";
import type { StylesConfig } from "react-select";
import { X, ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  value: string | null;
  onChange: (value: Option | null) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  height?: string; // default '2rem', '32px'
  fontSize?: string; // default '0.75rem', '12px'
  icon?: React.ReactNode;
  showIcon?: boolean;
}

const customStyles = (
  height?: string,
  fontSize?: string,
  isDark?: boolean
): StylesConfig<Option, false> => {
  return {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? "#374151" : "#ffffff", // Use consistent gray-700 for dark mode
      borderColor: state.isFocused ? "#fb923c" : isDark ? "#4b5563" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px #fb923c33" : "none",
      minHeight: height || "2.5rem",
      height: height || "2.5rem",
      color: isDark ? "#f3f4f6" : "#1f2937", // Use consistent text colors
      fontSize: fontSize || "0.95rem",
      transition: "all 0.2s",
      "&:hover": {
        borderColor: isDark ? "#6b7280" : "#d1d5db",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#374151" : "#ffffff", // Consistent with control
      zIndex: 50,
      marginTop: 2,
      borderRadius: "0.75rem",
      boxShadow: isDark
        ? "0 8px 32px 0 rgba(0,0,0,0.3)"
        : "0 8px 32px 0 rgba(0,0,0,0.12)",
      border: isDark ? "1px solid #4b5563" : "1px solid #e5e7eb",
      fontSize: fontSize || "0.95rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#fb923c"
        : state.isFocused
          ? isDark
            ? "rgba(251,146,60,0.15)"
            : "rgba(251,146,60,0.1)"
          : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#f3f4f6" : "#1f2937",
      cursor: "pointer",
      fontWeight: state.isSelected ? 600 : 400,
      transition: "all 0.2s",
      fontSize: fontSize || "0.95rem",
      "&:hover": {
        backgroundColor: state.isSelected
          ? "#fb923c"
          : isDark
            ? "rgba(251,146,60,0.15)"
            : "rgba(251,146,60,0.1)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? "#f3f4f6" : "#1f2937", // Consistent with control text color
      fontSize: fontSize || "0.95rem",
      padding: height && height === "1.75rem" ? "1px 1px 6px 1px" : "0 8px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a3a3a3",
      fontStyle: "italic",
      fontSize: fontSize || "0.95rem",
      padding: height && height === "1.75rem" ? "1px 1px 6px 1px" : "0 8px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#a3a3a3",
      padding: "0 8px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#fb923c",
      cursor: "pointer",
      padding: height && height === "1.75rem" ? "1px 1px 6px 1px" : "0 8px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
};

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown size={18} />
  </components.DropdownIndicator>
);

const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <X size={18} />
  </components.ClearIndicator>
);

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  placeholder,
  required = false,
  isClearable = true,
  isSearchable = true,
  height,
  fontSize,
  icon,
  showIcon = true,
}) => {
  const [isDark, setIsDark] = useState(() => {
    // More reliable initial state detection
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    // Initial check after component mounts
    const checkDarkMode = () => {
      const newIsDark = document.documentElement.classList.contains("dark");
      setIsDark(newIsDark);
    };

    // Check immediately
    checkDarkMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Find the selected option object
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Memoize styles to avoid recreating on every render
  const memoizedStyles = useMemo(
    () => customStyles(height, fontSize, isDark),
    [height, fontSize, isDark]
  );

  const memoizedTheme = useMemo(
    () => (theme: any) => ({
      ...theme,
      borderRadius: 12,
      colors: {
        ...theme.colors,
        primary: "#fb923c",
        primary25: isDark ? "rgba(251,146,60,0.15)" : "#fed7aa",
        primary50: isDark ? "rgba(251,146,60,0.25)" : "#fdba74",
        neutral0: isDark ? "#374151" : "#ffffff",
        neutral5: isDark ? "#4b5563" : "#f9fafb",
        neutral10: isDark ? "#4b5563" : "#f3f4f6",
        neutral20: isDark ? "#6b7280" : "#e5e7eb",
        neutral30: isDark ? "#9ca3af" : "#d1d5db",
        neutral40: isDark ? "#9ca3af" : "#9ca3af",
        neutral50: isDark ? "#6b7280" : "#6b7280",
        neutral60: isDark ? "#4b5563" : "#4b5563",
        neutral70: isDark ? "#374151" : "#374151",
        neutral80: isDark ? "#f3f4f6" : "#1f2937",
        neutral90: isDark ? "#f3f4f6" : "#111827",
      },
    }),
    [isDark]
  );

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {showIcon && icon && <span className="inline mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        name={name}
        value={selectedOption}
        onChange={(option) => onChange(option as Option)}
        options={options}
        placeholder={placeholder}
        required={required}
        isClearable={isClearable}
        isSearchable={isSearchable}
        styles={memoizedStyles}
        components={{ DropdownIndicator, ClearIndicator }}
        menuPlacement="bottom"
        menuPortalTarget={document.body}
        classNamePrefix="react-select"
        theme={memoizedTheme}
      />
    </div>
  );
};

export default CustomSelect;
