import type { ButtonHTMLAttributes, Ref } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components/ToggleButton';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    chip: 'breeze:inline-flex breeze:items-center breeze:justify-center breeze:whitespace-nowrap breeze:rounded-breeze-full breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:font-breeze-sans breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink breeze:cursor-pointer breeze:select-none breeze:outline-offset-2 breeze:data-[hovered]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-60 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap breeze:min-block-breeze-sm',
  },
  compound: {},
  size: {},
  state: {
    pressed:
      'breeze:data-[selected]:border-breeze-brand breeze:data-[selected]:bg-breeze-brand-soft breeze:data-[selected]:text-breeze-brand-text breeze:forced-colors:data-[selected]:outline-2 breeze:forced-colors:data-[selected]:outline-offset-2',
  },
  variant: {},
} as const;

interface ChipCommonProps {
  /** Provides an accessible name when it differs from the visible label. */
  'aria-label'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-label'];
  /** Identifies elements that provide additional information about the chip. */
  'aria-describedby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-describedby'];
  /** Identifies elements whose text provides the chip's accessible name. */
  'aria-labelledby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-labelledby'];
  /** Visible filter label and default accessible name. */
  children: string;
  /** Prevents the chip from being activated. Defaults to `false`. */
  disabled?: boolean;
  /** Sets the rendered button's HTML `id`. */
  id?: ButtonHTMLAttributes<HTMLButtonElement>['id'];
  /** Provides access to the rendered button element. */
  ref?: Ref<HTMLButtonElement>;
}

interface ControlledChipProps {
  /** Current pressed state. */
  pressed: boolean;
  /** Reports the next pressed state without exposing a DOM event. */
  onChange: (pressed: boolean) => void;
  /** Controlled and uncontrolled state props are mutually exclusive. */
  defaultPressed?: never;
}

interface UncontrolledChipProps {
  /** Initial pressed state. Defaults to `false`. */
  defaultPressed?: boolean;
  /** Reports the next pressed state without exposing a DOM event. */
  onChange?: (pressed: boolean) => void;
  /** Controlled and uncontrolled state props are mutually exclusive. */
  pressed?: never;
}

/** Props for controlled or uncontrolled boolean chip state. */
export type ChipProps = ChipCommonProps &
  (ControlledChipProps | UncontrolledChipProps);

/**
 * Renders an independently selectable, pill-shaped filter chip.
 *
 * @summary A compact filter with an accessible pressed state.
 */
export function Chip({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  defaultPressed,
  disabled = false,
  id,
  onChange,
  pressed,
  ref,
}: Readonly<ChipProps>) {
  useBreezeContext();

  return (
    <AriaToggleButton
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={[variants.base.chip, variants.state.pressed].join(' ')}
      defaultSelected={defaultPressed}
      id={id}
      isDisabled={disabled}
      isSelected={pressed}
      onChange={onChange}
      ref={ref}
    >
      {children}
    </AriaToggleButton>
  );
}
