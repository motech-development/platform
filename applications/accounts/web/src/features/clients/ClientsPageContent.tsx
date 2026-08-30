import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Button, StatePanel } from '@motech-development/breeze-ui';
import { UsersIcon } from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_CLIENTS } from '../../data/operations';
import { sortNamedEntities } from '../entity-details';
import { EntityCollectionPage } from '../EntityCollectionPage';
import { AddClientAction } from './AddClientAction';
import { ClientsTable, ClientsTableSkeleton } from './ClientsTable';

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
        <ClientsTable
          clients={clients}
          onClientAction={(clientId) => {
            navigate({
              params: { clientId, companyId },
              to: '/my-companies/clients/$companyId/update-details/$clientId',
            }).catch(() => undefined);
          }}
        />
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
