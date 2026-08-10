import { Skeleton, Table, VisuallyHidden } from '@motech-development/breeze-ui';
import { responsiveEntityTableClassNames } from './tableLayout';

interface EntityTableSkeletonColumns {
  actions: string;
  identity: string;
  primary: string;
  secondary: string;
  tertiary: string;
}

export function EntityTableSkeleton({
  actionLabel,
  columns,
  identityLabel,
  identityShape,
  loadingLabel,
  loadingText,
  rowCount,
  rowText,
  tableLabel,
}: Readonly<{
  actionLabel: string;
  columns: EntityTableSkeletonColumns;
  identityLabel: string;
  identityShape: 'circle' | 'square';
  loadingLabel: string;
  loadingText: string;
  rowCount: number;
  rowText: (index: number) => string;
  tableLabel: string;
}>) {
  return (
    <section aria-label={loadingLabel} role="status">
      <VisuallyHidden>{loadingText}</VisuallyHidden>
      <div aria-hidden="true" inert>
        <Table.Root
          aria-label={tableLabel}
          boundary="strong"
          className={responsiveEntityTableClassNames.root}
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
          tabIndex={-1}
        >
          <Table.Header className={responsiveEntityTableClassNames.header}>
            <Table.Column
              compactLabel={false}
              id={columns.identity}
              textValue={identityLabel}
            >
              <VisuallyHidden>{identityLabel}</VisuallyHidden>
            </Table.Column>
            <Table.Column compactLabel={false} id={columns.primary} rowHeader>
              <Skeleton className="h-4 w-3/4 max-w-44" />
            </Table.Column>
            <Table.Column compactLabel={false} id={columns.secondary}>
              <Skeleton className="h-4 w-4/5 max-w-64" />
            </Table.Column>
            <Table.Column compactLabel={false} id={columns.tertiary}>
              <Skeleton className="h-4 w-4/5 max-w-64" />
            </Table.Column>
            <Table.Column
              compactLabel={false}
              id={columns.actions}
              textValue={actionLabel}
              width="1.25rem"
            >
              <VisuallyHidden>{actionLabel}</VisuallyHidden>
            </Table.Column>
          </Table.Header>
          <Table.Body className={responsiveEntityTableClassNames.body}>
            {Array.from({ length: rowCount }, (_, index) => (
              <Table.Row
                className={responsiveEntityTableClassNames.row}
                id={`loading-${columns.primary}-${index}`}
                key={index}
                textValue={rowText(index)}
              >
                <Table.Cell
                  className={responsiveEntityTableClassNames.cells.identity}
                  column={columns.identity}
                >
                  <Skeleton
                    className={`size-9 shrink-0 ${identityShape === 'circle' ? 'rounded-full' : 'rounded-none'}`}
                  />
                </Table.Cell>
                <Table.Cell
                  className={responsiveEntityTableClassNames.cells.primary}
                  column={columns.primary}
                >
                  <Skeleton className="h-4 w-3/4 max-w-44" />
                </Table.Cell>
                <Table.Cell
                  className={responsiveEntityTableClassNames.cells.secondary}
                  column={columns.secondary}
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={responsiveEntityTableClassNames.cells.tertiary}
                  column={columns.tertiary}
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={responsiveEntityTableClassNames.cells.actions}
                  column={columns.actions}
                >
                  <Skeleton className="h-4 w-3" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </section>
  );
}
