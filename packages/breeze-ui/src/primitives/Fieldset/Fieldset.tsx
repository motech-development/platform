import type {
  FieldsetHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  createContext,
  createElement,
  useContext,
  useId,
  useMemo,
} from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const fieldsetRoot = tv({
  base: 'm-0 flex min-w-0 flex-col gap-3 border-0 p-0 disabled:opacity-70',
});

const fieldsetLegend = tv({
  base: 'mb-1 p-0 font-[family-name:var(--breeze-font-display)] text-base font-bold text-[var(--breeze-ink)]',
});

const fieldsetDescription = tv({
  base: 'text-sm text-[var(--breeze-ink-soft)]',
});

const fieldsetError = tv({
  base: 'text-sm font-medium text-[var(--breeze-danger)]',
});

interface FieldsetContextValue {
  descriptionId: string;
  errorId: string;
}

const FieldsetContext = createContext<FieldsetContextValue | null>(null);

function useFieldsetContext(): FieldsetContextValue {
  const context = useContext(FieldsetContext);

  if (context === null) {
    throw new globalThis.Error(
      'Fieldset parts must be rendered within Fieldset.Root.',
    );
  }

  return context;
}

/** Props for a native group of related form controls. */
export interface FieldsetRootProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'style'> {
  /** Legend, description, error, and related controls. */
  children: ReactNode;
  /** Exposes invalid group state to assistive technology and error association. Defaults to `false`. */
  invalid?: boolean;
  /** Ref to the rendered fieldset. */
  ref?: Ref<HTMLFieldSetElement>;
}

/** Props for the native fieldset legend. */
export interface FieldsetLegendProps
  extends Omit<HTMLAttributes<HTMLLegendElement>, 'style'> {
  /** Persistent group name. */
  children: ReactNode;
  /** Ref to the rendered legend. */
  ref?: Ref<HTMLLegendElement>;
}

/** Props for supporting text associated with the fieldset. */
export interface FieldsetDescriptionProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'id' | 'style'> {
  /** Supporting guidance for the control group. */
  children: ReactNode;
  /** Ref to the rendered description. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Props for an accessible fieldset validation message. */
export interface FieldsetErrorProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'id' | 'style'> {
  /** Validation message for the control group. */
  children: ReactNode;
  /** Ref to the rendered error message. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Renders a native form-control group with associated compound guidance. */
export function Root({
  'aria-describedby': ariaDescribedBy,
  children,
  className,
  invalid = false,
  ref,
  ...props
}: FieldsetRootProps): ReactElement {
  useBreezeContext();

  const generatedId = useId();
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const forwardedRef = useForwardedRef(ref);
  const contextValue = useMemo(
    () => ({ descriptionId, errorId }),
    [descriptionId, errorId],
  );
  const describedBy = [
    ariaDescribedBy,
    descriptionId,
    invalid ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return createElement(
    FieldsetContext.Provider,
    { value: contextValue },
    createElement(
      'fieldset',
      {
        ...props,
        'aria-describedby': describedBy,
        'aria-invalid': invalid || undefined,
        className: fieldsetRoot({ class: className }),
        ref: forwardedRef,
      },
      children,
    ),
  );
}

/** Renders the native accessible name for a Fieldset. */
export function Legend({
  className,
  ref,
  ...props
}: FieldsetLegendProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('legend', {
    ...props,
    className: fieldsetLegend({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders supporting guidance associated with a Fieldset. */
export function Description({
  className,
  ref,
  ...props
}: FieldsetDescriptionProps): ReactElement {
  const { descriptionId } = useFieldsetContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement('p', {
    ...props,
    className: fieldsetDescription({ class: className }),
    id: descriptionId,
    ref: forwardedRef,
  });
}

/** Renders a validation message associated with an invalid Fieldset. */
function ErrorMessage({
  className,
  ref,
  ...props
}: FieldsetErrorProps): ReactElement {
  const { errorId } = useFieldsetContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement('p', {
    ...props,
    className: fieldsetError({ class: className }),
    id: errorId,
    ref: forwardedRef,
  });
}

export { ErrorMessage as Error };

/**
 * Groups related form controls with native fieldset and legend semantics plus
 * associated guidance and group-level validation feedback.
 *
 * @summary native form-control group with accessible compound guidance
 */
export const Fieldset = {
  /** Supporting guidance associated with the group. */
  Description,
  /** Validation message associated with an invalid group. */
  Error: ErrorMessage,
  /** Persistent native group name. */
  Legend,
  /** Native fieldset and accessibility root. */
  Root,
};
