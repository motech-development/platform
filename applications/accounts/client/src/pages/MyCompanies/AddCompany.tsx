import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
  useMutation,
} from '@apollo/client';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CompanyWizard, { FormSchema } from '../../components/CompanyWizard';
import Connected from '../../components/Connected';
import { gql } from '../../graphql';
import {
  CreateCompanyMutation,
  MutationCreateCompanyArgs,
} from '../../graphql/graphql';

export const update: MutationUpdaterFunction<
  CreateCompanyMutation,
  MutationCreateCompanyArgs,
  unknown,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (data?.createCompany) {
    const { createCompany } = data;

    cache.modify({
      fields: {
        items: (refs: readonly Reference[], { readField }) => {
          if (refs.some((ref) => readField('id', ref) === createCompany.id)) {
            return [...refs];
          }

          const newRef = cache.writeFragment({
            data: createCompany,
            fragment: gql(/* GraphQL */ `
              fragment NewCompany on Company {
                address {
                  line1
                  line2
                  line3
                  line4
                  line5
                }
                bank {
                  accountNumber
                  sortCode
                }
                companyNumber
                contact {
                  email
                  telephone
                }
                id
                name
              }
            `),
          });

          if (!newRef) {
            return [...refs];
          }

          return [...refs, newRef].sort((a, b) => {
            const readA = readField<string>('name', a);
            const readB = readField<string>('name', b);

            if (readA && readB) {
              return readA.localeCompare(readB);
            }

            return 0;
          });
        },
      },
      id: cache.identify({
        __typename: 'Companies',
        id: createCompany.owner,
      }),
    });
  }
};

export const ADD_COMPANY = gql(/* GraphQL */ `
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      bank {
        accountNumber
        sortCode
      }
      companyNumber
      contact {
        email
        telephone
      }
      id
      name
      owner
    }
  }
`);

function AddCompany() {
  const navigate = useNavigate();
  const { t } = useTranslation('my-companies');
  const { add } = useToast();
  const [addCompany, { error, loading }] = useMutation(ADD_COMPANY, {
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
      update,
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
