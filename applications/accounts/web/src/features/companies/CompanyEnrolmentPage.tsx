import { useMutation } from '@apollo/client/react';
import { Drawer, useToast } from '@motech-development/breeze-ui';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CREATE_COMPANY } from '../../data/operations';
import { useFormNavigation } from '../forms/useFormNavigation';
import { upsertCompanyInCache } from './cache-updates';
import { CompaniesPageContent } from './CompaniesPageContent';
import {
  companyEnrolmentDefaults,
  companyEnrolmentSchema,
  type NormalisedCompanyDetails,
} from './company';
import { CompanyDetailsForm } from './CompanyDetailsForm';
import {
  type CompanySetupDraftValues,
  CompanySetupForm,
} from './CompanySetupForm';
import { DiscardChangesDialog } from './DiscardChangesDialog';

export function CompanyEnrolmentPage({ owner }: Readonly<{ owner: string }>) {
  const { t } = useTranslation('companies');
  const navigate = useNavigate();
  const toast = useToast();
  const initialValues = useRef(companyEnrolmentDefaults());
  const creationComplete = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [companyCreated, setCompanyCreated] = useState(false);
  const [creationPending, setCreationPending] = useState(false);
  const [company, setCompany] = useState<NormalisedCompanyDetails>(
    initialValues.current.company,
  );
  const [setup, setSetup] = useState<CompanySetupDraftValues>({
    balance: initialValues.current.balance,
    vat: initialValues.current.vat,
    yearEnd: initialValues.current.yearEnd,
  });
  const navigation = useFormNavigation({
    onClose: () => navigate({ to: '/my-companies' }),
    pending: creationPending,
  });
  const [createCompany] = useMutation(CREATE_COMPANY);

  return (
    <>
      <CompaniesPageContent />
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
          scrollResetKey={step}
          size="wide"
        >
          <Drawer.Description>
            {t('Step {{step}} of 2', { step })}
          </Drawer.Description>
          <Drawer.Title>{t('Add company')}</Drawer.Title>
          {step === 1 ? (
            <CompanyDetailsForm
              initialValues={company}
              layout="stacked"
              onCancel={navigation.requestClose}
              onDirty={navigation.markDirty}
              onSubmit={(value) => {
                setCompany(value);
                setStep(2);

                return Promise.resolve();
              }}
              submitLabel={t('Continue to settings')}
            />
          ) : (
            <CompanySetupForm
              initialValues={setup}
              onBack={(value) => {
                setSetup(value);
                setStep(1);
              }}
              onCancel={navigation.requestClose}
              onDirty={navigation.markDirty}
              onSubmit={async (value) => {
                if (creationComplete.current) return;

                setSetup(value);
                setCreationPending(true);

                let created;

                try {
                  const input = companyEnrolmentSchema.parse({
                    ...value,
                    company,
                  });
                  const result = await createCompany({
                    update: (cache, mutation) => {
                      if (mutation.data?.createCompany) {
                        upsertCompanyInCache(
                          cache,
                          mutation.data.createCompany.owner ?? owner,
                          mutation.data.createCompany,
                        );
                      }
                    },
                    variables: { input },
                  });
                  created = result.data?.createCompany;

                  if (!created) throw new Error('No company returned');
                } catch {
                  setCreationPending(false);
                  toast.show({
                    description: t(
                      'Your company details are still here. Check them and try again.',
                    ),
                    title: t('Company could not be added'),
                    variant: 'danger',
                  });

                  return;
                }

                creationComplete.current = true;
                setCompanyCreated(true);
                toast.show({
                  description: t('{{name}} is ready to use.', {
                    name: created.name,
                  }),
                  title: t('Company added'),
                  variant: 'success',
                });
                navigation.completeMutation();

                try {
                  await navigate({
                    params: { companyId: created.id },
                    to: '/my-companies/dashboard/$companyId',
                  });
                } catch {
                  await navigate({ to: '/my-companies' }).catch(() => {
                    setCreationPending(false);
                  });
                }
              }}
              submitDisabled={companyCreated}
            />
          )}
        </Drawer.Content>
      </Drawer.Root>
      <DiscardChangesDialog
        blocker={navigation.blocker}
        closeLabel={t('Close discard confirmation')}
        description={t(
          'The company details entered in this drawer will be lost.',
        )}
        nested
        onDiscard={navigation.discardChanges}
        onOpenChange={navigation.setDiscardOpen}
        open={navigation.discardOpen}
        title={t('Discard this company?')}
        trigger={t('Discard company')}
      />
    </>
  );
}
