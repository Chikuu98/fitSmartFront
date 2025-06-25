import React from "react";
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
  placeholder?: string;
  required?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  height?: string; // e.g. '2rem', '32px'
  fontSize?: string; // e.g. '0.75rem', '12px'
}

const customStyles = (
  height?: string,
  fontSize?: string,
): StylesConfig<Option, false> => {
  return {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "var(--tw-bg-opacity,1) #f3f4f6"
        : "var(--tw-bg-opacity,1) #fff",
      borderColor: state.isFocused ? "#fb923c" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px #fb923c33" : "none",
      minHeight: height || "2.5rem",
      color: "#1C1C1C",
      fontSize: fontSize || "0.95rem",
      transition: "all 0.2s",
      ...(document.documentElement.classList.contains("dark")
        ? {
            backgroundColor: state.isFocused ? "#232323" : "#1C1C1C",
            color: "#E0E0E0",
            borderColor: state.isFocused ? "#fb923c" : "#424242",
          }
        : {}),
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: document.documentElement.classList.contains("dark")
        ? "#232323"
        : "#fff",
      zIndex: 50,
      marginTop: 2,
      borderRadius: "0.75rem",
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)",
      fontSize: fontSize || "0.95rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#fb923c"
        : state.isFocused
          ? "rgba(251,146,60,0.15)"
          : "transparent",
      color: state.isSelected
        ? "#fff"
        : document.documentElement.classList.contains("dark")
          ? "#E0E0E0"
          : "#1C1C1C",
      cursor: "pointer",
      fontWeight: state.isSelected ? 600 : 400,
      transition: "background 0.2s",
      fontSize: fontSize || "0.95rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: document.documentElement.classList.contains("dark")
        ? "#E0E0E0"
        : "#1C1C1C",
      fontSize: fontSize || "0.95rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a3a3a3",
      fontStyle: "italic",
      fontSize: fontSize || "0.95rem",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#a3a3a3",
      padding: "0 8px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#fb923c",
      padding: "0 8px",
      cursor: "pointer",
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
  placeholder,
  required = false,
  isClearable = true,
  isSearchable = true,
  height,
  fontSize,
}) => {
  // Find the selected option object
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <Select
      name={name}
      value={selectedOption}
      onChange={(option) => onChange(option as Option)}
      options={options}
      placeholder={placeholder}
      required={required}
      isClearable={isClearable}
      isSearchable={isSearchable}
      styles={customStyles(height, fontSize)}
      components={{ DropdownIndicator, ClearIndicator }}
      menuPlacement="bottom"
      menuPortalTarget={document.body}
      classNamePrefix="react-select"
      theme={(theme) => ({
        ...theme,
        borderRadius: 12,
        colors: {
          ...theme.colors,
          primary: "#fb923c",
          primary25: "#fed7aa",
          neutral0: document.documentElement.classList.contains("dark")
            ? "#232323"
            : "#fff",
        },
      })}
    />
  );
};

export default CustomSelect;
