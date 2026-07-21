import type { ComponentProps, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import renderNativeButton, {
  type NativeButtonType,
} from '../../internal/react-aria/renderNativeButton';
import action from '../../internal/styling/actions';
import type {
  ControlSize,
  VisualAppearance,
  VisualVariant,
} from '../../internal/styling/visual';
import type { NativeButtonProps } from '../../internal/types/native';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Visual emphasis treatments supported by buttons with visible text. */
export type ButtonAppearance = VisualAppearance | 'text';

/** Props for a semantic action button. */
export interface ButtonProps extends NativeButtonProps {
  /** Visual emphasis treatment. Defaults to `solid`. */
  appearance?: ButtonAppearance;
  /** Button content. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Prevents interaction. Defaults to `false`. */
  disabled?: boolean;
  /** Shows and announces an in-progress state while preventing activation. Defaults to `false`. */
  loading?: boolean;
  /** Called once when the user activates the button. */
  onAction?: () => void;
  /** Ref to the rendered button. */
  ref?: Ref<HTMLButtonElement>;
  /** Canonical control size. Defaults to `md`. */
  size?: ControlSize;
  /** Constrained native form behavior: `button` or `submit`. Defaults to `button`. */
  type?: NativeButtonType;
  /** Semantic colour. Defaults to `primary`. */
  variant?: VisualVariant;
}

/**
 * Performs an application action through pointer or keyboard activation.
 *
 * @summary semantic action with accessible disabled and loading states
 */
export function Button({
  appearance,
  children,
  className,
  disabled = false,
  loading = false,
  onAction,
  ref,
  size,
  type = 'button',
  variant,
  ...props
}: ButtonProps): ReactElement {
  useBreezeContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaButton,
    {
      ...props,
      'aria-busy': loading || undefined,
      className: action({
        appearance,
        class: className,
        size,
        variant,
      }),
      isDisabled: disabled,
      isPending: loading,
      onPress: onAction,
      ref: forwardedRef,
      render: (renderProps) => {
        const nativeProps = {
          ...props,
          'aria-busy': loading || undefined,
          ...renderProps,
        };

        return renderNativeButton(nativeProps, type);
      },
      type,
    } as ComponentProps<typeof AriaButton>,
    loading ? (
      <>
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
        <span>{children}</span>
      </>
    ) : (
      children
    ),
  );
}
