import { useMutation, useQuery } from '@apollo/client/react';
import { useToast } from '@motech-development/breeze-ui';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ADD_TRANSACTION, GET_RECORD_TRANSACTION } from '../../data/operations';
import { useOnlineStatus } from '../../pwa/connectivity';
import { useFormNavigation } from '../forms/useFormNavigation';
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

      toast.show({
        description: `${recordedSale.name} · ${recordedSale.description}`,
        title: t('Confirmed sale recorded'),
        variant: 'success',
      });
      navigationActions.current?.completeMutation();
      await navigate({
        params: { companyId },
        to: returnTo,
      }).catch(navigationActions.current?.restrictNavigation);
    },
    validators: {
      onBlur: confirmedSaleSchema,
      onMount: confirmedSaleSchema,
    },
  });
  const submissionPending = useStore(form.store, (state) => state.isSubmitting);
  const navigation = useFormNavigation({
    onClose: () =>
      navigate({
        params: { companyId },
        to: returnTo,
      }),
    pending: submissionPending,
  });

  navigationActions.current = navigation;

  return {
    clients: data?.getClients.items ?? [],
    data,
    dirty: navigation.dirty,
    discardOpen: navigation.discardOpen,
    error,
    form,
    leaveForm: navigation.leave,
    loading,
    markDirty: navigation.markDirty,
    online,
    refetch,
    requestClose: navigation.requestClose,
    resetBlockedNavigation: navigation.resetBlockedNavigation,
    setDiscardOpen: navigation.setDiscardOpen,
    submissionPending,
    trackAttachmentTransfer: (transfer: Promise<AttachmentTransferResult>) => {
      attachmentTransfer.current = transfer;
    },
    vatRate: data?.getSettings.vat.pay ?? 0,
  };
}

export type ConfirmedSaleForm = ReturnType<typeof useConfirmedSaleForm>['form'];
