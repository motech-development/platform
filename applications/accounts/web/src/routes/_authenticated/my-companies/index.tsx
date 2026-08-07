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
import { BuildingIcon, WarningIcon } from '@motech-development/breeze-ui/icons';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAccountsOwnerId } from '../../../auth/owner';
import { primeCompanies } from '../../../data/loaders';
import { GET_COMPANIES } from '../../../data/operations';
import { companiesTableClassName } from '../../../features/companies/tableLayout';
import { CompaniesTableSkeleton } from '../../../features/loading/AccountsPageSkeletons';
import { AccountsPending } from '../../-RouteState';

function CompaniesPage() {
  const { t } = useTranslation(['companies', 'routing']);
  const ownerId = useAccountsOwnerId();
  const navigate = useNavigate();
  const { data, error, loading, refetch } = useQuery(GET_COMPANIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { owner: ownerId },
  });
  const initiallyLoading = loading && !data;

  return (
    <div className="min-w-0">
      <PageHeader
        description={t('Select the company you want to work in.')}
        title={t('My companies')}
      />
      {error ? (
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
      {data?.getCompanies.items.length ? (
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
            {data.getCompanies.items.map((company, index) => (
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
      {!initiallyLoading && data?.getCompanies.items.length === 0 ? (
        <StatePanel
          description={t('No company records are available for this account.')}
          icon={<BuildingIcon />}
          title={t('No companies available')}
        />
      ) : null}
    </div>
  );
}

export const Route = createFileRoute('/_authenticated/my-companies/')({
  component: CompaniesPage,
  loader: ({ context }) => primeCompanies(context),
  pendingComponent: AccountsPending,
});
