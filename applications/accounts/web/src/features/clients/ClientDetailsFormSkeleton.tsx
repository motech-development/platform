import {
  FormActions,
  FormSection,
  Skeleton,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';

function FieldSkeletons({ count }: Readonly<{ count: number }>) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className="h-17" key={index} />
      ))}
    </div>
  );
}

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
        <FieldSkeletons count={1} />
      </FormSection>
      <FormSection
        description={t('How to contact this client.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Contact details')}
      >
        <FieldSkeletons count={2} />
      </FormSection>
      <FormSection
        description={t('The client’s postal address.')}
        divided
        headingLevel={3}
        layout="stacked"
        title={t('Address')}
      >
        <FieldSkeletons count={5} />
      </FormSection>
      <FormActions
        cancel={<Skeleton className="h-11 w-20" />}
        danger={danger ? <Skeleton className="h-11 w-32" /> : undefined}
        primary={<Skeleton className="h-11 w-32" />}
      />
    </div>
  );
}
