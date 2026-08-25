import {
  IconTile,
  Inline,
  Skeleton,
  Stack,
  StatePanel,
  Table,
  Tooltip,
  Typography,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import Decimal from 'decimal.js';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../formatting/currency';
import { compactTableOnlyClassName } from '../tableLayout';

export interface LedgerTransaction {
  amount: number;
  attachment?: string | null;
  category: string;
  date: string;
  description: string;
  id: string;
  name: string;
  scheduled?: boolean;
  status?: 'confirmed' | 'pending';
}

const compactTransactionColumnsClassName =
  'grid-cols-[minmax(0,1fr)_auto_2.25rem]';

const compactTransactionTableClassName = `${compactTransactionColumnsClassName} sm:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)_2.75rem]`;

const groupedTransactionTableClassName = `${compactTransactionColumnsClassName} sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_auto_2.75rem] lg:grid-cols-[minmax(0,1.8fr)_minmax(0,0.8fr)_auto_2.75rem]`;

const transactionDataRowClassName = 'py-3 sm:py-3!';

function dayLabel(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(date));
}

function stopTransactionRowPropagation(event: { stopPropagation: () => void }) {
  event.stopPropagation();
}

function stopTransactionRowKeyboardPropagation(event: {
  key: string;
  stopPropagation: () => void;
}) {
  if (event.key === 'Enter') event.stopPropagation();
}

