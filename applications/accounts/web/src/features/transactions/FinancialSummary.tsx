import {
  Grid,
  Inline,
  MetricCard,
  Skeleton,
  Stack,
  Surface,
  Typography,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../formatting/currency';

interface FinancialSummaryProps {
  balance: number;
  currencyCode: string;
  fullWidth?: boolean;
  vat: {
    owed: number;
    paid: number;
  };
}

const responsiveSummaryColumns =
  'grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]';

export function FinancialSummary({
  balance,
  currencyCode,
  fullWidth = false,
  vat,
}: Readonly<FinancialSummaryProps>) {
  const { t } = useTranslation('overview');

  return (
    <Grid
      aria-label={t('Financial summary')}
      className={`mb-7 ${responsiveSummaryColumns} ${fullWidth ? 'max-w-none' : 'max-w-3xl'}`}
      gap={{ base: 'compact', sm: 'md' }}
      role="region"
    >
      <MetricCard
        label={t('Current balance')}
        tone="inverse"
        value={formatCurrency(balance, currencyCode)}
      />
      <Surface border="strong" padding={{ base: 'lg', sm: 'xl' }}>
        <Stack gap="md">
          <Typography as="h2" level="h4">
            {t('VAT summary')}
          </Typography>
          <dl className="m-0 grid grid-cols-2">
            <div className="grid gap-1 pe-5 sm:pe-6">
              <Typography as="dt" colour="muted" level="body">
                {t('Owed')}
              </Typography>
              <Typography as="dd" level="summary" tabularNumbers>
                {formatCurrency(vat.owed, currencyCode)}
              </Typography>
            </div>
            <div className="grid gap-1 border-s border-[var(--breeze-border)] ps-5 sm:ps-6">
              <Typography as="dt" colour="muted" level="body">
                {t('Paid')}
              </Typography>
              <Typography as="dd" level="summary" tabularNumbers>
                {formatCurrency(vat.paid, currencyCode)}
              </Typography>
            </div>
          </dl>
        </Stack>
      </Surface>
    </Grid>
  );
}

export function FinancialSummarySkeleton({
  fullWidth = false,
}: Readonly<{ fullWidth?: boolean }>) {
  return (
    <Grid
      aria-hidden="true"
      className={`${responsiveSummaryColumns} ${fullWidth ? 'max-w-none' : 'mb-7 max-w-3xl'}`}
      gap={{ base: 'compact', sm: 'md' }}
      inert
    >
      <MetricCard
        density="spacious"
        label={<Skeleton className="h-5 w-32" tone="inverse" />}
        tone="inverse"
        value={<Skeleton className="h-9 w-48" tone="inverse" />}
      />
      <Surface padding="xl">
        <Stack gap="md">
          <Skeleton className="h-5 w-28" />
          <Inline justify="between">
            <Stack gap="xs">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-7 w-24" />
            </Stack>
            <Stack align="end" gap="xs">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-7 w-24" />
            </Stack>
          </Inline>
        </Stack>
      </Surface>
    </Grid>
  );
}
