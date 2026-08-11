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
import { UsersIcon } from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_CLIENTS } from '../../data/operations';
import { sortNamedEntities } from '../entity-details';
import { EntityCollectionPage } from '../EntityCollectionPage';
import { responsiveEntityTableClassNames } from '../tableLayout';
import { AddClientAction } from './AddClientAction';
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
  const hasQueryData = data?.getClients !== undefined;
  const page = data?.getClients;
  const loadedPageCount = page?.clientLoadedPageCount ?? 1;
  const requestedPageCount = page?.clientRequestedPageCount ?? 1;
  const refreshGeneration = page?.clientRefreshGeneration ?? 0;
  const nextToken = page?.nextToken;
  const reconciliationAttempts = useRef({
    generation: refreshGeneration,
    tokens: new Set<string>(),
  });

  useEffect(() => {
    if (
      !nextToken ||
      loadedPageCount >= requestedPageCount ||
      networkStatus === NetworkStatus.fetchMore
    ) {
      return;
    }

    if (reconciliationAttempts.current.generation !== refreshGeneration) {
      reconciliationAttempts.current = {
        generation: refreshGeneration,
        tokens: new Set<string>(),
      };
    }

    const attempts = reconciliationAttempts.current.tokens;
    if (attempts.has(nextToken)) return;
    attempts.add(nextToken);
    fetchMore({ variables: { nextToken } }).catch(() => undefined);
  }, [
    fetchMore,
    loadedPageCount,
    networkStatus,
    nextToken,
    refreshGeneration,
    requestedPageCount,
  ]);

  return (
    <EntityCollectionPage
      action={<AddClientAction companyId={companyId} />}
      description={t('People and organisations linked to sales transactions.')}
      empty={clients.length === 0}
      emptyState={
        <StatePanel
          action={<AddClientAction companyId={companyId} icon={false} />}
          description={t('Add a client to use them on sales transactions.')}
          icon={<UsersIcon />}
          title={t('No clients yet')}
        />
      }
      hasData={hasQueryData}
      loading={loading}
      loadingState={<ClientsTableSkeleton />}
      queryState={{
        error,
        errorDescription: t('Check your connection, then try again.', {
          ns: 'routing',
        }),
        errorTitle: t('We could not load clients'),
        onRetry: () => {
          refetch().catch(() => undefined);
        },
        refreshErrorDescription: t(
          'Clients could not be refreshed. Check your connection, then try again.',
        ),
        retryLabel: t('Try again', { ns: 'routing' }),
      }}
      title={t('Clients')}
    >
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
            {clients.map((client) => (
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
                    tone="primary"
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
                variables: { nextToken: data.getClients.nextToken },
              }).catch(() => undefined);
            }}
          >
            {t('Load more')}
          </Button>
        ) : null}
      </div>
    </EntityCollectionPage>
  );
}
