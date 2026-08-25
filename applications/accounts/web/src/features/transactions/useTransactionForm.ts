import { useMutation, useQuery } from '@apollo/client/react';
import { useToast } from '@motech-development/breeze-ui';
import { useForm, useSelector } from '@tanstack/react-form';
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
  editableTransaction,
  type TransactionFormValues,
  transactionSchema,
} from './transaction';
import {
  reconcileTransactionInCache,
  type TransactionCacheValue,
} from './transaction-cache';

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
  dateTime: string,
): TransactionFormValues {
  return {
    amount: '',
    attachment: '',
    category: '',
    companyId,
    date: localCalendarDate(new Date(dateTime)),
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
  initialDateTime,
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
  initialDateTime?: string;
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
  const stagedAttachmentPath = useRef<string | undefined>(undefined);
  const previousAttachmentCleanupPath = useRef<string | undefined>(undefined);
  const persistedAttachmentPath = useRef(
    initialValues?.attachment || undefined,
  );
  const successfulReturnTo = useRef<TransactionReturnRoute | undefined>(
    undefined,
  );
  const successfulSubmissionTitle = useRef<string | undefined>(undefined);
  const persistedTransactionStatus = useRef<
    'confirmed' | 'pending' | undefined
  >(
    initialValues?.status === 'confirmed' || initialValues?.status === 'pending'
      ? initialValues.status
      : undefined,
  );
  const [persistedFormValues, setPersistedFormValues] =
    useState<TransactionFormValues>(
      () =>
        initialValues ??
        defaultValues(
          companyId,
          initialStatus,
          initialDateTime ?? new Date().toISOString(),
        ),
    );
  const { data, error, loading, refetch } = useQuery(GET_RECORD_TRANSACTION, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const [deleteFile] = useMutation(DELETE_FILE);
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
  const navigateAfterSuccessfulSubmission = async (
    returnTo: TransactionReturnRoute,
  ) => {
    navigationActions.current?.completeMutation();
    await navigate({ params: { companyId }, to: returnTo }).catch(() => {
      navigationActions.current?.restrictNavigation();
    });
  };
  const deleteAttachment = async (path: string, failureDescription: string) => {
    try {
      const deletion = await deleteFile({
        variables: { id: companyId, path },
      });

      if (!deletion.data?.deleteFile.path) {
        throw new Error('No deleted file returned');
      }

      return true;
    } catch {
      toast.show({
        description: failureDescription,
        title: t('Attachment cleanup failed'),
        variant: 'danger',
      });
      return false;
    }
  };
  const resetAttachmentTransferPending = () => {
    if (!attachmentTransfer.current) setAttachmentTransferPending(false);
  };
  const cleanUpPreviousAttachment = async () => {
    const path = previousAttachmentCleanupPath.current;

    if (!path) return true;

    setAttachmentTransferPending(true);
    const deleted = await deleteAttachment(
      path,
      t(
        'The Transaction was saved, but the previous attachment could not be deleted.',
      ),
    );

    if (deleted) previousAttachmentCleanupPath.current = undefined;
    resetAttachmentTransferPending();
    return deleted;
  };
  const announceSuccessfulSubmission = () => {
    const title = successfulSubmissionTitle.current;

    if (!title) return;

    toast.show({ title, variant: 'success' });
    successfulSubmissionTitle.current = undefined;
  };
  const discardStagedAttachment = async () => {
    const transfer = attachmentTransfer.current;

    attachmentTransfer.current = undefined;

    try {
      const transferResult = await transfer;
      const path =
        transferResult?.status === 'uploaded'
          ? transferResult.path
          : stagedAttachmentPath.current;

      if (!path) return true;

      stagedAttachmentPath.current = path;

      setAttachmentTransferPending(true);
      const deleted = await deleteAttachment(
        path,
        t('The staged attachment could not be deleted. Try again.', {
          ns: 'attachments',
        }),
      );

      if (deleted) stagedAttachmentPath.current = undefined;
      return deleted;
    } finally {
      resetAttachmentTransferPending();
    }
  };
  const cleanUpAttachmentsForDiscard = async () =>
    (await discardStagedAttachment()) && (await cleanUpPreviousAttachment());
  const attachmentTransferCanSubmit = (
    transfer: AttachmentTransferResult | undefined,
  ) => {
    if (transfer?.status === 'cancelled') return false;
    if (transfer?.status !== 'failed') return true;

    toast.show({
      description: t('Retry the attachment, then save again.', {
        ns: 'attachments',
      }),
      title: t('Attachment upload failed', { ns: 'attachments' }),
      variant: 'danger',
    });
    return false;
  };
  const saveTransaction = async (
    input: ReturnType<typeof buildTransactionInput>,
  ): Promise<TransactionCacheValue> => {
    if (input.id) {
      const result = await updateTransaction({
        update: (cache, mutation) => {
          if (mutation.data?.updateTransaction) {
            reconcileTransactionInCache(
              cache,
              mutation.data.updateTransaction,
              persistedTransactionStatus.current,
            );
          }
        },
        variables: { input },
      });

      if (!result.data?.updateTransaction) {
        throw new Error(t('No transaction was returned'));
      }

      return result.data.updateTransaction;
    }

    const result = await addTransaction({
      update: (cache, mutation) => {
        if (mutation.data?.addTransaction) {
          reconcileTransactionInCache(cache, mutation.data.addTransaction);
        }
      },
      variables: { input },
    });

    if (!result.data?.addTransaction) {
      throw new Error(t('No transaction was returned'));
    }

    return result.data.addTransaction;
  };
  const form = useForm({
    defaultValues: persistedFormValues,
    onSubmit: async ({ value }) => {
      if (!(await cleanUpPreviousAttachment())) return;

      if (successfulReturnTo.current) {
        announceSuccessfulSubmission();
        await navigateAfterSuccessfulSubmission(successfulReturnTo.current);
        return;
      }

      const transfer = await attachmentTransfer.current;

      if (!attachmentTransferCanSubmit(transfer)) return;

      const input = buildTransactionInput({
        ...value,
        attachment:
          transfer?.status === 'uploaded' ? transfer.path : value.attachment,
      });
      const editing = Boolean(input.id);
      const previousStatus = persistedTransactionStatus.current;
      let savedTransaction: TransactionCacheValue;
      const previousAttachment = persistedAttachmentPath.current;

      try {
        savedTransaction = await saveTransaction(input);
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

      attachmentTransfer.current = undefined;
      stagedAttachmentPath.current = undefined;
      persistedAttachmentPath.current =
        savedTransaction.attachment || undefined;
      persistedTransactionStatus.current = savedTransaction.status;
      const savedValues = editableTransaction({
        ...savedTransaction,
        attachment: savedTransaction.attachment ?? '',
      });

      setPersistedFormValues(savedValues);
      form.reset(savedValues);
      let returnTo: TransactionReturnRoute = confirmedReturnTo;

      if (editing && savedTransaction.status === previousStatus && closeTo) {
        returnTo = closeTo;
      } else if (savedTransaction.status === 'pending') {
        returnTo = '/my-companies/accounts/$companyId/pending-transactions';
      }

      successfulReturnTo.current = returnTo;
      successfulSubmissionTitle.current = editing
        ? t('Transaction updated')
        : t('Transaction recorded');

      if (
        previousAttachment &&
        previousAttachment !== persistedAttachmentPath.current
      ) {
        previousAttachmentCleanupPath.current = previousAttachment;
        if (!(await cleanUpPreviousAttachment())) return;
      }

      announceSuccessfulSubmission();
      await navigateAfterSuccessfulSubmission(returnTo);
    },
    validators: {
      onBlur: transactionSchema,
      onMount: transactionSchema,
    },
  });
  const formSubmissionPending = useSelector(
    form.store,
    (state) => state.isSubmitting,
  );
  const submissionPending = formSubmissionPending || attachmentTransferPending;
  const navigation = useFormNavigation({
    blockPendingNavigation: submissionPending || additionalPending,
    onClose: async () => {
      if (!(await cleanUpAttachmentsForDiscard())) {
        throw new Error('Attachment cleanup failed');
      }

      return navigate({
        params: { companyId },
        to:
          closeTo ??
          (initialValues?.status === 'pending' || initialStatus === 'pending'
            ? '/my-companies/accounts/$companyId/pending-transactions'
            : confirmedReturnTo),
      });
    },
    pending: submissionPending,
  });

  navigationActions.current = navigation;

  return {
    ...navigation,
    categories: data?.getSettings.categories ?? [],
    clients: data?.getClients.items ?? [],
    currency: data?.getBalance?.currency ?? 'GBP',
    data,
    discardChanges: async () => {
      try {
        const resumeBlockedNavigation = navigation.blocker.status === 'blocked';
        const discarded = await cleanUpAttachmentsForDiscard();

        if (discarded) {
          if (resumeBlockedNavigation) {
            navigation.completeMutation({ resumeBlockedNavigation: true });
          } else {
            navigation.discardChanges();
          }
        }
        return discarded;
      } catch {
        return false;
      }
    },
    discardStagedAttachment,
    error,
    form,
    loading,
    markDirty: () => {
      successfulReturnTo.current = undefined;
      successfulSubmissionTitle.current = undefined;
      navigation.markDirty();
    },
    online,
    refetch,
    removeAttachment: async (path: string) => {
      const transfer = attachmentTransfer.current;

      attachmentTransfer.current = undefined;

      try {
        const transferResult = await transfer;
        const stagedPath =
          transferResult?.status === 'uploaded'
            ? transferResult.path
            : stagedAttachmentPath.current;

        if (stagedPath !== path) return true;

        setAttachmentTransferPending(true);
        const deleted = await deleteAttachment(
          path,
          t('Nothing was deleted. Try again.', {
            ns: 'attachments',
          }),
        );

        if (deleted) stagedAttachmentPath.current = undefined;
        return deleted;
      } finally {
        resetAttachmentTransferPending();
      }
    },
    retryPreviousAttachmentCleanup: cleanUpPreviousAttachment,
    submissionPending,
    suggestions: data?.getTypeahead,
    trackAttachmentTransfer: (transfer: Promise<AttachmentTransferResult>) => {
      attachmentTransfer.current = transfer;
      setAttachmentTransferPending(true);
      transfer
        .then((result) => {
          if (
            attachmentTransfer.current === transfer &&
            result.status === 'uploaded'
          ) {
            stagedAttachmentPath.current = result.path;
          }
        })
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
