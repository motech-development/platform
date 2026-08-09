import { CombinedGraphQLErrors } from '@apollo/client/errors';
import {
  Button,
  LinkButton,
  PageHeader,
  Skeleton,
  StatePanel,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticationPanel } from '../auth/AuthenticationPanel';
import {
  CompaniesTableSkeleton,
  CompanyDetailsFormSkeleton,
  CompanyEnrolmentDrawerSkeleton,
  OverviewContentSkeleton,
  RecordTransactionDrawerSkeleton,
  SettingsFormSkeleton,
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

  if (pendingView === 'add-company' || pendingView === 'companies') {
    return (
      <>
        <div className="min-w-0">
          <PageHeader
            actions={<Skeleton className="h-11 w-36" />}
            description={t('Select a company or add another business.', {
              ns: 'companies',
            })}
            title={t('My companies', { ns: 'companies' })}
          />
          <CompaniesTableSkeleton />
        </div>
        {pendingView === 'add-company' ? (
          <CompanyEnrolmentDrawerSkeleton />
        ) : null}
      </>
    );
  }

  if (pendingView === 'company-details') {
    return (
      <div className="min-w-0">
        <PageHeader
          description={t(
            'Registered, contact, and bank details used across Accounts.',
            { ns: 'companies' },
          )}
          title={t('Company details', { ns: 'companies' })}
        />
        <section
          aria-busy="true"
          aria-label={t('Loading company details', { ns: 'companies' })}
          role="status"
        >
          <VisuallyHidden>
            {t('Loading company details', { ns: 'companies' })}
          </VisuallyHidden>
          <div aria-hidden="true" inert>
            <CompanyDetailsFormSkeleton />
          </div>
        </section>
      </div>
    );
  }

  if (pendingView === 'settings') {
    return (
      <div className="min-w-0">
        <PageHeader
          description={t(
            'VAT, financial year, and transaction category defaults.',
            { ns: 'companies' },
          )}
          title={t('Settings', { ns: 'companies' })}
        />
        <section
          aria-busy="true"
          aria-label={t('Loading settings', { ns: 'companies' })}
          role="status"
        >
          <VisuallyHidden>
            {t('Loading settings', { ns: 'companies' })}
          </VisuallyHidden>
          <div aria-hidden="true" inert>
            <SettingsFormSkeleton />
          </div>
        </section>
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
