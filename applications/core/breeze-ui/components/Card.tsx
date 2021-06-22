import { FC, ReactNode } from 'react';

type TPadding = 'none' | 'sm' | 'md' | 'lg';

const styles = (padding: TPadding) => {
  switch (padding) {
    case 'sm':
      return '';
    case 'md':
      return '';
    case 'lg':
      return 'p-5';
    default:
  }
};

const Card: FC<{
  children: ReactNode;
  padding?: TPadding;
}> = ({ children, padding = 'md' }) => (
  <div
    className={`bg-gray-100 border-b-2 border-gray-300 text-gray-800 shadow-lg ${styles(
      padding,
    )}`}
  >
    {children}
  </div>
);

export default Card;
