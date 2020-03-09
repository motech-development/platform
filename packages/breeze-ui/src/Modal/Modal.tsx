import React, { FC, memo, MouseEvent, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Card from '../Card/Card';
import Overlay from '../Overlay/Overlay';

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

const ModalDialog = styled.div`
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
  margin: 1.75rem auto;
  max-width: 500px;
  pointer-events: none;
  position: relative;
`;

export interface IModalProps {
  children: ReactNode;
  isOpen: boolean;
  onDismiss(): void;
}

const Modal: FC<IModalProps> = ({ children, isOpen, onDismiss }) => {
  const doNotDismiss = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const output = (
    <>
      <ModalOuter aria-modal role="dialog" tabIndex={-1} onClick={onDismiss}>
        <ModalDialog role="document">
          <ModalContent onClick={doNotDismiss}>
            <Card padding="lg">{children}</Card>
          </ModalContent>
        </ModalDialog>
      </ModalOuter>

      <Overlay />
    </>
  );

  useEffect(() => {
    const keyboardEvent = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        onDismiss();
      }
    };

    document.addEventListener('keydown', keyboardEvent, false);

    return () => {
      document.removeEventListener('keydown', keyboardEvent, false);
    };
  }, [onDismiss]);

  if (isOpen) {
    return createPortal(output, document.body);
  }

  return null;
};

export default memo(Modal);
