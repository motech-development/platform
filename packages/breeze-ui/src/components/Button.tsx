import { ButtonHTMLAttributes, FC, forwardRef } from 'react';
import { classNames } from '../utils/className';
import TSize from '../utils/size';
import TTheme from '../utils/theme';
import BaseButton from './BaseButton';
import Loader from './Loader';

const loaderSize = (size: TSize) => {
  switch (size) {
    case 'lg':
      return 'w-7 h-7 -mt-3.5 -ml-3.5';
    case 'sm':
      return 'w-3 h-3 -mt-1.5 -ml-1.5';
    default:
      return 'w-5 h-5 -mt-2.5 -ml-2.5';
  }
};

type TButtonType = 'submit' | 'reset' | 'button';

export interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  block?: boolean;
  colour?: TTheme;
  disabled?: boolean;
  loading?: boolean;
  size?: TSize;
  type?: TButtonType;
}

const Button: FC<IButtonProps> = forwardRef<HTMLImageElement, IButtonProps>(
  (
    {
      block = false,
      children,
      colour = 'primary',
      disabled = false,
      loading = false,
      size = 'md',
      type = 'button',
      ...rest
    },
    ref,
  ) => (
    <BaseButton
      as="button"
      block={block}
      colour={colour}
      disabled={disabled || loading}
      ref={ref}
      size={size}
      type={type}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {loading && (
        <Loader
          className={classNames('absolute top-2/4 left-2/4', loaderSize(size))}
        />
      )}

      <span className={classNames(loading ? 'invisible' : '')}>{children}</span>
    </BaseButton>
  ),
);

export default Button;
