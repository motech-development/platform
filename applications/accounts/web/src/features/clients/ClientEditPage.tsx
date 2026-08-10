import { useMutation, useQuery } from '@apollo/client/react';
import {
  AlertDialog,
  Button,
  Drawer,
  Stack,
  TextField,
  useToast,
} from '@motech-development/breeze-ui';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DELETE_CLIENT,
  GET_CLIENT,
  UPDATE_CLIENT,
} from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { QueryFailureState } from '../companies/QueryFailureState';
import { QueryRefreshAlert } from '../companies/QueryRefreshAlert';
import { FormSkeletonRegion } from '../loading/AccountsPageSkeletons';
import { removeClientFromCache, upsertClientInCache } from './cache-updates';
import { exactClientNameSchema } from './client';
import { ClientDetailsForm } from './ClientDetailsForm';
import { ClientDetailsFormSkeleton } from './ClientDetailsFormSkeleton';
import { ClientsPageContent } from './ClientsPageContent';

export function ClientEditPage({
  clientId,
  companyId,
}: Readonly<{ clientId: string; companyId: string }>) {
  const { t } = useTranslation('clients');
  const navigate = useNavigate();
  const toast = useToast();
  const allowNavigation = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
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
  const blocker = useBlocker({
    enableBeforeUnload: dirty || savePending || deleting,
    shouldBlockFn: () =>
      (dirty || savePending || deleting) && !allowNavigation.current,
    withResolver: true,
  });
  const blockerRef = useRef(blocker);

  blockerRef.current = blocker;
  const client =
    data?.getClient.companyId === companyId ? data.getClient : undefined;
  const confirmationValid = client
    ? exactClientNameSchema(client.name).safeParse(confirmation).success
    : false;
  const discardChanges = () => {
    allowNavigation.current = true;
    setDirty(false);
    setDiscardOpen(false);
  };
  const leave = () => {
    discardChanges();

    if (blocker.status === 'blocked') {
      blocker.proceed();
      return;
    }

    navigate({
      params: { companyId },
      to: '/my-companies/clients/$companyId',
    }).catch(() => undefined);
  };
  const requestClose = () => {
    if (savePending || deleting) return;
    if (dirty) setDiscardOpen(true);
    else leave();
  };

  useEffect(() => {
    if (blocker.status === 'blocked' && !savePending && !deleting) {
      setDiscardOpen(true);
    }
  }, [blocker.status, deleting, savePending]);

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
      const activeBlocker = blockerRef.current;
      if (activeBlocker.status === 'blocked') activeBlocker.reset?.();
      toast.show({
        description: t(
          'Nothing was deleted. Check your connection and try again.',
        ),
        title: t('Client could not be deleted'),
        variant: 'danger',
      });
      return;
    }

    const activeBlocker = blockerRef.current;
    if (activeBlocker.status === 'blocked') activeBlocker.reset?.();
    allowNavigation.current = true;
    setDirty(false);
    setDeleteOpen(false);
    setConfirmation('');
    toast.show({ title: t('Client deleted'), variant: 'success' });
    await navigate({
      params: { companyId },
      to: '/my-companies/clients/$companyId',
    }).catch(() => {
      allowNavigation.current = false;
    });
  };

  return (
    <>
      <ClientsPageContent companyId={companyId} />
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) requestClose();
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
                <AlertDialog.Root
                  onOpenChange={(open) => {
                    if (!open && deleting) return;
                    setDeleteOpen(open);
                    if (!open) setConfirmation('');
                  }}
                  open={deleteOpen}
                >
                  <AlertDialog.Trigger variant="danger">
                    {t('Delete client')}
                  </AlertDialog.Trigger>
                  <AlertDialog.Content keyboardDismissDisabled={deleting}>
                    <AlertDialog.Title>
                      {t('Delete {{name}}?', { name: client.name })}
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                      {t(
                        'The client will be removed. Existing transactions will remain.',
                      )}
                    </AlertDialog.Description>
                    <Stack gap="lg">
                      <TextField.Root
                        invalid={confirmation.length > 0 && !confirmationValid}
                        onChange={setConfirmation}
                        value={confirmation}
                      >
                        <TextField.Label>
                          {t('Type {{name}} to confirm', {
                            name: client.name,
                          })}
                        </TextField.Label>
                        <TextField.Input autoComplete="off" />
                        <TextField.Error>
                          {t('The client name must match exactly.')}
                        </TextField.Error>
                      </TextField.Root>
                      <AlertDialog.Actions>
                        <AlertDialog.Close
                          appearance="outline"
                          disabled={deleting}
                        >
                          {t('Cancel')}
                        </AlertDialog.Close>
                        <Button
                          disabled={!confirmationValid || deleting}
                          loading={deleting}
                          onAction={() => {
                            deleteCurrentClient().catch(() => undefined);
                          }}
                          variant="danger"
                        >
                          {t('Permanently delete client')}
                        </Button>
                      </AlertDialog.Actions>
                    </Stack>
                  </AlertDialog.Content>
                </AlertDialog.Root>
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
              onCancel={requestClose}
              onDirty={() => setDirty(true)}
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
                    const activeBlocker = blockerRef.current;
                    if (activeBlocker.status === 'blocked' && !dirty) {
                      allowNavigation.current = true;
                      activeBlocker.proceed();
                    }
                    return;
                  }

                  toast.show({
                    title: t('Client details saved'),
                    variant: 'success',
                  });
                  const activeBlocker = blockerRef.current;
                  if (activeBlocker.status === 'blocked') {
                    allowNavigation.current = true;
                    setDirty(false);
                    activeBlocker.proceed();
                    return;
                  }
                  allowNavigation.current = true;
                  setDirty(false);
                  await navigate({
                    params: { companyId },
                    to: '/my-companies/clients/$companyId',
                  }).catch(() => {
                    allowNavigation.current = false;
                  });
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
        blocker={blocker}
        closeLabel={t('Close discard confirmation')}
        description={t('The unsaved client changes will be lost.')}
        nested
        onDiscard={() => {
          if (savePending || deleting) return;

          discardChanges();
          if (blocker.status !== 'blocked') {
            navigate({
              params: { companyId },
              to: '/my-companies/clients/$companyId',
            }).catch(() => undefined);
          }
        }}
        onOpenChange={setDiscardOpen}
        open={discardOpen && !savePending && !deleting}
        title={t('Discard client changes?')}
        trigger={t('Discard client changes')}
      />
    </>
  );
}
