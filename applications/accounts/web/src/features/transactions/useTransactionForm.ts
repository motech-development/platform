import { useMutation, useQuery } from '@apollo/client/react';
import { useToast } from '@motech-development/breeze-ui';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ADD_TRANSACTION,
  DELETE_FILE,
  GET_RECORD_TRANSACTION,
  UPDATE_TRANSACTION,
} from '../../data/operations';
import { useOnlineStatus } from '../../pwa/connectivity';
import { useFormNavigation } from '../forms/useFormNavigation';
import type { AttachmentTransferResult } from './AttachmentUpload';
import {
  buildTransactionInput,
  type TransactionFormValues,
  transactionSchema,
} from './transaction';
import { reconcileTransactionInCache } from './transaction-cache';

export type TransactionReturnRoute =
  | '/my-companies/accounts/$companyId'
  | '/my-companies/dashboard/$companyId'
  | '/my-companies/accounts/$companyId/pending-transactions';

function localCalendarDate(date: Date) {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-');
}

function defaultValues(
  companyId: string,
  status: '' | 'confirmed' | 'pending',
): TransactionFormValues {
  return {
    amount: '',
    attachment: '',
    category: '',
    companyId,
    date: localCalendarDate(new Date()),
    description: '',
    id: '',
    name: '',
    refund: false,
    scheduled: false,
    status,
    transactionType: 'purchase',
    vat: '',
  };
}

export function useTransactionForm({
  companyId,
  closeTo,
  confirmedReturnTo,
  additionalPending = false,
  initialValues,
  initialStatus = '',
}: Readonly<{
  companyId: string;
  closeTo?: TransactionReturnRoute;
  additionalPending?: boolean;
  confirmedReturnTo: Exclude<
    TransactionReturnRoute,
    '/my-companies/accounts/$companyId/pending-transactions'
  >;
  initialStatus?: '' | 'confirmed' | 'pending';
  initialValues?: TransactionFormValues;
}>) {
  const { t } = useTranslation(['transactions', 'attachments']);
  const navigate = useNavigate();
  const toast = useToast();
  const online = useOnlineStatus();
  const [attachmentTransferPending, setAttachmentTransferPending] =
    useState(false);
  const navigationActions = useRef<
    | Pick<
        ReturnType<typeof useFormNavigation>,
        'completeMutation' | 'restrictNavigation'
      >
    | undefined
  >(undefined);
  const attachmentTransfer = useRef<
    Promise<AttachmentTransferResult> | undefined
  >(undefined);
  const { data, error, loading, refetch } = useQuery(GET_RECORD_TRANSACTION, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const [deleteFile] = useMutation(DELETE_FILE);
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
  const form = useForm({
    defaultValues: initialValues ?? defaultValues(companyId, initialStatus),
    onSubmit: async ({ value }) => {
      const transfer = await attachmentTransfer.current;

      if (transfer?.status === 'cancelled') {
        return;
      }

      if (transfer?.status === 'failed') {
        toast.show({
          description: t('Retry the attachment, then save again.', {
            ns: 'attachments',
          }),
          title: t('Attachment upload failed', { ns: 'attachments' }),
          variant: 'danger',
        });
        return;
      }

      const input = buildTransactionInput({
        ...value,
        attachment:
          transfer?.status === 'uploaded' ? transfer.path : value.attachment,
      });
      const editing = Boolean(input.id);

      try {
        if (editing) {
          const result = await updateTransaction({
            update: (cache, mutation) => {
              if (mutation.data?.updateTransaction) {
                reconcileTransactionInCache(
                  cache,
                  mutation.data.updateTransaction,
                );
              }
            },
            variables: { input },
          });

          if (!result.data?.updateTransaction) {
            throw new Error(t('No transaction was returned'));
          }

          const previousAttachment = initialValues?.attachment;

          if (previousAttachment && previousAttachment !== input.attachment) {
            try {
              const deletion = await deleteFile({
                variables: { id: companyId, path: previousAttachment },
              });

              if (!deletion.data?.deleteFile.path) {
                throw new Error('No deleted file returned');
              }
            } catch {
              toast.show({
                description: t(
                  'The Transaction was saved, but the previous attachment could not be deleted.',
                ),
                title: t('Attachment cleanup failed'),
                variant: 'danger',
              });
            }
          }
        } else {
          const result = await addTransaction({
            update: (cache, mutation) => {
              if (mutation.data?.addTransaction) {
                reconcileTransactionInCache(
                  cache,
                  mutation.data.addTransaction,
                );
              }
            },
            variables: { input },
          });

          if (!result.data?.addTransaction) {
            throw new Error(t('No transaction was returned'));
          }
        }
      } catch {
        toast.show({
          description: t(
            'Your changes are still here. Check the details and retry.',
          ),
          title: t('Transaction could not be saved'),
          variant: 'danger',
        });
        return;
      }

      toast.show({
        title: editing ? t('Transaction updated') : t('Transaction recorded'),
        variant: 'success',
      });
      navigationActions.current?.completeMutation();
      const returnTo =
        input.status === 'pending'
          ? '/my-companies/accounts/$companyId/pending-transactions'
          : confirmedReturnTo;

      await navigate({ params: { companyId }, to: returnTo }).catch(
        navigationActions.current?.restrictNavigation,
      );
    },
    validators: {
      onBlur: transactionSchema,
      onMount: transactionSchema,
    },
  });
  const formSubmissionPending = useStore(
    form.store,
    (state) => state.isSubmitting,
  );
  const submissionPending = formSubmissionPending || attachmentTransferPending;
  const navigation = useFormNavigation({
    blockPendingNavigation: submissionPending || additionalPending,
    onClose: () =>
      navigate({
        params: { companyId },
        to:
          closeTo ??
          (initialValues?.status === 'pending' || initialStatus === 'pending'
            ? '/my-companies/accounts/$companyId/pending-transactions'
            : confirmedReturnTo),
      }),
    pending: submissionPending,
  });

  navigationActions.current = navigation;

  return {
    ...navigation,
    categories: data?.getSettings.categories ?? [],
    clearAttachmentTransfer: () => {
      attachmentTransfer.current = undefined;
    },
    clients: data?.getClients.items ?? [],
    currency: data?.getBalance?.currency ?? 'GBP',
    data,
    error,
    form,
    loading,
    online,
    refetch,
    submissionPending,
    suggestions: data?.getTypeahead,
    trackAttachmentTransfer: (transfer: Promise<AttachmentTransferResult>) => {
      attachmentTransfer.current = transfer;
      setAttachmentTransferPending(true);
      transfer
        .finally(() => {
          if (attachmentTransfer.current === transfer) {
            setAttachmentTransferPending(false);
          }
        })
        .catch(() => undefined);
    },
    vatRate: data?.getSettings.vat.pay ?? 0,
  };
}

export type TransactionForm = ReturnType<typeof useTransactionForm>['form'];
