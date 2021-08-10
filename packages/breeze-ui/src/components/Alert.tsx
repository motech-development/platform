import { FC, ReactNode, useEffect, useState } from 'react';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';

export interface IAlertProps {
  colour?: TTheme;
  dismissable?: boolean | number;
  icon?: ReactNode;
  message: string;
  spacing?: TSpacing;
  onDismiss?: () => void;
}

// {
//   colour = 'primary',
//   dismissable = false,
//   icon,
//   message,
//   spacing = 'md',
//   onDismiss,
// }
const Alert: FC<IAlertProps> = ({ dismissable = false, onDismiss }) => {
  const [visible, setVisiblity] = useState(true);
  const dismiss = () => {
    setVisiblity(false);

    if (onDismiss) {
      onDismiss();
    }
  };

  useEffect(
    () => () => {
      setVisiblity(false);
    },
    [],
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (typeof dismissable === 'number') {
      timeout = setTimeout(dismiss, dismissable);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (visible) {
    return <div />;
  }

  return null;
};

export default Alert;
