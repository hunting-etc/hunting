import mitt from 'mitt';
interface ToastData {
    severity: string;
    summary: string;
    detail: string;
    group: string,
    life: number;
  }
  
  // Типы событий
  export type EventType = {
    toast: ToastData;
  };
  
  // Создайте эмиттер с указанным типом
  export const emitter = mitt<EventType>();