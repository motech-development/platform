import {
  Card,
  Form,
  LinkButton,
  Radio,
  Select,
  Typography,
} from '@motech-development/breeze-ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { number, object, string } from 'yup';

const formSchema = {
  companyId: '',
  currency: '',
  status: '',
  year: 0,
  yearEnd: {
    day: 0,
    month: 0,
  },
};

const now = new Date().getFullYear();

const yearOptions = [...new Array(5)].map((_, i) => {
  const refYear = now - i;
  const year = refYear.toString();
  const next = (refYear + 1).toString().substr(2, 2);

  return {
    name: `${year}/${next}`,
    value: year,
  };
});

export type FormSchema = typeof formSchema;

export interface IExportFormProps {
  backTo: string;
  companyId: string;
  currency: string;
  loading: boolean;
  yearEnd: {
    day: number;
    month: number;
  };
  onSave: (value: FormSchema) => void;
}

const ExportForm: FC<IExportFormProps> = ({
  backTo,
  companyId,
  currency,
  loading,
  yearEnd,
  onSave,
}) => {
  const { t } = useTranslation('reports');
  const validationSchema = object<FormSchema>()
    .shape({
      companyId: string().required(),
      currency: string().required(),
      status: string().oneOf(['confirmed', 'pending']).required(),
      year: number().required(),
      yearEnd: object()
        .shape({
          day: number().max(31).required(),
          month: number().max(11).required(),
        })
        .required(),
    })
    .required();
  const initialValues = {
    ...formSchema,
    companyId,
    currency,
    yearEnd,
  };
  const statusOptions = [
    {
      name: t('export-form.status.options.confirmed'),
      value: 'confirmed',
    },
    {
      name: t('export-form.status.options.pending'),
      value: 'pending',
    },
  ];

  return (
    <Form
      initialValues={initialValues}
      validationSchema={validationSchema}
      submitLabel={t('export-form.create')}
      loading={loading}
      onSubmit={onSave}
      cancel={
        <LinkButton block to={backTo} colour="secondary" size="lg">
          {t('export-form.cancel')}
        </LinkButton>
      }
    >
      <Card padding="lg">
        <Typography rule component="h3" variant="h3">
          {t('export-form.heading')}
        </Typography>

        <Select
          label={t('export-form.year.label')}
          name="year"
          options={yearOptions}
          placeholder={t('export-form.year.placeholder')}
        />

        <Radio
          name="status"
          label={t('export-form.status.label')}
          options={statusOptions}
        />
      </Card>
    </Form>
  );
};

export default ExportForm;
