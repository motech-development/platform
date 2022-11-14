import { useEffect } from 'react';

type Handler = (event: globalThis.MouseEvent | TouchEvent) => void;

const useOutsideClick = (ref: HTMLElement | null, handler: Handler): void => {
  useEffect(() => {
    const listener = (event: globalThis.MouseEvent | TouchEvent) => {
      if (!ref || ref.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, ref]);
};

export default useOutsideClick;
