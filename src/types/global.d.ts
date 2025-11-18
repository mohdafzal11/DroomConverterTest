// Declare global window interface for Google Analytics and other globals
interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string,
    config?: {
      page_path?: string;
      page_location?: string;
      page_title?: string;
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
  perfMetrics: {
    onFirstInputDelay?: (delay: number, event: Event) => void;
    [key: string]: any;
  };
  _sockets: WebSocket[];
} 