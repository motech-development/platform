import { useMutation, useQuery } from '@apollo/client/react';
import { useToast } from '@motech-development/breeze-ui';
import { useForm } from '@tanstack/react-form';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ADD_TRANSACTION, GET_RECORD_TRANSACTION } from '../../data/operations';
import { useOnlineStatus } from '../../pwa/connectivity';
import type { AttachmentTransferResult } from './AttachmentUpload';
import { addConfirmedTransactionToCache } from './cache-updates';
import { buildConfirmedSale, confirmedSaleSchema } from './sale';

export type ConfirmedSaleReturnRoute =
  | '/my-companies/accounts/$companyId'
  | '/my-companies/dashboard/$companyId';

function localCalendarDate(date: Date) {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-');
}

export function useConfirmedSaleForm(
  companyId: string,
  returnTo: ConfirmedSaleReturnRoute,
) {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const toast = useToast();
  const online = useOnlineStatus();
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const allowNavigation = useRef(false);
  const attachmentTransfer = useRef<
    Promise<AttachmentTransferResult> | undefined
  >(undefined);
  const blocker = useBlocker({
    enableBeforeUnload: dirty,
    shouldBlockFn: () => dirty && !allowNavigation.current,
    withResolver: true,
  });
  const { data, error, loading, refetch } = useQuery(GET_RECORD_TRANSACTION, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const form = useForm({
    defaultValues: {
      amount: '',
      attachment: '',
      client: '',
      companyId,
      date: localCalendarDate(new Date()),
      description: '',
      vat: '',
    },
    onSubmit: async ({ value }) => {
      const transfer = await attachmentTransfer.current;

      if (transfer?.status === 'cancelled' || transfer?.status === 'failed') {
        return;
      }

      let recordedSale: { description: string; name: string };

      try {
        const result = await addTransaction({
          update: (cache, mutation) => {
            if (mutation.data?.addTransaction) {
              addConfirmedTransactionToCache(cache, {
                ...mutation.data.addTransaction,
                __typename: 'Transaction',
                attachment: mutation.data.addTransaction.attachment ?? '',
                status: 'confirmed',
              });
            }
          },
          variables: {
            input: buildConfirmedSale({
              ...value,
              attachment:
                transfer?.status === 'uploaded'
                  ? transfer.path
                  : value.attachment,
            }),
          },
        });

        if (!result.data?.addTransaction) {
          throw new Error(t('No transaction was returned'));
        }

        recordedSale = result.data.addTransaction;
      } catch {
        toast.show({
          description: t(
            'Your changes are still here. Check the details and retry.',
          ),
          title: t('Sale could not be recorded'),
          variant: 'danger',
        });
        return;
      }

      allowNavigation.current = true;
      setDirty(false);
      toast.show({
        description: `${recordedSale.name} · ${recordedSale.description}`,
        title: t('Confirmed sale recorded'),
        variant: 'success',
      });
      await navigate({
        params: { companyId },
        to: returnTo,
      }).catch(() => undefined);
    },
    validators: {
      onBlur: confirmedSaleSchema,
      onMount: confirmedSaleSchema,
    },
  });

  const markDirty = () => {
    setDirty(true);
  };
  const leaveForm = () => {
    allowNavigation.current = true;
    setDiscardOpen(false);
    setDirty(false);

    if (blocker.status === 'blocked') {
      blocker.proceed();
      return;
    }

    navigate({
      params: { companyId },
      to: returnTo,
    }).catch(() => undefined);
  };
  const requestClose = () => {
    if (dirty) {
      setDiscardOpen(true);
      return;
    }

    leaveForm();
  };
  const resetBlockedNavigation = () => {
    if (blocker.status === 'blocked' && !allowNavigation.current) {
      blocker.reset();
    }
  };

  useEffect(() => {
    if (blocker.status === 'blocked') {
      setDiscardOpen(true);
    }
  }, [blocker.status]);

  return {
    clients: data?.getClients.items ?? [],
    data,
    dirty,
    discardOpen,
    error,
    form,
    leaveForm,
    loading,
    markDirty,
    online,
    refetch,
    requestClose,
    resetBlockedNavigation,
    setDiscardOpen,
    trackAttachmentTransfer: (transfer: Promise<AttachmentTransferResult>) => {
      attachmentTransfer.current = transfer;
    },
    vatRate: data?.getSettings.vat.pay ?? 0,
  };
}

export type ConfirmedSaleForm = ReturnType<typeof useConfirmedSaleForm>['form'];
