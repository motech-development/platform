import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Sizing,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';

/** Alert component properties */
export interface IAlertProps {
  /** Sets whether alert can be dismissed or a timer, in milliseconds, to automatically dismiss */
  dismissable?: boolean | number;

  /** Dismiss button text  */
  dismissText?: string;

  /** An icon to display before the alert message */
  icon?: ReactNode;

  /** Alert message text */
  message: string;

  /** Component spacing */
  spacing?: TSizing;

  /** Component theme */
  theme?: TTheme;

  /** Dismiss callback */
  onDismiss?: () => void;
}

/** Default dismiss text label */
const DISMISS_TEXT = 'Dismiss';

/**
 * Display application messages and alerts
 *
 * @param props - Component props
 *
 * @returns Alert component
 */
export function Alert(props: IAlertProps) {
  const {
    dismissable = false,
    dismissText = DISMISS_TEXT,
    icon,
    message,
    spacing = Sizing.NONE,
    theme = Themes.PRIMARY,
    onDismiss,
  } = props;

  const [visible, setVisiblity] = useState(true);

  const { createStyles } = useTailwind(theme, spacing);

  const alertStyles = createStyles({
    classNames: ['p-4'],
    sizing: {
      lg: ['mb-6'],
      md: ['mb-4'],
      none: ['mb-0'],
      sm: ['mb-2'],
    },
    theme: {
      danger: ['bg-red-50 text-red-800'],
      primary: ['bg-blue-50 text-blue-800'],
      secondary: ['bg-gray-50 text-gray-800'],
      success: ['bg-green-50 text-green-800'],
      warning: ['bg-yellow-50 text-yellow-800'],
    },
  });

  const buttonStyles = createStyles({
    classNames: [
      'inline-flex p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
    ],
    theme: {
      danger: [
        'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600',
      ],
      primary: [
        'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-offset-blue-50 focus:ring-blue-600',
      ],
      secondary: [
        'bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-offset-gray-50 focus:ring-gray-600',
      ],
      success: [
        'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600',
      ],
      warning: [
        'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-offset-yellow-50 focus:ring-yellow-600',
      ],
    },
  });

  const iconStyles = createStyles({
    classNames: ['h-5 w-5'],
    theme: {
      danger: ['text-red-400'],
      primary: ['text-blue-400'],
      secondary: ['text-gray-400'],
      success: ['text-green-400'],
      warning: ['text-yellow-400'],
    },
  });

  const messageStyle = createStyles({
    classNames: ['text-sm font-medium'],
  });

  const dismiss = useCallback(() => {
    setVisiblity(false);

    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  const timeoutCallback = useCallback(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (typeof dismissable === 'number') {
      timeout = setTimeout(dismiss, dismissable);
    }

    return timeout;
  }, [dismiss, dismissable]);

  useEffect(() => {
    const timeout = timeoutCallback();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeoutCallback]);

  return (
    <Transition
      show={visible}
      as={Fragment}
      enter="transition ease-in duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={alertStyles} role="alert">
        <div className="flex">
          <div className="flex-shrink-0">
            <p className={iconStyles}>{icon}</p>
          </div>

          <div className="ml-3">
            <p className={messageStyle}>{message}</p>
          </div>

          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              {dismissable && (
                <button
                  className={buttonStyles}
                  type="button"
                  onClick={dismiss}
                >
                  <span className="sr-only">{dismissText}</span>

                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
