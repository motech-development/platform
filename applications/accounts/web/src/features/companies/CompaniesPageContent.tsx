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
  BuildingIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAccountsOwnerId } from '../../auth/owner';
import { GET_COMPANIES } from '../../data/operations';
import { CompaniesTableSkeleton } from '../loading/AccountsPageSkeletons';
import { sortCompaniesByName } from './company';
import { QueryRefreshAlert } from './QueryRefreshAlert';
import { companiesTableClassName } from './tableLayout';

export function CompaniesPageContent() {
  const { t } = useTranslation(['companies', 'routing']);
  const ownerId = useAccountsOwnerId();
  const navigate = useNavigate();
  const { data, error, loading, refetch } = useQuery(GET_COMPANIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { owner: ownerId },
  });
  const initiallyLoading = loading && !data;
  const hasQueryData = data?.getCompanies !== undefined;
  const fatalError = Boolean(error && !hasQueryData);
  const refreshError = Boolean(error && hasQueryData);
  const companies = sortCompaniesByName(data?.getCompanies.items ?? []);
  const empty = !fatalError && !initiallyLoading && companies.length === 0;
  const addCompany = () => {
    navigate({ to: '/my-companies/add-company' }).catch(() => undefined);
  };

  return (
    <div className="min-w-0">
      <PageHeader
        actions={
          empty || fatalError ? undefined : (
            <Button aria-label={t('Add a new company')} onAction={addCompany}>
              <AddIcon />
              {t('Add company')}
            </Button>
          )
        }
        description={t('Select a company or add another business.')}
        title={t('My companies')}
      />
      {refreshError ? (
        <QueryRefreshAlert
          onRetry={() => {
            refetch().catch(() => undefined);
          }}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t(
            'Companies could not be refreshed. Check your connection, then try again.',
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
          title={t('We could not load companies')}
          variant="danger"
        />
      ) : null}
      {initiallyLoading ? <CompaniesTableSkeleton /> : null}
      {companies.length ? (
        <Table.Root
          aria-label={t('Companies')}
          boundary="strong"
          className={companiesTableClassName}
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
        >
          <Table.Header>
            <Table.Column
              compactLabel={false}
              id="avatar"
              textValue={t('Company')}
            >
              <VisuallyHidden>{t('Company')}</VisuallyHidden>
            </Table.Column>
            <Table.Column compactLabel={false} id="company" rowHeader>
              {t('Company')}
            </Table.Column>
            <Table.Column id="number">{t('Company number')}</Table.Column>
            <Table.Column id="contact">{t('Contact')}</Table.Column>
            <Table.Column
              compactLabel={false}
              id="actions"
              textValue={t('Action')}
              width="1.25rem"
            >
              <VisuallyHidden>{t('Action')}</VisuallyHidden>
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {companies.map((company, index) => (
              <Table.Row
                data-testid={company.name}
                id={company.id}
                key={company.id}
                onAction={() => {
                  navigate({
                    params: { companyId: company.id },
                    to: '/my-companies/dashboard/$companyId',
                  }).catch(() => undefined);
                }}
                textValue={t(
                  '{{company}} Company number {{companyNumber}} {{email}}',
                  {
                    company: company.name,
                    companyNumber: company.companyNumber,
                    email: company.contact.email,
                  },
                )}
              >
                <Table.Cell column="avatar" textValue={company.name}>
                  <Avatar
                    initials={company.name[0]}
                    name={company.name}
                    shape="square"
                    size="sm"
                    tone={index % 2 === 0 ? 'primary' : 'accent'}
                  />
                </Table.Cell>
                <Table.Cell column="company">
                  <Typography as="strong">{company.name}</Typography>
                </Table.Cell>
                <Table.Cell column="number">{company.companyNumber}</Table.Cell>
                <Table.Cell column="contact">
                  {company.contact.email}
                </Table.Cell>
                <Table.Disclosure column="actions" position="flow" />
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : null}
      {empty ? (
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
      ) : null}
    </div>
  );
}
