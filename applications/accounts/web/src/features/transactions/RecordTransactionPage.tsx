import { Button, Drawer, FormActions } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { SubmittingForm } from '../forms/SubmittingForm';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { DashboardPageContent } from './DashboardPageContent';
import { PendingTransactionsPageContent } from './PendingTransactionsPageContent';
import { RecordTransactionFormFields } from './RecordTransactionFormFields';
import { TransactionFormUnavailable } from './TransactionPagePresentation';
import { TransactionsPageContent } from './TransactionsPageContent';
import { useTransactionForm } from './useTransactionForm';

type RecordTransactionOrigin = 'dashboard' | 'pending' | 'transactions';

const recordTransactionOrigins = {
  dashboard: {
    Background: DashboardPageContent,
    returnTo: '/my-companies/dashboard/$companyId',
  },
  pending: {
    Background: PendingTransactionsPageContent,
    returnTo: '/my-companies/accounts/$companyId',
  },
  transactions: {
    Background: TransactionsPageContent,
    returnTo: '/my-companies/accounts/$companyId',
  },
} as const satisfies Record<
  RecordTransactionOrigin,
  {
    Background: typeof DashboardPageContent | typeof TransactionsPageContent;
    returnTo:
      | '/my-companies/accounts/$companyId'
      | '/my-companies/dashboard/$companyId';
  }
>;

export function RecordTransactionPage({
  companyId,
  origin,
}: Readonly<{
  companyId: string;
  origin: RecordTransactionOrigin;
}>) {
  const { t } = useTranslation(['transactions', 'routing']);
  const { Background, returnTo } = recordTransactionOrigins[origin];
  const {
    blocker,
    categories,
    clients,
    currency,
    data,
    discardChanges,
    discardOpen,
    error,
    form,
    loading,
    markDirty,
    online,
    refetch,
    removeAttachment,
    requestClose,
    setDiscardOpen,
    suggestions,
    submissionPending,
    trackAttachmentTransfer,
    vatRate,
  } = useTransactionForm({
    companyId,
    confirmedReturnTo: returnTo,
  });

  return (
    <>
      <Background companyId={companyId} />
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) {
            requestClose();
          }
        }}
        open
        triggerless
      >
        <Drawer.Content
          dismissible={!submissionPending}
          keyboardDismissDisabled={submissionPending}
          placement={{ base: 'bottom', md: 'end' }}
          size="wide"
        >
          <Drawer.Description>
            {t('Record a purchase, sale, refund, or Pending Transaction.')}
          </Drawer.Description>
          <Drawer.Title>{t('Record transaction')}</Drawer.Title>
          {error && data ? (
            <QueryRefreshAlert
              onRetry={() => {
                refetch().catch(() => undefined);
              }}
              retryLabel={t('Try again', { ns: 'routing' })}
            >
              {t(
                'Transaction settings could not be refreshed. Your edits are unchanged.',
              )}
            </QueryRefreshAlert>
          ) : null}
          {error && !data ? (
            <TransactionFormUnavailable
              loading={loading}
              onRetry={() => {
                refetch().catch(() => undefined);
              }}
            />
          ) : null}
          {loading && !data ? (
            <p aria-live="polite">{t('Preparing transaction form…')}</p>
          ) : null}
          {data ? (
            <SubmittingForm
              className="grid min-h-full gap-6"
              onSubmit={() => form.handleSubmit()}
              submissionPending={submissionPending}
            >
              <RecordTransactionFormFields
                categories={categories}
                clients={clients}
                companyId={companyId}
                currency={currency}
                editing={false}
                form={form}
                markDirty={markDirty}
                online={online}
                removeAttachment={removeAttachment}
                suggestions={suggestions}
                trackAttachmentTransfer={trackAttachmentTransfer}
                vatRate={vatRate}
              />
              <form.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting] as const
                }
              >
                {([canSubmit, isSubmitting]) => (
                  <FormActions
                    cancel={
                      <Button appearance="outline" onAction={requestClose}>
                        {t('Cancel')}
                      </Button>
                    }
                    primary={
                      <Button
                        disabled={!online || !canSubmit || isSubmitting}
                        loading={isSubmitting}
                        type="submit"
                      >
                        {online ? t('Save') : t('Connection required')}
                      </Button>
                    }
                  />
                )}
              </form.Subscribe>
            </SubmittingForm>
          ) : null}
        </Drawer.Content>
      </Drawer.Root>
      <DiscardChangesDialog
        blocker={blocker}
        closeLabel={t('Close discard confirmation')}
        description={t(
          'The transaction details entered on this page will be lost.',
        )}
        nested
        onDiscard={discardChanges}
        onOpenChange={setDiscardOpen}
        open={discardOpen && !submissionPending}
        title={t('Discard these transaction changes?')}
        trigger={t('Discard changes')}
      />
    </>
  );
}
