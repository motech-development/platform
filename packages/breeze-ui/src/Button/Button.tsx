import React, { FC, HTMLAttributes, memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import BaseButton, {
  buttonTheme,
  IBaseButtonProps,
} from '../BaseButton/BaseButton';
import Loader, { ILoaderProps } from '../Loader/Loader';

const loaderSizes = {
  lg: {
    height: '36px',
    margin: '-18px 0 0 -18px',
    width: '36px',
  },
  md: {
    height: '28px',
    margin: '-14px 0 0 -14px',
    width: '28px',
  },
  sm: {
    height: '20px',
    margin: '-10px 0 0 -10px',
    width: '20px',
  },
};

interface IButtonLoaderProps extends ILoaderProps {
  $size: keyof typeof loaderSizes;
}

const ButtonLoader = styled(Loader)<IButtonLoaderProps>`
  ${({ $size }) => `
    height: ${loaderSizes[$size].height};
    margin: ${loaderSizes[$size].margin};
    width: ${loaderSizes[$size].width};
  `}
`;

interface IButtonContainerProps {
  $isLoading: boolean;
}

const ButtonContainer = styled.span<IButtonContainerProps>`
  ${({ $isLoading }) => `
    visibility: ${$isLoading ? 'hidden' : 'visible'};
  `}
`;

export interface IButtonProps
  extends IBaseButtonProps,
    HTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const Button: FC<IButtonProps> = ({
  block = false,
  children,
  colour = 'primary',
  disabled = false,
  loading = false,
  size = 'md',
  type = 'button',
  ...rest
}) => {
  const loadingColour = colour === 'secondary' ? 'default' : 'secondary';

  return (
    <ThemeProvider theme={buttonTheme}>
      <BaseButton
        block={block}
        colour={colour}
        type={type}
        size={size}
        disabled={disabled || loading}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      >
        {loading && <ButtonLoader colour={loadingColour} $size={size} />}

        <ButtonContainer $isLoading={loading}>{children}</ButtonContainer>
      </BaseButton>
    </ThemeProvider>
  );
};

export default memo(Button);
