import {
  createElement,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Separator as AriaSeparator,
} from 'react-aria-components/Menu';
import CollectionPopover from '../../collections/CollectionPopover';
import type { ItemDescriptor } from '../../collections/item.types';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Badge } from '../Badge/Badge';
import type { IconName } from '../Icon/Icon';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    badge: 'breeze:ms-auto',
    content:
      'breeze:flex breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:gap-breeze-1',
    description:
      'breeze:text-breeze-xs breeze:font-normal breeze:text-breeze-ink-3',
    header:
      'breeze:block breeze:border-breeze-line breeze:border-be breeze:px-[14px] breeze:py-[10px] breeze:font-breeze-sans breeze:text-breeze-2xs breeze:font-semibold breeze:uppercase breeze:tracking-breeze-wide breeze:text-breeze-ink-3',
    icon: 'breeze:block-breeze-4 breeze:inline-breeze-4 breeze:shrink-0',
    initials:
      'breeze:flex breeze:block-breeze-6 breeze:inline-breeze-6 breeze:shrink-0 breeze:items-center breeze:justify-center breeze:rounded-breeze-sm breeze:bg-breeze-brand-soft breeze:text-breeze-2xs breeze:font-bold breeze:text-breeze-brand-text',
    item: 'breeze:flex breeze:min-inline-0 breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:items-center breeze:gap-breeze-2 breeze:px-[14px] breeze:py-[10px] breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-start breeze:outline-offset-[-2px] breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[focused]:bg-breeze-raised breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-raised',
    menu: 'breeze:min-inline-0 breeze:outline-none',
    // Shrink-wraps its items, as the prototype's menus do, instead of the shared 320px popover width.
    popover:
      'breeze:inline-auto breeze:max-inline-[calc(100vw-24px)] breeze:overflow-auto breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:shadow-breeze-overlay',
    separator:
      'breeze:m-0 breeze:block-breeze-px breeze:border-0 breeze:bg-breeze-line',
    // The prototype's trigger sets no text size, so it keeps the body's line height.
    trigger:
      'breeze:inline-flex breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:items-center breeze:gap-breeze-2 breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[hovered]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand',
    triggerLabel: 'breeze:inline-grid breeze:min-inline-0 breeze:items-center',
    triggerLabelContent: 'breeze:[grid-area:1/1]',
    triggerLabelSkeleton: 'breeze:[grid-area:1/1] breeze:inline-full',
    triggerLoadingStatus: 'breeze:sr-only',
  },
  compound: {},
  size: {
    md: 'breeze:min-inline-[max(256px,var(--trigger-width))]',
    sm: 'breeze:min-inline-[max(208px,var(--trigger-width))]',
  },
  state: {},
  variant: {
    tone: {
      danger: 'breeze:text-breeze-danger',
      default: 'breeze:text-breeze-ink',
    },
  },
} as const;

/** Minimum menu widths: `sm` is 208px and `md` is 256px. */
export type MenuWidth = keyof typeof variants.size;

/** A group of menu items, divided from neighbouring groups. */
export interface MenuSectionDescriptor {
  id: string;
  /** Visible header that also names the group; omit for an unlabelled group. */
  label?: string;
}

interface MenuItemDescriptorBase extends ItemDescriptor {
  /** Groups this item with every item sharing the section `id`. */
  section?: MenuSectionDescriptor;
  /** Shows a destructive action, such as Remove, in the danger colour. */
  tone?: 'danger';
}

interface MenuIconItemDescriptor extends MenuItemDescriptorBase {
  initials?: never;
}

interface MenuInitialsItemDescriptor
  extends Omit<MenuItemDescriptorBase, 'icon'> {
  icon?: never;
  /** Short initials shown in a brand tile in place of an icon. */
  initials: string;
}

/** The closed content contract for a menu item. */
export type MenuItemDescriptor =
  | MenuIconItemDescriptor
  | MenuInitialsItemDescriptor;

interface MenuCommonProps<T> {
  /** Returns the display details for an application item. */
  getItem: (item: T) => MenuItemDescriptor;
  /** Application items displayed as actions. */
  items: T[];
  /** Called with the selected application item. */
  onAction?: (item: T) => void;
  /** Shows a loading state on the trigger and prevents opening the menu. */
  loading?: boolean;
  /** Minimum width of the open menu, never narrower than its trigger. Defaults to `md`. */
  width?: MenuWidth;
  /** Aligns the menu's start or end edge with the trigger's. Defaults to `bottom start`. */
  placement?: 'bottom end' | 'bottom start';
}

interface LabelledTriggerProps {
  /** Visible label for the button that opens the menu. */
  trigger: string;
  /** Accessible name when it should differ from the visible trigger label. */
  triggerAriaLabel?: string;
  /** Icon shown beside the trigger label. */
  triggerIcon?: IconName;
}

