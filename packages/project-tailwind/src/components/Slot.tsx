import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react';

/** Reusable slot component base props */
export interface ISlot {
  /** Flags whether component should render child component */
  asChild?: boolean;
}

type TChild = ReactElement<{
  children?: ReactNode;
}>;

/** Slottable component props */
interface ISlottableProps extends ISlot {
  /** Component children */
  child: ReactNode;

  /** Component output */
  children: (child: ReactNode) => ReactNode;
}

/**
 * Customised Slottable component
 *
 * @param props - Slottable component props
 *
 * @returns Slottable component
 */
export function Slottable({
  asChild,
  child,
  children,
  ...rest
}: ISlottableProps) {
  if (asChild) {
    if (isValidElement(child)) {
      return cloneElement(
        child,
        rest,
        children((child as TChild).props.children),
      );
    }

    return null;
  }

  return <>{children(child)}</>;
}
