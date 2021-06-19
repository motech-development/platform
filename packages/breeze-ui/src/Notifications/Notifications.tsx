import { faAsterisk, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import Button from '../Button/Button';
import DataTable from '../DataTable/DataTable';
import useOutsideClick from '../hooks/useOutsideClick';
import TableCell from '../TableCell/TableCell';

const NotificationArrow = styled.div`
  height: 0;
  position: absolute;
  width: 0;
  border-bottom: 5px solid #007fa8;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  top: -5px;
`;

const NotificationButton = styled(Button)`
  background: none;
  color: inherit;

  :hover {
    background: none;
    color: inherit;
  }
`;

const NotificationContainer = styled.div`
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
`;

const NotificationWrapper = styled.div`
  position: relative;
`;

const AlertWrapper = styled.div`
  background-color: rgb(199, 56, 79);
  border-radius: 50%;
  color: #fff;
  padding: 5px;
  pointer-events: none;
  position: absolute;
  right: 5px;
  top: -5px;
  transform: scale(0.5);
  z-index: 1;
`;

const NotificationAlert = () => (
  <AlertWrapper>
    <FontAwesomeIcon icon={faAsterisk} />
  </AlertWrapper>
);

type Placement = 'bottom' | 'bottom-end' | 'bottom-start';

export interface INotificationsProps<T> {
  alert: boolean;
  cols?: number;
  items: T[];
  label: string;
  noResults: ReactNode;
  placement?: Placement;
  row: (item: T) => ReactNode;
  onClose(): void | Promise<void>;
}

function Notifications<T>({
  alert,
  cols = 1,
  items,
  label,
  noResults,
  onClose,
  placement = 'bottom',
  row,
}: INotificationsProps<T>) {
  const isFirstRun = useRef(true);
  const [visible, setVisible] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] =
    useState<HTMLDivElement | null>(null);
  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
    ],
    placement,
    strategy: 'fixed',
  });
  const toggleNotifications = () => {
    setVisible(!visible);
  };

  useOutsideClick(referenceElement, () => {
    setVisible(false);
  });

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      return;
    }

    if (!visible) {
      (async () => {
        await Promise.resolve(onClose());
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <NotificationWrapper ref={setReferenceElement}>
      {alert && <NotificationAlert />}

      <NotificationButton
        aria-label={label}
        size="sm"
        onClick={toggleNotifications}
      >
        <FontAwesomeIcon icon={faBell} />
      </NotificationButton>

      {visible && (
        <NotificationContainer
          ref={setPopperElement}
          style={styles.popper}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...attributes.popper}
        >
          <DataTable
            header={
              <TableCell as="th" align="left" colSpan={cols}>
                {label}
              </TableCell>
            }
            items={items}
            noResults={noResults}
            row={row}
          />

          <NotificationArrow ref={setArrowElement} style={styles.arrow} />
        </NotificationContainer>
      )}
    </NotificationWrapper>
  );
}

export default Notifications;