interface IconTriggerProps {
  /** Omit for an icon-only trigger. */
  trigger?: never;
  /** Accessible name for the icon-only trigger. */
  triggerAriaLabel: string;
  /** Icon shown as the trigger's only content. */
  triggerIcon: IconName;
}

interface ControlledMenuProps {
  /** Only set when visibility is uncontrolled. */
  defaultOpen?: never;
  /** Called when the menu should open or close. */
  onOpenChange: (open: boolean) => void;
  /** Whether the menu is open. */
  open: boolean;
}

interface UncontrolledMenuProps {
  /** Initial visibility. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Only set when visibility is controlled. */
  open?: never;
}

/** Props for a menu with caller-controlled or internal visibility. */
export type MenuProps<T> = MenuCommonProps<T> &
  (LabelledTriggerProps | IconTriggerProps) &
  (ControlledMenuProps | UncontrolledMenuProps);

interface MenuEntry<T> {
  descriptionId: string;
  descriptor: MenuItemDescriptor;
  item: T;
}

interface MenuGroup<T> {
  entries: MenuEntry<T>[];
  section: MenuSectionDescriptor;
}

type MenuBlock<T> =
  | { entry: MenuEntry<T>; kind: 'item' }
  | { group: MenuGroup<T>; kind: 'section' };

function groupEntries<T>(entries: MenuEntry<T>[]): MenuBlock<T>[] {
  const blocks: MenuBlock<T>[] = [];
  const groups = new Map<string, MenuGroup<T>>();

  entries.forEach((entry) => {
    const { section } = entry.descriptor;

    if (!section) {
      blocks.push({ entry, kind: 'item' });
      return;
    }

    const group = groups.get(section.id);

    if (group) {
      group.entries.push(entry);
    } else {
      const newGroup = { entries: [entry], section };
      groups.set(section.id, newGroup);
      blocks.push({ group: newGroup, kind: 'section' });
    }
  });

  return blocks;
}

interface MenuItemContentProps {
  descriptionId: string;
  descriptor: MenuItemDescriptor;
  reserveIcon: boolean;
}

function MenuItemContent({
  descriptionId,
  descriptor,
  reserveIcon,
}: Readonly<MenuItemContentProps>) {
  return (
    <>
      {descriptor.initials === undefined ? (
        reserveIcon && (
          <span aria-hidden="true" className={variants.base.icon}>
            {descriptor.icon && <Icon name={descriptor.icon} size="sm" />}
          </span>
        )
      ) : (
        <span aria-hidden="true" className={variants.base.initials}>
          {descriptor.initials}
        </span>
      )}
      <span className={variants.base.content}>
        <span>{descriptor.label}</span>
        {descriptor.description && (
          <span className={variants.base.description} id={descriptionId}>
            {descriptor.description}
          </span>
        )}
      </span>
      {descriptor.badge && (
        <span className={variants.base.badge}>
          <Badge
            aria-label={descriptor.badge['aria-label']}
            variant={descriptor.badge.variant}
          >
            {descriptor.badge.children}
          </Badge>
        </span>
      )}
    </>
  );
}

function getMenuItemAccessibleName(descriptor: MenuItemDescriptor) {
  if (!descriptor.badge) return descriptor.label;

  const badgeLabel =
    descriptor.badge['aria-label']?.trim() || descriptor.badge.children;

  return `${descriptor.label}, ${badgeLabel}`;
}

function renderMenuItem<T>(
  { descriptionId, descriptor }: MenuEntry<T>,
  reserveIcon: boolean,
) {
  return (
    <AriaMenuItem
      aria-describedby={descriptor.description ? descriptionId : undefined}
      aria-label={getMenuItemAccessibleName(descriptor)}
      className={[
        variants.base.item,
        variants.variant.tone[descriptor.tone ?? 'default'],
      ].join(' ')}
      id={descriptor.id}
      isDisabled={descriptor.disabled}
      key={descriptor.id}
      textValue={descriptor.label}
    >
      <MenuItemContent
        descriptionId={descriptionId}
        descriptor={descriptor}
        reserveIcon={reserveIcon}
      />
    </AriaMenuItem>
  );
}

interface MenuLoadingStatusProps {
  loading: boolean;
  triggerOwnsProgress: boolean;
}

function MenuLoadingStatus({
  loading,
  triggerOwnsProgress,
}: Readonly<MenuLoadingStatusProps>) {
  const { getMessageLocale, messages } = useBreezeContext();

  return (
    <>
      {loading && !triggerOwnsProgress && (
        <span className={variants.base.triggerLoadingStatus}>
          <Skeleton label={messages.loading} />
        </span>
      )}
      <output
        aria-live="polite"
        className={variants.base.triggerLoadingStatus}
        lang={getMessageLocale('loading')}
      >
        {loading ? messages.loading : ''}
      </output>
    </>
  );
}

