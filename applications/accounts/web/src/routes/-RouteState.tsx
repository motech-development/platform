import { CombinedGraphQLErrors } from '@apollo/client/errors';
import {
  Button,
  Drawer,
  LinkButton,
  PageHeader,
  Skeleton,
  StatePanel,
} from '@motech-development/breeze-ui';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticationPanel } from '../auth/AuthenticationPanel';
import { ClientDetailsFormSkeleton } from '../features/clients/ClientDetailsFormSkeleton';
import { ClientsTableSkeleton } from '../features/clients/ClientsTableSkeleton';
import {
  CompaniesTableSkeleton,
  CompanyDetailsFormSkeleton,
  CompanyEnrolmentDrawerSkeleton,
  FormSkeletonRegion,
  OverviewContentSkeleton,
  RecordTransactionDrawerSkeleton,
  SettingsFormSkeleton,
  TransactionsContentSkeleton,
} from '../features/loading/AccountsPageSkeletons';
import { captureRouteFailure } from '../observability';
import { type AccountsPendingView, accountsPendingView } from './-route-state';

function CompanyFormPending({
  children,
  description,
  loadingLabel,
  title,
}: Readonly<{
  children: ReactNode;
  description: string;
  loadingLabel: string;
  title: string;
}>) {
  return (
    <div className="min-w-0">
      <PageHeader description={description} title={title} />
      <FormSkeletonRegion loadingLabel={loadingLabel}>
        {children}
      </FormSkeletonRegion>
    </div>
  );
}

type ClientPendingView = Extract<
  AccountsPendingView,
  'add-client' | 'client-details' | 'clients'
>;

function ClientsPending({
  pathname,
  pendingView,
}: Readonly<{ pathname: string; pendingView: ClientPendingView }>) {
  const { t } = useTranslation('clients');
  const navigate = useNavigate();
  const companyId = /^\/my-companies\/clients\/([^/]+)/u.exec(pathname)?.[1];
  const addingClient = pendingView === 'add-client';

  return (
    <>
      <div className="min-w-0">
        <PageHeader
          description={t(
            'People and organisations linked to sales transactions.',
          )}
          title={t('Clients')}
        />
        <ClientsTableSkeleton />
      </div>
      {pendingView !== 'clients' ? (
        <Drawer.Root
          onOpenChange={(open) => {
            if (!open && companyId) {
              navigate({
                params: { companyId },
                to: '/my-companies/clients/$companyId',
              }).catch(() => undefined);
            }
          }}
          open
          triggerless
        >
          <Drawer.Content
            placement={{ base: 'bottom', md: 'end' }}
            size="medium"
          >
            <Drawer.Description>
              {addingClient
                ? t('Create a client for sales transactions.')
                : t('Update this client or remove them.')}
            </Drawer.Description>
            <Drawer.Title>
              {addingClient ? t('Add client') : t('Edit client')}
            </Drawer.Title>
            <FormSkeletonRegion loadingLabel={t('Loading client details')}>
              <ClientDetailsFormSkeleton
                danger={pendingView === 'client-details'}
              />
            </FormSkeletonRegion>
          </Drawer.Content>
        </Drawer.Root>
      ) : null}
    </>
  );
}

