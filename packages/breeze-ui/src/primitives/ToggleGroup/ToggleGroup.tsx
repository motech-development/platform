import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { ToggleButtonGroup as AriaToggleButtonGroup } from 'react-aria-components/ToggleButtonGroup';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const toggleGroup = tv({
  base: 'inline-flex gap-1',
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col items-stretch',
    },
  },
});

type ToggleGroupNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface ToggleGroupSharedProps extends ToggleGroupNativeProps {
  /** ToggleButton children with stable `value` props. */
  children: ReactNode;
  /** Prevents all contained toggles from changing. Defaults to `false`. */
  disabled?: boolean;
  /** Allows more than one selected value. Defaults to `false`. */
  multiple?: boolean;
  /** Layout and keyboard navigation axis. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledToggleGroupProps {
  /** Current selected values. */
  selection: string[];
  /** Called with the next selected values. */
  onSelectionChange: (selection: string[]) => void;
  defaultSelection?: never;
  readOnly?: false;
}

interface ReadOnlyToggleGroupProps {
  /** Current selected values. */
  selection: string[];
  /** Marks a controlled selection as intentionally immutable. */
  readOnly: true;
  defaultSelection?: never;
  onSelectionChange?: never;
}

interface UncontrolledToggleGroupProps {
  /** Initial selected values. Defaults to an empty selection. */
  defaultSelection?: string[];
  /** Called with the next selected values. */
  onSelectionChange?: (selection: string[]) => void;
  readOnly?: false;
  selection?: never;
}

/** Props for a controlled, read-only, or uncontrolled toggle collection. */
export type ToggleGroupProps = ToggleGroupSharedProps &
  (
    | ControlledToggleGroupProps
    | ReadOnlyToggleGroupProps
    | UncontrolledToggleGroupProps
  );

/**
 * Coordinates single or multiple toggle selection and arrow-key navigation.
 *
 * @summary related toggle actions with single or multiple selection
 */
export function ToggleGroup({
  children,
  className,
  defaultSelection,
  disabled = false,
  multiple = false,
  onSelectionChange,
  orientation,
  readOnly: _readOnly,
  ref,
  selection,
  ...props
}: Readonly<ToggleGroupProps>): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaToggleButtonGroup,
    {
      ...props,
      className: toggleGroup({
        class: className,
        orientation,
      }),
      defaultSelectedKeys: defaultSelection,
      isDisabled: disabled,
      onSelectionChange: (keys) => onSelectionChange?.([...keys].map(String)),
      orientation,
      ref: forwardedRef,
      selectedKeys: selection,
      selectionMode: multiple ? 'multiple' : 'single',
    },
    children,
  );
}
