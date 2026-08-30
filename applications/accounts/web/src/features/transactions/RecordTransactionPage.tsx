import { Button, Drawer, FormActions } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { SubmittingForm } from '../forms/SubmittingForm';
import { RecordTransactionDrawerSkeleton } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { RecordTransactionFormFields } from './RecordTransactionFormFields';
import {
  type TransactionPageOrigin,
  transactionPageOrigins,
} from './transaction-page-origin';
import { TransactionFormUnavailable } from './TransactionPagePresentation';
import { useTransactionForm } from './useTransactionForm';

export function RecordTransactionPage({
  companyId,
  origin,
}: Readonly<{
  companyId: string;
  origin: TransactionPageOrigin;
}>) {
  const { t } = useTranslation(['transactions', 'routing']);
  const { Background, closeTo, confirmedReturnTo } =
    transactionPageOrigins[origin];
  const {
    blocker,
    categories,
    clients,
    currency,
    data,
    discardChanges,
    discardStagedAttachment,
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
    closeTo,
    companyId,
    confirmedReturnTo,
  });

  if (loading && !data && !error) {
    return (
      <>
        <Background companyId={companyId} />
        <RecordTransactionDrawerSkeleton
          onOpenChange={(open) => {
            if (!open) requestClose();
          }}
        />
      </>
    );
  }

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
            {t('Add money coming in or going out.')}
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
                discardStagedAttachment={discardStagedAttachment}
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
                        {online
                          ? t('Save transaction')
                          : t('Connection required')}
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
      />
    </>
  );
}
