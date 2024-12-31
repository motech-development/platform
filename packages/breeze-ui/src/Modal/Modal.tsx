import { FC, MouseEvent, ReactNode, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Card from '../Card/Card';
import Loader from '../Loader/Loader';
import Overlay from '../Overlay/Overlay';

type TModalSize = 'sm' | 'lg';

const ModalOuter = styled.div`
  bottom: 0;
  left: 0;
  outline: 0;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1100;
`;

const ModalContent = styled.div`
  outline: 0;
  position: relative;
  width: 100%;
  pointer-events: auto;
`;

interface IModalDialogProps {
  size: TModalSize;
}

const ModalDialog = styled.div<IModalDialogProps>`
  box-shadow:
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
  margin: 5rem auto;
  max-width: ${({ size }) => (size === 'sm' ? '500px' : '90vw')};
  pointer-events: none;
  position: relative;
`;

export interface IModalProps {
  children: ReactNode;
  isOpen: boolean;
  size?: TModalSize;
  title: string;
  onDismiss: () => void;
}

const Modal: FC<IModalProps> = ({
  children,
  isOpen,
  onDismiss,
  size = 'sm',
  title,
}) => {
  const output = document.createElement('div');
  const doNotDismiss = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const modal = (
    <Suspense fallback={<Loader />}>
      <ModalOuter
        aria-modal
        aria-label={title}
        role="dialog"
        tabIndex={-1}
        onClick={onDismiss}
      >
        <ModalDialog size={size} role="document">
          <ModalContent onClick={doNotDismiss}>
            <Card padding="lg">{children}</Card>
          </ModalContent>
        </ModalDialog>
      </ModalOuter>

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
