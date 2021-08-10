import { FC, ReactNode } from 'react';
import TTheme from '../utils/theme';

export interface IAppBarProps {
  children: ReactNode;
  colour?: TTheme;
  element?: 'header' | 'div';
  fixed?: boolean;
}

// {
//   children,
//   colour = 'primary',
//   element = 'header',
//   fixed = false,
// }
const AppBar: FC<IAppBarProps> = () => <div />;

export default AppBar;
