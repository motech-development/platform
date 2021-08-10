import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { FC, Fragment, ReactNode, useEffect, useState } from 'react';
import { className, themeClass, spacingClass } from '../utils/className';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';

export interface IAlertProps {
  colour?: TTheme;
  dismissable?: boolean | number;
  dismissText?: string;
  icon?: ReactNode;
  message: string;
  spacing?: TSpacing;
  onDismiss?: () => void;
}

const Alert: FC<IAlertProps> = ({
  colour = 'primary',
  dismissable = false,
  dismissText = 'Dismiss',
  icon,
  message,
  spacing = 'md',
  onDismiss,
}) => {
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
      {/* @tailwind: bg-blue-50 bg-gray-50 bg-green-50 bg-red-50 bg-yellow-50 */}
      {/* @tailwind: mb-0 mb-2 mb-4 mb-6 */}
      <div
        className={className(
          'p-4',
          themeClass(colour, 'bg-{theme}-50'),
          spacingClass(spacing, 'mb-{spacing}'),
        )}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {/* @tailwind: text-blue-400 text-gray-400 text-green-400 text-red-400 text-yellow-400 */}
            <div
              className={className(
                'h-5 w-5',
                themeClass(colour, 'text-{theme}-400'),
              )}
            >
              {icon}
            </div>
          </div>
          <div className="ml-3">
            {/* @tailwind: text-blue-800 text-gray-800 text-green-800 text-red-800 text-yellow-800  */}
            <p
              className={className(
                'text-sm font-medium',
                themeClass(colour, 'text-{theme}-800'),
              )}
            >
              {message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              {/* @tailwind: bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-offset-blue-50 focus:ring-blue-600 */}
              {/* @tailwind: bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-offset-gray-50 focus:ring-gray-600 */}
              {/* @tailwind: bg-green-50 text-green-500 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600 */}
              {/* @tailwind: bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600 */}
              {/* @tailwind: bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-offset-yellow-50 focus:ring-yellow-600 */}
              {dismissable && (
                <button
                  className={className(
                    'inline-flex p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    themeClass(colour, 'bg-{theme}-50'),
                    themeClass(colour, 'text-{theme}-500'),
                    themeClass(colour, 'hover:bg-{theme}-100'),
                    themeClass(colour, 'focus:ring-offset-{theme}-50'),
                    themeClass(colour, 'focus:ring-{theme}-600'),
                  )}
                  type="button"
                  onClick={dismiss}
                >
                  <span className="sr-only">{dismissText}</span>

                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Alert;
