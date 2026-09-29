import type { ReactNode } from 'react';
import { useId } from 'react';
import { Typography } from '../../primitives/Typography/Typography';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    fieldset:
      'breeze:m-0 breeze:flex breeze:min-inline-size-0 breeze:flex-col breeze:gap-breeze-4 breeze:border-0 breeze:p-0',
    legend: 'breeze:p-0 breeze:pbe-breeze-1',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

/** Props for a field group with an accessible title and optional description. */
export interface FormSectionProps {
  /** Fields and related content in this group. */
  children: ReactNode;
  /** Optional explanation associated with the field group. */
  description?: string;
  /** Names the field group. */
  title: string;
}

/** Groups related form fields under a native fieldset legend. */
export function FormSection({
  children,
  description,
  title,
}: Readonly<FormSectionProps>) {
  useBreezeContext();

  const descriptionId = useId();

  return (
    <fieldset
      aria-describedby={description ? descriptionId : undefined}
      className={variants.base.fieldset}
    >
      <legend className={variants.base.legend}>
        <Typography element="span" variant="title">
          {title}
        </Typography>
      </legend>
      {description ? (
        <Typography
          element="p"
          id={descriptionId}
          tone="secondary"
          variant="body"
        >
          {description}
        </Typography>
      ) : null}
      {children}
    </fieldset>
  );
}
