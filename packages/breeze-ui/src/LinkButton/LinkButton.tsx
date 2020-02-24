import React, { FC, memo } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import BaseButton, {
  buttonTheme,
  IBaseButtonProps,
} from '../BaseButton/BaseButton';

const InternalLink: FC<ILinkButtonProps> = ({
  className,
  colour,
  block,
  ...rest
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Link className={className} {...rest} />
);

export interface ILinkButtonProps extends IBaseButtonProps, LinkProps {
  block?: boolean;
}

const LinkButton: FC<ILinkButtonProps> = ({
  block = false,
  colour = 'primary',
  size = 'md',
  ...rest
}) => (
  <ThemeProvider theme={buttonTheme}>
    <BaseButton
      as={InternalLink}
      block={block}
      colour={colour}
      size={size}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  </ThemeProvider>
);

export default memo(LinkButton);
