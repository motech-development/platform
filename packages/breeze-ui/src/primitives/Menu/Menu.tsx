import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  SubmenuTrigger as AriaSubmenuTrigger,
} from 'react-aria-components/Menu';
import { tv } from 'tailwind-variants';
import useCollectionEmptyContent from '../../internal/collections/useCollectionEmptyContent';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type {
  BreezeCollectionItem,
  CollectionContentProps,
  CollectionKey,
  CollectionSelection,
} from '../../internal/types/collection';
import type {
  NativeButtonProps,
  NativeLinkProps,
} from '../../internal/types/native';
import { useBreezeContext } from '../../provider/BreezeContext';

const menuTrigger = tv({
  base: 'inline-flex min-h-11 items-center justify-center border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] px-3 font-semibold text-[var(--breeze-ink)] outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]',
});
const menuPopover = tv({
  base: 'min-w-48 border border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] shadow-[0_8px_0_rgb(6_12_24_/_18%)]',
});
const menuList = tv({
  base: 'max-h-80 overflow-y-auto outline-none',
});
const menuItem = tv({
  base: 'flex min-h-11 cursor-default items-center border-b border-[var(--breeze-border)] px-4 py-2 text-base text-[var(--breeze-ink)] no-underline outline-none last:border-b-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:bg-[var(--breeze-primary-soft)] data-[hovered]:bg-[var(--breeze-primary-soft)] data-[selected]:bg-[var(--breeze-primary-soft)]',
});

interface MenuRootSharedProps {
  /** Trigger and popover parts. */
  children: ReactNode;
}

interface ControlledMenuRootProps {
  /** Current popup state. */
  open: boolean;
  /** Called with the next popup state. */
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}

interface ReadOnlyMenuRootProps {
  /** Current immutable popup state. */
  open: boolean;
  /** Marks controlled popup state as intentionally immutable. */
  readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}

interface UncontrolledMenuRootProps {
  /** Initial popup state. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the next popup state. */
  onOpenChange?: (open: boolean) => void;
  open?: never;
  readOnly?: false;
}

/** Props for controlled, read-only, or uncontrolled menu popup state. */
export type MenuRootProps = MenuRootSharedProps &
  (ControlledMenuRootProps | ReadOnlyMenuRootProps | UncontrolledMenuRootProps);

/** Props for the button that opens a menu. */
export interface MenuTriggerProps extends NativeButtonProps {
  /** Trigger label or content. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Prevents opening the menu. Defaults to `false`. */
  disabled?: boolean;
  /** Ref to the rendered trigger button. */
  ref?: Ref<HTMLButtonElement>;
}

/** Props for the positioned menu popup. */
export interface MenuPopoverProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Menu list content. */
  children: ReactNode;
  /** Allows interaction outside the popover while retaining outside-dismissal. Defaults to `false`. */
  nonModal?: boolean;
  /** Popup placement relative to its trigger. Defaults to `bottom start`. */
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end';
  /** Ref to the rendered popover. */
  ref?: Ref<HTMLElement>;
}

type MenuListNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

type MenuListSharedProps<Item extends BreezeCollectionItem> =
  MenuListNativeProps &
    CollectionContentProps<Item> & {
      /** Keys whose items cannot receive focus, selection, or actions. */
      disabledKeys?: Iterable<CollectionKey>;
      /** Content displayed when the menu has no items. */
      emptyContent?: ReactNode;
      /** Enables multiple selection. Defaults to `false`. */
      multiple?: boolean;
      /** Ref to the rendered menu. */
      ref?: Ref<HTMLDivElement>;
    };

interface ControlledMenuListProps {
  /** Current selected item keys. */
  selection: CollectionSelection;
  /** Called with the next selected item keys. */
  onSelectionChange: (selection: CollectionSelection) => void;
  defaultSelection?: never;
  readOnly?: false;
}

interface ReadOnlyMenuListProps {
  /** Current immutable selected item keys. */
  selection: CollectionSelection;
  /** Marks controlled selection as intentionally immutable. */
  readOnly: true;
  defaultSelection?: never;
  onSelectionChange?: never;
}

interface UncontrolledMenuListProps {
  /** Initial selected item keys. */
  defaultSelection?: CollectionSelection;
  /** Called with the next selected item keys. */
  onSelectionChange?: (selection: CollectionSelection) => void;
  readOnly?: false;
  selection?: never;
}

/** Props for a static or generic menu with optional selection state. */
export type MenuListProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = MenuListSharedProps<Item> &
  (ControlledMenuListProps | ReadOnlyMenuListProps | UncontrolledMenuListProps);

/** Props for one keyed menu action or destination. */
export interface MenuItemProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'id' | 'onClick' | 'onClickCapture' | 'style'
  > {
  /** Visible item content. */
  children: ReactNode;
  /** Prevents focus, selection, and action. Defaults to `false`. */
  disabled?: boolean;
  /** Optional native destination URL. */
  href?: string;
  /** Stable string or number item key. */
  id: CollectionKey;
  /** Called with this item key when activated. */
  onAction?: (key: CollectionKey) => void;
  /** Ref to the rendered menu item. */
  ref?: Ref<HTMLDivElement>;
  /** Plain-text representation used for typeahead and accessibility. */
  textValue: string;
}

