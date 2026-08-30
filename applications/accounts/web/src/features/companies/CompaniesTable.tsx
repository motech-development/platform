import {
  Avatar,
  Skeleton,
  Table,
  Typography,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';

interface CompanyTableItem {
  companyNumber: string;
  contact: { email: string };
  id: string;
  name: string;
}

export interface CompaniesTableProps {
  companies: readonly CompanyTableItem[];
  onCompanyAction: (companyId: string) => void;
}

const companyTableRowClassName =
  'max-sm:grid! max-sm:grid-cols-[2.25rem_minmax(0,1fr)_max-content] max-sm:items-center! max-sm:gap-x-3! max-sm:gap-y-2!';

const companyTableCellClassNames = {
  actions:
    'max-sm:col-start-3! max-sm:row-start-1 max-sm:flex! max-sm:justify-end',
  avatar: 'max-sm:col-start-1! max-sm:row-start-1 max-sm:flex!',
  company: 'max-sm:col-start-2! max-sm:row-start-1 max-sm:flex!',
  contact:
    'max-sm:col-span-3! max-sm:row-start-3 max-sm:block! max-sm:before:inline-block!',
  number:
    'max-sm:col-span-3! max-sm:row-start-2 max-sm:block! max-sm:before:inline-block!',
} as const;

function CompaniesTableHeader({
  loading = false,
}: Readonly<{ loading?: boolean }>) {
  const { t } = useTranslation('companies');

  return (
    <Table.Header>
      <Table.Column compactLabel={false} id="avatar" textValue={t('Company')}>
        <VisuallyHidden>{t('Company')}</VisuallyHidden>
      </Table.Column>
      <Table.Column compactLabel={false} id="company" rowHeader>
        {loading ? <Skeleton className="h-4 w-3/4 max-w-44" /> : t('Company')}
      </Table.Column>
      <Table.Column compactLabel={!loading} id="number">
        {loading ? (
          <Skeleton className="h-4 w-4/5 max-w-64" />
        ) : (
          t('Company number')
        )}
      </Table.Column>
      <Table.Column compactLabel={!loading} id="contact">
        {loading ? <Skeleton className="h-4 w-4/5 max-w-64" /> : t('Contact')}
      </Table.Column>
      <Table.Column
        compactLabel={false}
        id="actions"
        textValue={t('Action')}
        width="max-content"
      >
        <VisuallyHidden>{t('Action')}</VisuallyHidden>
      </Table.Column>
    </Table.Header>
  );
}

export function CompaniesTable({
  companies,
  onCompanyAction,
}: Readonly<CompaniesTableProps>) {
  const { t } = useTranslation('companies');

  return (
    <Table.Root
      aria-label={t('Companies')}
      boundary="strong"
      desktopColumns="mediaDetailsAction"
      layout="responsiveGrid"
    >
      <CompaniesTableHeader />
      <Table.Body>
        {companies.map((company, index) => (
          <Table.Row
            className={companyTableRowClassName}
            data-testid={company.name}
            id={company.id}
            key={company.id}
            onAction={() => onCompanyAction(company.id)}
            textValue={t(
              '{{company}} Company number {{companyNumber}} {{email}}',
              {
                company: company.name,
                companyNumber: company.companyNumber,
                email: company.contact.email,
              },
            )}
          >
            <Table.Cell
              className={companyTableCellClassNames.avatar}
              column="avatar"
              textValue={company.name}
            >
              <Avatar
                initials={company.name[0]}
                name={company.name}
                shape="square"
                size="sm"
                tone={index % 2 === 0 ? 'primary' : 'accent'}
              />
            </Table.Cell>
            <Table.Cell
              className={companyTableCellClassNames.company}
              column="company"
            >
              <Typography as="strong">{company.name}</Typography>
            </Table.Cell>
            <Table.Cell
              className={companyTableCellClassNames.number}
              column="number"
            >
              {company.companyNumber}
            </Table.Cell>
            <Table.Cell
              className={companyTableCellClassNames.contact}
              column="contact"
            >
              {company.contact.email}
            </Table.Cell>
            <Table.Disclosure
              className={companyTableCellClassNames.actions}
              column="actions"
              position="flow"
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export function CompaniesTableSkeleton() {
  const { t } = useTranslation(['companies', 'routing']);

  return (
    <section aria-label={t('Loading companies')} role="status">
      <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
      <div aria-hidden="true" inert>
        <Table.Root
          aria-label={t('Loading companies table')}
          boundary="strong"
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
          tabIndex={-1}
        >
          <CompaniesTableHeader loading />
          <Table.Body>
            {Array.from({ length: 3 }, (_, index) => (
              <Table.Row
                className={companyTableRowClassName}
                id={`loading-company-${index}`}
                key={index}
                textValue={t('Loading company row {{count}}', {
                  count: index + 1,
                })}
              >
                <Table.Cell
                  className={companyTableCellClassNames.avatar}
                  column="avatar"
                >
                  <Skeleton className="size-9 shrink-0 rounded-none" />
                </Table.Cell>
                <Table.Cell
                  className={companyTableCellClassNames.company}
                  column="company"
                >
                  <Skeleton className="h-4 w-3/4 max-w-44" />
                </Table.Cell>
                <Table.Cell
                  className={companyTableCellClassNames.number}
                  column="number"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={companyTableCellClassNames.contact}
                  column="contact"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={companyTableCellClassNames.actions}
                  column="actions"
                >
                  <Skeleton className="h-4 w-3" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </section>
  );
}
