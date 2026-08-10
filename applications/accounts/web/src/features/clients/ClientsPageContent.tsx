import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  Avatar,
  Button,
  StatePanel,
  Table,
  Typography,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import { AddIcon, UsersIcon } from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { GET_CLIENTS } from '../../data/operations';
import { sortNamedEntities } from '../entity-details';
import { EntityCollectionPage } from '../EntityCollectionPage';
import { responsiveEntityTableClassNames } from '../tableLayout';
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
  const { data, error, fetchMore, loading, networkStatus, refetch } = useQuery(
    GET_CLIENTS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      variables: { id: companyId },
    },
  );
  const clients = sortNamedEntities(data?.getClients.items ?? []);
  const initiallyLoading = loading && !data;
  const hasQueryData = data?.getClients !== undefined;
  const fatalError = Boolean(error && !hasQueryData);
  const refreshError = Boolean(error && hasQueryData);
  const empty = !fatalError && !initiallyLoading && clients.length === 0;
  let collectionState: 'empty' | 'error' | 'loading' | 'populated' =
    'populated';
  if (fatalError) collectionState = 'error';
  else if (initiallyLoading) collectionState = 'loading';
  else if (empty) collectionState = 'empty';
  const addClient = () => {
    navigate({
      params: { companyId },
      to: '/my-companies/clients/$companyId/add-client',
    }).catch(() => undefined);
  };

  return (
    <EntityCollectionPage
      action={
        <Button aria-label={t('Add a new client')} onAction={addClient}>
          <AddIcon />
          {t('Add client')}
        </Button>
      }
      description={t('People and organisations linked to sales transactions.')}
      queryState={{
        errorDescription: t('Check your connection, then try again.', {
          ns: 'routing',
        }),
        errorTitle: t('We could not load clients'),
        onRetry: () => {
          refetch().catch(() => undefined);
        },
        refreshErrorDescription: refreshError
          ? t(
              'Clients could not be refreshed. Check your connection, then try again.',
            )
          : undefined,
        retryLabel: t('Try again', { ns: 'routing' }),
      }}
      state={collectionState}
      title={t('Clients')}
    >
      {collectionState === 'loading' && <ClientsTableSkeleton />}
      {collectionState === 'empty' && (
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
      )}
      {collectionState === 'populated' && (
        <div className="flex flex-col">
          <Table.Root
            aria-label={t('Clients')}
            boundary="strong"
            className={responsiveEntityTableClassNames.root}
            desktopColumns="mediaDetailsAction"
            layout="responsiveGrid"
          >
            <Table.Header className={responsiveEntityTableClassNames.header}>
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
            <Table.Body className={responsiveEntityTableClassNames.body}>
              {clients.map((client, index) => (
                <Table.Row
                  className={responsiveEntityTableClassNames.row}
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
                    className={responsiveEntityTableClassNames.cells.identity}
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
                    className={responsiveEntityTableClassNames.cells.primary}
                    column="client"
                  >
                    <Typography as="strong">{client.name}</Typography>
                  </Table.Cell>
                  <Table.Cell
                    className={responsiveEntityTableClassNames.cells.secondary}
                    column="email"
                  >
                    {client.contact.email}
                  </Table.Cell>
                  <Table.Cell
                    className={responsiveEntityTableClassNames.cells.tertiary}
                    column="telephone"
                  >
                    {client.contact.telephone}
                  </Table.Cell>
                  <Table.Disclosure
                    className={responsiveEntityTableClassNames.cells.actions}
                    column="actions"
                    position="flow"
                  />
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          {data?.getClients.nextToken ? (
            <Button
              appearance="text"
              className="mt-4 self-center"
              loading={networkStatus === NetworkStatus.fetchMore}
              onAction={() => {
                fetchMore({
                  updateQuery: (previous, { fetchMoreResult }) => {
                    const existingIds = new Set(
                      previous.getClients.items.map(({ id }) => id),
                    );

                    return {
                      getClients: {
                        ...fetchMoreResult.getClients,
                        items: [
                          ...previous.getClients.items,
                          ...fetchMoreResult.getClients.items.filter(
                            ({ id }) => !existingIds.has(id),
                          ),
                        ],
                      },
                    };
                  },
                  variables: { nextToken: data.getClients.nextToken },
                }).catch(() => undefined);
              }}
            >
              {t('Load more')}
            </Button>
          ) : null}
        </div>
      )}
    </EntityCollectionPage>
  );
}
