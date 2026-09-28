import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { createElement, useState } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components/ToggleButton';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    label: 'breeze:[grid-area:1/1]',
    skeleton:
      'breeze:[grid-area:1/1] breeze:inline-size-full breeze:block-size-breeze-3',
    status: 'breeze:sr-only',
  },
  state: {
    loading: 'breeze:cursor-wait',
    loadingLabel: 'breeze:opacity-0',
  },
} as const;

interface SelectionControlProps {
  'aria-describedby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-describedby'];
  'aria-label'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-label'];
  'aria-labelledby'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-labelledby'];
  children: ReactNode;
  className: string;
  defaultPressed?: boolean;
  disabled: boolean;
  id?: ButtonHTMLAttributes<HTMLButtonElement>['id'];
  /** Lets a containing group provide one loading announcement for all options. */
  announceLoading?: boolean;
  loading: boolean;
  onChange?: (pressed: boolean) => void;
  pressed?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** Renders the shared selected button and its loading presentation. */
export default function SelectionControl({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  defaultPressed,
  disabled,
  id,
  announceLoading = true,
  loading,
  onChange,
  pressed,
  ref,
}: Readonly<SelectionControlProps>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const [uncontrolledPressed, setUncontrolledPressed] = useState(
    defaultPressed ?? false,
  );
  const isControlled = pressed !== undefined;
  const isPressed = isControlled ? pressed : uncontrolledPressed;

  return (
    <>
      <AriaToggleButton
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={[className, loading && variants.state.loading]
          .filter(Boolean)
          .join(' ')}
        id={id}
        isDisabled={disabled}
        isSelected={isPressed}
        onChange={(nextPressed) => {
          if (loading) return;

          if (!isControlled) {
            setUncontrolledPressed(nextPressed);
          }

          onChange?.(nextPressed);
        }}
        ref={ref}
        render={(buttonProps) =>
          createElement('button', {
            ...buttonProps,
            'aria-busy': loading || undefined,
            'aria-disabled': disabled || loading || undefined,
            type: 'button',
          })
        }
      >
        <span
          className={[
            variants.base.label,
            loading && variants.state.loadingLabel,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </span>
        {loading && (
          <span
            aria-hidden="true"
            className={variants.base.skeleton}
            data-breeze-skeleton=""
          >
            <Skeleton inlineSize="100%" />
          </span>
        )}
      </AriaToggleButton>
      {loading && announceLoading && (
        <span className={variants.base.status}>
          <Skeleton label={messages.loading} />
        </span>
      )}
      {announceLoading && (
        <output
          aria-live="polite"
          className={variants.base.status}
          lang={getMessageLocale('loading')}
        >
          {loading ? messages.loading : ''}
        </output>
      )}
    </>
  );
}
