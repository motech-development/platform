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
    // The canvas ring and the 48px brand disc inside it make the 56px raised action.
    action:
      'breeze:absolute breeze:start-1/2 breeze:-ms-breeze-7 breeze:-inset-bs-breeze-6 breeze:grid breeze:block-[56px] breeze:inline-[56px] breeze:rounded-breeze-full breeze:border-4 breeze:border-solid breeze:border-breeze-canvas breeze:[box-shadow:0_2px_6px_-2px_rgb(22_22_22/30%)] breeze:[&>button]:block-full breeze:[&>button]:inline-full breeze:[&>button]:min-block-0 breeze:[&>button]:min-inline-0',
    actionSlot: 'breeze:shrink-0 breeze:basis-[68px]',
    bottomNav:
      'breeze:fixed breeze:[inset-block-end:0] breeze:[inset-inline:0] breeze:z-30 breeze:flex breeze:block-[calc(72px_+_env(safe-area-inset-bottom))] breeze:items-center breeze:border-bs-[length:var(--breeze-spacing-breeze-px)] breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:pbs-[6px] breeze:pbe-[env(safe-area-inset-bottom)] breeze:px-[2px] breeze:breeze-md:hidden',
    bottomNavLink:
      'breeze:flex breeze:min-block-breeze-lg breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:items-center breeze:justify-center breeze:gap-[2px] breeze:rounded-breeze-sm breeze:font-breeze-sans breeze:text-breeze-2xs breeze:font-medium breeze:text-breeze-ink-3 breeze:no-underline breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:aria-[current=page]:font-semibold breeze:aria-[current=page]:text-breeze-brand-text breeze:[&>svg]:block-[21px] breeze:[&>svg]:inline-[21px]',
    bottomNavSide: 'breeze:flex breeze:min-inline-0 breeze:flex-1',
    brand:
      'breeze:flex breeze:min-inline-0 breeze:shrink-0 breeze:items-center',
    context: 'breeze:min-inline-0 breeze:truncate',
    divider:
      'breeze:hidden breeze:block-breeze-5 breeze:inline-breeze-px breeze:shrink-0 breeze:bg-breeze-line breeze:breeze-md:block',
    // Clears the 72px bottom bar and the raised action above it.
    main: 'breeze:mx-auto breeze:flex breeze:inline-full breeze:min-inline-0 breeze:max-inline-breeze-page breeze:flex-col breeze:gap-breeze-4 breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:pbs-breeze-4 breeze:pbe-[calc(168px_+_env(safe-area-inset-bottom))] breeze:breeze-md:ps-breeze-7 breeze:breeze-md:pe-breeze-7 breeze:breeze-md:pbs-breeze-5 breeze:breeze-md:pbe-[84px]',
    navLabel: 'breeze:min-inline-0 breeze:truncate',
    navMark:
      'breeze:absolute breeze:[inset-inline:0] breeze:[inset-block-end:0] breeze:[block-size:2px] breeze:bg-breeze-brand',
    topNav:
      'breeze:hidden breeze:block-breeze-tap breeze:items-center breeze:border-be breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:ps-breeze-5 breeze:pe-breeze-5 breeze:breeze-md:flex',
    topNavLink:
      'breeze:relative breeze:flex breeze:block-breeze-tap breeze:min-inline-0 breeze:shrink-0 breeze:items-center breeze:gap-breeze-2 breeze:mx-breeze-2 breeze:rounded-breeze-sm breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-medium breeze:text-breeze-ink-3 breeze:no-underline breeze:transition-colors breeze:hover:text-breeze-ink breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:aria-[current=page]:font-semibold breeze:aria-[current=page]:text-breeze-ink',
    topbar:
      'breeze:sticky breeze:[inset-block-start:0] breeze:z-30 breeze:flex breeze:block-[56px] breeze:items-center breeze:gap-[10px] breeze:border-be breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:breeze-md:gap-breeze-4 breeze:breeze-md:ps-breeze-5 breeze:breeze-md:pe-breeze-5',
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

  return (
    <a
      aria-current={current ? 'page' : undefined}
      className={
        placement === 'top'
          ? variants.base.topNavLink
          : variants.base.bottomNavLink
      }
      href={item.href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) =>
        routeAnchorClick(event, router, ['nav'])
      }
    >
      {item.icon ? <Icon name={item.icon} size="sm" /> : null}
      <span className={variants.base.navLabel}>{item.label}</span>
      {current && placement === 'top' ? (
        <span
          aria-hidden="true"
          className={variants.base.navMark}
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
        <div className={variants.base.brand}>{brand}</div>
        <span aria-hidden="true" className={variants.base.divider} />
        <div className={variants.base.context}>{context}</div>
        <div className={variants.base.topbarSlots}>
          {notifications}
          {account}
        </div>
      </header>

      <nav
        aria-label={messages.primaryNavigation}
        className={variants.base.topNav}
        lang={getMessageLocale('primaryNavigation')}
        ref={topnavRef}
      >
        {navigationItems.map((item) => (
          <NavigationLink
            current={item.id === currentItem}
            item={item}
            key={item.id}
            placement="top"
            router={router}
          />
        ))}
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
        <span className={variants.base.actionSlot}>
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
      </nav>
    </div>
  );
}
