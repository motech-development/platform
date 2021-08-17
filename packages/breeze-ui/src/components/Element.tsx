import { ComponentPropsWithoutRef, createElement, ElementType } from 'react';

interface IElementProps<C extends ElementType> {
  as: C;
}

export type TElementProps<C extends ElementType> = IElementProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof IElementProps<C>>;

const Element = <C extends ElementType>({
  as,
  children,
  ...rest
}: TElementProps<C>) => createElement(as, rest, children);

export default Element;
