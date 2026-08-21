import {
  IconTile,
  Skeleton,
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

const compactTransactionTableClassName =
  'gap-x-4 [&>tbody>tr]:px-0 [&>tbody>tr]:py-3 [&>tbody>tr>td:first-child]:!ps-4 [&>tbody>tr>td:last-child]:!w-full [&>tbody>tr>td:last-child]:!pe-4 sm:[&>tbody>tr]:px-0';

const groupedTransactionTableClassName =
  '[&>tbody>tr]:!grid [&>tbody>tr]:grid-cols-[3.25rem_minmax(0,1fr)_max-content_2.25rem] [&>tbody>tr]:items-center [&>tbody>tr]:!gap-x-4 [&>tbody>tr]:!gap-y-0 [&>tbody>tr]:px-0 [&>tbody>tr]:py-3 [&>tbody>tr>td]:!flex [&>tbody>tr>td]:!border-0 [&>tbody>tr>td]:!p-0 [&>tbody>tr>td[data-breeze-cell-column=amount]]:justify-end [&>tbody>tr>td[data-breeze-cell-column=category]]:!hidden [&>tbody>tr>td:first-child]:!ps-4 [&>tbody>tr>td:last-child]:!w-full [&>tbody>tr>td:last-child]:justify-end [&>tbody>tr>td:last-child]:!pe-4 min-[681px]:[&>tbody>tr>td[data-breeze-cell-column=category]]:!flex min-[681px]:[&>tbody>tr>td:first-child]:!ps-0 min-[681px]:[&>tbody>tr>td:last-child]:!pe-0 min-[681px]:[&>thead>tr>th[data-breeze-column=amount]]:justify-end';

const transactionSectionRowClassName = '!py-2 [&>td:first-child]:col-span-2';

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

function MissingAttachmentWarning() {
  const { t } = useTranslation('transactions');
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Root onOpenChange={setOpen} open={open}>
      <Tooltip.IconTrigger
        aria-label={t('No invoice or receipt')}
        className="relative z-[2]"
        onBlur={() => setOpen(false)}
        onClick={stopTransactionRowPropagation}
        onFocus={() => setOpen(true)}
        onKeyDown={stopTransactionRowKeyboardPropagation}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onPointerDown={stopTransactionRowPropagation}
        onPointerUp={stopTransactionRowPropagation}
        variant="danger"
      >
        <WarningIcon size="1rem" />
      </Tooltip.IconTrigger>
      <Tooltip.Content placement="right" variant="danger">
        {t('No invoice or receipt')}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

function ScheduledTransactionIndicator() {
  const { t } = useTranslation('transactions');
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Root onOpenChange={setOpen} open={open}>
      <Tooltip.IconTrigger
        aria-label={t('Scheduled transaction')}
        className="relative z-[2]"
        onBlur={() => setOpen(false)}
        onClick={stopTransactionRowPropagation}
        onFocus={() => setOpen(true)}
        onKeyDown={stopTransactionRowKeyboardPropagation}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onPointerDown={stopTransactionRowPropagation}
        onPointerUp={stopTransactionRowPropagation}
        variant="primary"
      >
        <CalendarIcon size="1rem" />
      </Tooltip.IconTrigger>
      <Tooltip.Content placement="right" variant="primary">
        {t('Scheduled transaction')}
      </Tooltip.Content>
    </Tooltip.Root>
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
    <span>{label}</span>
  );
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
      id={pending ? 'date' : 'category'}
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
    <Table.Header className={compact ? 'sr-only' : 'max-[680px]:!hidden'}>
      <Table.Column
        compactLabel={false}
        id="direction"
        rowHeader
        textValue={t('Transaction')}
        width={compact ? '3.25rem' : undefined}
      >
        <VisuallyHidden>{t('Transaction')}</VisuallyHidden>
      </Table.Column>
      <Table.Column
        compactLabel={false}
        id="transaction"
        textValue={t('Transaction details')}
      >
        <VisuallyHidden>{t('Transaction details')}</VisuallyHidden>
        <span aria-hidden="true">
          <TransactionHeaderLabel
            label={t('Transaction')}
            loading={loading}
            skeletonClassName="h-4 w-28"
          />
        </span>
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
    ? 'bg-[var(--breeze-surface-subtle)]'
    : undefined;
}

function transactionRoute(pendingCollection: boolean) {
  return pendingCollection
    ? '/my-companies/accounts/$companyId/pending-transactions/view-transaction/$transactionId'
    : '/my-companies/accounts/$companyId/view-transaction/$transactionId';
}

function TransactionDirectionCell({
  compact,
  incoming,
  pending,
  transaction,
  transactionLabel,
}: Readonly<{
  compact: boolean;
  incoming: boolean;
  pending: boolean;
  transaction: LedgerTransaction;
  transactionLabel: string;
}>) {
  const { t } = useTranslation('transactions');

  return (
    <Table.Cell column="direction" textValue={transactionLabel}>
      <VisuallyHidden>
        {pending ? <>{t('Pending transaction:')} </> : null}
        {transaction.name} {transaction.description}
        {compact ? null : (
          <span className="min-[681px]:hidden">, {transaction.category}</span>
        )}
      </VisuallyHidden>
      <IconTile
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
    </Table.Cell>
  );
}

function TransactionIdentityCell({
  locale,
  pendingCollection,
  transaction,
}: Readonly<{
  locale: string;
  pendingCollection: boolean;
  transaction: LedgerTransaction;
}>) {
  return (
    <Table.Cell column="transaction">
      <span className="grid min-w-0 gap-0">
        <span className="flex min-w-0 items-center gap-2">
          <Typography as="strong" level="body" truncate weight="semibold">
            {transaction.name}
          </Typography>
          {transaction.attachment ? null : <MissingAttachmentWarning />}
          {!pendingCollection && transaction.scheduled ? (
            <ScheduledTransactionIndicator />
          ) : null}
        </span>
        <Typography as="span" colour="muted" truncate>
          {transaction.description}
        </Typography>
        {pendingCollection ? (
          <span className="hidden items-center gap-2 text-[var(--breeze-ink-soft)] max-[680px]:flex">
            <span>{dayLabel(transaction.date, locale)}</span>
            {transaction.scheduled ? <ScheduledTransactionIndicator /> : null}
          </span>
        ) : null}
      </span>
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
    <Table.Cell className="max-[680px]:!hidden" column="date">
      <span className="flex items-center gap-2">
        <span>{dayLabel(transaction.date, locale)}</span>
        {transaction.scheduled ? <ScheduledTransactionIndicator /> : null}
      </span>
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
  pendingCollection,
  transaction,
}: Readonly<{
  compact: boolean;
  companyId: string;
  currencyCode: string;
  locale: string;
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
          to: transactionRoute(pendingCollection),
        }).catch(() => undefined);
      }}
      textValue={`${transactionLabel} ${transaction.category}`}
    >
      <TransactionDirectionCell
        compact={compact}
        incoming={incoming}
        pending={pending}
        transaction={transaction}
        transactionLabel={transactionLabel}
      />
      <TransactionIdentityCell
        locale={locale}
        pendingCollection={pendingCollection}
        transaction={transaction}
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
      id={`loading-transaction-${index}`}
      textValue={t('Loading transaction {{count}}', { count: index + 1 })}
    >
      <Table.Cell
        column="direction"
        textValue={t('Loading transaction {{count}}', { count: index + 1 })}
      >
        <VisuallyHidden>
          {t('Loading transaction {{count}}', { count: index + 1 })}
        </VisuallyHidden>
        <Skeleton className="size-9 shrink-0 rounded-full" />
      </Table.Cell>
      <Table.Cell column="transaction">
        <div className="grid min-w-0 gap-1">
          <Skeleton className="h-5 w-36 max-w-full" />
          <Skeleton className="h-4 w-48 max-w-full" />
          {pending ? (
            <Skeleton className="hidden h-4 w-28 max-w-full max-[680px]:block" />
          ) : null}
        </div>
      </Table.Cell>
      {compact ? null : (
        <Table.Cell
          className={pending ? 'max-[680px]:!hidden' : undefined}
          column={pending ? 'date' : 'category'}
        >
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
      className={transactionSectionRowClassName}
      id={`loading-transaction-section-${index}`}
      presentation="section"
      textValue={t('Loading transaction group {{count}}', {
        count: index + 1,
      })}
    >
      <Table.Cell colSpan={2} column="direction">
        <Skeleton className="h-4 w-28" />
      </Table.Cell>
      <Table.Cell column="category">
        <span />
      </Table.Cell>
      <Table.Cell align="end" column="amount">
        <Skeleton className="h-4 w-24" />
      </Table.Cell>
      <Table.Cell column="actions">
        <span />
      </Table.Cell>
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
        desktopColumns={compact ? undefined : 'mediaDetailsAction'}
        layout={compact ? 'grid' : 'responsiveGrid'}
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
  pending,
}: Readonly<{
  companyId: string;
  currencyCode: string;
  day: string;
  items: readonly LedgerTransaction[];
  locale: string;
  pending: boolean;
}>) {
  const { t } = useTranslation('transactions');
  const date = dayLabel(`${day}T00:00:00.000Z`, locale);
  const total = confirmedDailyTotal(items, currencyCode);

  return (
    <Table.Body id={day}>
      <Table.Row
        className={transactionSectionRowClassName}
        id={`${day}-total`}
        presentation="section"
        textValue={
          pending
            ? date
            : t('{{date}}, confirmed daily total {{total}}', { date, total })
        }
      >
        <Table.Cell colSpan={2} column="direction">
          <Typography as="span" level="label">
            {date}
          </Typography>
        </Table.Cell>
        <Table.Cell column={pending ? 'date' : 'category'}>
          <span />
        </Table.Cell>
        <Table.Cell align="end" column="amount">
          {pending ? (
            <span />
          ) : (
            <Typography as="span" level="label" tabularNumbers>
              <VisuallyHidden>{t('Confirmed daily total: ')}</VisuallyHidden>
              {total}
            </Typography>
          )}
        </Table.Cell>
        <Table.Cell column="actions">
          <span />
        </Table.Cell>
      </Table.Row>
      {items.map((transaction) => (
        <TransactionRow
          compact={false}
          companyId={companyId}
          currencyCode={currencyCode}
          key={transaction.id}
          locale={locale}
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
  pending,
  transactions,
}: Readonly<{
  compact: boolean;
  companyId: string;
  currencyCode: string;
  locale: string;
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
  pending = false,
  transactions,
}: Readonly<{
  compact?: boolean;
  companyId: string;
  currencyCode: string;
  emptyAction?: ReactNode;
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
    <div>
      <Table.Root
        aria-label={tableLabel}
        boundary={compact ? 'none' : 'strong'}
        className={
          compact
            ? compactTransactionTableClassName
            : groupedTransactionTableClassName
        }
        desktopColumns={compact ? undefined : 'mediaDetailsAction'}
        layout={compact ? 'grid' : 'responsiveGrid'}
      >
        <TransactionTableHeader compact={compact} pending={pending} />
        <TransactionBodies
          compact={compact}
          companyId={companyId}
          currencyCode={currencyCode}
          locale={i18n.language}
          pending={pending}
          transactions={transactions}
        />
      </Table.Root>
    </div>
  );
}
