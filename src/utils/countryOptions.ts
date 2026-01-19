import countryList from "react-select-country-list";

export interface CountryOption {
  value: string;
  label: string;
}

export const getCountryOptions = (): CountryOption[] => {
  return countryList()
    .getData()
    .map((country: any) => ({
      value: country.value,
      label: country.label,
    }));
};

export const countryOptions = getCountryOptions();

/**
 * Convert a country code (e.g., "LK") to full country name (e.g., "Sri Lanka")
 */
export const getCountryNameByCode = (code: string): string => {
  if (!code) return '';
  const country = countryOptions.find(
    (c) => c.value.toLowerCase() === code.toLowerCase()
  );
  return country?.label || code;
};
