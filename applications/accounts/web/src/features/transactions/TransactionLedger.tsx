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
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
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

function MissingAttachmentWarning() {
  const { t } = useTranslation('transactions');
  const [open, setOpen] = useState(false);

  return (
    <span className="relative z-[2]">
      <Tooltip.Root onOpenChange={setOpen} open={open}>
        <Tooltip.IconTrigger
          aria-label={t('No invoice or receipt')}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          variant="danger"
        >
          <WarningIcon size="1rem" />
        </Tooltip.IconTrigger>
        <Tooltip.Content placement="right" variant="danger">
          {t('No invoice or receipt')}
        </Tooltip.Content>
      </Tooltip.Root>
    </span>
  );
}

function TransactionTableHeader({
  compact = false,
  loading = false,
}: Readonly<{ compact?: boolean; loading?: boolean }>) {
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
          {loading ? <Skeleton className="h-4 w-28" /> : t('Transaction')}
        </span>
      </Table.Column>
      {compact ? null : (
        <Table.Column
          compactLabel={false}
          id="category"
          textValue={t('Category')}
        >
          {loading ? <Skeleton className="h-4 w-20" /> : t('Category')}
        </Table.Column>
      )}
      <Table.Column
        align="end"
        compactLabel={false}
        id="amount"
        textValue={t('Amount')}
        width={compact ? 'max-content' : undefined}
      >
        {loading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          <span>{t('Amount')}</span>
        )}
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

function TransactionRow({
  compact,
  companyId,
  currencyCode,
  transaction,
}: Readonly<{
  compact: boolean;
  companyId: string;
  currencyCode: string;
  transaction: LedgerTransaction;
}>) {
  const navigate = useNavigate();
  const incoming = transaction.amount >= 0;

  return (
    <Table.Row
      id={transaction.id}
      onAction={() => {
        navigate({
          params: {
            companyId,
            transactionId: transaction.id,
          },
          to: '/my-companies/accounts/$companyId/view-transaction/$transactionId',
        }).catch(() => undefined);
      }}
      textValue={`${transaction.name} ${transaction.description} ${transaction.category}`}
    >
      <Table.Cell
        column="direction"
        textValue={`${transaction.name} ${transaction.description}`}
      >
        <VisuallyHidden>
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
      <Table.Cell column="transaction">
        <span className="grid min-w-0 gap-0">
          <span className="flex min-w-0 items-center gap-2">
            <Typography as="strong" level="body" truncate weight="semibold">
              {transaction.name}
            </Typography>
            {transaction.attachment ? null : <MissingAttachmentWarning />}
          </span>
          <Typography as="span" colour="muted" truncate>
            {transaction.description}
          </Typography>
        </span>
      </Table.Cell>
      {compact ? null : (
        <Table.Cell column="category">{transaction.category}</Table.Cell>
      )}
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
      <Table.Disclosure column="actions" position="flow" />
    </Table.Row>
  );
}

function LoadingTransactionRow({
  compact,
  index,
}: Readonly<{ compact: boolean; index: number }>) {
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
        </div>
      </Table.Cell>
      {compact ? null : (
        <Table.Cell column="category">
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
  rows = 4,
}: Readonly<{ compact?: boolean; grouped?: boolean; rows?: number }>) {
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
        <TransactionTableHeader compact={compact} loading />
        {grouped ? (
          <>
            <Table.Body id="loading-transaction-group-1">
              <LoadingSectionRow index={0} />
              {rowIndexes.slice(0, 2).map((index) => (
                <LoadingTransactionRow
                  compact={compact}
                  index={index}
                  key={index}
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
              />
            ))}
          </Table.Body>
        )}
      </Table.Root>
    </div>
  );
}

export function TransactionLedger({
  compact = false,
  companyId,
  currencyCode,
  transactions,
}: Readonly<{
  compact?: boolean;
  companyId: string;
  currencyCode: string;
  transactions: readonly LedgerTransaction[];
}>) {
  const { i18n, t } = useTranslation('transactions');

  if (transactions.length === 0) {
    return (
      <StatePanel
        description={t(
          'Record a confirmed sale to start this transaction history.',
        )}
        icon={<ArrowRightIcon />}
        title={t('No transactions yet')}
      />
    );
  }

  const groups = transactions.reduce((transactionsByDay, transaction) => {
    const day = transaction.date.substring(0, 10);
    const transactionsOnDay = transactionsByDay.get(day);

    if (transactionsOnDay) {
      transactionsOnDay.push(transaction);
    } else {
      transactionsByDay.set(day, [transaction]);
    }

    return transactionsByDay;
  }, new Map<string, LedgerTransaction[]>());

  return (
    <div>
      <Table.Root
        aria-label={
          compact ? t('Recent transactions') : t('Transactions grouped by day')
        }
        boundary={compact ? 'none' : 'strong'}
        className={
          compact
            ? compactTransactionTableClassName
            : groupedTransactionTableClassName
        }
        desktopColumns={compact ? undefined : 'mediaDetailsAction'}
        layout={compact ? 'grid' : 'responsiveGrid'}
      >
        <TransactionTableHeader compact={compact} />
        {compact ? (
          <Table.Body>
            {transactions.map((transaction) => (
              <TransactionRow
                compact
                companyId={companyId}
                currencyCode={currencyCode}
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </Table.Body>
        ) : (
          [...groups].map(([day, items]) => {
            const date = dayLabel(`${day}T00:00:00.000Z`, i18n.language);
            const total = formatCurrency(
              items.reduce(
                (dailyTotal, transaction) => dailyTotal + transaction.amount,
                0,
              ),
              currencyCode,
            );

            return (
              <Table.Body id={day} key={day}>
                <Table.Row
                  className={transactionSectionRowClassName}
                  id={`${day}-total`}
                  presentation="section"
                  textValue={t('{{date}}, confirmed daily total {{total}}', {
                    date,
                    total,
                  })}
                >
                  <Table.Cell colSpan={2} column="direction">
                    <Typography as="span" level="label">
                      {date}
                    </Typography>
                  </Table.Cell>
                  <Table.Cell column="category">
                    <span />
                  </Table.Cell>
                  <Table.Cell align="end" column="amount">
                    <Typography as="span" level="label" tabularNumbers>
                      <VisuallyHidden>
                        {t('Confirmed daily total: ')}
                      </VisuallyHidden>
                      {total}
                    </Typography>
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
                    transaction={transaction}
                  />
                ))}
              </Table.Body>
            );
          })
        )}
      </Table.Root>
    </div>
  );
}
