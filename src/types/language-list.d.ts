declare module "language-list" {
  interface Language {
    name: string;
    [key: string]: any;
  }

  class LanguageList {
    getData(): Language[];
  }

  export = LanguageList;
}
