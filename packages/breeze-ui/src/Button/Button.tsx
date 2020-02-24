import React, { FC, HTMLAttributes, memo } from 'react';
import { ThemeProvider } from 'styled-components';
import BaseButton, {
  buttonTheme,
  IBaseButtonProps,
} from '../BaseButton/BaseButton';

export interface IButtonProps
  extends IBaseButtonProps,
    HTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const Button: FC<IButtonProps> = ({
  block = false,
  children,
  colour = 'primary',
  disabled = false,
  size = 'md',
  type = 'button',
  ...rest
}) => (
  <ThemeProvider theme={buttonTheme}>
    <BaseButton
      block={block}
      colour={colour}
      type={type}
      size={size}
      disabled={disabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </BaseButton>
  </ThemeProvider>
);

export default memo(Button);
