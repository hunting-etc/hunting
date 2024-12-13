export {};

declare global {
  interface Window {
    editorInstance: any; // Или укажите конкретный тип вместо `any`, если известен
  }
}