import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import CompanyForm, { FormSchema } from '../../components/CompanyForm';
import Connected from '../../components/Connected';
import GET_COMPANY, {
  IGetCompanyInput,
  IGetCompanyOutput,
} from '../../graphql/company/GET_COMPANY';
import UPDATE_COMPANY, {
  IUpdateCompanyInput,
  IUpdateCompanyOutput,
} from '../../graphql/company/UPDATE_COMPANY';
import withLayout from '../../hoc/withLayout';

interface IUpdateDetailsParams {
  companyId: string;
}

const UpdateDetails: FC = () => {
  const history = useHistory();
  const { add } = useToast();
  const { t } = useTranslation('my-companies');
  const { companyId } = useParams<IUpdateDetailsParams>();
  const [
    mutation,
    { error: updateError, loading: updateLoading },
  ] = useMutation<IUpdateCompanyOutput, IUpdateCompanyInput>(UPDATE_COMPANY, {
    onCompleted: ({ updateCompany }) => {
      const { id, name } = updateCompany;

      add({
        colour: 'success',
        message: t('update-details.success', {
          name,
        }),
      });

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
  const save = (input: FormSchema) => {
    (async () => {
      await mutation({
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
