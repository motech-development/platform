import { FC, ReactNode } from 'react';
import TTheme from '../utils/theme';

export interface ITooltipProps {
  colour?: TTheme;
  id: string;
  message: ReactNode;
  parent: ReactNode;
  // placement: TooltipPlacement;
}

// {
//   colour = 'primary',
//   message,
//   id,
//   parent,
//   placement,
// }
const Tooltip: FC<ITooltipProps> = () => <div />;

export default Tooltip;
