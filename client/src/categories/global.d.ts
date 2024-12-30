export {};

declare global {
  interface Window {
    editorInstance: any;
    processPendingDeletions:any // Или укажите конкретный тип вместо `any`, если известен
  }
}
