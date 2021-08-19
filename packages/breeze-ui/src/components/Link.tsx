import { ElementType } from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import { classNames } from '../utils/className';

export type TLinkProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  {}
>;

const defaultElement = 'a';

const Link = <E extends ElementType = typeof defaultElement>({
  className = '',
  ...rest
}: TLinkProps<E>) => (
  <Box
    as={defaultElement}
    className={classNames(
      'appearance-none bg-none border-0 font-semibold text-blue-600 underline hover:no-underline hover:text-red-600 focus:outline-none',
      className,
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

export default Link;
