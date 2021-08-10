import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Alert from '../components/Alert';
import TTheme from '../utils/theme';

interface IAddToast {
  colour: TTheme;
  message: string;
  onDismiss?(): void;
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

// const selectIcon = (alertType: AlertTheme) => {
//   switch (alertType) {
//     case 'danger':
//       return faExclamationTriangle;
//     case 'success':
//       return faCheckCircle;
//     case 'primary':
//     case 'secondary':
//     default:
//       return faExclamationCircle;
//   }
// };

export interface IToastProviderProps {
  children: ReactNode;
}

const ToastProvider: FC<IToastProviderProps> = ({ children }) => {
  const output = document.createElement('div');
  const [toasts, setToasts] = useState<IToast[]>([]);
  const add = ({ colour, message, onDismiss }: IAddToast) => {
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
  };
  const remove = (id: string) =>
    setToasts(
      toasts.filter((t) => {
        if (t.id === id && t.onDismiss) {
          t.onDismiss();
        }

        return t.id !== id;
      }),
    );
  const alerts = (
    <>
      {toasts.map(({ colour, id, message }) => (
        <Alert
          spacing="lg"
          key={id}
          dismissable={5000}
          icon={<div />}
          colour={colour}
          message={message}
          onDismiss={() => remove(id)}
        />
      ))}
    </>
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
