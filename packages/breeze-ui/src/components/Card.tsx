import { FC, ReactNode } from 'react';
import { classNames, spacingClass, themeClass } from '../utils/className';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';

export interface ICardProps {
  children: ReactNode;
  className?: string;
  flex?: boolean;
  padding?: TSpacing;
  theme?: TTheme;
}

const Card: FC<ICardProps> = ({
  children,
  className = '',
  flex = false,
  padding = 'md',
  theme = 'secondary',
}) => (
  <>
    {/* @tailwind: bg-blue-100 border-blue-300 text-blue-800 */}
    {/* @tailwind: bg-gray-100 border-gray-300 text-gray-800 */}
    {/* @tailwind: bg-green-100 border-green-300 text-green-800 */}
    {/* @tailwind: bg-red-100 border-red-300 text-red-800 */}
    {/* @tailwind: bg-yellow-100 border-yellow-300 text-yellow-800 */}
    {/* @tailwind: p-0 p-2 p-4 p-6 */}
    <div
      className={classNames(
        'border-b-2 shadow-lg',
        className,
        flex ? 'flex flex-col items-center' : '',
        spacingClass(padding, 'p-{spacing}'),
        themeClass(theme, 'bg-{theme}-100 border-{theme}-300 text-{theme}-800'),
      )}
    >
      {children}
    </div>
  </>
);

export default Card;
