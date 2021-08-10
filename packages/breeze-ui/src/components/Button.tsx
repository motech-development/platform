import { FC, HTMLProps } from 'react';
import TSize from '../utils/size';
import TTheme from '../utils/theme';

export interface IButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  block?: boolean;
  colour?: TTheme;
  disabled?: boolean;
  loading?: boolean;
  size?: TSize;
  type?: 'submit' | 'reset' | 'button';
}

// {
//   block = false,
//   children,
//   colour = 'primary',
//   disabled = false,
//   loading = false,
//   size = 'md',
//   type = 'button',
//   ...rest
// }
const Button: FC<IButtonProps> = () => <button type="button">Test</button>;

export default Button;
