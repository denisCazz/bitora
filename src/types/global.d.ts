// Estensioni dei tipi globali per il nostro progetto
declare global {
  interface Window {
    trackEvent?: (eventName: string, parameters?: {
      category?: string;
      label?: string;
      value?: number;
      custom?: string;
      [key: string]: any;
    }) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    webVitals?: any;
  }
}

export {};
