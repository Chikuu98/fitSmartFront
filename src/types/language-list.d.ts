// filepath: src/types/language-list.d.ts
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
