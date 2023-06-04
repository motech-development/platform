import { ElementType, ComponentProps, ReactElement, forwardRef } from 'react';

/** Default component element */
const DEFAULT_ELEMENT = 'div';

interface IBoxOwnProps<E extends ElementType = ElementType> {
  as?: E;
}

type TBox = <E extends ElementType = typeof DEFAULT_ELEMENT>(
  props: TBoxProps<E>,
) => ReactElement | null;

export type TBoxComponentProps<E extends ElementType, P> = P & TBoxProps<E>;

export type TBoxProps<E extends ElementType> = IBoxOwnProps<E> &
  Omit<ComponentProps<E>, keyof IBoxOwnProps>;

export const Box: TBox = forwardRef<Element, IBoxOwnProps>(
  ({ as, ...rest }, ref) => {
    const Element = as || DEFAULT_ELEMENT;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Element ref={ref} {...rest} />;
  },
);
