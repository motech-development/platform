import type { ButtonHTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { ProgressBarContext } from 'react-aria-components/ProgressBar';
import { useSlottedContext } from 'react-aria-components/slots';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    button:
      'breeze:relative breeze:inline-grid breeze:items-center breeze:justify-center breeze:gap-breeze-2 breeze:border breeze:border-solid breeze:rounded-breeze-ctl breeze:font-breeze-sans breeze:text-breeze-sm breeze:leading-breeze-snug breeze:cursor-pointer breeze:select-none breeze:[text-align:center] breeze:outline-offset-2 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    label: 'breeze:[grid-area:1/1]',
    skeleton:
      'breeze:[grid-area:1/1] breeze:inline-size-full breeze:block-size-breeze-3 breeze:rounded-breeze-xs',
  },
  compound: {
    loading: {
      danger: 'breeze:bg-breeze-on-brand/35',
      primary: 'breeze:bg-breeze-on-brand/35',
      quiet: 'breeze:bg-breeze-line-strong',
      secondary: 'breeze:bg-breeze-line-strong',
    },
  },
  size: {
    lg: 'breeze:min-block-breeze-lg breeze:ps-breeze-5 breeze:pe-breeze-5 breeze:py-breeze-3',
    md: 'breeze:min-block-breeze-md breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2',
    sm: 'breeze:min-block-breeze-sm breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-1',
  },
  state: {
    disabled: 'breeze:cursor-not-allowed breeze:opacity-50',
    loading: 'breeze:cursor-wait',
    loadingLabel: 'breeze:opacity-0',
    loadingStatus: 'breeze:sr-only',
  },
  variant: {
    danger:
      'breeze:border-transparent breeze:bg-breeze-danger-fill breeze:text-breeze-on-brand breeze:data-[hovered]:bg-breeze-danger-hover breeze:data-[pressed]:bg-breeze-danger-hover',
    primary:
      'breeze:border-transparent breeze:bg-breeze-brand breeze:text-breeze-on-brand breeze:data-[hovered]:bg-breeze-brand-hover breeze:data-[pressed]:bg-breeze-brand-hover',
    quiet:
      'breeze:border-transparent breeze:bg-transparent breeze:text-breeze-brand-text breeze:data-[hovered]:bg-breeze-brand-soft breeze:data-[pressed]:bg-breeze-brand-soft',
    secondary:
      'breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:text-breeze-ink breeze:data-[hovered]:bg-breeze-sunken breeze:data-[pressed]:bg-breeze-sunken',
  },
} as const;

/** Connect the pending announcement to a phrasing element inside the button. */
function LoadingStatus(): ReactElement {
  const progress = useSlottedContext(ProgressBarContext);
  const { messageLocale, messages } = useBreezeContext();

  return (
    <progress
      aria-label={messages.loading}
      className={variants.state.loadingStatus}
      id={progress?.id}
      lang={messageLocale}
    />
  );
}

/** Button-specific visual treatments. */
export type ButtonVariant = keyof typeof variants.variant;

/** Shared control sizes: 34, 38 and 52px, with a 44px coarse-pointer floor. */
export type ControlSize = 'sm' | 'md' | 'lg';

/** An intentional native subset; styling, slots and DOM event callbacks are closed. */
type NativeButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'aria-controls'
  | 'aria-describedby'
  | 'aria-expanded'
  | 'aria-haspopup'
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
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHasPopup,
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
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-label={ariaLabel ?? children}
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
          // Keep the form's default submitter while pending so Enter cannot
          // bypass it through the browser's implicit-submission fallback.
          onClick: loading
            ? (event) => event.preventDefault()
            : buttonProps.onClick,
          type: type === 'submit' ? 'submit' : 'button',
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
        <>
          <LoadingStatus />
          <span
            aria-hidden="true"
            className={[
              variants.base.skeleton,
              variants.compound.loading[variant],
            ].join(' ')}
            data-breeze-skeleton=""
          />
        </>
      )}
    </AriaButton>
  );
}