/**
 * Displays related actions from a labelled or icon-only trigger button.
 *
 * Give items a `section` to group them under an optional header, with dividers
 * between groups. Set `loading` while the trigger should not open the menu.
 * The loading status is announced while the trigger keeps its accessible name
 * and dimensions.
 *
 * @summary A compact menu for secondary actions.
 */
export function Menu<T>({
  defaultOpen,
  getItem,
  items,
  loading = false,
  onAction,
  onOpenChange,
  open: controlledOpen,
  placement = 'bottom start',
  trigger,
  triggerAriaLabel,
  triggerIcon,
  width = 'md',
}: Readonly<MenuProps<T>>) {
  useBreezeContext();

  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? false,
  );
  const open = controlledOpen ?? uncontrolledOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const menuId = useId();
  const entries = useMemo(
    () =>
      items.map((item, index) => ({
        descriptionId: `${menuId}-description-${index}`,
        descriptor: getItem(item),
        item,
      })),
    [getItem, items, menuId],
  );
  const blocks = useMemo(() => groupEntries(entries), [entries]);
  // Labels align with iconned neighbours; a menu without icons starts at the edge.
  const reserveIcon = entries.some(({ descriptor }) => descriptor.icon);
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (loading && nextOpen) return;

      if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, loading, onOpenChange],
  );

  useLayoutEffect(() => {
    if (!open && restoreFocusRef.current) {
      restoreFocusRef.current = false;

      requestAnimationFrame(() => {
        const triggerElement = triggerRef.current;

        if (
          triggerElement &&
          triggerElement.ownerDocument.activeElement ===
            triggerElement.ownerDocument.body
        ) {
          triggerElement.focus();
        }
      });
    }
  }, [open]);

  return (
    <>
      <AriaMenuTrigger isOpen={open} onOpenChange={handleOpenChange}>
        {trigger === undefined ? (
          <IconButton
            aria-haspopup="menu"
            label={triggerAriaLabel}
            loading={loading}
            name={triggerIcon}
            ref={triggerRef}
            size="sm"
          />
        ) : (
          <AriaButton
            aria-label={triggerAriaLabel}
            aria-haspopup="menu"
            className={variants.base.trigger}
            isPending={loading}
            ref={triggerRef}
            render={(buttonProps) =>
              createElement('button', {
                ...buttonProps,
                'aria-busy': loading || undefined,
                type: 'button',
              })
            }
          >
            {triggerIcon && <Icon name={triggerIcon} size="sm" />}
            <span className={variants.base.triggerLabel}>
              <span
                className={[
                  variants.base.triggerLabelContent,
                  loading && 'breeze:opacity-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {trigger}
              </span>
              {loading && (
                <span
                  aria-hidden="true"
                  className={variants.base.triggerLabelSkeleton}
                  data-breeze-skeleton=""
                >
                  <Skeleton />
                </span>
              )}
            </span>
            <Icon name="expand" size="sm" />
          </AriaButton>
        )}
        <CollectionPopover
          className={[variants.base.popover, variants.size[width]].join(' ')}
          isOpen={open}
          onOpenChange={handleOpenChange}
          placement={placement}
          triggerRef={triggerRef}
        >
          <div
            onKeyDownCapture={(event) => {
              if (event.key === 'Escape') restoreFocusRef.current = true;
            }}
          >
            <AriaMenu
              className={variants.base.menu}
              id={menuId}
              onAction={(key) => {
                const entry = entries.find(
                  ({ descriptor }) => descriptor.id === key,
                );
                if (entry) {
                  restoreFocusRef.current = true;
                  onAction?.(entry.item);
                }
              }}
            >
              {blocks.flatMap((block, index) => {
                const previous = blocks[index - 1];
                const content =
                  block.kind === 'item' ? (
                    renderMenuItem(block.entry, reserveIcon)
                  ) : (
                    <AriaMenuSection key={`section:${block.group.section.id}`}>
                      {block.group.section.label ? (
                        <AriaHeader className={variants.base.header}>
                          {block.group.section.label}
                        </AriaHeader>
                      ) : null}
                      {block.group.entries.map((entry) =>
                        renderMenuItem(entry, reserveIcon),
                      )}
                    </AriaMenuSection>
                  );

                if (
                  !previous ||
                  (block.kind === 'item' && previous.kind === 'item')
                ) {
                  return [content];
                }

                return [
                  <AriaSeparator
                    className={variants.base.separator}
                    key={`separator:${content.key}`}
                  />,
                  content,
                ];
              })}
            </AriaMenu>
          </div>
        </CollectionPopover>
      </AriaMenuTrigger>
      <MenuLoadingStatus
        loading={loading}
        triggerOwnsProgress={trigger === undefined}
      />
    </>
  );
}
