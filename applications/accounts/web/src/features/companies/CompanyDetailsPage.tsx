import { useMutation, useQuery } from '@apollo/client/react';
import {
  AlertDialog,
  Button,
  PageHeader,
  Stack,
  TextField,
  useToast,
} from '@motech-development/breeze-ui';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DELETE_COMPANY,
  GET_COMPANY_DETAILS,
  UPDATE_COMPANY,
} from '../../data/operations';
import { CompanyDetailsFormSkeleton } from '../loading/AccountsPageSkeletons';
import { removeCompanyFromCache, upsertCompanyInCache } from './cache-updates';
import { exactCompanyNameSchema, formatSortCode } from './company';
import { CompanyDetailsForm } from './CompanyDetailsForm';
import {
  CompanyFormFailureState,
  CompanyFormLoadingState,
} from './CompanyFormQueryState';
import { DiscardChangesDialog } from './DiscardChangesDialog';
import { QueryRefreshAlert } from './QueryRefreshAlert';

export function CompanyDetailsPage({
  companyId,
  owner,
}: Readonly<{ companyId: string; owner: string }>) {
  const { t } = useTranslation(['companies', 'routing']);
  const navigate = useNavigate();
  const toast = useToast();
  const allowNavigation = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [savePending, setSavePending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const blocker = useBlocker({
    enableBeforeUnload: dirty,
    shouldBlockFn: () => dirty && !allowNavigation.current,
    withResolver: true,
  });
  const { data, error, loading, refetch } = useQuery(GET_COMPANY_DETAILS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const [deleteCompany, { loading: deleting }] = useMutation(DELETE_COMPANY);
  const company = data?.getCompany;
  const confirmationValid = company
    ? exactCompanyNameSchema(company.name).safeParse(confirmation).success
    : false;
  const pageHeader = (
    <PageHeader
      description={t(
        'Registered, contact, and bank details used across Accounts.',
      )}
      title={t('Company details')}
    />
  );

  useEffect(() => {
    if (blocker.status === 'blocked') setDiscardOpen(true);
  }, [blocker.status]);

  const deleteCurrentCompany = async () => {
    try {
      const result = await deleteCompany({
        update: (cache, mutation) => {
          if (mutation.data?.deleteCompany) {
            removeCompanyFromCache(
              cache,
              mutation.data.deleteCompany.owner ?? owner,
              mutation.data.deleteCompany.id,
            );
          }
        },
        variables: { id: companyId },
      });

      if (!result.data?.deleteCompany) throw new Error('No company returned');
    } catch {
      toast.show({
        description: t(
          'Nothing was deleted. Check your connection and try again.',
        ),
        title: t('Company could not be deleted'),
        variant: 'danger',
      });

      return;
    }

    allowNavigation.current = true;
    setDirty(false);
    setDeleteOpen(false);
    setConfirmation('');
    toast.show({ title: t('Company deleted'), variant: 'success' });
    await navigate({ to: '/my-companies' }).catch(() => {
      allowNavigation.current = false;
    });
  };

  if (loading && !data) {
    return (
      <CompanyFormLoadingState
        loadingLabel={t('Loading company details')}
        pageHeader={pageHeader}
      >
        <CompanyDetailsFormSkeleton />
      </CompanyFormLoadingState>
    );
  }

  if (!company) {
    return (
      <CompanyFormFailureState
        onRetry={() => {
          refetch().catch(() => undefined);
        }}
        pageHeader={pageHeader}
        title={t('Company details could not be loaded')}
      />
    );
  }

  return (
    <div className="min-w-0">
      {pageHeader}
      {error ? (
        <QueryRefreshAlert
          onRetry={() => {
            refetch().catch(() => undefined);
          }}
          retryLabel={t('Try again', { ns: 'routing' })}
        >
          {t(
            'Company details could not be refreshed. Check your connection, then try again.',
          )}
        </QueryRefreshAlert>
      ) : null}
      <CompanyDetailsForm
        danger={
          <AlertDialog.Root
            onOpenChange={(open) => {
              setDeleteOpen(open);
              if (!open) setConfirmation('');
            }}
            open={deleteOpen}
          >
            <AlertDialog.Trigger variant="danger">
              {t('Delete company')}
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Title>
                {t('Delete {{name}}?', { name: company.name })}
              </AlertDialog.Title>
              <AlertDialog.Description>
                {t(
                  'Company records, clients, reports, and transactions will be permanently removed.',
                )}
              </AlertDialog.Description>
              <Stack gap="lg">
                <TextField.Root
                  invalid={confirmation.length > 0 && !confirmationValid}
                  onChange={setConfirmation}
                  value={confirmation}
                >
                  <TextField.Label>
                    {t('Type {{name}} to confirm', { name: company.name })}
                  </TextField.Label>
                  <TextField.Input autoComplete="off" />
                  <TextField.Error>
                    {t('The company name must match exactly.')}
                  </TextField.Error>
                </TextField.Root>
                <AlertDialog.Actions>
                  <AlertDialog.Close appearance="outline">
                    {t('Cancel')}
                  </AlertDialog.Close>
                  <Button
                    disabled={!confirmationValid || deleting}
                    loading={deleting}
                    onAction={() => {
                      deleteCurrentCompany().catch(() => undefined);
                    }}
                    variant="danger"
                  >
                    {t('Permanently delete company')}
                  </Button>
                </AlertDialog.Actions>
              </Stack>
            </AlertDialog.Content>
          </AlertDialog.Root>
        }
        initialValues={{
          ...company,
          address: {
            ...company.address,
            line2: company.address.line2 ?? '',
            line4: company.address.line4 ?? '',
          },
          bank: {
            ...company.bank,
            sortCode: formatSortCode(company.bank.sortCode),
          },
        }}
        key={companyId}
        onDirty={() => setDirty(true)}
        onSubmit={async (input) => {
          setSavePending(true);

          try {
            try {
              const result = await updateCompany({
                update: (cache, mutation) => {
                  if (mutation.data?.updateCompany) {
                    upsertCompanyInCache(
                      cache,
                      owner,
                      mutation.data.updateCompany,
                    );
                  }
                },
                variables: { input },
              });

              if (!result.data?.updateCompany)
                throw new Error('No company returned');
            } catch {
              toast.show({
                description: t(
                  'Your changes are still here. Check them and try again.',
                ),
                title: t('Company details could not be saved'),
                variant: 'danger',
              });

              return;
            }

            if (blocker.status === 'blocked') blocker.reset?.();
            setDiscardOpen(false);
            allowNavigation.current = true;
            setDirty(false);
            toast.show({
              title: t('Company details saved'),
              variant: 'success',
            });
            await navigate({
              params: { companyId },
              to: '/my-companies/dashboard/$companyId',
            }).catch(() => {
              allowNavigation.current = false;
            });
          } finally {
            setSavePending(false);
          }
        }}
        submitLabel={t('Save changes')}
      />
      <DiscardChangesDialog
        blocker={blocker}
        closeLabel={t('Close discard confirmation')}
        description={t('The unsaved company changes will be lost.')}
        onDiscard={() => {
          if (savePending) return;

          allowNavigation.current = true;
          setDirty(false);
          setDiscardOpen(false);
        }}
        onOpenChange={setDiscardOpen}
        open={discardOpen && !savePending}
        title={t('Discard company changes?')}
        trigger={t('Discard company changes')}
      />
    </div>
  );
}
