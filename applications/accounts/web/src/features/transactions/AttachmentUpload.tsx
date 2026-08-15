import { useMutation } from '@apollo/client/react';
import { Button, FileUpload, useToast } from '@motech-development/breeze-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { REQUEST_UPLOAD } from '../../data/operations';
import { uploadPresignedFile } from '../../data/presigned-transfer';
import { capturePresignedTransferFailure } from '../../observability';
import { useLatestTransfer } from './useLatestTransfer';

export type AttachmentTransferResult =
  | Readonly<{ status: 'cancelled' }>
  | Readonly<{ status: 'failed' }>
  | Readonly<{ path: string; status: 'uploaded' }>;

export function AttachmentUpload({
  companyId,
  disabled,
  onTransfer,
  onUploaded,
  transactionId,
}: Readonly<{
  companyId: string;
  disabled?: boolean;
  onTransfer: (transfer: Promise<AttachmentTransferResult>) => void;
  onUploaded: (path: string) => void;
  transactionId?: string;
}>) {
  const { t } = useTranslation(['attachments', 'transactions']);
  const toast = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const runLatestTransfer = useLatestTransfer();
  const [requestUpload, { loading }] = useMutation(REQUEST_UPLOAD);

  const upload = (file: File) => {
    const extensions = {
      'application/pdf': ['pdf'],
      'image/gif': ['gif'],
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
    }[file.type];
    const requestedExtension = file.name.split('.').at(-1)?.toLowerCase();
    const extension =
      extensions?.find((value) => value === requestedExtension) ??
      extensions?.[0];

    if (!extension) {
      return Promise.resolve({ status: 'failed' } as const);
    }

    setSelectedFiles([file]);
    setUploadFailed(false);
    setUploaded(false);

    const transfer = (async (): Promise<AttachmentTransferResult> => {
      try {
        const result = await runLatestTransfer(async (signal) => {
          const response = await requestUpload({
            variables: {
              id: companyId,
              input: {
                contentType: file.type,
                extension,
                metadata: {
                  ...(transactionId ? { id: transactionId } : {}),
                  typename: 'Transaction',
                },
              },
            },
          });
          const presigned = response.data?.requestUpload;

          if (!presigned) {
            const error = new Error(t('No upload destination was returned'));

            capturePresignedTransferFailure(error, 'Upload');
            throw error;
          }

          await uploadPresignedFile(presigned.url, file, signal);

          return `${companyId}/${presigned.id}.${extension}`;
        });

        if (result.status === 'cancelled') {
          return result;
        }

        onUploaded(result.value);
        setUploaded(true);
        toast.show({
          description: file.name,
          title: t('File attached'),
          variant: 'success',
        });

        return { path: result.value, status: 'uploaded' };
      } catch {
        setUploadFailed(true);
        toast.show({
          description: t('The PDF was not transferred. Retry when ready.'),
          title: t('Attachment upload failed'),
          variant: 'danger',
        });

        return { status: 'failed' };
      }
    })();

    onTransfer(transfer);

    return transfer;
  };

  if (uploaded) {
    return (
      <p role="status">
        {t('File attached')}: {selectedFiles[0]?.name}
      </p>
    );
  }

  return (
    <>
      <FileUpload
        acceptedFileTypes={[
          'application/pdf',
          'image/gif',
          'image/jpeg',
          'image/png',
        ]}
        browseLabel={
          disabled
            ? t('Connection required', { ns: 'transactions' })
            : t('Browse')
        }
        disabled={disabled || loading}
        guidance={
          disabled
            ? t('Connection required to attach a file.')
            : t('Choose one PDF, GIF, JPG, or PNG file.')
        }
        label={loading ? t('Uploading PDF…') : t('No file selected')}
        onFiles={(files) => {
          const [file] = files;

          if (file) {
            upload(file).catch(() => undefined);
          }
        }}
        onReject={() => {
          toast.show({
            description: t('Choose one PDF, GIF, JPG, or PNG file.'),
            title: t('File not accepted'),
            variant: 'warning',
          });
        }}
        selectedFiles={selectedFiles}
      />
      {uploadFailed && selectedFiles[0] ? (
        <Button
          disabled={disabled || loading}
          onAction={() => {
            upload(selectedFiles[0]).catch(() => undefined);
          }}
        >
          {t('Retry upload')}
        </Button>
      ) : null}
    </>
  );
}
