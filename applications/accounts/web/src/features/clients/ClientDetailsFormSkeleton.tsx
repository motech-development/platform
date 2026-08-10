import {
  FormActions,
  FormSection,
  Skeleton,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { FormFieldSkeletons } from '../loading/AccountsPageSkeletons';

export function ClientDetailsFormSkeleton({
  danger = false,
}: Readonly<{ danger?: boolean }>) {
  const { t } = useTranslation('clients');

  return (
    <div className="grid gap-6">
      <FormSection
        description={t('The name used on sales transactions.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Client details')}
      >
        <FormFieldSkeletons count={1} />
      </FormSection>
      <FormSection
        description={t('How to contact this client.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Contact details')}
      >
        <FormFieldSkeletons count={2} />
      </FormSection>
      <FormSection
        description={t('The client’s postal address.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Address')}
      >
        <FormFieldSkeletons count={5} />
      </FormSection>
      <FormActions
        cancel={<Skeleton className="h-11 w-20" />}
        danger={danger ? <Skeleton className="h-11 w-32" /> : undefined}
        primary={<Skeleton className="h-11 w-32" />}
      />
    </div>
  );
}
