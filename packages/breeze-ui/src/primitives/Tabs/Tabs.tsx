import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  TabPanels as AriaTabPanels,
  Tabs as AriaTabs,
} from 'react-aria-components/Tabs';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { CollectionKey } from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';

const tabsRoot = tv({
  base: 'flex gap-4',
  defaultVariants: { orientation: 'horizontal' },
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row items-start',
    },
  },
});
const tabsList = tv({
  base: 'flex gap-1 border-[var(--breeze-border)]',
  defaultVariants: { orientation: 'horizontal' },
  variants: {
    orientation: {
      horizontal: 'flex-row border-b',
      vertical: 'flex-col border-e',
    },
  },
});
const tab = tv({
  base: 'min-h-10 cursor-default px-3 py-2 font-semibold text-[var(--breeze-ink-muted)] outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[selected]:text-[var(--breeze-primary)]',
});
const tabPanel = tv({
  base: 'min-w-0 outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]',
});

type TabsRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface TabsRootSharedProps extends TabsRootNativeProps {
  /** Tab list and panels. */
  children: ReactNode;
  /** Disables every tab. Defaults to `false`. */
  disabled?: boolean;
  /** Arrow-key and layout direction. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered tabs root. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledTabsRootProps {
  /** Current selected tab key. */
  value: CollectionKey;
  /** Called with the next selected tab key. */
  onChange: (value: CollectionKey) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlyTabsRootProps {
  /** Current immutable selected tab key. */
  value: CollectionKey;
  /** Marks controlled selection as intentionally immutable. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledTabsRootProps {
  /** Initial selected tab key. */
  defaultValue?: CollectionKey;
  /** Called with the next selected tab key. */
  onChange?: (value: CollectionKey) => void;
  readOnly?: false;
  value?: never;
}

/** Props for controlled, read-only, or uncontrolled tab selection. */
export type TabsRootProps = TabsRootSharedProps &
  (ControlledTabsRootProps | ReadOnlyTabsRootProps | UncontrolledTabsRootProps);

/** Props for the accessible list of tab labels. */
export interface TabsListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Tab label parts. */
  children: ReactNode;
  /** Ref to the rendered tab list. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for one selectable tab label. */
export interface TabsTabProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'id' | 'onClick' | 'onClickCapture' | 'style'
  > {
  /** Visible tab label. */
  children: ReactNode;
  /** Prevents focus and selection. Defaults to `false`. */
  disabled?: boolean;
  /** Stable string or number key matching its panel. */
  id: CollectionKey;
  /** Ref to the rendered tab. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for the optional grouping of tab panels. */
export interface TabsPanelsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Tab panels. */
  children: ReactNode;
  /** Ref to the rendered panel group. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for content associated with one tab. */
export interface TabsPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'style'> {
  /** Panel content. */
  children: ReactNode;
  /** Stable key matching its tab. */
  id: CollectionKey;
  /** Keeps inactive content mounted and inert. Defaults to `false`. */
  forceMount?: boolean;
  /** Ref to the rendered panel. */
  ref?: Ref<HTMLDivElement>;
}

/** Coordinates tab selection, keyboard navigation, and panel visibility. */
export function Root({
  className,
  defaultValue,
  disabled = false,
  onChange,
  orientation = 'horizontal',
  readOnly: _readOnly,
  ref,
  value,
  ...props
}: Readonly<TabsRootProps>): ReactElement {
  useBreezeContext();

  return createElement(AriaTabs, {
    ...props,
    className: tabsRoot({ class: className, orientation }),
    defaultSelectedKey: defaultValue,
    isDisabled: disabled,
    onSelectionChange: onChange,
    orientation,
    ref: useForwardedRef(ref),
    selectedKey: value,
  });
}

/** Groups tab labels and inherits root orientation. */
export function List({
  className,
  ref,
  ...props
}: Readonly<TabsListProps>): ReactElement {
  return createElement(AriaTabList, {
    ...props,
    className: ({ orientation }: { orientation: 'horizontal' | 'vertical' }) =>
      tabsList({ class: className, orientation }),
    ref: useForwardedRef(ref),
  });
}

/** Renders one keyed tab label. */
export function Tab({
  className,
  disabled = false,
  id,
  ref,
  ...props
}: Readonly<TabsTabProps>): ReactElement {
  return createElement(AriaTab, {
    ...props,
    className: tab({ class: className }),
    id,
    isDisabled: disabled,
    ref: useForwardedRef(ref),
  } as ComponentProps<typeof AriaTab>);
}

/** Groups keyed panels for transition coordination. */
export function Panels({
  className,
  ref,
  ...props
}: Readonly<TabsPanelsProps>): ReactElement {
  return createElement(AriaTabPanels, {
    ...props,
    className,
    ref: useForwardedRef(ref),
  });
}

/** Renders content associated with a keyed tab. */
export function Panel({
  className,
  forceMount = false,
  id,
  ref,
  ...props
}: Readonly<TabsPanelProps>): ReactElement {
  return createElement(AriaTabPanel, {
    ...props,
    className: tabPanel({ class: className }),
    id,
    ref: useForwardedRef(ref),
    shouldForceMount: forceMount,
  });
}

/**
 * Coordinates keyed tab labels, orientation-aware keyboard navigation, and
 * visibility of their associated panels.
 *
 * @summary accessible compound tabbed content navigation
 */
export const Tabs = {
  /** List of selectable tab labels. */
  List,
  /** Content associated with one tab. */
  Panel,
  /** Optional panel collection wrapper. */
  Panels,
  /** Selection and orientation root. */
  Root,
  /** One keyed selectable label. */
  Tab,
};
