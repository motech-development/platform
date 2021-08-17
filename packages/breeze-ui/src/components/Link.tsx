import { ComponentPropsWithoutRef, createElement, ElementType } from 'react';
import { classNames } from '../utils/className';

interface ILinkProps<C extends ElementType> {
  as?: C;
}

export type TLinkProps<C extends ElementType> = ILinkProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof ILinkProps<C>>;

const Link = <C extends ElementType = 'a'>({
  as,
  children,
  className = '',
  ...rest
}: TLinkProps<C>) => {
  const component = as || 'a';

  return createElement(
    component,
    {
      className: classNames(
        'appearance-none bg-none border-0 font-semibold text-blue-600 underline hover:no-underline hover:text-red-600 focus:outline-none',
        className,
      ),
      ...rest,
    },
    children,
  );
};

export default Link;
