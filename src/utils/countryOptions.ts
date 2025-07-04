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
