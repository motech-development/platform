import {
  Card,
  Col,
  Form,
  LinkButton,
  Radio,
  Row,
  Select,
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
  // TODO: Make dynamic
  const yearOptions = [
    {
      name: '2021/22',
      value: '2021',
    },
    {
      name: '2020/21',
      value: '2020',
    },
    {
      name: '2019/20',
      value: '2019',
    },
    {
      name: '2018/19',
      value: '2018',
    },
    {
      name: '2017/18',
      value: '2017',
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
      <Card>
        <Row>
          <Col xs={12} md={6}>
            <Select
              label={t('export-form.year.label')}
              name="year"
              options={yearOptions}
              placeholder={t('export-form.year.placeholder')}
            />
          </Col>

          <Col xs={12} md={6}>
            <Radio
              name="status"
              label={t('export-form.status.label')}
              options={statusOptions}
              // onChange={onStatusChange}
            />
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default ExportForm;
