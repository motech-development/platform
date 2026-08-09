import {
  Drawer,
  FormSection,
  SectionHeader,
  Skeleton,
  Surface,
  Table,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { companiesTableClassNames } from '../companies/tableLayout';
import { FinancialSummarySkeleton } from '../transactions/FinancialSummary';
import { TransactionLedgerSkeleton } from '../transactions/TransactionLedger';

export function FormSkeletonRegion({
  children,
  loadingLabel,
}: Readonly<{ children: ReactNode; loadingLabel: string }>) {
  return (
    <section aria-busy="true" aria-label={loadingLabel} role="status">
      <VisuallyHidden>{loadingLabel}</VisuallyHidden>
      <div aria-hidden="true" inert>
        {children}
      </div>
    </section>
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
          className={companiesTableClassNames.root}
          desktopColumns="mediaDetailsAction"
          layout="responsiveGrid"
          tabIndex={-1}
        >
          <Table.Header className={companiesTableClassNames.header}>
            <Table.Column
              compactLabel={false}
              id="avatar"
              textValue={t('Company')}
            >
              <VisuallyHidden>{t('Company')}</VisuallyHidden>
            </Table.Column>
            <Table.Column compactLabel={false} id="company" rowHeader>
              <Skeleton className="h-4 w-3/4 max-w-44" />
            </Table.Column>
            <Table.Column compactLabel={false} id="number">
              <Skeleton className="h-4 w-4/5 max-w-64" />
            </Table.Column>
            <Table.Column compactLabel={false} id="contact">
              <Skeleton className="h-4 w-4/5 max-w-64" />
            </Table.Column>
            <Table.Column
              compactLabel={false}
              id="actions"
              textValue={t('Action')}
              width="1.25rem"
            >
              <VisuallyHidden>{t('Action')}</VisuallyHidden>
            </Table.Column>
          </Table.Header>
          <Table.Body className={companiesTableClassNames.body}>
            {[0, 1, 2].map((index) => (
              <Table.Row
                id={`loading-company-${index}`}
                className={companiesTableClassNames.row}
                key={index}
                textValue={t('Loading company row {{count}}', {
                  count: index + 1,
                })}
              >
                <Table.Cell
                  className={companiesTableClassNames.cells.avatar}
                  column="avatar"
                >
                  <Skeleton className="size-9 shrink-0 rounded-none" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.company}
                  column="company"
                >
                  <Skeleton className="h-4 w-3/4 max-w-44" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.number}
                  column="number"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.contact}
                  column="contact"
                >
                  <Skeleton className="h-4 w-3/4 max-w-64" />
                </Table.Cell>
                <Table.Cell
                  className={companiesTableClassNames.cells.actions}
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

function FieldSkeletons({ count }: Readonly<{ count: number }>) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className="h-17" key={index} />
      ))}
    </div>
  );
}

export function CompanyDetailsFormSkeleton({
  layout = 'split',
}: Readonly<{ layout?: 'split' | 'stacked' }>) {
  const { t } = useTranslation('companies');
  const headingLevel = layout === 'stacked' ? 3 : 2;
  const bankSection = (
    <FormSection
      description={t('Used to match transactions.')}
      divided
      headingLevel={headingLevel}
      layout={layout}
      title={t('Bank account')}
    >
      <FieldSkeletons count={2} />
    </FormSection>
  );

  return (
    <div className="grid min-w-0 gap-6">
      <FormSection
        description={t('The registered company identity.')}
        divided
        headingLevel={headingLevel}
        layout={layout}
        title={t(layout === 'stacked' ? 'Company details' : 'Identity')}
      >
        <FieldSkeletons count={2} />
      </FormSection>
      {layout === 'stacked' ? bankSection : null}
      <FormSection
        description={t('The registered company address.')}
        divided
        headingLevel={headingLevel}
        layout={layout}
        title={t('Address')}
      >
        <FieldSkeletons count={5} />
      </FormSection>
      <FormSection
        description={t('Primary company contact details.')}
        divided
        headingLevel={headingLevel}
        layout={layout}
        title={t('Contact details')}
      >
        <FieldSkeletons count={2} />
      </FormSection>
      {layout === 'split' ? bankSection : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {layout === 'split' ? <Skeleton className="h-11 w-36" /> : null}
        <div className="flex justify-end gap-3">
          {layout === 'stacked' ? <Skeleton className="h-11 w-24" /> : null}
          <Skeleton className="h-11 w-36" />
        </div>
      </div>
    </div>
  );
}

export function SettingsFormSkeleton() {
  const { t } = useTranslation('companies');

  return (
    <div className="grid min-w-0 gap-6">
      <FormSection
        action={<Skeleton className="h-11 w-36" />}
        description={t('Applied when purchases are recorded.')}
        divided
        title={t('Expense categories')}
      >
        <div className="grid gap-3">
          {[0, 1, 2].map((index) => (
            <div
              className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,13rem)_auto]"
              key={index}
            >
              <Skeleton className="h-17" />
              <Skeleton className="h-17" />
              <Skeleton className="size-11 self-end" />
            </div>
          ))}
        </div>
      </FormSection>
      <FormSection
        description={t('Used when creating annual reports.')}
        divided
        title={t('Financial year end')}
      >
        <FieldSkeletons count={2} />
      </FormSection>
      <FormSection
        description={t('Rates applied to sales and purchases.')}
        divided
        title={t('VAT settings')}
      >
        <div className="grid gap-5">
          <Skeleton className="h-17" />
          <FieldSkeletons count={3} />
        </div>
      </FormSection>
      <div className="flex justify-end">
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}

