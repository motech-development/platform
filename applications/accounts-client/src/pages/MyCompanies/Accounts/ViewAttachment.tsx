import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useLazyGet } from '@motech-development/axios-hooks';
import { Button, Col, Row, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import { saveAs } from 'file-saver';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

interface IDeleteFileInput {
  path: string;
}

interface IDeleteFileOutput {
  deleteFile: {
    path: string;
  };
}

export const DELETE_FILE = gql`
  mutation DeleteFile($path: ID!) {
    deleteFile(path: $path) {
      path
    }
  }
`;

interface IRequestDownloadInput {
  id: string;
  path: string;
}

interface IRequestDownloadOutput {
  requestDownload: {
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
    },
    responseType: 'blob',
  });
  const [request, { loading: requestLoading }] = useLazyQuery<
    IRequestDownloadOutput,
    IRequestDownloadInput
  >(REQUEST_DOWNLOAD, {
    onCompleted: async ({ requestDownload }) => {
      await download(requestDownload.url);
    },
  });
  const [upload, { loading: uploadLoading }] = useMutation<
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
        colour: 'success',
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
      </Col>

      <Col sm={6}>
        <Button
          block
          colour="danger"
          loading={uploadLoading}
          onClick={() => {
            (async () => {
              await upload({
                variables: {
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
