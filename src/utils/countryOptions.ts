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


export const getCountryNameByCode = (code: string): string => {
  if (!code) return '';
  const country = countryOptions.find(
    (c) => c.value.toLowerCase() === code.toLowerCase()
  );
  return country?.label || code;
};
