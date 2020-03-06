import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import withLayout from '../../hoc/withLayout';
import CompanyForm, { FormSchema } from '../../components/CompanyForm';
import Connected from '../../components/Connected';
import GET_COMPANY, {
  IGetCompanyInput,
  IGetCompanyOutput,
} from '../../graphql/GET_COMPANY';
import UPDATE_COMPANY, {
  IUpdateCompanyInput,
  IUpdateCompanyOutput,
} from '../../graphql/UPDATE_COMPANY';

interface IUpdateDetailsParams {
  companyId: string;
}

const UpdateDetails: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<IUpdateDetailsParams>();
  const [
    updateCompany,
    { error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateCompanyOutput, IUpdateCompanyInput>(UPDATE_COMPANY, {
    onCompleted: ({ updateCompany: { id } }) => {
      history.push(`/my-companies/dashboard/${id}`);
    },
  });
  const { data, error, loading } = useQuery<
    IGetCompanyOutput,
    IGetCompanyInput
  >(GET_COMPANY, {
    variables: {
      id: companyId,
    },
  });
  const { t } = useTranslation('my-companies');
  const save = (input: FormSchema) => {
    (async () => {
      await updateCompany({
        variables: {
          input,
        },
      });
    })();
  };

  return (
    <Connected error={error || updateError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={data.getCompany.name}
            subTitle={t('update-details.sub-title')}
          />

          <CompanyForm
            backTo={`/my-companies/dashboard/${companyId}`}
            initialValues={data.getCompany}
            loading={updateLoading}
            onSave={save}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(UpdateDetails);