/** Props for a nested menu trigger and its popup. */
export interface MenuSubmenuProps {
  /** Trigger item followed by a submenu popover. */
  children: [ReactElement, ReactElement];
  /** Hover delay before opening, in milliseconds. Defaults to `200`. */
  delay?: number;
  /** Ref to the rendered submenu trigger item. */
  ref?: Ref<HTMLDivElement>;
}

function normaliseSelection(
  selection: 'all' | Set<CollectionKey>,
): CollectionSelection {
  return selection === 'all' ? 'all' : [...selection];
}

function shouldUseRouter(href: string | undefined): href is string {
  return href !== undefined && href.startsWith('/') && !href.startsWith('//');
}

/** Coordinates popup state, trigger focus, and dismissal. */
export function Root({
  defaultOpen,
  onOpenChange,
  open,
  readOnly: _readOnly,
  ...props
}: Readonly<MenuRootProps>): ReactElement {
  useBreezeContext();

  return createElement(AriaMenuTrigger, {
    ...props,
    defaultOpen,
    isOpen: open,
    onOpenChange,
  });
}

/** Renders the menu trigger button. */
export function Trigger({
  className,
  disabled = false,
  ref,
  ...props
}: Readonly<MenuTriggerProps>): ReactElement {
  return createElement(AriaButton, {
    ...props,
    className: menuTrigger({ class: className }),
    isDisabled: disabled,
    ref: useForwardedRef(ref),
  } as ComponentProps<typeof AriaButton>);
}

/** Positions a root or nested menu and portals it through the Breeze provider. */
export function Popover({
  className,
  nonModal = false,
  placement = 'bottom start',
  ref,
  ...props
}: Readonly<MenuPopoverProps>): ReactElement {
  useBreezeContext();

  return createElement(AriaPopover, {
    ...props,
    className: menuPopover({ class: className }),
    isNonModal: nonModal,
    placement,
    ref: useForwardedRef(ref),
  } as ComponentProps<typeof AriaPopover>);
}

/** Renders a static or generic collection with keyboard focus and optional selection. */
export function List<Item extends BreezeCollectionItem>({
  children,
  className,
  defaultSelection,
  disabledKeys,
  emptyContent,
  items,
  multiple = false,
  onSelectionChange,
  ref,
  selection,
  ...props
}: Readonly<MenuListProps<Item>>): ReactElement {
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);
  const hasSelection =
    selection !== undefined || defaultSelection !== undefined;
  let selectionMode: 'none' | 'single' | 'multiple' = 'none';

  if (hasSelection) {
    selectionMode = multiple ? 'multiple' : 'single';
  }

  return createElement(AriaMenu, {
    ...props,
    children,
    className: menuList({ class: className }),
    defaultSelectedKeys: defaultSelection,
    disabledKeys,
    items,
    onSelectionChange: (keys: 'all' | Set<CollectionKey>) =>
      onSelectionChange?.(normaliseSelection(keys)),
    ref: useForwardedRef(ref),
    renderEmptyState: () => resolvedEmptyContent,
    selectedKeys: selection,
    selectionMode,
  } as unknown as ComponentProps<typeof AriaMenu>);
}

/** Renders one action, selectable item, or router-neutral destination. */
export function Item({
  className,
  disabled = false,
  href,
  id,
  onAction,
  ref,
  textValue,
  ...props
}: Readonly<MenuItemProps>): ReactElement {
  const { router } = useBreezeContext();
  const useRouter = router !== undefined && shouldUseRouter(href);
  const navigationProps =
    href === undefined || useRouter
      ? {}
      : {
          href,
        };

  return createElement(AriaMenuItem, {
    ...props,
    ...navigationProps,
    className: menuItem({ class: className }),
    id,
    isDisabled: disabled,
    onAction: () => {
      if (useRouter) {
        router.navigate(href);
      }

      onAction?.(id);
    },
    ref: useForwardedRef(ref),
    textValue,
  } as ComponentProps<typeof AriaMenuItem> & NativeLinkProps);
}

/** Coordinates nested-menu focus, opening, direction, and Escape dismissal. */
export function Submenu({
  ref,
  ...props
}: Readonly<MenuSubmenuProps>): ReactElement {
  return createElement(AriaSubmenuTrigger, {
    ...props,
    ref: useForwardedRef(ref),
  });
}

/**
 * Accessible compound action-menu primitive.
 *
 * @summary transient keyboard-navigable actions, destinations, and submenus
 */
export const Menu = {
  /** One keyed action, selectable item, or destination. */
  Item,
  /** Static or generic keyboard-navigable collection. */
  List,
  /** Positioned root or nested popup. */
  Popover,
  /** Popup state and focus coordination root. */
  Root,
  /** Nested-menu trigger and popup pair. */
  Submenu,
  /** Button that opens the root popup. */
  Trigger,
};