export function AccountsPending() {
  const { t } = useTranslation(['routing', 'companies', 'shell']);
  const location = useLocation();
  const navigate = useNavigate();
  const pendingView = accountsPendingView(location.pathname);

  if (
    pendingView === 'clients' ||
    pendingView === 'add-client' ||
    pendingView === 'client-details'
  ) {
    return (
      <ClientsPending pathname={location.pathname} pendingView={pendingView} />
    );
  }

  if (pendingView === 'record-transaction') {
    const openedFromDashboard = location.pathname.includes(
      '/my-companies/dashboard/',
    );

    return (
      <>
        <div className="min-w-0">
          <PageHeader
            description={
              openedFromDashboard
                ? t(
                    'Your financial position and the work that needs attention.',
                  )
                : t(
                    'Review money in and out, attachments, and approval status.',
                  )
            }
            title={
              openedFromDashboard ? (
                <Skeleton
                  as="span"
                  className="block h-[2.8rem] w-64 max-w-full"
                />
              ) : (
                t('Accounts', { ns: 'shell' })
              )
            }
          />
          {openedFromDashboard ? (
            <OverviewContentSkeleton />
          ) : (
            <TransactionsContentSkeleton />
          )}
        </div>
        <RecordTransactionDrawerSkeleton />
      </>
    );
  }

  if (pendingView === 'transactions') {
    return (
      <div className="min-w-0">
        <PageHeader
          description={t(
            'Review money in and out, attachments, and approval status.',
          )}
          title={t('Accounts', { ns: 'shell' })}
        />
        <TransactionsContentSkeleton />
      </div>
    );
  }

  if (pendingView === 'dashboard') {
    return (
      <div className="min-w-0">
        <PageHeader
          description={t(
            'Your financial position and the work that needs attention.',
          )}
          title={
            <Skeleton as="span" className="block h-[2.8rem] w-64 max-w-full" />
          }
        />
        <OverviewContentSkeleton />
      </div>
    );
  }

  if (pendingView === 'add-company' || pendingView === 'companies') {
    return (
      <>
        <div className="min-w-0">
          <PageHeader
            description={t('Select a company or add another business.', {
              ns: 'companies',
            })}
            title={t('My companies', { ns: 'companies' })}
          />
          <CompaniesTableSkeleton />
        </div>
        {pendingView === 'add-company' ? (
          <CompanyEnrolmentDrawerSkeleton
            onClose={() => {
              navigate({ to: '/my-companies' }).catch(() => undefined);
            }}
          />
        ) : null}
      </>
    );
  }

  if (pendingView === 'company-details') {
    return (
      <CompanyFormPending
        description={t(
          'Registered, contact, and bank details used across Accounts.',
          { ns: 'companies' },
        )}
        loadingLabel={t('Loading company details', { ns: 'companies' })}
        title={t('Company details', { ns: 'companies' })}
      >
        <CompanyDetailsFormSkeleton />
      </CompanyFormPending>
    );
  }

  if (pendingView === 'settings') {
    return (
      <CompanyFormPending
        description={t(
          'VAT, financial year, and transaction category defaults.',
          { ns: 'companies' },
        )}
        loadingLabel={t('Loading settings', { ns: 'companies' })}
        title={t('Settings', { ns: 'companies' })}
      >
        <SettingsFormSkeleton />
      </CompanyFormPending>
    );
  }

  return <AuthenticationPanel loading />;
}

export const RoutePending = AccountsPending;

export function RouteError({ error, reset }: Readonly<ErrorComponentProps>) {
  const { t } = useTranslation('routing');

  useEffect(() => {
    if (!CombinedGraphQLErrors.is(error)) {
      captureRouteFailure(error);
    }
  }, [error]);

  return (
    <StatePanel
      action={<Button onAction={reset}>{t('Try again')}</Button>}
      description={t(
        'The requested Accounts screen could not be loaded. Your saved accounting data has not changed.',
      )}
      icon={<span aria-hidden="true">!</span>}
      title={t('Something went wrong')}
      variant="danger"
    />
  );
}

export function RouteNotFound() {
  const { t } = useTranslation(['routing', 'shell']);

  return (
    <StatePanel
      action={
        <LinkButton href="/my-companies">
          {t('Manage companies', { ns: 'shell' })}
        </LinkButton>
      }
      description={t(
        'This Accounts address does not match an available company screen.',
      )}
      icon={<span aria-hidden="true">?</span>}
      title={t('Page not found')}
    />
  );
}

export function PublicRouteNotFound() {
  return (
    <main className="min-h-dvh p-6 sm:p-12">
      <RouteNotFound />
    </main>
  );
}
