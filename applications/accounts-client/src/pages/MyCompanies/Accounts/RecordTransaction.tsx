import { useMutation, useQuery } from '@apollo/react-hooks';
import { PageTitle, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import Connected from '../../../components/Connected';
import TransactionForm, {
  FormSchema,
} from '../../../components/TransactionForm';
import GET_BALANCE from '../../../graphql/balance/GET_BALANCE';
import DELETE_FILE, {
  IDeleteFileInput,
  IDeleteFileOutput,
} from '../../../graphql/storage/DELETE_FILE';
import REQUEST_UPLOAD, {
  IRequestUploadInput,
  IRequestUploadOutput,
} from '../../../graphql/storage/REQUEST_UPLOAD';
import ADD_TRANSACTION, {
  IAddTransactionInput,
  IAddTransactionOutput,
  updateCache,
} from '../../../graphql/transaction/ADD_TRANSACTION';
import withLayout from '../../../hoc/withLayout';
import { usePut } from '../../../hooks/useFetch';

interface IRecordTransactionInput {
  id: string;
}

interface IRecordTransactionOutput {
  getClients: {
    items: {
      id: string;
      name: string;
    }[];
  };
  getSettings: {
    categories: {
      name: string;
      vatRate: number;
    }[];
    vat: {
      pay: number;
    };
  };
}

export const RECORD_TRANSACTION = gql`
  query RecordTransaction($id: ID!) {
    getClients(companyId: $id) {
      items {
        id
        name
      }
    }
    getSettings(id: $id) {
      categories {
        name
        vatRate
      }
      vat {
        pay
      }
    }
  }
`;

interface IRecordTransactionParams {
  companyId: string;
}

const RecordTransaction: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<IRecordTransactionParams>();
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const [put, { loading: uploadLoading }] = usePut();
  const { data, error, loading } = useQuery<
    IRecordTransactionOutput,
    IRecordTransactionInput
  >(RECORD_TRANSACTION, {
    variables: {
      id: companyId,
    },
  });
  const [mutation, { error: addError, loading: addLoading }] = useMutation<
    IAddTransactionOutput,
    IAddTransactionInput
  >(ADD_TRANSACTION, {
    awaitRefetchQueries: true,
    onCompleted: ({ addTransaction }) => {
      add({
        colour: 'success',
        message: t('record-transaction.success'),
      });

      history.push(backTo(addTransaction.companyId));
    },
    refetchQueries: () => [
      {
        query: GET_BALANCE,
        variables: {
          id: companyId,
        },
      },
    ],
  });
  const [deleteFileMutation] = useMutation<IDeleteFileOutput, IDeleteFileInput>(
    DELETE_FILE,
    {
      onCompleted: () => {
        add({
          colour: 'success',
          message: t('uploads.delete.success'),
        });
      },
      onError: () => {
        add({
          colour: 'danger',
          message: t('uploads.delete.error'),
        });
      },
    },
  );
  const [requestMutation, { loading: requestUploadLoading }] = useMutation<
    IRequestUploadOutput,
    IRequestUploadInput
  >(REQUEST_UPLOAD);
  const backTo = (id: string) => `/my-companies/accounts/${id}`;
  const save = (input: FormSchema) => {
    (async () => {
      await mutation({
        update: updateCache,
        variables: {
          input,
        },
      });
    })();
  };
  const upload = async (file: File, extension: string) => {
    const { data: uploadData } = await requestMutation({
      variables: {
        extension,
        id: companyId,
      },
    });

    if (uploadData) {
      const { requestUpload } = uploadData;
      const formData = new FormData();
      const headers = new Headers();

      formData.append(file.name, file, file.name);

      headers.append('Content-Type', 'multipart/form-data');

      await put(requestUpload.url, formData, headers);

      return `${companyId}/${requestUpload.id}.${extension}`;
    }

    return '';
  };
  const removeUpload = (path: string) => {
    (async () => {
      await deleteFileMutation({
        variables: {
          path,
        },
      });
    })();
  };

  return (
    <Connected error={error || addError} loading={loading}>
      {data && (
        <>
          <PageTitle
            title={t('record-transaction.title')}
            subTitle={t('record-transaction.sub-title')}
          />

          <TransactionForm
            backTo={backTo(companyId)}
            categories={data.getSettings.categories.map(
              ({ name, vatRate }) => ({
                name,
                value: vatRate.toFixed(2),
              }),
            )}
            clients={data.getClients.items.map(({ name }) => ({
              name,
              value: name,
            }))}
            companyId={companyId}
            loading={addLoading}
            uploading={requestUploadLoading || uploadLoading}
            vat={data.getSettings.vat.pay}
            onFileRemove={removeUpload}
            onSave={save}
            onUpload={upload}
          />
        </>
      )}
    </Connected>
  );
};

export default withLayout(RecordTransaction);
