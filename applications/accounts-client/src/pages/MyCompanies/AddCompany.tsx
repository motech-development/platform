import { useMutation } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CompanyForm, { FormSchema } from '../../components/CompanyForm';
import Connected from '../../components/Connected';
import ADD_COMPANY, {
  IAddCompanyInput,
  IAddCompanyOutput,
  updateCache,
} from '../../graphql/company/ADD_COMPANY';
import withLayout from '../../hoc/withLayout';

const AddCompany: FC = () => {
  const history = useHistory();
  const { t } = useTranslation('my-companies');
  const { add } = useToast();
  const [addCompany, { error, loading }] = useMutation<
    IAddCompanyOutput,
    IAddCompanyInput
  >(ADD_COMPANY, {
    onCompleted: ({ createCompany }) => {
      const { id, name } = createCompany;

      add({
        colour: 'success',
        message: t('add-company.success', {
          name,
        }),
      });

      history.push(`/my-companies/dashboard/${id}`);
    },
  });
  const save = (input: FormSchema) => {
    (async () => {
      await addCompany({
        update: updateCache,
        variables: {
          input,
        },
      });
    })();
  };

  return (
    <Connected error={error} loading={false}>
      <PageTitle
        title={t('add-company.title')}
        subTitle={t('add-company.sub-title')}
      />

      <CompanyForm backTo="/my-companies" loading={loading} onSave={save} />
    </Connected>
  );
};

export default withLayout(AddCompany);
