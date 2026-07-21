import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ConflictingInteractionProps =
  | 'children'
  | 'className'
  | 'onClick'
  | 'onClickCapture'
  | 'style';

/** Native React button attributes that do not conflict with Breeze state APIs. */
export type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | ConflictingInteractionProps
  | 'aria-busy'
  | 'aria-pressed'
  | 'disabled'
  | 'onChange'
  | 'type'
>;

/** Native React anchor attributes that do not conflict with Breeze navigation APIs. */
export type NativeLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  ConflictingInteractionProps | 'download' | 'href'
>;
