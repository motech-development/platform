import { describe, expectTypeOf, it } from 'vitest';
import type { ButtonProps } from './Button/Button';
import type { IconButtonProps } from './IconButton/IconButton';
import type { LinkProps } from './Link/Link';
import type { LinkButtonProps } from './LinkButton/LinkButton';
import type { LogoProps } from './Logo/Logo';
import type { ToggleButtonProps } from './ToggleButton/ToggleButton';

describe('native public prop contracts', () => {
  it('accepts relevant native button and anchor attributes', () => {
    expectTypeOf<{
      'aria-controls': string;
      'aria-labelledby': string;
      children: string;
      formAction: string;
      id: string;
      type: 'submit';
    }>().toMatchTypeOf<ButtonProps>();
    expectTypeOf<{
      'aria-controls': string;
      'aria-labelledby': string;
      'aria-label': string;
      children: string;
      formAction: string;
      id: string;
      type: 'submit';
    }>().toMatchTypeOf<IconButtonProps>();
    expectTypeOf<{
      'aria-controls': string;
      'aria-labelledby': string;
      children: string;
      href: string;
      id: string;
    }>().toMatchTypeOf<LinkProps>();
    expectTypeOf<{
      'aria-controls': string;
      'aria-labelledby': string;
      children: string;
      href: string;
      id: string;
    }>().toMatchTypeOf<LinkButtonProps>();
    expectTypeOf<{
      'aria-controls': string;
      'aria-labelledby': string;
      children: string;
      id: string;
    }>().toMatchTypeOf<ToggleButtonProps>();
  });

  it('does not expose DOM click, inline style, or conflicting state props', () => {
    expectTypeOf<ButtonProps>().not.toHaveProperty('onClick');
    expectTypeOf<ButtonProps>().not.toHaveProperty('onClickCapture');
    expectTypeOf<ButtonProps>().not.toHaveProperty('style');
    expectTypeOf<IconButtonProps>().not.toHaveProperty('onClick');
    expectTypeOf<LinkProps>().not.toHaveProperty('onClick');
    expectTypeOf<LinkButtonProps>().not.toHaveProperty('onClickCapture');
    expectTypeOf<LogoProps>().not.toHaveProperty('aria-label');
    expectTypeOf<ToggleButtonProps>().not.toHaveProperty('onClick');
    expectTypeOf<ToggleButtonProps>().not.toHaveProperty('isSelected');
    expectTypeOf<{
      children: string;
      type: 'reset';
    }>().not.toMatchTypeOf<ButtonProps>();
    expectTypeOf<{
      'aria-label': string;
      children: string;
      type: 'reset';
    }>().not.toMatchTypeOf<IconButtonProps>();
  });

  it('keeps text appearance exclusive to buttons with visible text', () => {
    expectTypeOf<{
      appearance: 'text';
      children: string;
    }>().toMatchTypeOf<ButtonProps>();
    expectTypeOf<{
      'aria-label': string;
      appearance: 'text';
      children: string;
    }>().not.toMatchTypeOf<IconButtonProps>();
  });

  it('requires a callback only for mutable controlled toggles', () => {
    expectTypeOf<{
      children: string;
      onChange: (selected: boolean) => void;
      selected: boolean;
    }>().toMatchTypeOf<ToggleButtonProps>();
    expectTypeOf<{
      children: string;
      readOnly: true;
      selected: boolean;
    }>().toMatchTypeOf<ToggleButtonProps>();
    expectTypeOf<{
      children: string;
      selected: boolean;
    }>().not.toMatchTypeOf<ToggleButtonProps>();
    expectTypeOf<{
      children: string;
      defaultSelected: boolean;
      selected: boolean;
    }>().not.toMatchTypeOf<ToggleButtonProps>();
  });
});
