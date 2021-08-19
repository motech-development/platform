import { FC, ReactNode } from 'react';
import { Box } from 'react-polymorphic-box';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';

export type TAppBarElement = 'header' | 'div' | 'nav';

export interface IAppBarProps {
  border?: boolean;
  children: ReactNode;
  colour?: TTheme;
  element?: TAppBarElement;
  fixed?: boolean;
}

const AppBar: FC<IAppBarProps> = ({
  border = false,
  children,
  colour = 'secondary',
  element = 'nav',
  fixed = false,
}) => (
  <>
    {/* @tailwind: bg-blue-900 bg-gray-900 bg-green-900 bg-red-900 bg-yellow-900 */}
    <Box
      className={classNames(
        fixed ? 'fixed top-0 left-0 w-full' : 'relative',
        themeClass(colour, 'bg-{theme}-900'),
      )}
      as={element}
    >
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 select-none">
        {/* @tailwind: border-blue-800 border-gray-800 border-green-800 border-red-800 border-yellow-800 */}
        <div
          className={classNames(
            border ? 'border-b' : '',
            border ? themeClass(colour, 'border-{theme}-800') : '',
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            {children}
          </div>
        </div>
      </div>
    </Box>
  </>
);

export default AppBar;
