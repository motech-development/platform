import { gql, useMutation, useQuery } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import ExportForm, { FormSchema } from '../../../components/ExportForm';
import GET_SETTINGS, {
  IGetSettingsInput,
  IGetSettingsOutput,
} from '../../../graphql/settings/GET_SETTINGS';
import invariant from '../../../utils/invariant';

interface ICreateReportInput {
  input: {
    companyId: string;
    currency: string;
    status: string;
    year: number;
    yearEnd: {
      day: number;
      month: number;
    };
  };
}

interface ICreateReportOutput {
  createReport?: {
    status: string;
  };
}

export const CREATE_REPORT = gql`
  mutation CreateReport($input: ReportInput!) {
    createReport(input: $input) {
      status
    }
  }
`;

function CreateReport() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  invariant(companyId);

  const { add } = useToast();
  const { t } = useTranslation('reports');
  const backTo = `/my-companies/reports/${companyId}`;
  const { data, error, loading } = useQuery<
    IGetSettingsOutput,
    IGetSettingsInput
  >(GET_SETTINGS, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { error: mutationError, loading: mutationLoading }] =
    useMutation<ICreateReportOutput, ICreateReportInput>(CREATE_REPORT, {
      onCompleted: () => {
        add({
          colour: 'success',
          message: t('create-report.requested'),
        });

        navigate(backTo);
      },
    });
  const save = (input: FormSchema) => {
    mutation({
      variables: {
        input,
      },
    }).catch(() => {});
  };

  return (
    <Connected error={error || mutationError} loading={loading}>
      {data?.getSettings && (
        <>
          <PageTitle
            title={t('create-report.title')}
            subTitle={t('create-report.sub-title')}
          />

          <ExportForm
            backTo={backTo}
            companyId={companyId}
            currency={t('create-report.currency')}
            loading={mutationLoading}
            yearEnd={data.getSettings.yearEnd}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
}

export default CreateReport;
