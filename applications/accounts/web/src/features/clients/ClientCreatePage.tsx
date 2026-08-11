import { useMutation } from '@apollo/client/react';
import { Drawer, useToast } from '@motech-development/breeze-ui';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CREATE_CLIENT } from '../../data/operations';
import { DiscardChangesDialog } from '../companies/DiscardChangesDialog';
import { useFormNavigation } from '../forms/useFormNavigation';
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
  const toast = useToast();
  const navigate = useNavigate();
  const creationComplete = useRef(false);
  const [creationPending, setCreationPending] = useState(false);
  const navigation = useFormNavigation({
    blockPendingNavigation: creationPending,
    onClose: () =>
      navigate({
        params: { companyId },
        to: '/my-companies/clients/$companyId',
      }),
    pending: creationPending,
  });
  const [createClient] = useMutation(CREATE_CLIENT);

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
            onCancel={navigation.requestClose}
            onDirty={navigation.markDirty}
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

              creationComplete.current = true;
              toast.show({
                description: t('{{name}} is ready to use.', {
                  name: created.name,
                }),
                title: t('Client added'),
                variant: 'success',
              });
              if (
                navigation.completeMutation({ resumeBlockedNavigation: true })
              )
                return;

              try {
                await navigate({
                  params: { companyId: created.companyId },
                  to: '/my-companies/clients/$companyId',
                });
              } catch {
                await navigate({ to: '/my-companies' }).catch(() => {
                  navigation.restrictNavigation();
                  setCreationPending(false);
                });
              }
            }}
            submitLabel={t('Save client')}
          />
        </Drawer.Content>
      </Drawer.Root>
      <DiscardChangesDialog
        blocker={navigation.blocker}
        closeLabel={t('Close discard confirmation')}
        description={t(
          'The client details entered in this drawer will be lost.',
        )}
        nested
        onDiscard={navigation.discardChanges}
        onOpenChange={navigation.setDiscardOpen}
        open={navigation.discardOpen}
        title={t('Discard this client?')}
        trigger={t('Discard client')}
      />
    </>
  );
}
