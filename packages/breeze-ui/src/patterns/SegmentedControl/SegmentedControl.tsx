import type { ReactElement, ReactNode } from 'react';
import { ToggleButton } from '../../primitives/ToggleButton/ToggleButton';
import { ToggleGroup } from '../../primitives/ToggleGroup/ToggleGroup';

/** One option displayed by SegmentedControl. */
export interface SegmentedControlOption {
  /** Prevents selection of this option. Defaults to `false`. */
  disabled?: boolean;
  /** Visible option label. */
  label: ReactNode;
  /** Stable semantic value. */
  value: string;
}

interface SegmentedControlSharedProps {
  /** Accessible name for the exclusive choice. */
  'aria-label': string;
  /** Optional placement class for application composition. */
  className?: string;
  /** Prevents all choices from changing. Defaults to `false`. */
  disabled?: boolean;
  /** Choice layout and keyboard axis. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ordered application-owned options. */
  options: readonly SegmentedControlOption[];
}

interface ControlledSegmentedControlProps {
  /** Current selected option. */
  value: string;
  /** Called with the next selected option. */
  onChange: (value: string) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlySegmentedControlProps {
  /** Current immutable selected option. */
  value: string;
  /** Marks the controlled value as intentionally immutable. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledSegmentedControlProps {
  /** Initial selected option. */
  defaultValue?: string;
  /** Called with the next selected option. */
  onChange?: (value: string) => void;
  value?: never;
  readOnly?: false;
}

/** Props for a controlled, read-only, or uncontrolled segmented choice. */
export type SegmentedControlProps = SegmentedControlSharedProps &
  (
    | ControlledSegmentedControlProps
    | ReadOnlySegmentedControlProps
    | UncontrolledSegmentedControlProps
  );

/**
 * Presents a compact exclusive choice with arrow-key navigation.
 *
 * @summary exclusive compact choice with controlled or uncontrolled state
 */
export function SegmentedControl({
  'aria-label': ariaLabel,
  className,
  defaultValue,
  disabled = false,
  onChange,
  options,
  orientation = 'horizontal',
  readOnly = false,
  value,
}: SegmentedControlProps): ReactElement {
  const selection = value === undefined ? undefined : [value];
  const defaultSelection =
    defaultValue === undefined ? undefined : [defaultValue];
  const reportSelection = (nextSelection: string[]) => {
    const [nextValue] = nextSelection;

    if (nextValue !== undefined) {
      onChange?.(nextValue);
    }
  };
  const content = (
    <>
      {options.map((option) => (
        <ToggleButton
          disabled={option.disabled}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </ToggleButton>
      ))}
    </>
  );

  const adjacentBorderClass =
    orientation === 'vertical'
      ? '[&>button+button]:border-t-0'
      : '[&>button+button]:border-s-0';
  const resolvedClassName = `gap-0 ${adjacentBorderClass} ${className ?? ''}`;

  if (selection === undefined) {
    return (
      <ToggleGroup
        aria-label={ariaLabel}
        className={resolvedClassName}
        defaultSelection={defaultSelection}
        disabled={disabled}
        onSelectionChange={reportSelection}
        orientation={orientation}
      >
        {content}
      </ToggleGroup>
    );
  }

  if (readOnly) {
    return (
      <ToggleGroup
        aria-label={ariaLabel}
        className={resolvedClassName}
        disabled={disabled}
        orientation={orientation}
        readOnly
        selection={selection}
      >
        {content}
      </ToggleGroup>
    );
  }

  if (onChange === undefined) {
    throw new Error('Controlled SegmentedControl requires onChange.');
  }

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      className={resolvedClassName}
      disabled={disabled}
      onSelectionChange={reportSelection}
      orientation={orientation}
      selection={selection}
    >
      {content}
    </ToggleGroup>
  );
}
