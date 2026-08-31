import {
  Drawer,
  FormSection,
  SectionHeader,
  Skeleton,
  Surface,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { expenseCategoryRowClassName } from '../companies/expense-category-layout';
import { LoadingSkeletonRegion } from '../LoadingSkeletonRegion';
import { FinancialSummarySkeleton } from '../transactions/FinancialSummary';
import { TransactionLedgerSkeleton } from '../transactions/TransactionLedger';

export const FormSkeletonRegion = LoadingSkeletonRegion;

export function FormFieldSkeletons({ count }: Readonly<{ count: number }>) {
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
      <FormFieldSkeletons count={2} />
    </FormSection>
  );

  return (
    <div className="grid min-w-0 gap-6">
      <FormSection
        description={t('The registered company identity.')}
        divided
        headingLevel={headingLevel}
        layout={layout}
        title={t('Company details')}
      >
        <FormFieldSkeletons count={2} />
      </FormSection>
      {layout === 'stacked' ? bankSection : null}
      <FormSection
        description={t('The registered company address.')}
        divided
        headingLevel={headingLevel}
        layout={layout}
        title={t('Address')}
      >
        <FormFieldSkeletons count={5} />
      </FormSection>
      <FormSection
        description={t('Primary company contact details.')}
        divided
        headingLevel={headingLevel}
        layout={layout}
        title={t('Contact details')}
      >
        <FormFieldSkeletons count={2} />
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
            <div className={expenseCategoryRowClassName} key={index}>
              <Skeleton className="h-11" />
              <Skeleton className="h-11" />
              <Skeleton className="size-11" />
            </div>
          ))}
        </div>
      </FormSection>
      <FormSection
        description={t('Used when creating annual reports.')}
        divided
        title={t('Financial year end')}
      >
        <FormFieldSkeletons count={2} />
      </FormSection>
      <FormSection
        description={t('Rates applied to sales and purchases.')}
        divided
        title={t('VAT settings')}
      >
        <div className="grid gap-5">
          <Skeleton className="h-17" />
          <FormFieldSkeletons count={3} />
        </div>
      </FormSection>
      <div className="flex justify-end">
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}

export function CompanyEnrolmentDrawerSkeleton({
  onClose,
}: Readonly<{ onClose: () => void }>) {
  const { t } = useTranslation(['companies', 'routing']);

  return (
    <Drawer.Root
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open
      triggerless
    >
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

function TransactionDrawerSkeleton({
  description,
  editing = false,
  onOpenChange = () => undefined,
  title,
}: Readonly<{
  description: string;
  editing?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
}>) {
  const { t } = useTranslation(['transactions', 'routing']);

  return (
    <Drawer.Root onOpenChange={onOpenChange} open triggerless>
      <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
        <Drawer.Description>{description}</Drawer.Description>
        <Drawer.Title>{title}</Drawer.Title>
        <section aria-label={t('Loading transaction form')} role="status">
          <VisuallyHidden>{t('Loading', { ns: 'routing' })}</VisuallyHidden>
          <div aria-hidden="true" className="grid gap-7" inert>
            <FormSection
              description={t(
                editing
                  ? 'Transaction type cannot be changed after creation.'
                  : 'Identify who the transaction is with and when it occurred.',
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
              description={t('Status determines when the balance is updated.')}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Transaction amount')}
            >
              <div className="grid gap-5">
                <Skeleton className="h-17" />
                <Skeleton className="h-17" />
              </div>
            </FormSection>
            <FormSection
              description={t(
                editing
                  ? 'View, replace, or delete the attached file.'
                  : 'Attach an invoice or receipt to this transaction.',
              )}
              divided
              headingLevel={3}
              layout="stacked"
              title={t('Invoice or receipt')}
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

export function RecordTransactionDrawerSkeleton({
  onOpenChange,
}: Readonly<{ onOpenChange?: (open: boolean) => void }>) {
  const { t } = useTranslation('transactions');

  return (
    <TransactionDrawerSkeleton
      description={t('Add money coming in or going out.')}
      onOpenChange={onOpenChange}
      title={t('Record transaction')}
    />
  );
}

export function TransactionEditDrawerSkeleton({
  onOpenChange,
}: Readonly<{ onOpenChange?: (open: boolean) => void }>) {
  const { t } = useTranslation('transactions');

  return (
    <TransactionDrawerSkeleton
      description={t('Update the transaction and its attachment.')}
      editing
      onOpenChange={onOpenChange}
      title={t('Edit transaction')}
    />
  );
}
