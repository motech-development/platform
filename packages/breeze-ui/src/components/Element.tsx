import { createElement, FC, HTMLProps, ReactHTML } from 'react';

export interface IElementProps extends HTMLProps<HTMLElement> {
  as: keyof ReactHTML;
}

const Element: FC<IElementProps> = ({ as, children, ...rest }) =>
  createElement(as, rest, children);

export default Element;
