import type { ReactElement, ReactNode } from 'react';

/** Stable identifier accepted by every Breeze collection. */
export type CollectionKey = string | number;

/** Minimum item shape required by Breeze dynamic collections. */
export interface BreezeCollectionItem {
  /** Stable string or number identifier used for focus and selection. */
  id: CollectionKey;
}

/** Selected collection keys, or every key for select-all state. */
export type CollectionSelection = CollectionKey[] | 'all';

interface CollectionVirtualizationShared {
  /** Gap between measured rows in pixels. Defaults to `0`. */
  gap?: number;
  /** Initial measurable loading-row height in pixels. Defaults to `48`. */
  loadingRowHeight?: number;
  /** Additional pixels retained around the visible window. Defaults to `0` beyond the engine's directional buffer. */
  overscan?: number;
  /** Initial section heading or footer height estimate; live measurements remain authoritative. */
  estimatedSectionHeight?: number;
  /** Fixed scroll viewport height in pixels. */
  viewportHeight: number;
}

/** Fixed-height virtualization configuration for uniform collection rows. */
export interface FixedCollectionVirtualization
  extends CollectionVirtualizationShared {
  /** Uses one authoritative height for every row. */
  mode: 'fixed';
  /** Authoritative fixed row height in pixels. */
  rowHeight: number;
  /** Excluded because fixed mode does not estimate row height. */
  estimatedRowHeight?: never;
}

/** Variable-height virtualization configuration whose live measurements override estimates. */
export interface VariableCollectionVirtualization
  extends CollectionVirtualizationShared {
  /** Measures every rendered row and retains those measurements across window changes. */
  mode: 'variable';
  /** Initial row-height estimate in pixels; measured content is always authoritative. Defaults to `48`. */
  estimatedRowHeight?: number;
  /** Excluded because variable mode measures each row. */
  rowHeight?: never;
}

/** Optional Breeze-owned virtualization configuration shared by supported collections. */
export type CollectionVirtualization =
  | FixedCollectionVirtualization
  | VariableCollectionVirtualization;

/** Static compound collection content. */
export interface StaticCollectionContentProps {
  /** Static compound item elements. */
  children: ReactNode;
  /** Excluded when static compound item elements are supplied. */
  items?: never;
}

/** Generic item-renderer collection content. */
export interface DynamicCollectionContentProps<
  Item extends BreezeCollectionItem,
> {
  /** Generic items with stable `id` keys. */
  items: Iterable<Item>;
  /** Renders one compound item for each generic item. */
  children: (item: Item) => ReactElement;
}

/** Shared static-or-generic collection content contract. */
export type CollectionContentProps<Item extends BreezeCollectionItem> =
  | DynamicCollectionContentProps<Item>
  | StaticCollectionContentProps;
