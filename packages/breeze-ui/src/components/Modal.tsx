import { FC, /* MouseEvent, */ ReactNode, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Loader from './Loader';
import Overlay from './Overlay';

export interface IModalProps {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onDismiss(): void;
}

// { children, isOpen, onDismiss, title }
const Modal: FC<IModalProps> = ({ children, isOpen, onDismiss }) => {
  const output = document.createElement('div');
  // const doNotDismiss = (e: MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  // };
  const modal = (
    <Suspense fallback={<Loader />}>
      <div>{children}</div>

      <Overlay />
    </Suspense>
  );

  useEffect(() => {
    const keyboardEvent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    document.body.appendChild(output);

    document.addEventListener('keydown', keyboardEvent, false);

    return () => {
      document.body.removeChild(output);

      document.body.style.removeProperty('overflow');

      document.removeEventListener('keydown', keyboardEvent, false);
    };
  }, [output, onDismiss]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  if (isOpen) {
    return createPortal(modal, output);
  }

  return null;
};

export default Modal;
