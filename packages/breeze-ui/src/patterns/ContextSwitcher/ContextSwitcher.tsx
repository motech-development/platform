import type { ReactElement, ReactNode } from 'react';
import { Menu } from '../../primitives/Menu/Menu';

/** One application-owned context available for selection. */
export interface ContextSwitcherItem {
  /** Optional supporting identifier or description. */
  description?: ReactNode;
  /** Prevents selection. Defaults to `false`. */
  disabled?: boolean;
  /** Optional visual context marker. */
  icon?: ReactNode;
  /** Stable context key. */
  id: string;
  /** Visible and typeahead-readable context name. */
  name: string;
}

/** Props for switching one visible application context. */
export interface ContextSwitcherProps {
  /** Accessible name for the menu trigger. */
  'aria-label': string;
  /** Current selected context key, or `null` when selection is required. */
  currentId: string | null;
  /** Optional visual marker shown when selection is required. */
  emptyIcon?: ReactNode;
  /** Application-owned prompt shown when selection is required. */
  emptyName?: ReactNode;
  /** Ordered application-owned contexts. */
  items: readonly ContextSwitcherItem[];
  /** Optional label for a management action after the contexts. */
  manageLabel?: string;
  /** Called when the optional management action is selected. */
  onManage?: () => void;
  /** Called with the next selected context key. */
  onChange: (id: string) => void;
  /** Short text describing the selected context role. */
  triggerLabel?: ReactNode;
}

/**
 * Switches one application-owned context through a keyboard-complete menu.
 *
 * @summary controlled application-context selection menu
 */
export function ContextSwitcher({
  'aria-label': ariaLabel,
  currentId,
  emptyIcon,
  emptyName,
  items,
  manageLabel,
  onChange,
  onManage,
  triggerLabel,
}: Readonly<ContextSwitcherProps>): ReactElement {
  const current = items.find((item) => item.id === currentId);
  const itemIds = new Set(items.map((item) => item.id));
  let manageItemId = '__breeze-manage-contexts';

  while (itemIds.has(manageItemId)) {
    manageItemId = `_${manageItemId}`;
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={ariaLabel}
        className="min-h-14 w-full justify-start gap-3 border-0 bg-transparent p-2 text-start text-inherit data-[hovered]:bg-[var(--breeze-shell-soft)]"
      >
        {current?.icon ?? emptyIcon}
        <span className="grid min-w-0 flex-1 gap-0.5">
          {triggerLabel === undefined ? null : (
            <small className="text-base text-[var(--breeze-ink-inverse-muted)]">
              {triggerLabel}
            </small>
          )}
          <strong className="truncate text-base">
            {current?.name ?? emptyName ?? ariaLabel}
          </strong>
        </span>
      </Menu.Trigger>
      <Menu.Popover className="w-80" nonModal placement="top start">
        <div className="border-b border-[var(--breeze-border)] px-4 py-3 font-[family-name:var(--breeze-font-display)] text-xl font-bold">
          {ariaLabel}
        </div>
        <Menu.List
          aria-label={ariaLabel}
          onSelectionChange={(selection) => {
            if (selection === 'all') {
              return;
            }

            const [nextId] = selection;

            if (nextId !== undefined && nextId !== manageItemId) {
              onChange(String(nextId));
            }
          }}
          selection={currentId === null ? [] : [currentId]}
        >
          {items.map((item) => (
            <Menu.Item
              disabled={item.disabled}
              id={item.id}
              key={item.id}
              textValue={item.name}
            >
              <span className="flex min-w-0 items-center gap-3">
                {item.icon}
                <span className="grid min-w-0 gap-0.5">
                  <strong>{item.name}</strong>
                  {item.description === undefined ? null : (
                    <small>{item.description}</small>
                  )}
                </span>
              </span>
            </Menu.Item>
          ))}
          {manageLabel === undefined || onManage === undefined ? null : (
            <Menu.Item
              className="font-bold text-[var(--breeze-primary)]"
              id={manageItemId}
              onAction={onManage}
              textValue={manageLabel}
            >
              {manageLabel}
            </Menu.Item>
          )}
        </Menu.List>
      </Menu.Popover>
    </Menu.Root>
  );
}
