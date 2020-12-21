import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useLazyGet } from '@motech-development/axios-hooks';
import { Button, Col, Row, useToast } from '@motech-development/breeze-ui';
import { saveAs } from 'file-saver';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import FileDownload from '../../../../components/FileDownload';

interface IDeleteFileInput {
  id: string;
  path: string;
}

interface IDeleteFileOutput {
  deleteFile?: {
    path: string;
  };
}

export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!, $path: String!) {
    deleteFile(id: $id, path: $path) {
      path
    }
  }
`;

interface IRequestDownloadInput {
  id: string;
  path: string;
}

interface IRequestDownloadOutput {
  requestDownload?: {
    url: string;
  };
}

export const REQUEST_DOWNLOAD = gql`
  query RequestDownload($id: ID!, $path: String!) {
    requestDownload(id: $id, path: $path) {
      url
    }
  }
`;

export interface IDeleteTransactionProps {
  id: string;
  path: string;
  onDelete(name: string): void;
}

const DeleteTransaction: FC<IDeleteTransactionProps> = ({
  id,
  onDelete,
  path,
}) => {
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const [download] = useLazyGet<Blob>({
    onCompleted: data => {
      const fileName = path.split('/').pop();

      saveAs(data, fileName);

      add({
        colour: 'success',
        message: t('uploads.download.success'),
      });
    },
    onError: () => {
      add({
        colour: 'danger',
        message: t('uploads.download.error'),
      });
    },
    responseType: 'blob',
  });
  const [
    request,
    { data: requestData, loading: requestLoading },
  ] = useLazyQuery<IRequestDownloadOutput, IRequestDownloadInput>(
    REQUEST_DOWNLOAD,
    {
      onError: () => {
        add({
          colour: 'danger',
          message: t('uploads.download.error'),
        });
      },
    },
  );
  const [deleteFile, { loading: deleteFileLoading }] = useMutation<
    IDeleteFileOutput,
    IDeleteFileInput
  >(DELETE_FILE, {
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
  });

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
            });
          }}
        >
          {t('transaction-form.upload.download-file')}
        </Button>

        {requestData && (
          <FileDownload
            loading={requestLoading}
            onDownload={async () => {
              if (requestData.requestDownload) {
                await download(requestData.requestDownload.url);
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
            (async () => {
              await deleteFile({
                variables: {
                  id,
                  path,
                },
              });
            })();
          }}
        >
          {t('transaction-form.upload.delete-file')}
        </Button>
      </Col>
    </Row>
  );
};

export default memo(DeleteTransaction);
