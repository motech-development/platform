import { useQuery } from '@apollo/client/react';
import {
  Avatar,
  Button,
  PageHeader,
  StatePanel,
  Table,
  Typography,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import {
  AddIcon,
  UsersIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { GET_CLIENTS } from '../../data/operations';
import { QueryRefreshAlert } from '../companies/QueryRefreshAlert';
import { companiesTableClassNames } from '../companies/tableLayout';
import { sortClientsByName } from './client';
import { ClientsTableSkeleton } from './ClientsTableSkeleton';

function clientInitials(name: string) {
  return name
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export function ClientsPageContent({
  companyId,
}: Readonly<{ companyId: string }>) {
  const { t } = useTranslation(['clients', 'routing']);
  const navigate = useNavigate();
  const { data, error, loading, refetch } = useQuery(GET_CLIENTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const clients = sortClientsByName(data?.getClients.items ?? []);
  const initiallyLoading = loading && !data;
  const hasQueryData = data?.getClients !== undefined;
  const fatalError = Boolean(error && !hasQueryData);
  const refreshError = Boolean(error && hasQueryData);
  const empty = !fatalError && !initiallyLoading && clients.length === 0;
  const addClient = () => {
    navigate({
      params: { companyId },
      to: '/my-companies/clients/$companyId/add-client',
    }).catch(() => undefined);
  };

  return (
    <div className="min-w-0">
      <PageHeader
        actions={
          clients.length && !initiallyLoading ? (
            <Button aria-label={t('Add a new client')} onAction={addClient}>
              <AddIcon />
              {t('Add client')}
            </Button>
          ) : undefined
        }
        description={t(
          'People and organisations linked to sales transactions.',
        )}
        title={t('Clients')}
      />
      {refreshError ? (
        <QueryRefreshAlert
          onRetry={() => {
            refetch().catch(() => undefined);
          }}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t(
            'Clients could not be refreshed. Check your connection, then try again.',
          )}
        </QueryRefreshAlert>
      ) : null}
      {fatalError ? (
        <StatePanel
          action={
            <Button
              onAction={() => {
                refetch().catch(() => undefined);
              }}
            >
              {t('Try again', { ns: 'routing' })}
            </Button>
          }
          description={t('Check your connection, then try again.', {
            ns: 'routing',
          })}
          icon={<WarningIcon />}
          title={t('We could not load clients')}
          variant="danger"
        />
      ) : null}
      {initiallyLoading ? <ClientsTableSkeleton /> : null}
      {clients.length ? (
        <Table.Root
          aria-label={t('Clients')}
          boundary="strong"
          className={companiesTableClassNames.root}
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
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
              {t('Client')}
            </Table.Column>
            <Table.Column id="email">{t('Email')}</Table.Column>
            <Table.Column id="telephone">{t('Telephone')}</Table.Column>
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
            {clients.map((client, index) => (
              <Table.Row
                className={companiesTableClassNames.row}
                data-testid={client.name}
                id={client.id}
                key={client.id}
                onAction={() => {
                  navigate({
                    params: { clientId: client.id, companyId },
                    to: '/my-companies/clients/$companyId/update-details/$clientId',
                  }).catch(() => undefined);
                }}
                textValue={t('{{client}} {{email}} {{telephone}}', {
                  client: client.name,
                  email: client.contact.email,
                  telephone: client.contact.telephone,
                })}
              >
                <Table.Cell
                  className={companiesTableClassNames.cells.avatar}
                  column="avatar"
                  textValue={client.name}
                >
                  <Avatar
                    initials={clientInitials(client.name)}
                    name={client.name}
                    shape="circle"
                    size="sm"
                    tone={index % 2 === 0 ? 'primary' : 'accent'}
                  />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.company}
                  column="client"
                >
                  <Typography as="strong">{client.name}</Typography>
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.number}
                  column="email"
                >
                  {client.contact.email}
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.contact}
                  column="telephone"
                >
                  {client.contact.telephone}
                </Table.Cell>
                <Table.Disclosure
                  className={companiesTableClassNames.cells.actions}
                  column="actions"
                  position="flow"
                />
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : null}
      {empty ? (
        <StatePanel
          action={
            <Button aria-label={t('Add a new client')} onAction={addClient}>
              {t('Add client')}
            </Button>
          }
          description={t('Add a client to use them on sales transactions.')}
          icon={<UsersIcon />}
          title={t('No clients yet')}
        />
      ) : null}
    </div>
  );
}
