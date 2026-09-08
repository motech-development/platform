import type { ButtonHTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { useBreezeContext } from '../../provider/BreezeContext';

// The ordered recipe is the v4 contribution contract, not alphabetical data.
const variants = {
  base: {
    button:
      'relative inline-grid items-center justify-center gap-breeze-2 border border-solid rounded-breeze-ctl font-breeze-sans text-breeze-sm leading-breeze-snug cursor-pointer select-none [text-align:center] outline-offset-2 data-[focus-visible]:outline-2 data-[focus-visible]:outline-solid data-[focus-visible]:outline-breeze-brand pointer-coarse:min-block-breeze-tap pointer-coarse:min-inline-breeze-tap',
    label: '[grid-area:1/1]',
    skeleton:
      '[grid-area:1/1] inline-size-full block-size-breeze-3 rounded-breeze-xs',
  },
  variant: {
    danger:
      'border-transparent bg-breeze-danger-fill text-breeze-on-brand data-[hovered]:bg-breeze-danger-hover data-[pressed]:bg-breeze-danger-hover',
    primary:
      'border-transparent bg-breeze-brand text-breeze-on-brand data-[hovered]:bg-breeze-brand-hover data-[pressed]:bg-breeze-brand-hover',
    quiet:
      'border-transparent bg-transparent text-breeze-brand-text data-[hovered]:bg-breeze-brand-soft data-[pressed]:bg-breeze-brand-soft',
    secondary:
      'border-breeze-line-strong bg-breeze-surface text-breeze-ink data-[hovered]:bg-breeze-sunken data-[pressed]:bg-breeze-sunken',
  },
  // eslint-disable-next-line sort-keys -- v4 recipes require base, variant, size, state, compound ordering.
  size: {
    lg: 'min-block-breeze-lg ps-breeze-5 pe-breeze-5 py-breeze-3',
    md: 'min-block-breeze-md ps-breeze-3 pe-breeze-3 py-breeze-2',
    sm: 'min-block-breeze-sm ps-breeze-3 pe-breeze-3 py-breeze-1',
  },
  state: {
    disabled: 'cursor-not-allowed opacity-50',
    loading: 'cursor-wait',
    loadingLabel: 'opacity-0',
  },
  // eslint-disable-next-line sort-keys -- compound states deliberately finish every v4 recipe.
  compound: {
    loading: {
      danger: 'bg-breeze-on-brand/35',
      primary: 'bg-breeze-on-brand/35',
      quiet: 'bg-breeze-line-strong',
      secondary: 'bg-breeze-line-strong',
    },
  },
} as const;

/** Button-specific visual treatments. */
export type ButtonVariant = keyof typeof variants.variant;

/** Shared control sizes: 34, 38 and 52px, with a 44px coarse-pointer floor. */
export type ControlSize = 'sm' | 'md' | 'lg';

/** An intentional native subset; styling, slots and DOM event callbacks are closed. */
type NativeButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'aria-controls'
  | 'aria-describedby'
  | 'aria-label'
  | 'aria-labelledby'
  | 'form'
  | 'id'
  | 'name'
>;

export interface ButtonProps extends NativeButtonProps {
  /** Visible action label, retained as the accessible name while loading. */
  children: string;
  /** Prevents activation and removes the button from the tab order. */
  disabled?: boolean;
  /** Shows the button's own skeleton and prevents repeat activation. */
  loading?: boolean;
  /** Reports a semantic activation, without a DOM event. */
  onAction?: () => void;
  ref?: Ref<HTMLButtonElement>;
  size?: ControlSize;
  type?: 'button' | 'submit';
  value?: string;
  variant?: ButtonVariant;
}

/**
 * Performs a semantic action with a visible label and an optional loading skeleton.
 *
 * @summary A closed, labelled action in four treatments and three sizes.
 */
export function Button({
  'aria-controls': ariaControls,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  disabled = false,
  form,
  id,
  loading = false,
  name,
  onAction,
  ref,
  size = 'md',
  type = 'button',
  value,
  variant = 'primary',
}: Readonly<ButtonProps>): ReactElement {
  useBreezeContext();

  const className = [
    variants.base.button,
    variants.variant[variant],
    variants.size[size],
    disabled && variants.state.disabled,
    loading && variants.state.loading,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AriaButton
      aria-controls={ariaControls}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
      form={form}
      id={id}
      isDisabled={disabled}
      isPending={loading}
      name={name}
      onPress={() => onAction?.()}
      ref={ref}
      render={(buttonProps) =>
        createElement('button', {
          ...buttonProps,
          // React Aria filters aria-busy; Breeze owns it on the native button.
          'aria-busy': loading || undefined,
          type: buttonProps.type === 'submit' ? 'submit' : 'button',
        })
      }
      type={type}
      value={value}
    >
      <span
        className={[variants.base.label, loading && variants.state.loadingLabel]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </span>
      {loading && (
        <span
          aria-hidden="true"
          className={[
            variants.base.skeleton,
            variants.compound.loading[variant],
          ].join(' ')}
          data-breeze-skeleton=""
        />
      )}
    </AriaButton>
  );
}