function TransactionIndicator({
  icon,
  label,
  variant,
}: Readonly<{
  icon: ReactNode;
  label: string;
  variant: 'danger' | 'primary';
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Root onOpenChange={setOpen} open={open}>
      <Tooltip.IconTrigger
        aria-label={label}
        className="relative z-[2]"
        onBlur={() => setOpen(false)}
        onClick={stopTransactionRowPropagation}
        onFocus={() => setOpen(true)}
        onKeyDown={stopTransactionRowKeyboardPropagation}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onPointerDown={stopTransactionRowPropagation}
        onPointerUp={stopTransactionRowPropagation}
        variant={variant}
      >
        {icon}
      </Tooltip.IconTrigger>
      <Tooltip.Content placement="right" variant={variant}>
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

function MissingAttachmentWarning() {
  const { t } = useTranslation('transactions');

  return (
    <TransactionIndicator
      icon={<WarningIcon size="1rem" />}
      label={t('No invoice or receipt')}
      variant="danger"
    />
  );
}

function ScheduledTransactionIndicator() {
  const { t } = useTranslation('transactions');

  return (
    <TransactionIndicator
      icon={<CalendarIcon size="1rem" />}
      label={t('Scheduled transaction')}
      variant="primary"
    />
  );
}

function PendingTransactionDate({
  className,
  date,
  locale,
  scheduled,
}: Readonly<{
  className?: string;
  date: string;
  locale: string;
  scheduled: boolean;
}>) {
  return (
    <Inline className={className} gap="sm">
      <Typography as="span" colour="muted">
        {dayLabel(date, locale)}
      </Typography>
      {scheduled ? (
        <ScheduledTransactionIndicator />
      ) : (
        <CalendarIcon
          aria-hidden="true"
          className="text-[var(--breeze-primary)]"
          data-testid="transaction-date-icon"
          size="1rem"
        />
      )}
    </Inline>
  );
}

function TransactionHeaderLabel({
  label,
  loading,
  skeletonClassName,
}: Readonly<{
  label: string;
  loading: boolean;
  skeletonClassName: string;
}>) {
  return loading ? (
    <Skeleton className={skeletonClassName} />
  ) : (
    <Typography as="span" weight="bold">
      {label}
    </Typography>
  );
}

function transactionContextColumn(pending: boolean): 'category' | 'date' {
  return pending ? 'date' : 'category';
}

function TransactionContextColumn({
  loading,
  pending,
}: Readonly<{ loading: boolean; pending: boolean }>) {
  const { t } = useTranslation('transactions');
  const label = pending ? t('Date') : t('Category');

  return (
    <Table.Column
      compactLabel={false}
      id={transactionContextColumn(pending)}
      textValue={label}
    >
      <TransactionHeaderLabel
        label={label}
        loading={loading}
        skeletonClassName="h-4 w-20"
      />
    </Table.Column>
  );
}

function TransactionTableHeader({
  compact = false,
  loading = false,
  pending = false,
}: Readonly<{ compact?: boolean; loading?: boolean; pending?: boolean }>) {
  const { t } = useTranslation('transactions');

  return (
    <Table.Header className={compact ? 'sr-only' : undefined}>
      <Table.Column
        className="ps-14"
        compactLabel={false}
        id="transaction"
        rowHeader
        textValue={t('Transaction')}
      >
        <TransactionHeaderLabel
          label={t('Transaction')}
          loading={loading}
          skeletonClassName="h-4 w-28"
        />
      </Table.Column>
      {compact ? null : (
        <TransactionContextColumn loading={loading} pending={pending} />
      )}
      <Table.Column
        align="end"
        compactLabel={false}
        id="amount"
        textValue={t('Amount')}
        width={compact ? 'max-content' : undefined}
      >
        <TransactionHeaderLabel
          label={t('Amount')}
          loading={loading}
          skeletonClassName="h-4 w-16"
        />
      </Table.Column>
      <Table.Column
        compactLabel={false}
        id="actions"
        textValue={t('Actions')}
        width={compact ? '2.25rem' : undefined}
      >
        <VisuallyHidden>{t('Actions')}</VisuallyHidden>
      </Table.Column>
    </Table.Header>
  );
}

function transactionRowClassName(pending: boolean, pendingCollection: boolean) {
  return pending && !pendingCollection
    ? `${transactionDataRowClassName} bg-[var(--breeze-surface-subtle)]`
    : transactionDataRowClassName;
}

type TransactionLedgerOrigin = 'dashboard' | 'transactions';

function transactionRoute(
  origin: TransactionLedgerOrigin,
  pendingCollection: boolean,
) {
  if (pendingCollection) {
    return '/my-companies/accounts/$companyId/pending-transactions/view-transaction/$transactionId';
  }

  if (origin === 'dashboard') {
    return '/my-companies/dashboard/$companyId/view-transaction/$transactionId';
  }

  return '/my-companies/accounts/$companyId/view-transaction/$transactionId';
}

function TransactionIdentityCell({
  incoming,
  locale,
  pending,
  pendingCollection,
  transaction,
  transactionLabel,
}: Readonly<{
  incoming: boolean;
  locale: string;
  pending: boolean;
  pendingCollection: boolean;
  transaction: LedgerTransaction;
  transactionLabel: string;
}>) {
  const { t } = useTranslation('transactions');

  return (
    <Table.Cell column="transaction" textValue={transactionLabel}>
      {pending ? (
        <VisuallyHidden>{t('Pending transaction:')} </VisuallyHidden>
      ) : null}
      <Inline className="min-w-0" gap="md" wrap={false}>
        <IconTile
          aria-hidden="true"
          bordered={false}
          shape="circle"
          size="sm"
          variant={incoming ? 'success' : 'danger'}
        >
          {incoming ? (
            <ArrowRightIcon size="1rem" />
          ) : (
            <ArrowLeftIcon size="1rem" />
          )}
        </IconTile>
        <Stack className="min-w-0" gap="none">
          <Inline className="min-w-0" gap="sm" wrap={false}>
            <Typography as="strong" level="body" truncate weight="semibold">
              {transaction.name}
            </Typography>
            {transaction.attachment ? null : <MissingAttachmentWarning />}
            {!pendingCollection && transaction.scheduled ? (
              <ScheduledTransactionIndicator />
            ) : null}
          </Inline>
          <Typography as="span" colour="muted" truncate>
            {transaction.description}
          </Typography>
          {pendingCollection ? (
            <PendingTransactionDate
              className={compactTableOnlyClassName}
              date={transaction.date}
              locale={locale}
              scheduled={transaction.scheduled === true}
            />
          ) : null}
        </Stack>
      </Inline>
    </Table.Cell>
  );
}

function TransactionContextCell({
  compact,
  locale,
  pendingCollection,
  transaction,
}: Readonly<{
  compact: boolean;
  locale: string;
  pendingCollection: boolean;
  transaction: LedgerTransaction;
}>) {
  if (compact) return null;

  if (!pendingCollection) {
    return <Table.Cell column="category">{transaction.category}</Table.Cell>;
  }

  return (
    <Table.Cell column="date">
      <PendingTransactionDate
        date={transaction.date}
        locale={locale}
        scheduled={transaction.scheduled === true}
      />
    </Table.Cell>
  );
}

function TransactionAmountCell({
  currencyCode,
  incoming,
  transaction,
}: Readonly<{
  currencyCode: string;
  incoming: boolean;
  transaction: LedgerTransaction;
}>) {
  return (
    <Table.Cell align="end" column="amount">
      <Typography
        as="span"
        className="whitespace-nowrap"
        colour={incoming ? 'success' : 'default'}
        tabularNumbers
        weight="semibold"
      >
        {formatCurrency(transaction.amount, currencyCode, 'always')}
      </Typography>
    </Table.Cell>
  );
}

function TransactionRow({
  compact,
  companyId,
  currencyCode,
  locale,
  origin,
  pendingCollection,
  transaction,
}: Readonly<{
  compact: boolean;
  companyId: string;
  currencyCode: string;
  locale: string;
  origin: TransactionLedgerOrigin;
  pendingCollection: boolean;
  transaction: LedgerTransaction;
}>) {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const incoming = transaction.amount >= 0;
  const pending = transaction.status === 'pending';
  const transactionLabel = pending
    ? t('Pending transaction: {{name}} {{description}}', {
        description: transaction.description,
        name: transaction.name,
      })
    : `${transaction.name} ${transaction.description}`;

  return (
    <Table.Row
      className={transactionRowClassName(pending, pendingCollection)}
      id={transaction.id}
      onAction={() => {
        navigate({
          params: {
            companyId,
            transactionId: transaction.id,
          },
          to: transactionRoute(origin, pendingCollection),
        }).catch(() => undefined);
      }}
      textValue={`${transactionLabel} ${transaction.category}`}
    >
      <TransactionIdentityCell
        incoming={incoming}
        locale={locale}
        pending={pending}
        pendingCollection={pendingCollection}
        transaction={transaction}
        transactionLabel={transactionLabel}
      />
      <TransactionContextCell
        compact={compact}
        locale={locale}
        pendingCollection={pendingCollection}
        transaction={transaction}
      />
      <TransactionAmountCell
        currencyCode={currencyCode}
        incoming={incoming}
        transaction={transaction}
      />
      <Table.Disclosure column="actions" position="flow" />
    </Table.Row>
  );
}

function LoadingTransactionRow({
  compact,
  index,
  pending = false,
}: Readonly<{ compact: boolean; index: number; pending?: boolean }>) {
  const { t } = useTranslation('transactions');

  return (
    <Table.Row
      className={transactionDataRowClassName}
      id={`loading-transaction-${index}`}
      textValue={t('Loading transaction {{count}}', { count: index + 1 })}
    >
      <Table.Cell column="transaction">
        <VisuallyHidden>
          {t('Loading transaction {{count}}', { count: index + 1 })}
        </VisuallyHidden>
        <Inline className="min-w-0" gap="md" wrap={false}>
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <Stack className="min-w-0" gap="xs">
            <Skeleton className="h-5 w-36 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
            {pending ? (
              <Skeleton
                className={`h-4 w-28 max-w-full ${compactTableOnlyClassName}`}
              />
            ) : null}
          </Stack>
        </Inline>
      </Table.Cell>
      {compact ? null : (
        <Table.Cell column={transactionContextColumn(pending)}>
          <Skeleton className="h-4 w-28 max-w-full" />
        </Table.Cell>
      )}
      <Table.Cell align="end" column="amount">
        <Skeleton className="h-5 w-24" />
      </Table.Cell>
      <Table.Cell column="actions">
        <Skeleton className="h-5 w-3" />
      </Table.Cell>
    </Table.Row>
  );
}

function LoadingSectionRow({ index }: Readonly<{ index: number }>) {
  const { t } = useTranslation('transactions');

  return (
    <Table.Row
      id={`loading-transaction-section-${index}`}
      presentation="section"
      textValue={t('Loading transaction group {{count}}', {
        count: index + 1,
      })}
    >
      <Table.Cell column="transaction">
        <Skeleton className="h-4 w-28" />
      </Table.Cell>
      <Table.Cell column="category">{null}</Table.Cell>
      <Table.Cell align="end" column="amount">
        <Skeleton className="h-4 w-24" />
      </Table.Cell>
      <Table.Cell column="actions">{null}</Table.Cell>
    </Table.Row>
  );
}

export function TransactionLedgerSkeleton({
  compact = false,
  grouped = false,
  pending = false,
  rows = 4,
}: Readonly<{
  compact?: boolean;
  grouped?: boolean;
  pending?: boolean;
  rows?: number;
}>) {
  const { t } = useTranslation('transactions');
  const rowIndexes = Array.from({ length: rows }, (_, index) => index);

  return (
    <div aria-hidden="true" inert>
      <Table.Root
        aria-label={t('Loading transactions table')}
        boundary={compact ? 'none' : 'strong'}
        className={
          compact
            ? compactTransactionTableClassName
            : groupedTransactionTableClassName
        }
        compactHiddenColumns={
          compact ? undefined : transactionContextColumn(pending)
        }
        layout="grid"
        tabIndex={-1}
      >
        <TransactionTableHeader compact={compact} loading pending={pending} />
        {grouped ? (
          <>
            <Table.Body id="loading-transaction-group-1">
              <LoadingSectionRow index={0} />
              {rowIndexes.slice(0, 2).map((index) => (
                <LoadingTransactionRow
                  compact={compact}
                  index={index}
                  key={index}
                  pending={pending}
                />
              ))}
            </Table.Body>
            <Table.Body id="loading-transaction-group-2">
              <LoadingSectionRow index={1} />
              {rowIndexes.slice(2).map((index) => (
                <LoadingTransactionRow
                  compact={compact}
                  index={index}
                  key={index}
                  pending={pending}
                />
              ))}
            </Table.Body>
          </>
        ) : (
          <Table.Body>
            {rowIndexes.map((index) => (
              <LoadingTransactionRow
                compact={compact}
                index={index}
                key={index}
                pending={pending}
              />
            ))}
          </Table.Body>
        )}
      </Table.Root>
    </div>
  );
}

function groupTransactionsByDay(transactions: readonly LedgerTransaction[]) {
  return transactions.reduce((transactionsByDay, transaction) => {
    const day = transaction.date.substring(0, 10);
    const transactionsOnDay = transactionsByDay.get(day);

    if (transactionsOnDay) {
      transactionsOnDay.push(transaction);
    } else {
      transactionsByDay.set(day, [transaction]);
    }

    return transactionsByDay;
  }, new Map<string, LedgerTransaction[]>());
}

function confirmedDailyTotal(
  transactions: readonly LedgerTransaction[],
  currencyCode: string,
) {
  return formatCurrency(
    transactions
      .filter(({ status }) => status !== 'pending')
      .reduce(
        (dailyTotal, transaction) => dailyTotal.plus(transaction.amount),
        new Decimal(0),
      )
      .toNumber(),
    currencyCode,
  );
}

function TransactionDayBody({
  companyId,
  currencyCode,
  day,
  items,
  locale,
  origin,
  pending,
}: Readonly<{
  companyId: string;
  currencyCode: string;
  day: string;
  items: readonly LedgerTransaction[];
  locale: string;
  origin: TransactionLedgerOrigin;
  pending: boolean;
}>) {
  const { t } = useTranslation('transactions');
  const date = dayLabel(`${day}T00:00:00.000Z`, locale);
  const total = confirmedDailyTotal(items, currencyCode);

  return (
    <Table.Body id={day}>
      <Table.Row
        id={`${day}-total`}
        presentation="section"
        textValue={
          pending
            ? date
            : t('{{date}}, confirmed daily total {{total}}', { date, total })
        }
      >
        <Table.Cell column="transaction">
          <Typography as="span" level="label">
            {date}
          </Typography>
        </Table.Cell>
        <Table.Cell column={transactionContextColumn(pending)}>
          {null}
        </Table.Cell>
        <Table.Cell align="end" column="amount">
          {pending ? null : (
            <Typography as="span" level="label" tabularNumbers>
              <VisuallyHidden>{t('Confirmed daily total: ')}</VisuallyHidden>
              {total}
            </Typography>
          )}
        </Table.Cell>
        <Table.Cell column="actions">{null}</Table.Cell>
      </Table.Row>
      {items.map((transaction) => (
        <TransactionRow
          compact={false}
          companyId={companyId}
          currencyCode={currencyCode}
          key={transaction.id}
          locale={locale}
          origin={origin}
          pendingCollection={pending}
          transaction={transaction}
        />
      ))}
    </Table.Body>
  );
}

function TransactionBodies({
  compact,
  companyId,
  currencyCode,
  locale,
  origin,
  pending,
  transactions,
}: Readonly<{
  compact: boolean;
  companyId: string;
  currencyCode: string;
  locale: string;
  origin: TransactionLedgerOrigin;
  pending: boolean;
  transactions: readonly LedgerTransaction[];
}>) {
  if (!compact && !pending) {
    return [...groupTransactionsByDay(transactions)].map(([day, items]) => (
      <TransactionDayBody
        companyId={companyId}
        currencyCode={currencyCode}
        day={day}
        items={items}
        key={day}
        locale={locale}
        origin={origin}
        pending={pending}
      />
    ));
  }

  return (
    <Table.Body>
      {transactions.map((transaction) => (
        <TransactionRow
          compact={compact}
          companyId={companyId}
          currencyCode={currencyCode}
          key={transaction.id}
          locale={locale}
          origin={origin}
          pendingCollection={pending}
          transaction={transaction}
        />
      ))}
    </Table.Body>
  );
}

export function TransactionLedger({
  compact = false,
  companyId,
  currencyCode,
  emptyAction,
  origin = 'transactions',
  pending = false,
  transactions,
}: Readonly<{
  compact?: boolean;
  companyId: string;
  currencyCode: string;
  emptyAction?: ReactNode;
  origin?: TransactionLedgerOrigin;
  pending?: boolean;
  transactions: readonly LedgerTransaction[];
}>) {
  const { i18n, t } = useTranslation('transactions');
  let tableLabel = t('Transactions grouped by day');

  if (compact) {
    tableLabel = t('Recent transactions');
  } else if (pending) {
    tableLabel = t('Pending transactions');
  }

  if (transactions.length === 0) {
    return (
      <StatePanel
        action={emptyAction}
        description={
          pending
            ? t('All recorded transactions have been reviewed.')
            : t('Record a confirmed sale to start this transaction history.')
        }
        icon={pending ? <CalendarIcon /> : <ArrowRightIcon />}
        title={
          pending ? t('No pending transactions') : t('No transactions yet')
        }
      />
    );
  }

  return (
    <Table.Root
      aria-label={tableLabel}
      boundary={compact ? 'none' : 'strong'}
      className={
        compact
          ? compactTransactionTableClassName
          : groupedTransactionTableClassName
      }
      compactHiddenColumns={
        compact ? undefined : transactionContextColumn(pending)
      }
      layout="grid"
    >
      <TransactionTableHeader compact={compact} pending={pending} />
      <TransactionBodies
        compact={compact}
        companyId={companyId}
        currencyCode={currencyCode}
        locale={i18n.language}
        origin={origin}
        pending={pending}
        transactions={transactions}
      />
    </Table.Root>
  );
}
