import { useMutation, useQuery } from '@apollo/client/react';
import { Drawer, useToast } from '@motech-development/breeze-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DELETE_CLIENT,
  GET_CLIENT,
  UPDATE_CLIENT,
} from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { QueryFailureState } from '../companies/QueryFailureState';
import { QueryRefreshAlert } from '../companies/QueryRefreshAlert';
import { exactEntityNameSchema } from '../entity-details';
import { FormSkeletonRegion } from '../loading/AccountsPageSkeletons';
import { removeClientFromCache, upsertClientInCache } from './cache-updates';
import { ClientDeleteDialog } from './ClientDeleteDialog';
import { ClientDetailsForm } from './ClientDetailsForm';
import { ClientDetailsFormSkeleton } from './ClientDetailsFormSkeleton';
import { ClientsPageContent } from './ClientsPageContent';
import { useClientDrawerNavigation } from './useClientDrawerNavigation';

export function ClientEditPage({
  clientId,
  companyId,
}: Readonly<{ clientId: string; companyId: string }>) {
  const { t } = useTranslation('clients');
  const toast = useToast();
  const [savePending, setSavePending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const { data, error, loading, refetch } = useQuery(GET_CLIENT, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: clientId },
  });
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [deleteClient, { loading: deleting }] = useMutation(DELETE_CLIENT);
  const navigation = useClientDrawerNavigation({
    companyId,
    pending: savePending || deleting,
  });
  const client =
    data?.getClient.companyId === companyId ? data.getClient : undefined;
  const confirmationValid = client
    ? exactEntityNameSchema(client.name).safeParse(confirmation).success
    : false;
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
      return;
    }

    setDeleteOpen(false);
    setConfirmation('');
    toast.show({ title: t('Client deleted'), variant: 'success' });
    if (navigation.completeMutation()) return;

    await navigation.navigateToClients().catch(navigation.restrictNavigation);
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
              ? t('Update {{name}} or remove this client.', {
                  name: client.name,
                })
              : t('Update this client or remove them.')}
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
                <ClientDeleteDialog
                  clientName={client.name}
                  confirmation={confirmation}
                  confirmationValid={confirmationValid}
                  deleting={deleting}
                  onConfirmationChange={setConfirmation}
                  onDelete={() => {
                    deleteCurrentClient().catch(() => undefined);
                  }}
                  onOpenChange={(open) => {
                    if (!open && deleting) return;
                    setDeleteOpen(open);
                    if (!open) setConfirmation('');
                  }}
                  open={deleteOpen}
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
                  if (navigation.completeMutation()) return;

                  await navigation
                    .navigateToClients()
                    .catch(navigation.restrictNavigation);
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
        trigger={t('Discard client changes')}
      />
    </>
  );
}
