import { useMutation } from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CompanyWizard, { FormSchema } from '../../components/CompanyWizard';
import Connected from '../../components/Connected';
import ADD_COMPANY, {
  IAddCompanyInput,
  IAddCompanyOutput,
  updateCache,
} from '../../graphql/company/ADD_COMPANY';

function AddCompany() {
  const navigate = useNavigate();
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

        navigate(`/my-companies/dashboard/${id}`);
      } else {
        add({
          colour: 'danger',
          message: t('add-company.retry'),
        });

        navigate('/my-companies');
      }
    },
  });
  const save = (input: FormSchema) => {
    addCompany({
      update: updateCache,
      variables: {
        input,
      },
    }).catch(() => {});
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
}

export default AddCompany;
