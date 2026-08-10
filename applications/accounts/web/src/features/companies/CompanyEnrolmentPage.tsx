import { useMutation } from '@apollo/client/react';
import { Drawer, useToast } from '@motech-development/breeze-ui';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CREATE_COMPANY } from '../../data/operations';
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
  const allowNavigation = useRef(false);
  const creationComplete = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
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
  const blocker = useBlocker({
    enableBeforeUnload: dirty,
    shouldBlockFn: () => dirty && !allowNavigation.current,
    withResolver: true,
  });
  const blockerRef = useRef(blocker);

  blockerRef.current = blocker;
  const [createCompany] = useMutation(CREATE_COMPANY);

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

    navigate({ to: '/my-companies' }).catch(() => undefined);
  };
  const requestClose = () => {
    if (creationPending) return;

    if (dirty) {
      setDiscardOpen(true);
    } else {
      leave();
    }
  };

  useEffect(() => {
    if (blocker.status === 'blocked' && !creationPending) {
      setDiscardOpen(true);
    }
  }, [blocker.status, creationPending]);

  return (
    <>
      <CompaniesPageContent />
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
              onCancel={requestClose}
              onDirty={() => setDirty(true)}
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
              onCancel={requestClose}
              onDirty={() => setDirty(true)}
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

                const activeBlocker = blockerRef.current;

                if (activeBlocker.status === 'blocked') activeBlocker.reset?.();
                creationComplete.current = true;
                setCompanyCreated(true);
                allowNavigation.current = true;
                setDirty(false);
                toast.show({
                  description: t('{{name}} is ready to use.', {
                    name: created.name,
                  }),
                  title: t('Company added'),
                  variant: 'success',
                });

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
        blocker={blocker}
        closeLabel={t('Close discard confirmation')}
        description={t(
          'The company details entered in this drawer will be lost.',
        )}
        nested
        onDiscard={() => {
          if (creationPending) return;

          discardChanges();
          if (blocker.status !== 'blocked') {
            navigate({ to: '/my-companies' }).catch(() => undefined);
          }
        }}
        onOpenChange={setDiscardOpen}
        open={discardOpen}
        title={t('Discard this company?')}
        trigger={t('Discard company')}
      />
    </>
  );
}
