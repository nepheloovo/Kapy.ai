import type { KapyApi } from '../shared/contracts';

declare global {
  interface Window {
    kapy: KapyApi;
  }
}

export {};
