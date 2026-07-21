import type {
  ComponentProps,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Link as AriaLink } from 'react-aria-components/Link';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { NativeLinkProps } from '../../internal/types/native';
import { useBreezeContext } from '../../provider/BreezeContext';

const link = tv({
  base: 'font-medium underline decoration-1 underline-offset-2 transition-colors duration-[var(--breeze-duration-fast)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55',
  defaultVariants: {
    variant: 'primary',
  },
  variants: {
    variant: {
      danger:
        'text-[var(--breeze-danger)] data-[hovered]:text-[var(--breeze-danger-hover)]',
      inverse:
        'text-[var(--breeze-ink-inverse)] data-[hovered]:text-[var(--breeze-ink-inverse-muted)]',
      muted:
        'text-[var(--breeze-ink-soft)] data-[hovered]:text-[var(--breeze-ink)]',
      primary:
        'text-[var(--breeze-primary)] data-[hovered]:text-[var(--breeze-primary-hover)]',
    },
  },
});

/** Props for a router-neutral navigation link. */
export interface LinkProps extends NativeLinkProps {
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
  /** Called after semantic link activation. */
  onAction?: () => void;
  /** Ref to the rendered anchor. */
  ref?: Ref<HTMLAnchorElement>;
  /** Semantic text colour. Defaults to `primary`. */
  variant?: 'primary' | 'muted' | 'danger' | 'inverse';
}

function shouldUseRouter(
  href: string,
  target: string | undefined,
  download: LinkProps['download'],
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
 * Navigates with the provider router for local URLs and native browser behaviour otherwise.
 *
 * @summary router-neutral inline navigation with native browser behaviour
 */
export function Link({
  children,
  className,
  disabled = false,
  download,
  href,
  onAction,
  ref,
  target,
  variant,
  ...props
}: Readonly<LinkProps>): ReactElement {
  const { router } = useBreezeContext();
  const forwardedRef = useForwardedRef(ref);
  const useRouter =
    router !== undefined && shouldUseRouter(href, target, download);
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
      className: link({
        class: className,
        variant,
      }),
      download,
      href,
      isDisabled: disabled,
      onPress: onAction,
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
