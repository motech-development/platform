import { CombinedGraphQLErrors } from '@apollo/client/errors';
import {
  Button,
  LinkButton,
  PageHeader,
  Skeleton,
  StatePanel,
} from '@motech-development/breeze-ui';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticationPanel } from '../auth/AuthenticationPanel';
import {
  CompaniesTableSkeleton,
  OverviewContentSkeleton,
  RecordTransactionDrawerSkeleton,
  TransactionsContentSkeleton,
} from '../features/loading/AccountsPageSkeletons';
import { captureRouteFailure } from '../observability';
import { accountsPendingView } from './-route-state';

export function AccountsPending() {
  const { t } = useTranslation(['routing', 'companies', 'shell']);
  const location = useLocation();
  const pendingView = accountsPendingView(location.pathname);

  if (pendingView === 'record-transaction') {
    const openedFromDashboard = location.pathname.includes(
      '/my-companies/dashboard/',
    );

    return (
      <>
        <div className="min-w-0">
          <PageHeader
            actions={<Skeleton className="h-11 w-40" />}
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
          actions={<Skeleton className="h-11 w-40" />}
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
          actions={<Skeleton className="h-11 w-40" />}
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

  if (pendingView === 'companies') {
    return (
      <div className="min-w-0">
        <PageHeader
          description={t('Select the company you want to work in.', {
            ns: 'companies',
          })}
          title={t('My companies', { ns: 'companies' })}
        />
        <CompaniesTableSkeleton />
      </div>
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
