import { ReactNode } from 'react';

export interface INotificationsProps<T> {
  alert: boolean;
  cols?: number;
  items: T[];
  label: string;
  noResults: ReactNode;
  // placement?: Placement;
  row: (item: T) => ReactNode;
  onClose(): void | Promise<void>;
}

// {
//   alert,
//   cols = 1,
//   items,
//   label,
//   noResults,
//   onClose,
//   placement = 'bottom',
//   row,
// }
function Notifications<T>(_props: INotificationsProps<T>) {
  return <div />;
}

export default Notifications;
