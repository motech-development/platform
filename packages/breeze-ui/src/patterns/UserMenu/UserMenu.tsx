import type { ReactElement, ReactNode } from 'react';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { Menu } from '../../primitives/Menu/Menu';
import { useBreezeContext } from '../../provider/BreezeContext';

/** One application-owned user-menu action or destination. */
export interface UserMenuAction {
  /** Prevents action. Defaults to `false`. */
  disabled?: boolean;
  /** Optional router-neutral or native destination. */
  href?: string;
  /** Optional decorative action icon. */
  icon?: ReactNode;
  /** Stable action key. */
  id: string;
  /** Visible and typeahead-readable label. */
  label: string;
  /** Called with this action key after activation. */
  onAction?: (id: string) => void;
  /** Visual treatment for the action. Defaults to `default`. */
  variant?: 'default' | 'danger';
}

/** Props for account identity, notifications, and application-owned user actions. */
export interface UserMenuProps {
  /** Accessible name for the menu trigger. */
  'aria-label': string;
  /** Ordered application-owned actions. */
  actions: readonly UserMenuAction[];
  /** Indicates unread notification content. Defaults to `false`. */
  hasUnread?: boolean;
  /** Optional notification or account content above the actions. */
  notifications?: ReactNode;
  /** Optional heading displayed above notification content. */
  notificationHeading?: ReactNode;
  /** Optional count or state displayed beside the notification heading. */
  notificationState?: ReactNode;
  /** Optional avatar image URL. */
  src?: string;
  /** Visible represented user name. */
  userName: string;
}

/**
 * Presents user identity, notification content, and keyboard-complete account
 * actions.
 *
 * @summary user identity menu with notifications and account actions
 */
export function UserMenu({
  'aria-label': ariaLabel,
  actions,
  hasUnread = false,
  notificationHeading,
  notificationState,
  notifications,
  src,
  userName,
}: Readonly<UserMenuProps>): ReactElement {
  const { messages } = useBreezeContext();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={
          hasUnread
            ? `${ariaLabel}, ${messages.unreadNotifications}`
            : ariaLabel
        }
        className="relative min-h-14 w-full justify-start gap-3 border-0 bg-transparent p-2 text-start text-inherit data-[hovered]:bg-[var(--breeze-shell-soft)]"
        data-breeze-user-menu-trigger=""
      >
        <span className="relative">
          <Avatar name={userName} size="md" src={src} />
          {hasUnread ? (
            <span
              aria-hidden="true"
              className="absolute -end-0.5 -top-0.5 size-3 rounded-full border-2 border-[var(--breeze-shell)] bg-[var(--breeze-danger)]"
            />
          ) : null}
        </span>
        <strong className="min-w-0 truncate text-base" data-breeze-user-name="">
          {userName}
        </strong>
      </Menu.Trigger>
      <Menu.Popover className="w-80" nonModal placement="top start">
        {notifications === undefined ? null : (
          <div className="border-b border-[var(--breeze-border)]">
            {notificationHeading === undefined ? null : (
              <div className="flex items-center justify-between gap-3 border-b border-[var(--breeze-border)] px-4 py-3">
                <strong className="font-[family-name:var(--breeze-font-display)] text-xl">
                  {notificationHeading}
                </strong>
                {notificationState === undefined ? null : (
                  <span className="bg-[var(--breeze-danger-soft)] px-2 py-1 font-bold text-[var(--breeze-danger)]">
                    {notificationState}
                  </span>
                )}
              </div>
            )}
            <div className="bg-[var(--breeze-primary-soft)] p-4">
              {notifications}
            </div>
          </div>
        )}
        <Menu.List aria-label={ariaLabel}>
          {actions.map((action) => (
            <Menu.Item
              className={
                action.variant === 'danger'
                  ? 'justify-center border-b-0 bg-[var(--breeze-danger)] font-bold text-white data-[focus-visible]:bg-[var(--breeze-danger-hover)] data-[hovered]:bg-[var(--breeze-danger-hover)] data-[selected]:bg-[var(--breeze-danger-hover)]'
                  : undefined
              }
              disabled={action.disabled}
              href={action.href}
              id={action.id}
              key={action.id}
              onAction={() => action.onAction?.(action.id)}
              textValue={action.label}
            >
              <span className="flex items-center gap-2.5">
                {action.icon}
                {action.label}
              </span>
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu.Popover>
    </Menu.Root>
  );
}
