import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Col,
  PageTitle,
  Row,
  useToast,
} from '@motech-development/breeze-ui';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import CompanyForm, { FormSchema } from '../../components/CompanyForm';
import Connected from '../../components/Connected';
import DeleteItem from '../../components/DeleteItem';
import DELETE_COMPANY, {
  IDeleteCompanyInput,
  IDeleteCompanyOutput,
  updateCache,
} from '../../graphql/company/DELETE_COMPANY';
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
  const backTo = (id: string) => `/my-companies/dashboard/${id}`;
  const history = useHistory();
  const { add } = useToast();
  const { t } = useTranslation('my-companies');
  const { companyId } = useParams<IUpdateDetailsParams>();
  const [modal, setModal] = useState(false);
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

      history.push(backTo(id));
    },
  });
  const [deleteMutation, { loading: deleteLoading }] = useMutation<
    IDeleteCompanyOutput,
    IDeleteCompanyInput
  >(DELETE_COMPANY, {
    onCompleted: ({ deleteCompany }) => {
      const { name } = deleteCompany;

      add({
        colour: 'success',
        message: t('delete-company.success', {
          name,
        }),
      });

      history.push('/my-companies');
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('delete-company.error'),
      });
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
  const launchDeleteModal = () => {
    setModal(true);
  };
  const onDismiss = () => {
    setModal(false);
  };
  const onDelete = () => {
    (async () => {
      await deleteMutation({
        update: updateCache,
        variables: {
          id: companyId,
        },
      });
    })();
  };
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

          <Row>
            <Col>
              <CompanyForm
                backTo={backTo(companyId)}
                initialValues={data.getCompany}
                loading={updateLoading}
                onSave={save}
              />
            </Col>

            <Col xs={12} md={6} mdOffset={7}>
              <Button
                block
                colour="danger"
                size="lg"
                onClick={launchDeleteModal}
              >
                {t('update-details.delete-company', {
                  name: data.getCompany.name,
                })}
              </Button>
            </Col>
          </Row>

          <DeleteItem
            title={t('delete-company.title', {
              name: data.getCompany.name,
            })}
            warning={t('delete-company.warning')}
            display={modal}
            loading={deleteLoading}
            name={data.getCompany.name}
            onDelete={onDelete}
            onDismiss={onDismiss}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(UpdateDetails);
