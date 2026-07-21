import type { ComponentProps, ReactElement } from 'react';
import { createElement } from 'react';

/** Native form behaviors supported by Breeze action buttons. */
export type NativeButtonType = 'button' | 'submit';

/** Renders the concrete button expected by React Aria's DOM render contract. */
export default function renderNativeButton(
  props: ComponentProps<'button'>,
  type: NativeButtonType,
): ReactElement {
  if (type === 'submit') {
    return createElement('button', {
      ...props,
      type: 'submit',
    });
  }

  return createElement('button', {
    ...props,
    type: 'button',
  });
}
