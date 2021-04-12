import { gql, useMutation, useQuery } from '@apollo/client';
import { PageTitle } from '@motech-development/breeze-ui';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import ExportForm, { FormSchema } from '../../../components/ExportForm';
import GET_SETTINGS, {
  IGetSettingsInput,
  IGetSettingsOutput,
} from '../../../graphql/settings/GET_SETTINGS';

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

interface IReportsParams {
  companyId: string;
}

export const CREATE_REPORT = gql`
  mutation CreateReport($input: ReportInput!) {
    createReport(input: $input) {
      status
    }
  }
`;

const CreateReport: FC = () => {
  const { companyId } = useParams<IReportsParams>();
  const { t } = useTranslation('reports');
  const backTo = (id: string) => `/my-companies/reports/${id}`;
  const { data, error, loading } = useQuery<
    IGetSettingsOutput,
    IGetSettingsInput
  >(GET_SETTINGS, {
    variables: {
      id: companyId,
    },
  });
  const [
    mutation,
    { error: mutationError, loading: mutationLoading },
  ] = useMutation<ICreateReportOutput, ICreateReportInput>(CREATE_REPORT, {
    onCompleted: () => {
      // TODO: Redirect back
    },
    onError: () => {
      // TODO: Handle error
    },
  });
  const save = async (input: FormSchema) => {
    await mutation({
      variables: {
        input,
      },
    });
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
            backTo={backTo(companyId)}
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
};

export default memo(CreateReport);
