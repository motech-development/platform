import { FC } from 'react';
import TTheme from '../utils/theme';

export interface ILoaderProps {
  className?: string;
  colour?: TTheme;
}

// { colour = 'default', className = '' }
const Loader: FC<ILoaderProps> = () => <div />;

export default Loader;
