import ISO6391 from "iso-639-1";

export interface LanguageOption {
  value: string;
  label: string;
}

export const getLanguageOptions = (): LanguageOption[] => {
  return ISO6391.getAllNames().map((name) => ({
    value: name,
    label: name,
  }));
};

export const languageOptions = getLanguageOptions();