export function CompanyEnrolmentDrawerSkeleton() {
  const { t } = useTranslation(['companies', 'routing']);

  return (
    <Drawer.Root onOpenChange={() => undefined} open triggerless>
      <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
        <Drawer.Description>
          {t('Step {{step}} of 2', { ns: 'companies', step: 1 })}
        </Drawer.Description>
        <Drawer.Title>{t('Add company', { ns: 'companies' })}</Drawer.Title>
        <section
          aria-busy="true"
          aria-label={t('Loading company details', { ns: 'companies' })}
          role="status"
        >
          <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
          <div aria-hidden="true" inert>
            <CompanyDetailsFormSkeleton layout="stacked" />
          </div>
        </section>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export function OverviewContentSkeleton() {
  const { t } = useTranslation(['overview', 'routing']);

  return (
    <section aria-label={t('Loading your overview')} role="status">
      <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
      <div
        className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)]"
        aria-hidden="true"
        inert
      >
        <div className="flex min-w-0 flex-col gap-8">
          <FinancialSummarySkeleton fullWidth />
          <Surface className="min-w-0" padding="none">
            <SectionHeader
              description={
                <Skeleton as="span" className="block h-4 w-64 max-w-full" />
              }
              title={<Skeleton as="span" className="block h-5 w-44" />}
            />
            <TransactionLedgerSkeleton compact rows={4} />
          </Surface>
        </div>
        <aside className="self-start bg-[var(--breeze-shell)] text-[var(--breeze-ink-inverse)]">
          <div className="flex items-start gap-4 px-5 pb-4 pt-5">
            <Skeleton className="size-10 shrink-0" tone="inverse" />
            <div className="grid gap-1">
              <Skeleton className="h-5 w-32" tone="inverse" />
              <Skeleton className="mt-2 h-4 w-52 max-w-full" tone="inverse" />
            </div>
          </div>
          <div className="grid gap-1 border-t border-[var(--breeze-shell-soft)] px-5 py-4">
            <Skeleton className="h-10 w-full" tone="inverse" />
          </div>
        </aside>
      </div>
    </section>
  );
}

export function TransactionsContentSkeleton() {
  const { t } = useTranslation(['transactions', 'routing']);

  return (
    <section aria-label={t('Loading transactions')} role="status">
      <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
      <div className="flex flex-col gap-8">
        <FinancialSummarySkeleton />
        <TransactionLedgerSkeleton grouped />
      </div>
    </section>
  );
}

export function RecordTransactionDrawerSkeleton() {
  const { t } = useTranslation(['transactions', 'routing']);

  return (
    <Drawer.Root onOpenChange={() => undefined} open triggerless>
      <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
        <Drawer.Description>{t('Record a confirmed sale.')}</Drawer.Description>
        <Drawer.Title>{t('Record transaction')}</Drawer.Title>
        <section aria-label={t('Loading transaction form')} role="status">
          <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
          <div aria-hidden="true" className="grid gap-7" inert>
            <FormSection
              description={t(
                'Identify who the transaction is with and when it occurred.',
              )}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Transaction details')}
            >
              <div className="grid gap-5">
                <Skeleton className="h-17" />
                <Skeleton className="h-17" />
                <Skeleton className="h-17" />
              </div>
            </FormSection>
            <FormSection
              description={t('Enter the confirmed sale amount and VAT.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Status and totals')}
            >
              <div className="grid gap-5">
                <Skeleton className="h-17" />
                <Skeleton className="h-17" />
              </div>
            </FormSection>
            <FormSection
              description={t('Attach an invoice to this transaction.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Invoice')}
            >
              <Skeleton className="h-32" />
            </FormSection>
            <div className="flex justify-end gap-3">
              <Skeleton className="h-11 w-20" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>
        </section>
      </Drawer.Content>
    </Drawer.Root>
  );
}
