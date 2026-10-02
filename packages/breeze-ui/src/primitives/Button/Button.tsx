import type { ButtonHTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import ButtonLoadingStatus from '../../buttons/button.presentation';
import {
  type ButtonVariant,
  buttonVariants,
} from '../../buttons/button.styles';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    button:
      'breeze:relative breeze:inline-grid breeze:items-center breeze:justify-center breeze:gap-breeze-2 breeze:border breeze:border-solid breeze:rounded-breeze-ctl breeze:font-breeze-sans breeze:font-semibold breeze:leading-breeze-snug breeze:cursor-pointer breeze:select-none breeze:[text-align:center] breeze:outline-offset-2 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    label: 'breeze:[grid-area:1/1]',
    skeleton:
      'breeze:[grid-area:1/1] breeze:inline-full breeze:block-breeze-3 breeze:rounded-breeze-xs',
  },
  // Treatments, states and loading fills are shared with IconButton.
  compound: {
    // The design pads the filled primary wider than the other md treatments.
    md: {
      danger: 'breeze:ps-breeze-3 breeze:pe-breeze-3',
      primary: 'breeze:ps-[14px] breeze:pe-[14px]',
      quiet: 'breeze:ps-breeze-3 breeze:pe-breeze-3',
      secondary: 'breeze:ps-breeze-3 breeze:pe-breeze-3',
    },
  },
  size: {
    lg: 'breeze:min-block-breeze-lg breeze:ps-breeze-5 breeze:pe-breeze-5 breeze:py-breeze-3 breeze:text-breeze-sm',
    md: 'breeze:min-block-breeze-9 breeze:text-breeze-sm',
    sm: 'breeze:min-block-breeze-8 breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:text-breeze-xs',
  },
  state: {},
  variant: {},
} as const;

export type { ButtonVariant } from '../../buttons/button.styles';

/** Shared control size scale, with a 44px coarse-pointer floor. */
export type ControlSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Identifies the element whose contents or presence this button controls. */
  'aria-controls'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-controls'];
  /** Identifies elements that provide additional information about the button. */
  'aria-describedby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-describedby'];
  /** Indicates whether the controlled element is currently expanded. */
  'aria-expanded'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-expanded'];
  /** Indicates the type of interactive popup opened by the button. */
  'aria-haspopup'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-haspopup'];
  /** Provides an accessible name when it should differ from the visible label. */
  'aria-label'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-label'];
  /** Identifies elements whose text provides the button's accessible name. */
  'aria-labelledby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-labelledby'];
  /** Visible action label, retained as the accessible name while loading. */
  children: string;
  /** Prevents activation and removes the button from the tab order. */
  disabled?: boolean;
  /** Associates a submit button with a form by its HTML `id`. */
  form?: ButtonHTMLAttributes<HTMLButtonElement>['form'];
  /** Sets the rendered button's HTML `id`. */
  id?: ButtonHTMLAttributes<HTMLButtonElement>['id'];
  /** Shows the button's own skeleton and prevents repeat activation. */
  loading?: boolean;
  /** Sets the name submitted with the button's form value. */
  name?: ButtonHTMLAttributes<HTMLButtonElement>['name'];
  /** Reports a semantic activation, without a DOM event. */
  onAction?: () => void;
  /** Provides access to the rendered button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Selects the button's dimensions. Defaults to `md`. */
  size?: ControlSize;
  /** Selects ordinary or form-submission behaviour. Defaults to `button`. */
  type?: 'button' | 'submit';
  /** Sets the value submitted when this button submits a form. */
  value?: string;
  /** Selects the button's visual and semantic treatment. Defaults to `primary`. */
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
}: Readonly<ButtonProps>) {
  useBreezeContext();

  const className = [
    variants.base.button,
    buttonVariants.variant[variant],
    variants.size[size],
    size === 'md' && variants.compound.md[variant],
    disabled && buttonVariants.state.disabled,
    loading && buttonVariants.state.loading,
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
        className={[
          variants.base.label,
          loading && buttonVariants.state.loadingContent,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </span>
      {loading && (
        <>
          <ButtonLoadingStatus />
          <span
            aria-hidden="true"
            className={[
              variants.base.skeleton,
              buttonVariants.compound.loading[variant],
            ].join(' ')}
            data-breeze-skeleton=""
          />
        </>
      )}
    </AriaButton>
  );
}
