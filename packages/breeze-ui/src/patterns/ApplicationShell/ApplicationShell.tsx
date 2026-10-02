import type { MouseEvent, ReactNode } from 'react';
import { useId } from 'react';
import { useViewTransitionParticipant } from '../../motion/view-transitions';
import type { IconName } from '../../primitives/Icon/Icon';
import { Icon } from '../../primitives/Icon/Icon';
import { IconButton } from '../../primitives/IconButton/IconButton';
import routeAnchorClick from '../../primitives/Link/link-routing';
import { SkipLink } from '../../primitives/SkipLink/SkipLink';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    action:
      'breeze:flex breeze:min-inline-0 breeze:items-center breeze:justify-center',
    bottomNav:
      'breeze:fixed breeze:[inset-block-end:0] breeze:[inset-inline:0] breeze:z-30 breeze:border-bs-[length:var(--breeze-spacing-breeze-px)] breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:pbs-breeze-2 breeze:pbe-[calc(var(--breeze-spacing-breeze-2)_+_env(safe-area-inset-bottom))] breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:breeze-lg:hidden',
    bottomNavInner:
      'breeze:mx-auto breeze:inline-full breeze:max-inline-breeze-page breeze:grid breeze:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] breeze:items-center',
    bottomNavLink:
      'breeze:relative breeze:flex breeze:min-block-breeze-lg breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:items-center breeze:justify-center breeze:gap-breeze-1 breeze:rounded-breeze-sm breeze:px-breeze-1 breeze:font-breeze-sans breeze:text-breeze-2xs breeze:font-medium breeze:leading-breeze-snug breeze:text-breeze-ink-2 breeze:no-underline breeze:transition-colors breeze:hover:text-breeze-ink breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand',
    bottomNavLinkCurrent: 'breeze:text-breeze-brand-text',
    bottomNavMark: 'breeze:[inset-block-start:0]',
    bottomNavSide: 'breeze:flex breeze:min-inline-0',
    brand:
      'breeze:flex breeze:min-inline-0 breeze:shrink-0 breeze:items-center',
    context:
      'breeze:min-inline-0 breeze:truncate breeze:border-s breeze:border-solid breeze:border-breeze-line breeze:ps-breeze-4',
    // Clears the fixed bottom bar: its 1px top border, block padding either
    // side and the 52px row of links and the centre action.
    main: 'breeze:mx-auto breeze:inline-full breeze:min-inline-0 breeze:max-inline-breeze-page breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:pbe-[calc(var(--breeze-spacing-breeze-px)_+_var(--breeze-spacing-breeze-2)_+_var(--breeze-spacing-breeze-lg)_+_var(--breeze-spacing-breeze-2)_+_env(safe-area-inset-bottom))] breeze:breeze-lg:ps-breeze-7 breeze:breeze-lg:pe-breeze-7 breeze:breeze-lg:pbe-breeze-8',
    navLabel: 'breeze:min-inline-0 breeze:truncate',
    navMark:
      'breeze:absolute breeze:[inset-inline:0] breeze:[block-size:2px] breeze:bg-breeze-brand',
    topNav:
      'breeze:hidden breeze:border-be breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:breeze-lg:block',
    topNavInner:
      'breeze:mx-auto breeze:flex breeze:min-block-breeze-lg breeze:inline-full breeze:max-inline-breeze-page breeze:items-stretch breeze:gap-breeze-6 breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:breeze-lg:ps-breeze-7 breeze:breeze-lg:pe-breeze-7',
    topNavLink:
      'breeze:relative breeze:inline-flex breeze:min-block-breeze-lg breeze:min-inline-0 breeze:shrink-0 breeze:items-center breeze:gap-breeze-2 breeze:rounded-breeze-sm breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-medium breeze:text-breeze-ink-2 breeze:no-underline breeze:transition-colors breeze:hover:text-breeze-ink breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand',
    topNavLinkCurrent: 'breeze:text-breeze-brand-text',
    topNavMark: 'breeze:[inset-block-end:0]',
    topbar:
      'breeze:sticky breeze:[inset-block-start:0] breeze:z-30 breeze:border-be breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface',
    topbarInner:
      'breeze:mx-auto breeze:flex breeze:min-block-breeze-lg breeze:inline-full breeze:max-inline-breeze-page breeze:min-inline-0 breeze:items-center breeze:gap-breeze-4 breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:breeze-lg:ps-breeze-7 breeze:breeze-lg:pe-breeze-7',
    topbarSlots:
      'breeze:ms-auto breeze:flex breeze:min-inline-0 breeze:shrink-0 breeze:items-center breeze:gap-breeze-3',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

/** A route rendered by the shell's section navigation. */
export interface ApplicationShellNavigationItem {
  /** Destination used by native anchors and the configured router. */
  href: string;
  /** Optional icon from Breeze's curated icon set. */
  icon?: IconName;
  /** Stable identifier used by `currentItem`. */
  id: string;
  /** Visible name for the destination. */
  label: string;
}

