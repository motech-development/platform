import { useLazyQuery, useMutation } from '@apollo/client';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLazyGet } from '@motech-development/axios-hooks';
import {
  Button,
  Col,
  Modal,
  Row,
  Tooltip,
  useToast,
} from '@motech-development/breeze-ui';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentViewer from '../../../../components/DocumentViewer';
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
  onDelete: (name: string) => void;
}

function DeleteTransaction({ id, onDelete, path }: IDeleteTransactionProps) {
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const [file, setFile] = useState<Blob>();
  const [modal, setModal] = useState(false);
  const title = path.split('/').pop()!;
  const onDismiss = () => {
    setModal(false);
  };
  const onDownload = () => {
    if (file) {
      const fileName = path.split('/').pop();

      saveAs(file, fileName);

      add({
        colour: 'success',
        message: t('uploads.download.success'),
      });
    }
  };
  const onError = () => {
    add({
      colour: 'danger',
      message: t('uploads.download.error'),
    });
  };
  const [download] = useLazyGet<Blob>({
    onCompleted: (data) => {
      setFile(data);
    },
    onError,
    responseType: 'blob',
  });
  const [request, { data: requestData, loading: requestLoading }] =
    useLazyQuery(REQUEST_DOWNLOAD, {
      onCompleted: () => {
        setModal(true);
      },
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
    <>
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
            {t('transaction-form.upload.view-file')}
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

      <Modal title={title} isOpen={modal} size="lg" onDismiss={onDismiss}>
        <Row>
          <Col xs={12}>
            {file && (
              <DocumentViewer
                file={file}
                buttons={
                  <Tooltip
                    id="close"
                    parent={
                      <Button
                        aria-label={t('transaction-form.close')}
                        colour="danger"
                        onClick={onDismiss}
                      >
                        <FontAwesomeIcon icon={faClose} />
                      </Button>
                    }
                    placement="top"
                    colour="danger"
                    message={t('transaction-form.close')}
                  />
                }
                onDownload={onDownload}
              />
            )}
          </Col>
          <Col xs={6}>
            <Button onClick={onDismiss}>{t('transaction-form.close')}</Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default DeleteTransaction;
