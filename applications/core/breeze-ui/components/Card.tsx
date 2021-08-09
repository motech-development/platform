import { FC, ReactNode } from 'react';

type TPadding = 'none' | 'sm' | 'md' | 'lg';

const styles = (padding: TPadding, flex: boolean) => {
  const flexStyles = flex ? 'flex flex-col items-center' : '';

  let paddingStyles: string;

  switch (padding) {
    case 'sm':
      break;
    case 'md':
      break;
    case 'lg':
      paddingStyles = 'p-5';
      break;
    default:
  }

  return `${paddingStyles} ${flexStyles}`;
};

const Card: FC<{
  children: ReactNode;
  className?: string;
  flex?: boolean;
  padding?: TPadding;
}> = ({ children, className, flex = false, padding = 'md' }) => (
  <div
    className={`bg-gray-100 border-b-2 border-gray-300 text-gray-800 shadow-lg ${className} ${styles(
      padding,
      flex,
    )}`}
  >
    {children}
  </div>
);

export default Card;
