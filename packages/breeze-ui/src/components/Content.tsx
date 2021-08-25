import { ElementType, forwardRef } from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import { classNames } from '../utils/className';

export type TContentProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  {}
>;

const defaultElement = 'div';

const Content = forwardRef(
  <E extends ElementType = typeof defaultElement>(
    { className = '', ...rest }: TContentProps<E>,
    ref: typeof rest.ref,
  ) => (
    <Box
      as={defaultElement}
      className={classNames(
        'max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8',
        className,
      )}
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  ),
);

export default Content;
