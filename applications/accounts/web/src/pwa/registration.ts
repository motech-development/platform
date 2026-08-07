import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  if (typeof window !== 'undefined') {
    registerSW({ immediate: true });
  }
}
