/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE: 'mock' | 'live';
  readonly VITE_API_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_RAZORPAY_KEY_ID?: string;
  readonly VITE_MAPS_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
