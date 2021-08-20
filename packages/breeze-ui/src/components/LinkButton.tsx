import { ElementType, forwardRef } from 'react';
import { PolymorphicComponentProps } from 'react-polymorphic-box';
import TSize from '../utils/size';
import TTheme from '../utils/theme';
import BaseButton from './BaseButton';

interface ILinkButtonProps {
  block?: boolean;
  colour?: TTheme;
  size?: TSize;
}

export type TLinkButtonProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  ILinkButtonProps
>;

const defaultElement = 'a';

const LinkButton = forwardRef(
  <C extends ElementType = typeof defaultElement>(
    {
      block = false,
      colour = 'primary',
      size = 'md',
      ...rest
    }: TLinkButtonProps<C>,
    ref: typeof rest.ref,
  ) => (
    <BaseButton
      as={defaultElement}
      block={block}
      colour={colour}
      ref={ref}
      size={size}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  ),
);

export default LinkButton;
