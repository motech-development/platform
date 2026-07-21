import type {
  ComponentProps,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Link as AriaLink } from 'react-aria-components/Link';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import action from '../../internal/styling/actions';
import type {
  ControlSize,
  VisualAppearance,
  VisualVariant,
} from '../../internal/styling/visual';
import type { NativeLinkProps } from '../../internal/types/native';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for navigation presented with button emphasis. */
export interface LinkButtonProps extends NativeLinkProps {
  /** Visual emphasis treatment. Defaults to `solid`. */
  appearance?: VisualAppearance;
  /** Link content. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Prevents navigation. Defaults to `false`. */
  disabled?: boolean;
  /** Prompts download instead of navigation when provided. */
  download?: boolean | string;
  /** Native destination URL. */
  href: string;
  /** Ref to the rendered anchor. */
  ref?: Ref<HTMLAnchorElement>;
  /** Canonical control size. Defaults to `md`. */
  size?: ControlSize;
  /** Semantic colour. Defaults to `primary`. */
  variant?: VisualVariant;
}

function isLocalNavigation(
  href: string,
  target: string | undefined,
  download: LinkButtonProps['download'],
): boolean {
  return (
    href.startsWith('/') &&
    !href.startsWith('//') &&
    download !== true &&
    typeof download !== 'string' &&
    (target === undefined || target === '_self')
  );
}

/**
 * Navigates like a link while using the visual hierarchy of an action button.
 *
 * @summary router-neutral navigation with canonical button emphasis
 */
export function LinkButton({
  appearance,
  children,
  className,
  disabled = false,
  download,
  href,
  ref,
  size,
  target,
  variant,
  ...props
}: Readonly<LinkButtonProps>): ReactElement {
  const { router } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const useRouter =
    router !== undefined && isLocalNavigation(href, target, download);
  const routerClick = {
    onClick: (event: MouseEvent<Element>) => {
      if (
        useRouter &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        router.navigate(href);
      }
    },
  };

  return createElement(
    AriaLink,
    {
      ...props,
      ...routerClick,
      className: action({
        appearance,
        class: className,
        size,
        variant,
      }),
      download,
      href,
      isDisabled: disabled,
      ref: forwardedRef,
      render: (renderProps) => {
        if (disabled || !('href' in renderProps)) {
          return createElement('span', {
            ...renderProps,
            href: undefined,
          } as unknown as ComponentProps<'span'>);
        }

        return createElement('a', {
          ...props,
          ...renderProps,
        });
      },
      target,
    } as ComponentProps<typeof AriaLink>,
    children,
  );
}
