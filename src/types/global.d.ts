// Estensioni dei tipi globali per il nostro progetto
declare global {
  interface Window {
    bitoraTrack?: (
      eventName: string,
      parameters?: {
        category?: string;
        label?: string;
        value?: number;
        location?: string;
        custom?: string;
        [key: string]: any;
      }
    ) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    webVitals?: any;
    umami?: { track: (eventName: string, props?: Record<string, unknown>) => void };
    __bitoraTags?: { ga: boolean; ads: boolean; meta: boolean; umami: boolean };
  }
}

export {};
