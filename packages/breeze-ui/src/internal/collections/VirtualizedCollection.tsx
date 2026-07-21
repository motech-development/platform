import type {
  ComponentProps,
  CSSProperties,
  ReactElement,
  ReactNode,
} from 'react';
import { createElement, useMemo } from 'react';
import {
  GridLayout,
  ListLayout,
  Rect,
  Size,
  TableLayout,
  Virtualizer as AriaVirtualizer,
} from 'react-aria-components/Virtualizer';
import type {
  CollectionKey,
  CollectionVirtualization,
} from '../types/collection';

const compactTableBreakpoint = 681;
const compactTableCellGap = 8;
const compactTableMeasurementAllowance = 1;
const compactTableRowBorder = 1;
const compactTableRowPadding = 34;

interface VirtualizedCollectionProps {
  children?: ReactNode;
  configuration: CollectionVirtualization;
  kind: 'grid' | 'list' | 'table';
  direction?: 'ltr' | 'rtl';
  maximumColumns?: number;
  minimumItemWidth?: number;
  orientation?: 'horizontal' | 'vertical';
}

interface LayoutOptions {
  estimatedHeadingSize?: number;
  estimatedRowSize?: number;
  gap?: number;
  headingSize?: number;
  loaderSize?: number;
  orientation?: 'horizontal' | 'vertical';
  rowSize?: number;
}

interface TableOptions {
  estimatedHeadingHeight?: number;
  estimatedRowHeight?: number;
  gap?: number;
  headingHeight?: number;
  loaderHeight?: number;
  rowHeight?: number;
}

interface GridOptions {
  direction?: 'ltr' | 'rtl';
  loaderHeight?: number;
  maxColumns?: number;
  minItemSize?: Size;
  minSpace?: Size;
  preserveAspectRatio?: boolean;
}

function overscanRect(rect: Rect, amount: number): Rect {
  const expandedRect = rect.copy();

  expandedRect.x = Math.max(0, expandedRect.x - amount);
  expandedRect.y = Math.max(0, expandedRect.y - amount);
  expandedRect.width += amount * 2;
  expandedRect.height += amount * 2;

  return expandedRect;
}

class BreezeListLayout extends ListLayout<unknown, LayoutOptions> {
  readonly #overscan: number;

  constructor(options: LayoutOptions, overscan: number) {
    super(options);
    this.#overscan = overscan;
  }

  override getVisibleLayoutInfos(rect: Rect) {
    return super.getVisibleLayoutInfos(overscanRect(rect, this.#overscan));
  }
}

class BreezeTableLayout extends TableLayout<unknown, TableOptions> {
  readonly #overscan: number;

  readonly #compactCellHeights = new Map<CollectionKey, number>();

  constructor(options: TableOptions, overscan: number) {
    super(options);
    this.#overscan = overscan;
  }

  override getVisibleLayoutInfos(rect: Rect) {
    return super.getVisibleLayoutInfos(overscanRect(rect, this.#overscan));
  }

  override updateItemSize(key: CollectionKey, size: Size): boolean {
    const layoutNode = this.layoutNodes.get(key);
    const compact =
      (this.virtualizer?.size.width ?? Infinity) < compactTableBreakpoint;

    if (
      !compact ||
      this.rowHeight !== null ||
      layoutNode?.layoutInfo.type !== 'cell' ||
      layoutNode.layoutInfo.parentKey === null
    ) {
      return super.updateItemSize(key, size);
    }

    this.#compactCellHeights.set(key, size.height);

    const row = this.layoutNodes.get(layoutNode.layoutInfo.parentKey);
    const cells = row?.children ?? [];

    if (cells.length === 0) {
      return super.updateItemSize(key, size);
    }

    const measuredHeight = Math.ceil(
      cells.reduce(
        (height, cell) =>
          height +
          (this.#compactCellHeights.get(cell.layoutInfo.key) ?? size.height),
        compactTableRowBorder +
          compactTableMeasurementAllowance +
          compactTableRowPadding +
          compactTableCellGap * (cells.length - 1),
      ),
    );

    return cells.reduce(
      (changed, cell) =>
        super.updateItemSize(
          cell.layoutInfo.key,
          new Size(cell.layoutInfo.rect.width, measuredHeight),
        ) || changed,
      false,
    );
  }
}

class BreezeGridLayout extends GridLayout<unknown, GridOptions> {
  readonly #overscan: number;

  constructor(overscan: number) {
    super();
    this.#overscan = overscan;
  }

  override getVisibleLayoutInfos(rect: Rect) {
    return super.getVisibleLayoutInfos(overscanRect(rect, this.#overscan));
  }
}

function rowHeightOptions(configuration: CollectionVirtualization) {
  return configuration.mode === 'fixed'
    ? {
        estimatedRowHeight: undefined,
        rowHeight: configuration.rowHeight,
      }
    : {
        estimatedRowHeight: configuration.estimatedRowHeight ?? 48,
        rowHeight: undefined,
      };
}

export function collectionViewportStyle(
  configuration: CollectionVirtualization | undefined,
): CSSProperties | undefined {
  return configuration === undefined
    ? undefined
    : {
        height: configuration.viewportHeight,
      };
}

export default function VirtualizedCollection({
  children,
  configuration,
  direction = 'ltr',
  kind,
  maximumColumns,
  minimumItemWidth = 224,
  orientation = 'vertical',
}: Readonly<VirtualizedCollectionProps>): ReactElement {
  const {
    estimatedSectionHeight,
    gap = 0,
    loadingRowHeight = 48,
    overscan = 0,
  } = configuration;
  const { estimatedRowHeight, rowHeight } = rowHeightOptions(configuration);
  const gridLayoutOptions = useMemo<GridOptions | undefined>(
    () =>
      kind === 'grid'
        ? {
            direction,
            loaderHeight: loadingRowHeight,
            maxColumns: maximumColumns,
            minItemSize: new Size(
              minimumItemWidth,
              rowHeight ?? estimatedRowHeight ?? 48,
            ),
            minSpace: new Size(gap, gap),
            preserveAspectRatio: configuration.mode === 'fixed',
          }
        : undefined,
    [
      configuration.mode,
      direction,
      estimatedRowHeight,
      gap,
      kind,
      loadingRowHeight,
      maximumColumns,
      minimumItemWidth,
      rowHeight,
    ],
  );
  const layout = useMemo(() => {
    if (kind === 'table') {
      return new BreezeTableLayout(
        {
          estimatedHeadingHeight: estimatedSectionHeight,
          estimatedRowHeight,
          gap,
          loaderHeight: loadingRowHeight,
          rowHeight,
        },
        overscan,
      );
    }

    if (kind === 'grid') {
      return new BreezeGridLayout(overscan);
    }

    return new BreezeListLayout(
      {
        estimatedHeadingSize: estimatedSectionHeight,
        estimatedRowSize: estimatedRowHeight,
        gap,
        loaderSize: loadingRowHeight,
        orientation,
        rowSize: rowHeight,
      },
      overscan,
    );
  }, [
    estimatedRowHeight,
    estimatedSectionHeight,
    gap,
    kind,
    loadingRowHeight,
    orientation,
    overscan,
    rowHeight,
  ]);

  const virtualizerProps = {
    children,
    layout,
    layoutOptions: gridLayoutOptions,
  } as unknown as ComponentProps<typeof AriaVirtualizer>;

  return createElement(AriaVirtualizer, virtualizerProps);
}
