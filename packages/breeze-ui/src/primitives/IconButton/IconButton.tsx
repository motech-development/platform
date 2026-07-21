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

/** Props for an icon-only action with a required accessible name. */
export interface IconButtonProps extends NativeButtonProps {
  /** Accessible action name. */
  'aria-label': string;
  /** Visual emphasis treatment. Defaults to `ghost`. */
  appearance?: VisualAppearance;
  /** Decorative icon. */
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
  /** Canonical square control size. Defaults to `md`. */
  size?: ControlSize;
  /** Constrained native form behavior: `button` or `submit`. Defaults to `button`. */
  type?: NativeButtonType;
  /** Semantic colour. Defaults to `secondary`. */
  variant?: VisualVariant;
}

const squareSizes = {
  lg: 'size-12 p-0',
  md: 'size-11 p-0',
  sm: 'size-8 p-0',
} as const;

/**
 * Performs an application action through a compact icon-only control whose
 * required accessible label supplies its semantic name.
 *
 * @summary icon-only action with a mandatory accessible label
 */
export function IconButton({
  appearance = 'ghost',
  children,
  className,
  disabled = false,
  loading = false,
  onAction,
  ref,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: IconButtonProps): ReactElement {
  useBreezeContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement(
    AriaButton,
    {
      ...props,
      'aria-busy': loading || undefined,
      className: action({
        appearance,
        class: [squareSizes[size], className],
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
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
    ) : (
      <span aria-hidden="true">{children}</span>
    ),
  );
}
