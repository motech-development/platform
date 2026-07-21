import type { ComponentProps, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components/ToggleButton';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import action from '../../internal/styling/actions';
import type {
  ControlSize,
  VisualAppearance,
  VisualVariant,
} from '../../internal/styling/visual';
import type { NativeButtonProps } from '../../internal/types/native';
import { useBreezeContext } from '../../provider/BreezeContext';

interface ToggleButtonSharedProps extends Omit<NativeButtonProps, 'value'> {
  /** Visual emphasis treatment. Defaults to `outline`. */
  appearance?: VisualAppearance;
  /** Toggle content. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Prevents interaction. Defaults to `false`. */
  disabled?: boolean;
  /** Ref to the rendered button. */
  ref?: Ref<HTMLButtonElement>;
  /** Canonical control size. Defaults to `md`. */
  size?: ControlSize;
  /** Stable value when the toggle is composed inside a ToggleGroup. */
  value?: string;
  /** Semantic colour. Defaults to `primary`. */
  variant?: VisualVariant;
}

interface ControlledToggleButtonProps {
  /** Current selected state. */
  selected: boolean;
  /** Called with the next selected state. */
  onChange: (selected: boolean) => void;
  defaultSelected?: never;
  readOnly?: false;
}

interface ReadOnlyToggleButtonProps {
  /** Current selected state. */
  selected: boolean;
  /** Marks controlled state as intentionally immutable while preserving focus. */
  readOnly: true;
  defaultSelected?: never;
  onChange?: never;
}

interface UncontrolledToggleButtonProps {
  /** Initial selected state. Defaults to `false`. */
  defaultSelected?: boolean;
  /** Called with the next selected state. */
  onChange?: (selected: boolean) => void;
  readOnly?: false;
  selected?: never;
}

/** Props for a controlled or uncontrolled two-state action. */
export type ToggleButtonProps = ToggleButtonSharedProps &
  (
    | ControlledToggleButtonProps
    | ReadOnlyToggleButtonProps
    | UncontrolledToggleButtonProps
  );

/**
 * Selects or deselects a two-state action through pointer or keyboard input.
 *
 * @summary two-state action with controlled or uncontrolled selection
 */
export function ToggleButton({
  appearance = 'outline',
  children,
  className,
  defaultSelected,
  disabled = false,
  id,
  onChange,
  readOnly = false,
  ref,
  selected,
  size,
  value,
  variant,
  ...props
}: ToggleButtonProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaToggleButton,
    {
      ...props,
      className: ({ isSelected }) =>
        action({
          appearance: isSelected ? 'solid' : appearance,
          class: className,
          size,
          variant,
        }),
      defaultSelected,
      id: value ?? id,
      isDisabled: disabled,
      isSelected: selected,
      onChange: readOnly ? undefined : onChange,
      ref: forwardedRef,
    } as ComponentProps<typeof AriaToggleButton>,
    children,
  );
}
