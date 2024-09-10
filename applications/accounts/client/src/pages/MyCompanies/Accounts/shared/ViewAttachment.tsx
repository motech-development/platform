import { useLazyQuery, useMutation } from '@apollo/client';
import { useLazyGet } from '@motech-development/axios-hooks';
import { Button, Col, Row, useToast } from '@motech-development/breeze-ui';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import FileDownload from '../../../../components/FileDownload';
import { gql } from '../../../../graphql';

export const DELETE_FILE = gql(/* GraphQL */ `
  mutation DeleteFile($id: ID!, $path: String!) {
    deleteFile(id: $id, path: $path) {
      path
    }
  }
`);

export const REQUEST_DOWNLOAD = gql(/* GraphQL */ `
  query RequestDownload($id: ID!, $path: String!) {
    requestDownload(id: $id, path: $path) {
      url
    }
  }
`);

export interface IDeleteTransactionProps {
  id: string;
  path: string;
  onDelete(name: string): void;
}

function DeleteTransaction({ id, onDelete, path }: IDeleteTransactionProps) {
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const onError = () => {
    add({
      colour: 'danger',
      message: t('uploads.download.error'),
    });
  };
  const [download] = useLazyGet<Blob>({
    onCompleted: (data) => {
      const fileName = path.split('/').pop();

      saveAs(data, fileName);

      add({
        colour: 'success',
        message: t('uploads.download.success'),
      });
    },
    onError,
    responseType: 'blob',
  });
  const [request, { data: requestData, loading: requestLoading }] =
    useLazyQuery(REQUEST_DOWNLOAD, {
      onError,
    });
  const [deleteFile, { loading: deleteFileLoading }] = useMutation(
    DELETE_FILE,
    {
      onCompleted: () => {
        add({
          colour: 'success',
          message: t('uploads.delete.success'),
        });

        onDelete('');
      },
      onError: () => {
        add({
          colour: 'danger',
          message: t('uploads.delete.error'),
        });
      },
    },
  );

  return (
    <Row>
      <Col sm={6}>
        <Button
          block
          loading={requestLoading}
          onClick={() => {
            request({
              variables: {
                id,
                path,
              },
            }).catch(() => {});
          }}
        >
          {t('transaction-form.upload.download-file')}
        </Button>

        {requestData && (
          <FileDownload
            loading={requestLoading}
            onDownload={async () => {
              if (requestData.requestDownload?.url) {
                await download(requestData.requestDownload.url);
              } else {
                add({
                  colour: 'danger',
                  message: t('uploads.download.retry'),
                });
              }
            }}
          />
        )}
      </Col>

      <Col sm={6}>
        <Button
          block
          colour="danger"
          loading={deleteFileLoading}
          onClick={() => {
            deleteFile({
              variables: {
                id,
                path,
              },
            }).catch(() => {});
          }}
        >
          {t('transaction-form.upload.delete-file')}
        </Button>
      </Col>
    </Row>
  );
}

export default DeleteTransaction;
