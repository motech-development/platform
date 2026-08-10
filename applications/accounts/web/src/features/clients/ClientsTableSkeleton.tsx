import { Skeleton, Table, VisuallyHidden } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { companiesTableClassNames } from '../companies/tableLayout';

export function ClientsTableSkeleton() {
  const { t } = useTranslation(['clients', 'routing']);

  return (
    <section aria-label={t('Loading clients')} role="status">
      <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
      <div aria-hidden="true" inert>
        <Table.Root
          aria-label={t('Loading clients table')}
          boundary="strong"
          className={companiesTableClassNames.root}
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
          tabIndex={-1}
        >
          <Table.Header className={companiesTableClassNames.header}>
            <Table.Column
              compactLabel={false}
              id="avatar"
              textValue={t('Client')}
            >
              <VisuallyHidden>{t('Client')}</VisuallyHidden>
            </Table.Column>
            <Table.Column compactLabel={false} id="client" rowHeader>
              <Skeleton className="h-4 w-3/4 max-w-44" />
            </Table.Column>
            <Table.Column compactLabel={false} id="email">
              <Skeleton className="h-4 w-4/5 max-w-64" />
            </Table.Column>
            <Table.Column compactLabel={false} id="telephone">
              <Skeleton className="h-4 w-4/5 max-w-64" />
            </Table.Column>
            <Table.Column
              compactLabel={false}
              id="actions"
              textValue={t('Action')}
              width="1.25rem"
            >
              <VisuallyHidden>{t('Action')}</VisuallyHidden>
            </Table.Column>
          </Table.Header>
          <Table.Body className={companiesTableClassNames.body}>
            {[0, 1, 2, 3].map((index) => (
              <Table.Row
                className={companiesTableClassNames.row}
                id={`loading-client-${index}`}
                key={index}
                textValue={t('Loading client row {{count}}', {
                  count: index + 1,
                })}
              >
                <Table.Cell
                  className={companiesTableClassNames.cells.avatar}
                  column="avatar"
                >
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.company}
                  column="client"
                >
                  <Skeleton className="h-4 w-3/4 max-w-44" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.number}
                  column="email"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.contact}
                  column="telephone"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.actions}
                  column="actions"
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
