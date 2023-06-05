import { ElementType, ComponentProps, ReactElement, forwardRef } from 'react';

/** Default component element */
const DEFAULT_ELEMENT = 'div';

/** Inner box component props */
interface IBoxOwnProps<E extends ElementType = ElementType> {
  /** Element to render component as */
  as?: E;
}

type TBox = <E extends ElementType = typeof DEFAULT_ELEMENT>(
  props: TBoxProps<E>,
) => ReactElement | null;

export type TBoxComponentProps<E extends ElementType, P> = P & TBoxProps<E>;

/** Box component props */
export type TBoxProps<E extends ElementType> = IBoxOwnProps<E> &
  Omit<ComponentProps<E>, keyof IBoxOwnProps>;

/**
 * A flexible polymorphic box component
 *
 * @deprecated in favour of using slots.
 *
 * @param props - Box component props
 *
 * @returns Box component
 *
 */
export const Box: TBox = forwardRef<Element, IBoxOwnProps>(
  ({ as, ...rest }, ref) => {
    const Comp = as || DEFAULT_ELEMENT;

    return <Comp ref={ref} {...rest} />;
  },
);
