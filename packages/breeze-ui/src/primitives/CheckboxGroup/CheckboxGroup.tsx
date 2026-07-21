import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components/CheckboxGroup';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldErrorProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const checkboxGroupRoot = tv({
  base: 'flex min-w-0 gap-2',
  defaultVariants: {
    orientation: 'vertical',
  },
  variants: {
    orientation: {
      horizontal:
        'flex-row flex-wrap items-start gap-x-5 [&>[data-breeze-checkbox-group-description]]:basis-full [&>[data-breeze-checkbox-group-error]]:basis-full [&>[data-breeze-checkbox-group-label]]:basis-full',
      vertical: 'flex-col items-start',
    },
  },
});

type CheckboxGroupRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface CheckboxGroupRootSharedProps extends CheckboxGroupRootNativeProps {
  /** Compound label, checkboxes, description, and error parts. */
  children: ReactNode;
  /** Prevents focus and selection changes for every checkbox. Defaults to `false`. */
  disabled?: boolean;
  /** Exposes invalid group state to assistive technology and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Native form field name shared by grouped checkboxes. */
  name?: string;
  /** Visual option layout. Defaults to `vertical`. */
  orientation?: 'horizontal' | 'vertical';
  /** Marks the group as requiring at least one selection. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledCheckboxGroupRootProps {
  /** Current selected checkbox values. */
  selection: string[];
  /** Called with the next selected checkbox values. */
  onSelectionChange: (selection: string[]) => void;
  defaultSelection?: never;
  readOnly?: false;
}

interface ReadOnlyCheckboxGroupRootProps {
  /** Current immutable selected checkbox values. */
  selection: string[];
  /** Marks a controlled selection as intentionally immutable. */
  readOnly: true;
  defaultSelection?: never;
  onSelectionChange?: never;
}

interface UncontrolledCheckboxGroupRootProps {
  /** Initial selected checkbox values. Defaults to an empty selection. */
  defaultSelection?: string[];
  /** Called with the next selected checkbox values. */
  onSelectionChange?: (selection: string[]) => void;
  readOnly?: false;
  selection?: never;
}

/** Props for controlled, read-only, or uncontrolled checkbox-group selection. */
export type CheckboxGroupRootProps = CheckboxGroupRootSharedProps &
  (
    | ControlledCheckboxGroupRootProps
    | ReadOnlyCheckboxGroupRootProps
    | UncontrolledCheckboxGroupRootProps
  );

/** Props for the visible checkbox-group label. */
export type CheckboxGroupLabelProps = TextFieldLabelProps;

/** Props for supporting text associated with the checkbox group. */
export type CheckboxGroupDescriptionProps = TextFieldDescriptionProps;

/** Props for an accessible checkbox-group validation message. */
export type CheckboxGroupErrorProps = TextFieldErrorProps;

/** Coordinates multiple checkbox selection, validation, layout, and form naming. */
export function Root({
  children,
  className,
  defaultSelection,
  disabled = false,
  invalid = false,
  name,
  onSelectionChange,
  orientation,
  readOnly = false,
  ref,
  required = false,
  selection,
  ...props
}: CheckboxGroupRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaCheckboxGroup,
    {
      ...props,
      className: checkboxGroupRoot({ class: className, orientation }),
      defaultValue: defaultSelection,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      name,
      onChange: onSelectionChange,
      ref: forwardedRef,
      value: selection,
    } as ComponentProps<typeof AriaCheckboxGroup>,
    children,
  );
}

/** Renders the persistent accessible label owned by the checkbox group. */
export function Label(props: CheckboxGroupLabelProps): ReactElement {
  return createElement(TextField.Label, {
    ...props,
    'data-breeze-checkbox-group-label': true,
  } as CheckboxGroupLabelProps & {
    'data-breeze-checkbox-group-label': true;
  });
}

/** Renders supporting guidance on its own checkbox-group row. */
export function Description(
  props: CheckboxGroupDescriptionProps,
): ReactElement {
  return createElement(TextField.Description, {
    ...props,
    'data-breeze-checkbox-group-description': true,
  } as CheckboxGroupDescriptionProps & {
    'data-breeze-checkbox-group-description': true;
  });
}

/** Renders associated validation feedback on its own checkbox-group row. */
function ErrorMessage(props: CheckboxGroupErrorProps): ReactElement {
  return createElement(TextField.Error, {
    ...props,
    'data-breeze-checkbox-group-error': true,
  } as CheckboxGroupErrorProps & {
    'data-breeze-checkbox-group-error': true;
  });
}

export { ErrorMessage as Error };

/**
 * Coordinates labelled multiple selection with native checkbox semantics.
 *
 * @summary labelled multiple selection with native checkbox semantics
 */
export const CheckboxGroup = {
  /** Supporting guidance associated with the group. */
  Description,
  /** Validation message associated with an invalid group. */
  Error: ErrorMessage,
  /** Persistent accessible group label. */
  Label,
  /** Selection, validation, layout, and native form root. */
  Root,
};
