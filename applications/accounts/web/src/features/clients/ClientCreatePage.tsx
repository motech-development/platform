import { useMutation } from '@apollo/client/react';
import { Drawer, useToast } from '@motech-development/breeze-ui';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CREATE_CLIENT } from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { upsertClientInCache } from './cache-updates';
import { ClientDetailsForm } from './ClientDetailsForm';
import { ClientsPageContent } from './ClientsPageContent';

function clientDefaults(companyId: string) {
  return {
    address: { line1: '', line2: '', line3: '', line4: '', line5: '' },
    companyId,
    contact: { email: '', telephone: '' },
    id: '',
    name: '',
  };
}

export function ClientCreatePage({
  companyId,
}: Readonly<{ companyId: string }>) {
  const { t } = useTranslation('clients');
  const navigate = useNavigate();
  const toast = useToast();
  const allowNavigation = useRef(false);
  const creationComplete = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [creationPending, setCreationPending] = useState(false);
  const blocker = useBlocker({
    enableBeforeUnload: dirty,
    shouldBlockFn: () => dirty && !allowNavigation.current,
    withResolver: true,
  });
  const blockerRef = useRef(blocker);

  blockerRef.current = blocker;
  const [createClient] = useMutation(CREATE_CLIENT);
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
    if (creationPending) return;
    if (dirty) setDiscardOpen(true);
    else leave();
  };

  useEffect(() => {
    if (blocker.status === 'blocked' && !creationPending) setDiscardOpen(true);
  }, [blocker.status, creationPending]);

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
          dismissible={!creationPending}
          keyboardDismissDisabled={creationPending}
          placement={{ base: 'bottom', md: 'end' }}
          size="medium"
        >
          <Drawer.Description>
            {t('Create a client for sales transactions.')}
          </Drawer.Description>
          <Drawer.Title>{t('Add client')}</Drawer.Title>
          <ClientDetailsForm
            initialValues={clientDefaults(companyId)}
            onCancel={requestClose}
            onDirty={() => setDirty(true)}
            onSubmit={async (input) => {
              if (creationComplete.current) return;
              setCreationPending(true);

              let created;

              try {
                const result = await createClient({
                  update: (cache, mutation) => {
                    if (mutation.data?.createClient) {
                      upsertClientInCache(
                        cache,
                        mutation.data.createClient.companyId,
                        mutation.data.createClient,
                      );
                    }
                  },
                  variables: { input },
                });
                created = result.data?.createClient;
                if (!created) throw new Error('No client returned');
              } catch {
                setCreationPending(false);
                toast.show({
                  description: t(
                    'Your client details are still here. Check them and try again.',
                  ),
                  title: t('Client could not be added'),
                  variant: 'danger',
                });
                return;
              }

              const activeBlocker = blockerRef.current;
              if (activeBlocker.status === 'blocked') activeBlocker.reset?.();
              creationComplete.current = true;
              allowNavigation.current = true;
              setDirty(false);
              toast.show({
                description: t('{{name}} is ready to use.', {
                  name: created.name,
                }),
                title: t('Client added'),
                variant: 'success',
              });
              try {
                await navigate({
                  params: { companyId: created.companyId },
                  to: '/my-companies/clients/$companyId',
                });
              } catch {
                await navigate({ to: '/my-companies' }).catch(() => {
                  setCreationPending(false);
                });
              }
            }}
            submitLabel={t('Save client')}
          />
        </Drawer.Content>
      </Drawer.Root>
      <DiscardChangesDialog
        blocker={blocker}
        closeLabel={t('Close discard confirmation')}
        description={t(
          'The client details entered in this drawer will be lost.',
        )}
        nested
        onDiscard={() => {
          if (creationPending) return;

          discardChanges();
          if (blocker.status !== 'blocked') {
            navigate({
              params: { companyId },
              to: '/my-companies/clients/$companyId',
            }).catch(() => undefined);
          }
        }}
        onOpenChange={setDiscardOpen}
        open={discardOpen}
        title={t('Discard this client?')}
        trigger={t('Discard client')}
      />
    </>
  );
}
