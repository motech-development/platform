import { useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  Drawer,
  FormActions,
  StatePanel,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import { WarningIcon } from '@motech-development/breeze-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DELETE_TRANSACTION, GET_TRANSACTION } from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { EntityDeleteDialog } from '../forms/EntityDeleteDialog';
import { SubmittingForm } from '../forms/SubmittingForm';
import { TransactionEditDrawerSkeleton } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { DashboardPageContent } from './DashboardPageContent';
import { PendingTransactionsPageContent } from './PendingTransactionsPageContent';
import { RecordTransactionFormFields } from './RecordTransactionFormFields';
import { editableTransaction } from './transaction';
import { removeTransactionFromCache } from './transaction-cache';
import { TransactionFormUnavailable } from './TransactionPagePresentation';
import { TransactionsPageContent } from './TransactionsPageContent';
import { useTransactionForm } from './useTransactionForm';

type TransactionEditOrigin = 'dashboard' | 'pending' | 'transactions';

const transactionEditOrigins = {
  dashboard: {
    Background: DashboardPageContent,
    closeTo: '/my-companies/dashboard/$companyId',
    confirmedReturnTo: '/my-companies/dashboard/$companyId',
  },
  pending: {
    Background: PendingTransactionsPageContent,
    closeTo: '/my-companies/accounts/$companyId/pending-transactions',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  },
  transactions: {
    Background: TransactionsPageContent,
    closeTo: '/my-companies/accounts/$companyId',
    confirmedReturnTo: '/my-companies/accounts/$companyId',
  },
} as const;

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
  const { t } = useTranslation(['transactions', 'routing']);
  const navigate = useNavigate();
  const toast = useToast();
  const { closeTo, confirmedReturnTo } = transactionEditOrigins[origin];
  const [deleteTransaction, { loading: deleting }] =
    useMutation(DELETE_TRANSACTION);
  const transactionDeletionCompleted = useRef(false);
  const [transactionDeleted, setTransactionDeleted] = useState(false);
  const {
    blocker,
    categories,
    clients,
    completeMutation,
    currency,
    data,
    discardChanges,
    discardOpen,
    discardPersistedAttachment,
    discardStagedAttachment,
    error,
    form,
    loading,
    markDirty,
    online,
    refetch,
    removeAttachment,
    requestClose,
    restrictNavigation,
    retryPreviousAttachmentCleanup,
    setDiscardOpen,
    submissionPending,
    suggestions,
    trackAttachmentTransfer,
    vatRate,
  } = useTransactionForm({
    additionalPending: deleting || transactionDeleted,
    closeTo,
    companyId,
    confirmedReturnTo,
    initialDateTime: transaction.date,
    initialValues: editableTransaction(transaction),
  });
  const pending = submissionPending || deleting || transactionDeleted;

  if (loading && !data) {
    return (
      <TransactionEditDrawerSkeleton
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
      />
    );
  }

  const deleteCurrentTransaction = async () => {
    if (!(await retryPreviousAttachmentCleanup())) return false;

    if (!transactionDeletionCompleted.current) {
      try {
        const result = await deleteTransaction({
          update: (cache, mutation) => {
            const deletedTransaction = mutation.data?.deleteTransaction;

            if (deletedTransaction) {
              removeTransactionFromCache(
                cache,
                deletedTransaction.companyId,
                deletedTransaction.id,
              );
            }
          },
          variables: { id: transactionId },
        });

        if (!result.data?.deleteTransaction) {
          throw new Error('No deleted Transaction returned');
        }

        transactionDeletionCompleted.current = true;
        setTransactionDeleted(true);
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
    }

    if (!(await discardPersistedAttachment())) return false;

    const stagedAttachmentDiscarded = await discardStagedAttachment().catch(
      () => false,
    );

    if (!stagedAttachmentDiscarded) return false;

    completeMutation();
    const navigated = await navigate({ params: { companyId }, to: closeTo })
      .then(() => true)
      .catch(() => {
        restrictNavigation();
        toast.show({
          description: t(
            'The transaction was deleted. Try opening the transaction list again.',
          ),
          title: t('Transaction list could not be opened'),
          variant: 'danger',
        });
        return false;
      });

    if (!navigated) return false;

    toast.show({ title: t('Transaction deleted'), variant: 'success' });
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
            {t('Update the transaction and its attachment.')}
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
                discardStagedAttachment={discardStagedAttachment}
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
                          'The supplier or client name must match exactly.',
                        )}
                        confirmationLabel={t('Type {{name}} to confirm', {
                          name: transaction.name,
                        })}
                        confirmLabel={t('Permanently delete transaction')}
                        deleting={deleting}
                        description={t(
                          'This transaction and its attachment will be permanently removed.',
                        )}
                        dismissible={!transactionDeleted}
                        disabled={!online || submissionPending}
                        entityName={transaction.name}
                        nested
                        onDelete={deleteCurrentTransaction}
                        title={t('Delete {{name}}?', {
                          name: transaction.name,
                        })}
                        triggerLabel={t('Delete transaction')}
                      />
                    }
                    primary={
                      <Button
                        disabled={!online || !canSubmit || pending}
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
        description={t('The unsaved Transaction changes will be lost.')}
        nested
        onDiscard={discardChanges}
        onOpenChange={setDiscardOpen}
        open={discardOpen && !pending}
        title={t('Discard Transaction changes?')}
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
  const transactionForCompany =
    data?.getTransaction.companyId === companyId
      ? data.getTransaction
      : undefined;
  const [openedTransaction, setOpenedTransaction] = useState<
    | {
        id: string;
        status: 'confirmed' | 'pending';
      }
    | undefined
  >(undefined);
  const openedTransactionStatus =
    openedTransaction?.id === transactionId
      ? openedTransaction.status
      : undefined;
  const publishedPendingTransaction =
    transactionForCompany !== undefined &&
    (origin === 'pending' || openedTransactionStatus === 'pending') &&
    transactionForCompany.status !== 'pending';
  const transaction = publishedPendingTransaction
    ? undefined
    : transactionForCompany;
  const { Background, closeTo } = transactionEditOrigins[origin];

  useEffect(() => {
    if (transactionForCompany && openedTransaction?.id !== transactionId) {
      setOpenedTransaction({
        id: transactionId,
        status: transactionForCompany.status,
      });
    }
  }, [openedTransaction?.id, transactionForCompany, transactionId]);

  useEffect(() => {
    if (publishedPendingTransaction) {
      navigate({
        params: { companyId },
        to: closeTo,
      }).catch(() => undefined);
    }
  }, [closeTo, companyId, navigate, publishedPendingTransaction]);

  if (publishedPendingTransaction) {
    return <Background companyId={companyId} />;
  }

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
                to: closeTo,
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
                icon={<WarningIcon />}
                title={t('Transaction unavailable')}
                variant="danger"
              />
            ) : (
              <Typography aria-live="polite">
                {t('Loading Transaction…')}
              </Typography>
            )}
          </Drawer.Content>
        </Drawer.Root>
      )}
    </>
  );
}
