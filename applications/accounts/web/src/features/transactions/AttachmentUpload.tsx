import { useMutation } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  FileUpload,
  Typography,
  useToast,
} from '@motech-development/breeze-ui';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { REQUEST_UPLOAD } from '../../data/operations';
import { uploadPresignedFile } from '../../data/presigned-transfer';
import { capturePresignedTransferFailure } from '../../observability';
import { useLatestTransfer } from './useLatestTransfer';

const attachmentExtensions = {
  'application/pdf': ['pdf'],
  'image/gif': ['gif'],
  'image/jpeg': ['jpeg', 'jpg'],
  'image/png': ['png'],
} as const;
const acceptedFileTypes = Object.keys(attachmentExtensions);

function attachmentExtension(file: File) {
  const extensionIndex = file.name.lastIndexOf('.');
  const extension =
    extensionIndex > 0
      ? file.name.slice(extensionIndex + 1).toLowerCase()
      : undefined;

  const supportedExtensions: readonly string[] | undefined =
    attachmentExtensions[file.type as keyof typeof attachmentExtensions];

  return extension && supportedExtensions?.includes(extension)
    ? extension
    : undefined;
}

export type AttachmentTransferResult =
  | Readonly<{ status: 'cancelled' }>
  | Readonly<{ status: 'failed' }>
  | Readonly<{ path: string; status: 'uploaded' }>;

export function AttachmentUpload({
  companyId,
  disabled,
  onAllocated,
  onDiscardFailed,
  onTransfer,
  onUploaded,
  transactionId,
}: Readonly<{
  companyId: string;
  disabled?: boolean;
  onAllocated: (path: string) => void;
  onDiscardFailed: () => boolean | Promise<boolean>;
  onTransfer: (transfer: Promise<AttachmentTransferResult>) => void;
  onUploaded: (path: string, name: string) => void;
  transactionId?: string;
}>) {
  const { t } = useTranslation(['attachments', 'transactions']);
  const toast = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [transferPending, setTransferPending] = useState(false);
  const [discardPending, setDiscardPending] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const activeTransfer = useRef<symbol | undefined>(undefined);
  const discardPendingRef = useRef(false);
  const runLatestTransfer = useLatestTransfer();
  const [requestUpload, { loading }] = useMutation(REQUEST_UPLOAD);
  const showRejectedFileToast = () => {
    toast.show({
      description: t('Choose one PDF, JPG, PNG, or GIF file.'),
      title: t('File not accepted'),
      variant: 'warning',
    });
  };
  const discardFailedFile = async () => {
    if (discardPendingRef.current) return;

    discardPendingRef.current = true;
    setDiscardPending(true);
    try {
      if (await onDiscardFailed()) {
        setSelectedFiles([]);
        setUploadFailed(false);
      }
    } catch {
      // The failed upload remains available for another cleanup attempt.
    } finally {
      discardPendingRef.current = false;
      setDiscardPending(false);
    }
  };

  const upload = (file: File) => {
    const extension = attachmentExtension(file);

    if (!extension) {
      showRejectedFileToast();
      return Promise.resolve({ status: 'failed' } as const);
    }

    const transferId = Symbol('attachment-transfer');

    activeTransfer.current = transferId;
    setSelectedFiles([file]);
    setTransferPending(true);
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

          const path = `${companyId}/${presigned.id}.${extension}`;

          onAllocated(path);
          await uploadPresignedFile(presigned.url, file, signal);

          return path;
        });

        if (result.status === 'cancelled') {
          return result;
        }

        onUploaded(result.value, file.name);
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
          description: t('The file was not transferred. Retry when ready.'),
          title: t('Attachment upload failed'),
          variant: 'danger',
        });

        return { status: 'failed' };
      } finally {
        if (activeTransfer.current === transferId) {
          activeTransfer.current = undefined;
          setTransferPending(false);
        }
      }
    })();

    onTransfer(transfer);

    return transfer;
  };

  const retryUpload = async (file: File) => {
    if (discardPendingRef.current) return;

    discardPendingRef.current = true;
    setDiscardPending(true);
    try {
      if (await onDiscardFailed()) {
        await upload(file);
      }
    } catch {
      // The previous allocation remains available for another cleanup attempt.
    } finally {
      discardPendingRef.current = false;
      setDiscardPending(false);
    }
  };

  if (uploaded) {
    return (
      <Typography role="status">
        {t('File attached')}: {selectedFiles[0]?.name}
      </Typography>
    );
  }

  return (
    <>
      <FileUpload
        acceptedFileTypes={acceptedFileTypes}
        browseLabel={
          disabled
            ? t('Connection required', { ns: 'transactions' })
            : t('Browse')
        }
        disabled={disabled || loading || transferPending}
        guidance={
          disabled
            ? t('Connection required to attach a file.')
            : t('PDF, JPG, PNG or GIF')
        }
        label={t('No file selected')}
        onFiles={(files) => {
          const [file] = files;

          if (file) {
            upload(file).catch(() => undefined);
          }
        }}
        onReject={showRejectedFileToast}
        selectedFiles={selectedFiles}
      />
      {transferPending && selectedFiles[0] ? (
        <Typography role="status">
          {t('Uploading file…')}: {selectedFiles[0].name}
        </Typography>
      ) : null}
      {uploadFailed && selectedFiles[0] ? (
        <ButtonGroup>
          <Button
            disabled={disabled || discardPending || loading || transferPending}
            onAction={() => {
              retryUpload(selectedFiles[0]).catch(() => undefined);
            }}
          >
            {t('Retry upload')}
          </Button>
          <Button
            appearance="outline"
            disabled={disabled || discardPending || loading || transferPending}
            onAction={() => {
              discardFailedFile().catch(() => undefined);
            }}
          >
            {t('Remove file')}
          </Button>
        </ButtonGroup>
      ) : null}
    </>
  );
}
