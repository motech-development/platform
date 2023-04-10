/// <reference types="vite/client" />

declare module 'body-scroll-lock' {
  // eslint-disable-next-line import/prefer-default-export
  export function disableBodyScroll(
    targetElement: HTMLElement,
    options?: BodyScrollOptions,
  ): void;
}
