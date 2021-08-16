import { Popover } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import { Placement } from '@popperjs/core';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';
import DataTable from './DataTable';
import TableCell from './TableCell';

export interface INotificationsProps<T> {
  alert: boolean;
  alertText?: string;
  colour?: TTheme;
  cols?: number;
  items: T[];
  label: string;
  noResults: ReactNode;
  placement?: Placement;
  row: (item: T) => ReactNode;
  onClose: () => void | Promise<void>;
}

function Notifications<T>({
  alert,
  alertText = 'New',
  colour = 'secondary',
  cols = 1,
  items,
  label,
  noResults,
  onClose,
  placement = 'bottom',
  row,
}: INotificationsProps<T>) {
  const isFirstRun = useRef(true);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 18],
        },
      },
    ],
    placement,
  });
  const onCloseCallback = useCallback(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      return;
    }

    if (!popperElement) {
      (async () => {
        await Promise.resolve(onClose());
      })();
    }
  }, [onClose, popperElement]);

  useEffect(onCloseCallback, [onCloseCallback]);

  return (
    <Popover>
      {/* @tailwind: bg-blue-900 text-blue-400 focus:ring-offset-blue-900 hover:text-blue-100 focus:ring-blue-500 */}
      {/* @tailwind: bg-gray-900 text-gray-400 focus:ring-offset-gray-900 hover:text-gray-100 focus:ring-gray-500 */}
      {/* @tailwind: bg-green-900 text-green-400 focus:ring-offset-green-900 hover:text-green-100 focus:ring-green-500 */}
      {/* @tailwind: bg-red-900 text-red-400 focus:ring-offset-red-900 hover:text-red-100 focus:ring-red-500 */}
      {/* @tailwind: bg-yellow-900 text-yellow-400 focus:ring-offset-yellow-900 hover:text-yellow-100 focus:ring-yellow-500 */}
      <Popover.Button
        className={classNames(
          'p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 relative',
          themeClass(
            colour,
            'bg-{theme}-900 text-{theme}-400 focus:ring-offset-{theme}-900 hover:text-{theme}-100 focus:ring-{theme}-500',
          ),
        )}
        ref={setReferenceElement}
      >
        <span className="sr-only">{label}</span>

        <BellIcon className="h-6 w-6" aria-hidden="true" />

        {alert && (
          <span className="rounded-full text-sm font-medium bg-red-800 text-red-100 absolute top-0 right-0 p-0.5">
            <span className="sr-only">({alertText})</span>

            <StarIcon className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        )}
      </Popover.Button>

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <DataTable
          header={
            <TableCell as="th" align="center" colSpan={cols}>
              {label}
            </TableCell>
          }
          items={items}
          noResults={noResults}
          row={row}
        />
      </Popover.Panel>
    </Popover>
  );
}

export default Notifications;
