import { useMutation, useQuery } from '@apollo/client/react';
import { Drawer, useToast } from '@motech-development/breeze-ui';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DELETE_CLIENT,
  GET_CLIENT,
  UPDATE_CLIENT,
} from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { QueryFailureState } from '../companies/QueryFailureState';
import { EntityDeleteDialog } from '../forms/EntityDeleteDialog';
import { useFormNavigation } from '../forms/useFormNavigation';
import { FormSkeletonRegion } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { removeClientFromCache, upsertClientInCache } from './cache-updates';
import { ClientDetailsForm } from './ClientDetailsForm';
import { ClientDetailsFormSkeleton } from './ClientDetailsFormSkeleton';
import { ClientsPageContent } from './ClientsPageContent';

export function ClientEditPage({
  clientId,
  companyId,
}: Readonly<{ clientId: string; companyId: string }>) {
  const { t } = useTranslation('clients');
  const toast = useToast();
  const navigate = useNavigate();
  const [savePending, setSavePending] = useState(false);
  const { data, error, loading, refetch } = useQuery(GET_CLIENT, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: clientId },
  });
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [deleteClient, { loading: deleting }] = useMutation(DELETE_CLIENT);
  const navigation = useFormNavigation({
    blockPendingNavigation: savePending || deleting,
    onClose: () =>
      navigate({
        params: { companyId },
        to: '/my-companies/clients/$companyId',
      }),
    pending: savePending || deleting,
  });
  const client =
    data?.getClient.companyId === companyId ? data.getClient : undefined;
  const deleteCurrentClient = async () => {
    try {
      const result = await deleteClient({
        update: (cache, mutation) => {
          if (mutation.data?.deleteClient) {
            removeClientFromCache(
              cache,
              mutation.data.deleteClient.companyId,
              mutation.data.deleteClient.id,
            );
          }
        },
        variables: { id: clientId },
      });
      if (!result.data?.deleteClient) throw new Error('No client returned');
    } catch {
      navigation.resetBlockedNavigation();
      toast.show({
        description: t(
          'Nothing was deleted. Check your connection and try again.',
        ),
        title: t('Client could not be deleted'),
        variant: 'danger',
      });
      return false;
    }

    toast.show({ title: t('Client deleted'), variant: 'success' });
    if (navigation.completeMutation({ resumeBlockedNavigation: true })) {
      return true;
    }

    await navigate({
      params: { companyId },
      to: '/my-companies/clients/$companyId',
    }).catch(navigation.restrictNavigation);

    return true;
  };

  return (
    <>
      <ClientsPageContent companyId={companyId} />
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) navigation.requestClose();
        }}
        open
        triggerless
      >
        <Drawer.Content
          dismissible={!savePending && !deleting}
          keyboardDismissDisabled={savePending || deleting}
          placement={{ base: 'bottom', md: 'end' }}
          size="medium"
        >
          <Drawer.Description>
            {client
              ? t('Keep {{name}}’s details up to date.', {
                  name: client.name,
                })
              : t('Keep this client’s details up to date.')}
          </Drawer.Description>
          <Drawer.Title>{t('Edit client')}</Drawer.Title>
          {error && client ? (
            <QueryRefreshAlert
              onRetry={() => {
                refetch().catch(() => undefined);
              }}
              retryLabel={t('Try again', { ns: 'routing' })}
            >
              {t(
                'Client details could not be refreshed. Check your connection, then try again.',
              )}
            </QueryRefreshAlert>
          ) : null}
          {loading && !data ? (
            <FormSkeletonRegion loadingLabel={t('Loading client details')}>
              <ClientDetailsFormSkeleton danger />
            </FormSkeletonRegion>
          ) : null}
          {!loading && !client ? (
            <QueryFailureState
              onRetry={() => {
                refetch().catch(() => undefined);
              }}
              title={t('Client details could not be loaded')}
            />
          ) : null}
          {client ? (
            <ClientDetailsForm
              danger={
                <EntityDeleteDialog
                  cancelLabel={t('Cancel')}
                  closeLabel={t('Close delete confirmation')}
                  confirmationError={t('The client name must match exactly.')}
                  confirmationLabel={t('Type {{name}} to confirm', {
                    name: client.name,
                  })}
                  confirmLabel={t('Permanently delete client')}
                  deleting={deleting}
                  description={t(
                    'The client will be removed. Existing transactions will remain.',
                  )}
                  entityName={client.name}
                  nested
                  onDelete={deleteCurrentClient}
                  title={t('Delete {{name}}?', { name: client.name })}
                  triggerLabel={t('Delete client')}
                />
              }
              initialValues={{
                ...client,
                address: {
                  ...client.address,
                  line2: client.address.line2 ?? '',
                  line4: client.address.line4 ?? '',
                },
              }}
              key={clientId}
              onCancel={navigation.requestClose}
              onDirty={navigation.markDirty}
              onSubmit={async (input) => {
                setSavePending(true);

                try {
                  try {
                    const result = await updateClient({
                      update: (cache, mutation) => {
                        if (mutation.data?.updateClient) {
                          upsertClientInCache(
                            cache,
                            mutation.data.updateClient.companyId,
                            mutation.data.updateClient,
                          );
                        }
                      },
                      variables: { input },
                    });
                    if (!result.data?.updateClient) {
                      throw new Error('No client returned');
                    }
                  } catch {
                    toast.show({
                      description: t(
                        'Your changes are still here. Check them and try again.',
                      ),
                      title: t('Client details could not be saved'),
                      variant: 'danger',
                    });
                    navigation.proceedBlockedNavigationIfPristine();
                    return;
                  }

                  toast.show({
                    title: t('Client details saved'),
                    variant: 'success',
                  });
                  if (
                    navigation.completeMutation({
                      resumeBlockedNavigation: true,
                    })
                  )
                    return;

                  await navigate({
                    params: { companyId },
                    to: '/my-companies/clients/$companyId',
                  }).catch(navigation.restrictNavigation);
                } finally {
                  setSavePending(false);
                }
              }}
              submitLabel={t('Save client')}
            />
          ) : null}
        </Drawer.Content>
      </Drawer.Root>
      <DiscardChangesDialog
        blocker={navigation.blocker}
        closeLabel={t('Close discard confirmation')}
        description={t('The unsaved client changes will be lost.')}
        nested
        onDiscard={navigation.discardChanges}
        onOpenChange={navigation.setDiscardOpen}
        open={navigation.discardOpen && !savePending && !deleting}
        title={t('Discard client changes?')}
      />
    </>
  );
}
