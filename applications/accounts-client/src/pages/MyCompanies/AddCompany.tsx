import { useMutation } from '@apollo/react-hooks';
import { PageTitle } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CompanyForm, { FormSchema } from '../../components/CompanyForm';
import Connected from '../../components/Connected';
import ADD_COMPANY, {
  IAddCompanyInput,
  IAddCompanyOutput,
  updateCache,
} from '../../graphql/ADD_COMPANY';
import withLayout from '../../hoc/withLayout';

const AddCompany: FC = () => {
  const history = useHistory();
  const { t } = useTranslation('my-companies');
  const [addCompany, { error, loading }] = useMutation<
    IAddCompanyOutput,
    IAddCompanyInput
  >(ADD_COMPANY);

  function save(input: FormSchema) {
    (async () => {
      const { data } = await addCompany({
        update: updateCache,
        variables: {
          input,
        },
      });

      history.push(`/dashboard/${data?.createCompany.id}`);
    })();
  }

  return (
    <Connected error={error} loading={loading}>
      <PageTitle
        title={t('add-company.title')}
        subTitle={t('add-company.sub-title')}
      />

      <CompanyForm backTo="/my-companies" loading={loading} onSave={save} />
    </Connected>
  );
};

export default withLayout(AddCompany);
