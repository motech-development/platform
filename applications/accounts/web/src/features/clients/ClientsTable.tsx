import {
  Avatar,
  Skeleton,
  Table,
  Typography,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';

interface ClientTableItem {
  contact: { email: string; telephone: string };
  id: string;
  name: string;
}

export interface ClientsTableProps {
  clients: readonly ClientTableItem[];
  onClientAction: (clientId: string) => void;
}

const clientTableRowClassName =
  'max-sm:grid! max-sm:grid-cols-[2.25rem_minmax(0,1fr)_max-content] max-sm:items-center! max-sm:gap-x-3! max-sm:gap-y-2!';

const clientTableCellClassNames = {
  actions:
    'max-sm:col-start-3! max-sm:row-start-1 max-sm:flex! max-sm:justify-end',
  avatar: 'max-sm:col-start-1! max-sm:row-start-1 max-sm:flex!',
  client: 'max-sm:col-start-2! max-sm:row-start-1 max-sm:flex!',
  email:
    'max-sm:col-span-3! max-sm:row-start-2 max-sm:block! max-sm:before:inline-block!',
  telephone:
    'max-sm:col-span-3! max-sm:row-start-3 max-sm:block! max-sm:before:inline-block!',
} as const;

function clientInitials(name: string) {
  return name
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

function ClientsTableHeader({
  loading = false,
}: Readonly<{ loading?: boolean }>) {
  const { t } = useTranslation('clients');

  return (
    <Table.Header>
      <Table.Column compactLabel={false} id="avatar" textValue={t('Client')}>
        <VisuallyHidden>{t('Client')}</VisuallyHidden>
      </Table.Column>
      <Table.Column compactLabel={false} id="client" rowHeader>
        {loading ? <Skeleton className="h-4 w-3/4 max-w-44" /> : t('Client')}
      </Table.Column>
      <Table.Column compactLabel={!loading} id="email">
        {loading ? <Skeleton className="h-4 w-4/5 max-w-64" /> : t('Email')}
      </Table.Column>
      <Table.Column compactLabel={!loading} id="telephone">
        {loading ? <Skeleton className="h-4 w-4/5 max-w-64" /> : t('Telephone')}
      </Table.Column>
      <Table.Column
        compactLabel={false}
        id="actions"
        textValue={t('Action')}
        width="max-content"
      >
        <VisuallyHidden>{t('Action')}</VisuallyHidden>
      </Table.Column>
    </Table.Header>
  );
}

export function ClientsTable({
  clients,
  onClientAction,
}: Readonly<ClientsTableProps>) {
  const { t } = useTranslation('clients');

  return (
    <Table.Root
      aria-label={t('Clients')}
      boundary="strong"
      desktopColumns="mediaDetailsAction"
      layout="responsiveGrid"
    >
      <ClientsTableHeader />
      <Table.Body>
        {clients.map((client) => (
          <Table.Row
            className={clientTableRowClassName}
            data-testid={client.name}
            id={client.id}
            key={client.id}
            onAction={() => onClientAction(client.id)}
            textValue={t('{{client}} {{email}} {{telephone}}', {
              client: client.name,
              email: client.contact.email,
              telephone: client.contact.telephone,
            })}
          >
            <Table.Cell
              className={clientTableCellClassNames.avatar}
              column="avatar"
              textValue={client.name}
            >
              <Avatar
                initials={clientInitials(client.name)}
                name={client.name}
                shape="circle"
                size="sm"
                tone="primary"
              />
            </Table.Cell>
            <Table.Cell
              className={clientTableCellClassNames.client}
              column="client"
            >
              <Typography as="strong">{client.name}</Typography>
            </Table.Cell>
            <Table.Cell
              className={clientTableCellClassNames.email}
              column="email"
            >
              {client.contact.email}
            </Table.Cell>
            <Table.Cell
              className={clientTableCellClassNames.telephone}
              column="telephone"
            >
              {client.contact.telephone}
            </Table.Cell>
            <Table.Disclosure
              className={clientTableCellClassNames.actions}
              column="actions"
              position="flow"
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export function ClientsTableSkeleton() {
  const { t } = useTranslation(['clients', 'routing']);

  return (
    <section aria-label={t('Loading clients')} role="status">
      <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
      <div aria-hidden="true" inert>
        <Table.Root
          aria-label={t('Loading clients table')}
          boundary="strong"
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
          tabIndex={-1}
        >
          <ClientsTableHeader loading />
          <Table.Body>
            {Array.from({ length: 4 }, (_, index) => (
              <Table.Row
                className={clientTableRowClassName}
                id={`loading-client-${index}`}
                key={index}
                textValue={t('Loading client row {{count}}', {
                  count: index + 1,
                })}
              >
                <Table.Cell
                  className={clientTableCellClassNames.avatar}
                  column="avatar"
                >
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                </Table.Cell>
                <Table.Cell
                  className={clientTableCellClassNames.client}
                  column="client"
                >
                  <Skeleton className="h-4 w-3/4 max-w-44" />
                </Table.Cell>
                <Table.Cell
                  className={clientTableCellClassNames.email}
                  column="email"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={clientTableCellClassNames.telephone}
                  column="telephone"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={clientTableCellClassNames.actions}
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
