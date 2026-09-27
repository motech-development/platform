import type { ButtonHTMLAttributes, Ref } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components/ToggleButton';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { ControlSize } from '../Button/Button';

const variants = {
  base: {
    toggle:
      'breeze:inline-flex breeze:items-center breeze:justify-center breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:font-breeze-sans breeze:font-semibold breeze:text-breeze-ink breeze:cursor-pointer breeze:select-none breeze:outline-offset-2 breeze:data-[hovered]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-60 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
  },
  compound: {},
  size: {
    lg: 'breeze:min-block-breeze-lg breeze:ps-breeze-5 breeze:pe-breeze-5 breeze:py-breeze-3 breeze:text-breeze-sm',
    md: 'breeze:min-block-breeze-md breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:text-breeze-sm',
    sm: 'breeze:min-block-breeze-sm breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-1 breeze:text-breeze-xs',
  },
  state: {
    pressed:
      'breeze:data-[selected]:border-breeze-brand breeze:data-[selected]:bg-breeze-brand-soft breeze:data-[selected]:text-breeze-brand-text breeze:forced-colors:data-[selected]:outline-2 breeze:forced-colors:data-[selected]:outline-offset-2',
  },
  variant: {},
} as const;

interface ToggleCommonProps {
  /** Provides an accessible name when it differs from the visible label. */
  'aria-label'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-label'];
  /** Identifies elements that provide additional information about the toggle. */
  'aria-describedby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-describedby'];
  /** Identifies elements whose text provides the toggle's accessible name. */
  'aria-labelledby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-labelledby'];
  /** Visible label and default accessible name. */
  children: string;
  /** Prevents the toggle from being activated. Defaults to `false`. */
  disabled?: boolean;
  /** Sets the rendered button's HTML `id`. */
  id?: ButtonHTMLAttributes<HTMLButtonElement>['id'];
  /** Provides access to the rendered button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Selects the toggle's dimensions. Defaults to `md`. */
  size?: ControlSize;
}

interface ControlledToggleProps {
  /** Current pressed state. */
  pressed: boolean;
  /** Reports the next pressed state without exposing a DOM event. */
  onChange: (pressed: boolean) => void;
  /** Controlled and uncontrolled state props are mutually exclusive. */
  defaultPressed?: never;
}

interface UncontrolledToggleProps {
  /** Initial pressed state. Defaults to `false`. */
  defaultPressed?: boolean;
  /** Reports the next pressed state without exposing a DOM event. */
  onChange?: (pressed: boolean) => void;
  /** Controlled and uncontrolled state props are mutually exclusive. */
  pressed?: never;
}

/** Props for controlled or uncontrolled button-like pressed state. */
export type ToggleProps = ToggleCommonProps &
  (ControlledToggleProps | UncontrolledToggleProps);

/**
 * Renders a button whose accessible pressed state represents a binary choice.
 *
 * @summary A semantic, pressable on/off control.
 */
export function Toggle({
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
  size = 'md',
}: Readonly<ToggleProps>) {
  useBreezeContext();

  return (
    <AriaToggleButton
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={[
        variants.base.toggle,
        variants.size[size],
        variants.state.pressed,
      ].join(' ')}
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
