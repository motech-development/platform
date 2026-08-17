import { useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  Drawer,
  FormActions,
  StatePanel,
  useToast,
} from '@motech-development/breeze-ui';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { DELETE_TRANSACTION, GET_TRANSACTION } from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { EntityDeleteDialog } from '../forms/EntityDeleteDialog';
import { SubmittingForm } from '../forms/SubmittingForm';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { PendingTransactionsPageContent } from './PendingTransactionsPageContent';
import { RecordTransactionFormFields } from './RecordTransactionFormFields';
import { editableTransaction } from './transaction';
import { removeTransactionFromCache } from './transaction-cache';
import { TransactionFormUnavailable } from './TransactionPagePresentation';
import { TransactionsPageContent } from './TransactionsPageContent';
import { useTransactionForm } from './useTransactionForm';

type TransactionEditOrigin = 'pending' | 'transactions';

function TransactionEditDrawer({
  companyId,
  origin,
  refetchTransaction,
  transaction,
  transactionRefreshFailed,
  transactionId,
}: Readonly<{
  companyId: string;
  origin: TransactionEditOrigin;
  refetchTransaction: () => Promise<unknown>;
  transaction: Parameters<typeof editableTransaction>[0];
  transactionRefreshFailed: boolean;
  transactionId: string;
}>) {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const toast = useToast();
  const closeTo =
    origin === 'pending'
      ? '/my-companies/accounts/$companyId/pending-transactions'
      : '/my-companies/accounts/$companyId';
  const [deleteTransaction, { loading: deleting }] =
    useMutation(DELETE_TRANSACTION);
  const {
    blocker,
    categories,
    clients,
    completeMutation,
    currency,
    data,
    discardChanges,
    discardOpen,
    discardStagedAttachment,
    error,
    form,
    loading,
    markDirty,
    online,
    refetch,
    removeAttachment,
    requestClose,
    setDiscardOpen,
    submissionPending,
    suggestions,
    trackAttachmentTransfer,
    vatRate,
  } = useTransactionForm({
    additionalPending: deleting,
    closeTo,
    companyId,
    confirmedReturnTo: '/my-companies/accounts/$companyId',
    initialDateTime: transaction.date,
    initialValues: editableTransaction(transaction),
  });
  const pending = submissionPending || deleting;
  const deleteCurrentTransaction = async () => {
    try {
      const result = await deleteTransaction({
        update: (cache, mutation) => {
          if (mutation.data?.deleteTransaction) {
            removeTransactionFromCache(
              cache,
              mutation.data.deleteTransaction.companyId,
              mutation.data.deleteTransaction.id,
            );
          }
        },
        variables: { id: transactionId },
      });

      if (!result.data?.deleteTransaction) {
        throw new Error('No deleted Transaction returned');
      }
    } catch {
      toast.show({
        description: t(
          'Nothing was deleted. Check your connection and try again.',
        ),
        title: t('Transaction could not be deleted'),
        variant: 'danger',
      });
      return false;
    }

    await discardStagedAttachment().catch(() => false);
    toast.show({ title: t('Transaction deleted'), variant: 'success' });
    completeMutation();
    await navigate({ params: { companyId }, to: closeTo }).catch(
      () => undefined,
    );
    return true;
  };

  return (
    <>
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
        open
        triggerless
      >
        <Drawer.Content
          dismissible={!pending}
          keyboardDismissDisabled={pending}
          placement={{ base: 'bottom', md: 'end' }}
          size="wide"
        >
          <Drawer.Description>
            {t('Update this Transaction.')}
          </Drawer.Description>
          <Drawer.Title>{t('Edit transaction')}</Drawer.Title>
          {(error || transactionRefreshFailed) && data ? (
            <QueryRefreshAlert
              onRetry={() => {
                Promise.all([refetch(), refetchTransaction()]).catch(
                  () => undefined,
                );
              }}
              retryLabel={t('Try again', { ns: 'routing' })}
            >
              {t(
                'Transaction details could not be refreshed. Your edits are unchanged.',
              )}
            </QueryRefreshAlert>
          ) : null}
          {error && !data ? (
            <TransactionFormUnavailable
              loading={loading}
              onRetry={() => {
                Promise.all([refetch(), refetchTransaction()]).catch(
                  () => undefined,
                );
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
              submissionPending={pending}
            >
              <RecordTransactionFormFields
                categories={categories}
                clients={clients}
                companyId={companyId}
                currency={currency}
                editing
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
                    danger={
                      <EntityDeleteDialog
                        cancelLabel={t('Cancel')}
                        closeLabel={t('Close delete confirmation')}
                        confirmationError={t(
                          'The Transaction description must match exactly.',
                        )}
                        confirmationLabel={t('Type {{name}} to confirm', {
                          name: transaction.description,
                        })}
                        confirmLabel={t('Permanently delete Transaction')}
                        deleting={deleting}
                        description={t(
                          'This Transaction and its attachment will be permanently removed.',
                        )}
                        disabled={!online || submissionPending}
                        entityName={transaction.description}
                        nested
                        onDelete={deleteCurrentTransaction}
                        title={t('Delete {{name}}?', {
                          name: transaction.description,
                        })}
                        triggerLabel={t('Delete Transaction')}
                      />
                    }
                    primary={
                      <Button
                        disabled={!online || !canSubmit || pending}
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
        description={t('The unsaved Transaction changes will be lost.')}
        nested
        onDiscard={discardChanges}
        onOpenChange={setDiscardOpen}
        open={discardOpen && !pending}
        title={t('Discard Transaction changes?')}
        trigger={t('Discard Transaction changes')}
      />
    </>
  );
}

export function TransactionEditPage({
  companyId,
  origin,
  transactionId,
}: Readonly<{
  companyId: string;
  origin: TransactionEditOrigin;
  transactionId: string;
}>) {
  const { t } = useTranslation(['transactions', 'routing']);
  const navigate = useNavigate();
  const { data, error, loading, refetch } = useQuery(GET_TRANSACTION, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { transactionId },
  });
  const transaction =
    data?.getTransaction.companyId === companyId
      ? data.getTransaction
      : undefined;
  const Background =
    origin === 'pending'
      ? PendingTransactionsPageContent
      : TransactionsPageContent;

  return (
    <>
      <Background companyId={companyId} />
      {transaction ? (
        <TransactionEditDrawer
          companyId={companyId}
          origin={origin}
          refetchTransaction={refetch}
          transaction={{
            ...transaction,
            attachment: transaction.attachment ?? '',
          }}
          transactionRefreshFailed={Boolean(error)}
          transactionId={transactionId}
        />
      ) : (
        <Drawer.Root
          onOpenChange={(open) => {
            if (!open) {
              navigate({
                params: { companyId },
                to:
                  origin === 'pending'
                    ? '/my-companies/accounts/$companyId/pending-transactions'
                    : '/my-companies/accounts/$companyId',
              }).catch(() => undefined);
            }
          }}
          open
          triggerless
        >
          <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
            <Drawer.Description>{t('Transaction details')}</Drawer.Description>
            <Drawer.Title>{t('Edit transaction')}</Drawer.Title>
            {error || (!loading && !transaction) ? (
              <StatePanel
                action={
                  <Button
                    disabled={loading}
                    onAction={() => {
                      refetch().catch(() => undefined);
                    }}
                  >
                    {t('Try again', { ns: 'routing' })}
                  </Button>
                }
                description={t('The Transaction could not be loaded.')}
                icon={<span aria-hidden="true">!</span>}
                title={t('Transaction unavailable')}
                variant="danger"
              />
            ) : (
              <p aria-live="polite">{t('Loading Transaction…')}</p>
            )}
          </Drawer.Content>
        </Drawer.Root>
      )}
    </>
  );
}
