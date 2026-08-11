import { useMutation, useQuery } from '@apollo/client/react';
import { PageHeader, useToast } from '@motech-development/breeze-ui';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DELETE_COMPANY,
  GET_COMPANY_DETAILS,
  UPDATE_COMPANY,
} from '../../data/operations';
import { EntityDeleteDialog } from '../forms/EntityDeleteDialog';
import { useFormNavigation } from '../forms/useFormNavigation';
import { CompanyDetailsFormSkeleton } from '../loading/AccountsPageSkeletons';
import { QueryRefreshAlert } from '../QueryRefreshAlert';
import { removeCompanyFromCache, upsertCompanyInCache } from './cache-updates';
import { formatSortCode } from './company';
import { CompanyDetailsForm } from './CompanyDetailsForm';
import {
  CompanyFormFailureState,
  CompanyFormLoadingState,
} from './CompanyFormQueryState';
import { DiscardChangesDialog } from './DiscardChangesDialog';

export function CompanyDetailsPage({
  companyId,
  owner,
}: Readonly<{ companyId: string; owner: string }>) {
  const { t } = useTranslation(['companies', 'routing']);
  const navigate = useNavigate();
  const toast = useToast();
  const [savePending, setSavePending] = useState(false);
  const [updateCompany] = useMutation(UPDATE_COMPANY);
  const [deleteCompany, { loading: deleting }] = useMutation(DELETE_COMPANY);
  const navigation = useFormNavigation({
    blockPendingNavigation: deleting,
    onClose: () =>
      navigate({
        params: { companyId },
        to: '/my-companies/dashboard/$companyId',
      }),
    pending: savePending || deleting,
  });
  const { data, error, loading, refetch } = useQuery(GET_COMPANY_DETAILS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { id: companyId },
  });
  const company = data?.getCompany;
  const pageHeader = (
    <PageHeader
      description={t(
        'Registered, contact, and bank details used across Accounts.',
      )}
      title={t('Company details')}
    />
  );

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
      navigation.resetBlockedNavigation();

      toast.show({
        description: t(
          'Nothing was deleted. Check your connection and try again.',
        ),
        title: t('Company could not be deleted'),
        variant: 'danger',
      });

      return false;
    }

    toast.show({ title: t('Company deleted'), variant: 'success' });
    navigation.completeMutation();
    await navigate({ to: '/my-companies' }).catch(
      navigation.restrictNavigation,
    );

    return true;
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
          <EntityDeleteDialog
            cancelLabel={t('Cancel')}
            confirmationError={t('The company name must match exactly.')}
            confirmationLabel={t('Type {{name}} to confirm', {
              name: company.name,
            })}
            confirmLabel={t('Permanently delete company')}
            deleting={deleting}
            description={t(
              'Company records, clients, reports, and transactions will be permanently removed.',
            )}
            entityName={company.name}
            onDelete={deleteCurrentCompany}
            title={t('Delete {{name}}?', { name: company.name })}
            triggerLabel={t('Delete company')}
          />
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
        onDirty={navigation.markDirty}
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

            toast.show({
              title: t('Company details saved'),
              variant: 'success',
            });
            navigation.completeMutation();
            await navigate({
              params: { companyId },
              to: '/my-companies/dashboard/$companyId',
            }).catch(navigation.restrictNavigation);
          } finally {
            setSavePending(false);
          }
        }}
        submitLabel={t('Save changes')}
      />
      <DiscardChangesDialog
        blocker={navigation.blocker}
        closeLabel={t('Close discard confirmation')}
        description={t('The unsaved company changes will be lost.')}
        onDiscard={navigation.discardChanges}
        onOpenChange={navigation.setDiscardOpen}
        open={navigation.discardOpen && !savePending && !deleting}
        title={t('Discard company changes?')}
        trigger={t('Discard company changes')}
      />
    </div>
  );
}
