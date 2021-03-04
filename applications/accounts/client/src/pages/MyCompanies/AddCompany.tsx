import { useMutation } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CompanyWizard, { FormSchema } from '../../components/CompanyWizard';
import Connected from '../../components/Connected';
import ADD_COMPANY, {
  IAddCompanyInput,
  IAddCompanyOutput,
  updateCache,
} from '../../graphql/company/ADD_COMPANY';

const AddCompany: FC = () => {
  const history = useHistory();
  const { t } = useTranslation('my-companies');
  const { add } = useToast();
  const [addCompany, { error, loading }] = useMutation<
    IAddCompanyOutput,
    IAddCompanyInput
  >(ADD_COMPANY, {
    onCompleted: ({ createCompany }) => {
      if (createCompany) {
        const { id, name } = createCompany;

        add({
          colour: 'success',
          message: t('add-company.success', {
            name,
          }),
        });

        history.push(`/my-companies/dashboard/${id}`);
      } else {
        add({
          colour: 'danger',
          message: t('add-company.retry'),
        });

        history.push('/my-companies');
      }
    },
  });
  const save = async (input: FormSchema) => {
    await addCompany({
      update: updateCache,
      variables: {
        input,
      },
    });
  };

  return (
    <Connected error={error} loading={false}>
      <PageTitle
        title={t('add-company.title')}
        subTitle={t('add-company.sub-title')}
      />

      <CompanyWizard backTo="/my-companies" loading={loading} onSave={save} />
    </Connected>
  );
};

export default memo(AddCompany);
