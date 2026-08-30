import { useQuery } from '@apollo/client/react';
import { Button, StatePanel } from '@motech-development/breeze-ui';
import { AddIcon, BuildingIcon } from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAccountsOwnerId } from '../../auth/owner';
import { GET_COMPANIES } from '../../data/operations';
import { sortNamedEntities } from '../entity-details';
import { EntityCollectionPage } from '../EntityCollectionPage';
import { CompaniesTable, CompaniesTableSkeleton } from './CompaniesTable';

export function CompaniesPageContent() {
  const { t } = useTranslation(['companies', 'routing']);
  const ownerId = useAccountsOwnerId();
  const navigate = useNavigate();
  const { data, error, loading, refetch } = useQuery(GET_COMPANIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { owner: ownerId },
  });
  const hasQueryData = data?.getCompanies !== undefined;
  const companies = sortNamedEntities(data?.getCompanies.items ?? []);
  const addCompany = () => {
    navigate({ to: '/my-companies/add-company' }).catch(() => undefined);
  };

  return (
    <EntityCollectionPage
      action={
        <Button aria-label={t('Add a new company')} onAction={addCompany}>
          <AddIcon />
          {t('Add company')}
        </Button>
      }
      description={t('Select a company or add another business.')}
      empty={companies.length === 0}
      emptyState={
        <StatePanel
          action={
            <Button aria-label={t('Add a new company')} onAction={addCompany}>
              {t('Add company')}
            </Button>
          }
          description={t('Add your first company to start using Accounts.')}
          icon={<BuildingIcon />}
          title={t('No companies yet')}
        />
      }
      hasData={hasQueryData}
      loading={loading}
      loadingState={<CompaniesTableSkeleton />}
      queryState={{
        error,
        errorDescription: t('Check your connection, then try again.', {
          ns: 'routing',
        }),
        errorTitle: t('We could not load companies'),
        onRetry: () => {
          refetch().catch(() => undefined);
        },
        refreshErrorDescription: t(
          'Companies could not be refreshed. Check your connection, then try again.',
        ),
        retryLabel: t('Try again', { ns: 'routing' }),
      }}
      title={t('My companies')}
    >
      <CompaniesTable
        companies={companies}
        onCompanyAction={(companyId) => {
          navigate({
            params: { companyId },
            to: '/my-companies/dashboard/$companyId',
          }).catch(() => undefined);
        }}
      />
    </EntityCollectionPage>
  );
}
