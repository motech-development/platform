import type { ButtonHTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import ButtonLoadingStatus from '../../buttons/button.presentation';
import {
  type ButtonVariant,
  buttonVariants,
} from '../../buttons/button.styles';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { ControlSize } from '../Button/Button';
import { Icon, type IconName, type IconSize } from '../Icon/Icon';

const variants = {
  base: {
    button:
      'breeze:relative breeze:inline-grid breeze:shrink-0 breeze:place-items-center breeze:border breeze:border-solid breeze:p-0 breeze:cursor-pointer breeze:select-none breeze:outline-offset-2 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    icon: 'breeze:[grid-area:1/1]',
    skeleton:
      'breeze:[grid-area:1/1] breeze:block-full breeze:inline-full breeze:rounded-breeze-xs',
  },
  // Treatments, states and loading fills are shared with Button.
  compound: {},
  size: {
    lg: 'breeze:min-block-breeze-lg breeze:min-inline-breeze-lg',
    md: 'breeze:min-block-breeze-9 breeze:min-inline-breeze-9',
    sm: 'breeze:min-block-breeze-8 breeze:min-inline-breeze-8',
  },
  state: {},
  variant: {
    shape: {
      circle: 'breeze:rounded-breeze-full',
      square: 'breeze:rounded-breeze-ctl',
    },
  },
} as const;

const iconSizes = {
  lg: '3xl',
  md: 'lg',
  sm: 'sm',
} as const satisfies Record<ControlSize, IconSize>;

/** Icon button treatments: the same type as `ButtonVariant`. */
export type IconButtonVariant = ButtonVariant;

/** The outline of an icon button. */
export type IconButtonShape = keyof typeof variants.variant.shape;

export interface IconButtonProps {
  /** Identifies the element whose contents or presence this button controls. */
  'aria-controls'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-controls'];
  /** Identifies elements that provide additional information about the button. */
  'aria-describedby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-describedby'];
  /** Indicates whether the controlled element is currently expanded. */
  'aria-expanded'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-expanded'];
  /** Indicates the type of interactive popup opened by the button. */
  'aria-haspopup'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-haspopup'];
  /** Prevents activation and removes the button from the tab order. */
  disabled?: boolean;
  /** Sets the rendered button's HTML `id`. */
  id?: ButtonHTMLAttributes<HTMLButtonElement>['id'];
  /** Accessible name for the action. Required, because the button has no visible text. */
  label: string;
  /** Shows the button's own skeleton in place of the icon and prevents repeat activation. */
  loading?: boolean;
  /** Selects artwork from the curated Breeze icon set. */
  name: IconName;
  /** Reports a semantic activation, without a DOM event. */
  onAction?: () => void;
  /** Provides access to the rendered button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Selects a rounded square or a circle. Defaults to `square`. */
  shape?: IconButtonShape;
  /** Selects the button's dimensions: 32, 36 or 52px square. Defaults to `md`. */
  size?: ControlSize;
  /** Selects the button's visual and semantic treatment. Defaults to `secondary`. */
  variant?: IconButtonVariant;
}

/**
 * Performs a semantic action from a curated icon with a required accessible name.
 *
 * @summary A square or circular icon-only action in Button's treatments and sizes.
 */
export function IconButton({
  'aria-controls': ariaControls,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHasPopup,
  disabled = false,
  id,
  label,
  loading = false,
  name,
  onAction,
  ref,
  shape = 'square',
  size = 'md',
  variant = 'secondary',
}: Readonly<IconButtonProps>) {
  useBreezeContext();

  const accessibleLabel = label.trim();

  if (!accessibleLabel) {
    throw new Error('IconButton label must be non-empty.');
  }

  const className = [
    variants.base.button,
    buttonVariants.variant[variant],
    variants.variant.shape[shape],
    variants.size[size],
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
      aria-label={accessibleLabel}
      className={className}
      id={id}
      isDisabled={disabled}
      isPending={loading}
      onPress={() => onAction?.()}
      ref={ref}
      render={(buttonProps) =>
        createElement('button', {
          ...buttonProps,
          // React Aria filters aria-busy; Breeze owns it on the native button.
          'aria-busy': loading || undefined,
          type: 'button',
        })
      }
    >
      <span
        className={[
          variants.base.icon,
          loading && buttonVariants.state.loadingContent,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Icon name={name} size={iconSizes[size]} />
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
