import { CombinedGraphQLErrors } from '@apollo/client/errors';
import {
  Button,
  Drawer,
  LinkButton,
  PageHeader,
  Skeleton,
  StatePanel,
} from '@motech-development/breeze-ui';
import { ArrowLeftIcon } from '@motech-development/breeze-ui/icons';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticationPanel } from '../auth/AuthenticationPanel';
import { AddClientAction } from '../features/clients/AddClientAction';
import { ClientDetailsFormSkeleton } from '../features/clients/ClientDetailsFormSkeleton';
import { ClientsTableSkeleton } from '../features/clients/ClientsTableSkeleton';
import {
  CompaniesTableSkeleton,
  CompanyDetailsFormSkeleton,
  CompanyEnrolmentDrawerSkeleton,
  FormSkeletonRegion,
  LoadingSkeletonRegion,
  OverviewContentSkeleton,
  RecordTransactionDrawerSkeleton,
  SettingsFormSkeleton,
  TransactionEditDrawerSkeleton,
  TransactionsContentSkeleton,
} from '../features/loading/AccountsPageSkeletons';
import { TransactionLedgerSkeleton } from '../features/transactions/TransactionLedger';
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
          actions={
            companyId ? <AddClientAction companyId={companyId} /> : undefined
          }
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
                ? t('Details for a new client.')
                : t('Keep this client’s details up to date.')}
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

function TransactionsCollectionPending() {
  const { t } = useTranslation(['routing', 'transactions']);

  return (
    <div className="min-w-0">
      <PageHeader
        description={t(
          'Review money in and out, attachments, and approval status.',
        )}
        title={t('Transactions', { ns: 'transactions' })}
      />
      <TransactionsContentSkeleton />
    </div>
  );
}

type TransactionDrawerPendingView = Extract<
  AccountsPendingView,
  'record-transaction' | 'transaction-details'
>;

function TransactionDrawerPending({
  pathname,
  pendingView,
}: Readonly<{
  pathname: string;
  pendingView: TransactionDrawerPendingView;
}>) {
  const { t } = useTranslation(['routing', 'transactions']);
  const openedFromDashboard = pathname.includes('/my-companies/dashboard/');

  return (
    <>
      <div className="min-w-0">
        <PageHeader
          description={
            openedFromDashboard
              ? t('Your financial position and the work that needs attention.')
              : t('Review money in and out, attachments, and approval status.')
          }
          title={
            openedFromDashboard ? (
              <Skeleton
                as="span"
                className="block h-[2.8rem] w-64 max-w-full"
              />
            ) : (
              t('Transactions', { ns: 'transactions' })
            )
          }
        />
        {openedFromDashboard ? (
          <OverviewContentSkeleton />
        ) : (
          <TransactionsContentSkeleton />
        )}
      </div>
      {pendingView === 'record-transaction' ? (
        <RecordTransactionDrawerSkeleton />
      ) : (
        <TransactionEditDrawerSkeleton />
      )}
    </>
  );
}

type PendingTransactionsPendingView = Extract<
  AccountsPendingView,
  | 'pending-record-transaction'
  | 'pending-transaction-details'
  | 'pending-transactions'
>;

function PendingTransactionsPending({
  pathname,
  pendingView,
}: Readonly<{
  pathname: string;
  pendingView: PendingTransactionsPendingView;
}>) {
  const { t } = useTranslation('transactions');
  const companyId = /^\/my-companies\/accounts\/([^/]+)/u.exec(pathname)?.[1];
  const accountsHref = companyId
    ? `/my-companies/accounts/${encodeURIComponent(companyId)}`
    : '/my-companies';

  return (
    <>
      <div className="min-w-0">
        <PageHeader
          back={
            <LinkButton appearance="ghost" href={accountsHref}>
              <ArrowLeftIcon />
              {t('Back')}
            </LinkButton>
          }
          description={t(
            'Review transactions before they affect the confirmed balance.',
          )}
          title={t('Pending transactions')}
        />
        <LoadingSkeletonRegion loadingLabel={t('Loading Pending Transactions')}>
          <TransactionLedgerSkeleton pending />
        </LoadingSkeletonRegion>
      </div>
      {pendingView === 'pending-record-transaction' ? (
        <RecordTransactionDrawerSkeleton />
      ) : null}
      {pendingView === 'pending-transaction-details' ? (
        <TransactionEditDrawerSkeleton />
      ) : null}
    </>
  );
}

function DashboardPending() {
  const { t } = useTranslation('routing');

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

function CompaniesPending({ adding }: Readonly<{ adding: boolean }>) {
  const { t } = useTranslation('companies');
  const navigate = useNavigate();

  return (
    <>
      <div className="min-w-0">
        <PageHeader
          description={t('Select a company or add another business.')}
          title={t('My companies')}
        />
        <CompaniesTableSkeleton />
      </div>
      {adding ? (
        <CompanyEnrolmentDrawerSkeleton
          onClose={() => {
            navigate({ to: '/my-companies' }).catch(() => undefined);
          }}
        />
      ) : null}
    </>
  );
}

function CompanyDetailsPending() {
  const { t } = useTranslation('companies');

  return (
    <CompanyFormPending
      description={t(
        'Registered, contact, and bank details used across Accounts.',
      )}
      loadingLabel={t('Loading company details')}
      title={t('Company details')}
    >
      <CompanyDetailsFormSkeleton />
    </CompanyFormPending>
  );
}

function SettingsPending() {
  const { t } = useTranslation('companies');

  return (
    <CompanyFormPending
      description={t('VAT, financial year, and transaction category defaults.')}
      loadingLabel={t('Loading settings')}
      title={t('Settings')}
    >
      <SettingsFormSkeleton />
    </CompanyFormPending>
  );
}

export function AccountsPending() {
  const location = useLocation();
  const pendingView = accountsPendingView(location.pathname);

  switch (pendingView) {
    case 'add-client':
    case 'client-details':
    case 'clients':
      return (
        <ClientsPending
          pathname={location.pathname}
          pendingView={pendingView}
        />
      );
    case 'record-transaction':
    case 'transaction-details':
      return (
        <TransactionDrawerPending
          pathname={location.pathname}
          pendingView={pendingView}
        />
      );
    case 'transactions':
      return <TransactionsCollectionPending />;
    case 'pending-record-transaction':
    case 'pending-transaction-details':
    case 'pending-transactions':
      return (
        <PendingTransactionsPending
          pathname={location.pathname}
          pendingView={pendingView}
        />
      );
    case 'dashboard':
      return <DashboardPending />;
    case 'add-company':
      return <CompaniesPending adding />;
    case 'companies':
      return <CompaniesPending adding={false} />;
    case 'company-details':
      return <CompanyDetailsPending />;
    case 'settings':
      return <SettingsPending />;
    default:
      return <AuthenticationPanel loading />;
  }
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
