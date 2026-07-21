import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { CloseIcon, MenuIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { Drawer } from '../../primitives/Drawer/Drawer';
import { SkipLink } from '../../primitives/SkipLink/SkipLink';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for the shared responsive application frame. */
export interface ApplicationShellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style' | 'title'> {
  /** Account or user-menu slot in the shell footer and compact header. */
  account: ReactNode;
  /** Canonical product brand slot. */
  brand: ReactNode;
  /** Main application page content. */
  children: ReactNode;
  /** Compact-header product name. Defaults to `brand`. */
  compactBrand?: ReactNode;
  /** Optional active application-context slot. */
  context?: ReactNode;
  /** Accessible title for the compact navigation drawer. */
  navigationLabel: string;
  /** Primary application navigation. */
  navigation: ReactNode;
  /** Ref to the rendered shell root. */
  ref?: Ref<HTMLDivElement>;
  /** Visible-on-focus skip-link label. */
  skipLinkLabel: ReactNode;
  /** Stable id assigned to the main-content target. Defaults to `main-content`. */
  mainId?: string;
}

/**
 * Frames brand, navigation, context, account controls, and main content
 * responsively.
 *
 * @summary responsive application frame with accessible primary navigation
 */
export function ApplicationShell({
  account,
  brand,
  children,
  className,
  compactBrand,
  context,
  mainId = 'main-content',
  navigation,
  navigationLabel,
  ref,
  skipLinkLabel,
  ...props
}: ApplicationShellProps): ReactElement {
  const { messages } = useBreezeContext();

  return createElement(
    'div',
    {
      ...props,
      className: `min-h-dvh bg-[var(--breeze-canvas)] text-[var(--breeze-ink)] ${className ?? ''}`,
      ref: useForwardedRef(ref),
    },
    <>
      <SkipLink targetId={mainId}>{skipLinkLabel}</SkipLink>
      <aside className="fixed inset-y-0 start-0 z-20 hidden w-64 flex-col bg-[var(--breeze-shell)] text-[var(--breeze-ink-inverse)] md:flex">
        <div className="flex min-h-20 items-center border-b border-[var(--breeze-shell-soft)] px-5">
          {brand}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-7 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-3 [&_a]:text-[var(--breeze-ink-inverse-muted)] [&_a]:no-underline [&_a[data-current]]:bg-[var(--breeze-primary-selected)] [&_a[data-current]]:text-white [&_a[data-current][data-hovered]]:bg-[var(--breeze-primary-selected)] [&_a[data-hovered]]:bg-[var(--breeze-shell-soft)] [&_a[data-hovered]]:text-white">
          {navigation}
        </div>
        <footer className="grid gap-2 border-t border-[var(--breeze-shell-soft)] p-3">
          {context}
          {account}
        </footer>
      </aside>
      <header className="grid min-h-16 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3 bg-[var(--breeze-shell)] px-3 text-[var(--breeze-ink-inverse)] md:hidden">
        <Drawer.Root>
          <Drawer.Trigger
            aria-label={navigationLabel}
            appearance="ghost"
            className="size-11 border-0 p-0 text-[var(--breeze-ink-inverse)] data-[hovered]:bg-[var(--breeze-shell-soft)]"
            variant="light"
          >
            <MenuIcon size="1.5rem" />
          </Drawer.Trigger>
          <Drawer.Content
            className="max-h-none w-64 border-0 bg-[var(--breeze-shell)] p-0 text-[var(--breeze-ink-inverse)]"
            chrome="none"
            placement="start"
          >
            <div className="flex min-h-16 items-center justify-between border-b border-[var(--breeze-shell-soft)] px-4">
              <div>{brand}</div>
              <Drawer.Title className="sr-only">{navigationLabel}</Drawer.Title>
              <Drawer.Close
                aria-label={messages.close}
                appearance="ghost"
                className="size-11 border-0 p-0 text-[var(--breeze-ink-inverse)] data-[hovered]:bg-[var(--breeze-shell-soft)]"
                variant="light"
              >
                <CloseIcon size="1.5rem" />
              </Drawer.Close>
            </div>
            <Drawer.Description className="sr-only">
              {navigationLabel}
            </Drawer.Description>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-3 [&_a]:text-[var(--breeze-ink-inverse-muted)] [&_a]:no-underline [&_a[data-current]]:bg-[var(--breeze-primary-selected)] [&_a[data-current]]:text-white [&_a[data-current][data-hovered]]:bg-[var(--breeze-primary-selected)] [&_a[data-hovered]]:bg-[var(--breeze-shell-soft)] [&_a[data-hovered]]:text-white">
              {navigation}
            </div>
            <footer className="grid gap-2 border-t border-[var(--breeze-shell-soft)] p-3">
              {context}
              {account}
            </footer>
          </Drawer.Content>
        </Drawer.Root>
        <div className="min-w-0 justify-self-center font-[family-name:var(--breeze-font-display)] text-xl font-semibold">
          {compactBrand ?? brand}
        </div>
        <div className="size-11 justify-self-end overflow-visible [&_[data-breeze-user-menu-trigger]]:min-h-11 [&_[data-breeze-user-menu-trigger]]:p-1 [&_[data-breeze-user-name]]:hidden">
          {account}
        </div>
      </header>
      <main
        className="min-h-dvh px-4 py-6 sm:px-8 sm:py-12 md:ms-64 lg:px-12"
        id={mainId}
        tabIndex={-1}
      >
        {children}
      </main>
    </>,
  );
}
