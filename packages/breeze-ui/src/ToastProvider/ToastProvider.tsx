import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Alert, { AlertTheme } from '../Alert/Alert';

const ToastContainer = styled.div`
  bottom: 0;
  left: 1rem;
  position: fixed;
  right: 1rem;
  z-index: 1800;
`;

export interface IAddToast {
  colour: AlertTheme;
  message: string;
  onDismiss?: () => void;
}

interface IToast extends IAddToast {
  id: string;
}

interface IToastContext {
  add: (alert: IAddToast) => void;
  remove: (id: string) => void;
}

export const ToastContext = createContext<IToastContext | null>(null);

export const useToast = (): IToastContext => useContext(ToastContext)!;

const generateId = () => {
  const array = new Uint32Array(2);
  const output = crypto.getRandomValues(array);

  return (
    output[0].toString(36).substring(2, 15) +
    output[1].toString(36).substring(2, 15)
  );
};

const selectIcon = (alertType: AlertTheme) => {
  switch (alertType) {
    case 'danger':
      return faExclamationTriangle;
    case 'success':
      return faCheckCircle;
    case 'primary':
    case 'secondary':
    default:
      return faExclamationCircle;
  }
};

export interface IToastProviderProps {
  children: ReactNode;
}

const ToastProvider: FC<IToastProviderProps> = ({ children }) => {
  const output = document.createElement('div');
  const [toasts, setToasts] = useState<IToast[]>([]);
  const add = useCallback(
    ({ colour, message, onDismiss }: IAddToast) => {
      const id = generateId();

      setToasts([
        ...toasts,
        {
          colour,
          id,
          message,
          onDismiss,
        },
      ]);
    },
    [toasts],
  );
  const remove = useCallback(
    (id: string) =>
      setToasts(
        toasts.filter((t) => {
          if (t.id === id && t.onDismiss) {
            t.onDismiss();
          }

          return t.id !== id;
        }),
      ),
    [toasts],
  );
  const alerts = (
    <ToastContainer>
      {toasts.map(({ colour, id, message }) => (
        <Alert
          spacing="lg"
          key={id}
          dismissable={5000}
          icon={<FontAwesomeIcon icon={selectIcon(colour)} />}
          colour={colour}
          message={message}
          onDismiss={() => remove(id)}
        />
      ))}
    </ToastContainer>
  );

  useEffect(() => {
    document.body.appendChild(output);

    return () => {
      document.body.removeChild(output);
    };
  }, [output]);

  const value = useMemo(
    () => ({
      add,
      remove,
    }),
    [add, remove],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {createPortal(alerts, output)}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
