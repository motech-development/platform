// TODO: Auto dismiss
// TODO: Alert callback
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Alert, { AlertTheme } from '../Alert/Alert';

const ToastContainer = styled.div`
  bottom: 1rem;
  left: 1rem;
  position: fixed;
  right: 1rem;
  z-index: 1800;
`;

interface IAddToast {
  colour: AlertTheme;
  message: string;
}

interface IToast extends IAddToast {
  id: string;
}

interface IToastContext {
  add(alert: IAddToast): void;
  remove(id: string): void;
}

export const ToastContext = createContext<IToastContext | null>(null);

export const useToast = () => useContext(ToastContext)!;

const generateId = () => {
  const array = new Uint32Array(2);
  const output = crypto.getRandomValues(array);

  return (
    output[0].toString(36).substring(2, 15) +
    output[1].toString(36).substring(2, 15)
  );
};

export interface IToastProviderProps {
  children: ReactNode;
}

const ToastProvider: FC<IToastProviderProps> = ({ children }) => {
  const output = document.createElement('div');
  const [toasts, setToasts] = useState<IToast[]>([]);
  const add = ({ colour, message }: IAddToast) => {
    const id = generateId();

    setToasts([
      ...toasts,
      {
        colour,
        id,
        message,
      },
    ]);
  };
  const remove = (id: string) => setToasts(toasts.filter(t => t.id !== id));
  const alerts = toasts.length > 0 && (
    <ToastContainer>
      {toasts.map(({ colour, id, message }) => (
        <Alert dismissable key={id} colour={colour} message={message} />
      ))}
    </ToastContainer>
  );

  useEffect(() => {
    document.body.appendChild(output);

    return () => {
      document.body.removeChild(output);
    };
  }, [output]);

  return (
    <ToastContext.Provider
      value={{
        add,
        remove,
      }}
    >
      {children}

      {createPortal(alerts, output)}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