/** The fixed bottom navigation action, independent of the current page. */
export interface ApplicationShellAction {
  /** Breeze icon shown in the circular action button. */
  icon: IconName;
  /** Accessible name for the icon-only action. */
  label: string;
  /** Performs the application-owned action. */
  onAction: () => void;
}

/** Props for the shared, domain-neutral application frame. */
export interface ApplicationShellProps<T> {
  /** Application-owned account control. */
  account: ReactNode;
  /** Required mobile action that remains in a fixed centre slot. */
  action: ApplicationShellAction;
  /** Application-owned brand content. */
  brand: ReactNode;
  /** Application-owned route content rendered in the shell's main landmark. */
  children: ReactNode;
  /** Application-owned company, tenant, or other context content. */
  context: ReactNode;
  /** Id returned by `getItem` for the current destination. */
  currentItem: string;
  /** Returns the supported navigation fields for an application value. */
  getItem: (item: T) => ApplicationShellNavigationItem;
  /** Application-owned navigation values. */
  items: T[];
  /** Application-owned notification control. */
  notifications: ReactNode;
}

interface NavigationLinkProps {
  item: ApplicationShellNavigationItem;
  placement: 'bottom' | 'top';
  router: ReturnType<typeof useBreezeContext>['router'];
  current: boolean;
}

function NavigationLink({
  current,
  item,
  placement,
  router,
}: Readonly<NavigationLinkProps>) {
  const navMarkRef = useViewTransitionParticipant({ role: 'navmark' });
  const className = [
    placement === 'top'
      ? variants.base.topNavLink
      : variants.base.bottomNavLink,
    current &&
      (placement === 'top'
        ? variants.base.topNavLinkCurrent
        : variants.base.bottomNavLinkCurrent),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      aria-current={current ? 'page' : undefined}
      className={className}
      href={item.href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) =>
        routeAnchorClick(event, router, ['nav'])
      }
    >
      {item.icon ? <Icon name={item.icon} size="sm" /> : null}
      <span className={variants.base.navLabel}>{item.label}</span>
      {current ? (
        <span
          aria-hidden="true"
          className={[
            variants.base.navMark,
            placement === 'top'
              ? variants.base.topNavMark
              : variants.base.bottomNavMark,
          ].join(' ')}
          ref={navMarkRef}
        />
      ) : null}
    </a>
  );
}

/**
 * Provides shared app chrome, navigation, a fixed mobile action and main content.
 *
 * @summary A responsive application shell with semantic application slots.
 */
export function ApplicationShell<T>({
  account,
  action,
  brand,
  children,
  context,
  currentItem,
  getItem,
  items,
  notifications,
}: Readonly<ApplicationShellProps<T>>) {
  const { getMessageLocale, messages, router } = useBreezeContext();
  const mainId = `breeze-main-${useId()}`;
  const navigationItems = items.map(getItem);
  const midpoint = Math.ceil(navigationItems.length / 2);
  const leadingItems = navigationItems.slice(0, midpoint);
  const trailingItems = navigationItems.slice(midpoint);
  const topbarRef = useViewTransitionParticipant({ role: 'topbar' });
  const topnavRef = useViewTransitionParticipant({ role: 'topnav' });
  const botnavRef = useViewTransitionParticipant({ role: 'botnav' });

  return (
    <div className="breeze:[min-block-size:100dvh] breeze:bg-breeze-canvas breeze:text-breeze-ink">
      <SkipLink targetId={mainId} />

      <header className={variants.base.topbar} ref={topbarRef}>
        <div className={variants.base.topbarInner}>
          <div className={variants.base.brand}>{brand}</div>
          <div className={variants.base.context}>{context}</div>
          <div className={variants.base.topbarSlots}>
            {notifications}
            {account}
          </div>
        </div>
      </header>

      <nav
        aria-label={messages.primaryNavigation}
        className={variants.base.topNav}
        lang={getMessageLocale('primaryNavigation')}
        ref={topnavRef}
      >
        <div className={variants.base.topNavInner}>
          {navigationItems.map((item) => (
            <NavigationLink
              current={item.id === currentItem}
              item={item}
              key={item.id}
              placement="top"
              router={router}
            />
          ))}
        </div>
      </nav>

      <main className={variants.base.main} id={mainId} tabIndex={-1}>
        {children}
      </main>

      <nav
        aria-label={messages.primaryNavigation}
        className={variants.base.bottomNav}
        lang={getMessageLocale('primaryNavigation')}
        ref={botnavRef}
      >
        <div className={variants.base.bottomNavInner}>
          <div className={variants.base.bottomNavSide}>
            {leadingItems.map((item) => (
              <NavigationLink
                current={item.id === currentItem}
                item={item}
                key={item.id}
                placement="bottom"
                router={router}
              />
            ))}
          </div>
          <span className={variants.base.action}>
            <IconButton
              label={action.label}
              name={action.icon}
              onAction={action.onAction}
              shape="circle"
              size="lg"
              variant="primary"
            />
          </span>
          <div className={variants.base.bottomNavSide}>
            {trailingItems.map((item) => (
              <NavigationLink
                current={item.id === currentItem}
                item={item}
                key={item.id}
                placement="bottom"
                router={router}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
