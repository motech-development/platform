import type { ReactNode } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    actions:
      'breeze:flex breeze:min-inline-0 breeze:flex-wrap breeze:items-center breeze:gap-breeze-3',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    align: {
      end: 'breeze:justify-end',
      start: 'breeze:justify-start',
    },
  },
} as const;

export type FormActionsAlign = keyof typeof variants.variant.align;

/** Props for a consistently spaced row of form actions. */
export interface FormActionsProps {
  /** Aligns the actions along the inline axis. Defaults to `end`. */
  align?: FormActionsAlign;
  /** Application-owned actions, usually buttons. */
  children: ReactNode;
}

/** Places form action content in a responsive, consistently spaced row. */
export function FormActions({
  align = 'end',
  children,
}: Readonly<FormActionsProps>) {
  useBreezeContext();

  return (
    <div
      className={[variants.base.actions, variants.variant.align[align]].join(
        ' ',
      )}
    >
      {children}
    </div>
  );
}
