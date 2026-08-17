import { useApolloClient } from '@apollo/client/react';
import {
  Button,
  Drawer,
  FileAttachment,
  Inline,
  Surface,
  useToast,
} from '@motech-development/breeze-ui';
import { saveAs } from 'file-saver';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { REQUEST_DOWNLOAD } from '../../data/operations';
import { downloadPresignedFile } from '../../data/presigned-transfer';
import { capturePresignedTransferFailure } from '../../observability';
import { useOnlineStatus } from '../../pwa/connectivity';
import { useLatestTransfer } from './useLatestTransfer';

const PdfPreview = lazy(() =>
  import('./PdfPreview').then((module) => ({ default: module.PdfPreview })),
);

const generatedAttachmentName =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(\.[^.]+)?$/iu;

export function TransactionAttachment({
  companyId,
  disabled,
  onDeleted,
  path,
}: Readonly<{
  companyId: string;
  disabled?: boolean;
  onDeleted: () => boolean | Promise<boolean>;
  path: string;
}>) {
  const { t } = useTranslation(['attachments', 'transactions']);
  const apolloClient = useApolloClient();
  const toast = useToast();
  const online = useOnlineStatus();
  const runLatestTransfer = useLatestTransfer();
  const [file, setFile] = useState<Blob>();
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const storedName = path.split('/').at(-1) ?? path;
  const extension = /\.[^.]+$/u.exec(storedName)?.[0] ?? '';
  const name = generatedAttachmentName.test(storedName)
    ? `${t('Transaction attachment')}${extension}`
    : storedName;
  const imageUrl = useMemo(
    () => (file?.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(
    () => () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    },
    [imageUrl],
  );
  const download = async () => {
    if (file) return file;

    const result = await runLatestTransfer(async (signal) => {
      const response = await apolloClient.query({
        fetchPolicy: 'no-cache',
        query: REQUEST_DOWNLOAD,
        variables: { id: companyId, path },
      });
      const url = response.data?.requestDownload.url;

      if (!url) {
        const error = new Error(t('No download destination was returned'));

        capturePresignedTransferFailure(error, 'Download');
        throw error;
      }

      return downloadPresignedFile(url, signal);
    });

    return result.status === 'cancelled' ? undefined : result.value;
  };
  const saveDownload = (downloaded: Blob) => {
    saveAs(downloaded, name);
    toast.show({ title: t('The download has started'), variant: 'success' });
  };
  const getFile = async () => {
    if (file) return file;

    setLoading(true);
    try {
      const downloaded = await download();

      if (downloaded) setFile(downloaded);
      return downloaded;
    } catch {
      toast.show({
        description: t('The file could not be opened. Try again.'),
        title: t('Attachment unavailable'),
        variant: 'danger',
      });
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FileAttachment
        actions={
          <>
            <Button
              appearance="outline"
              disabled={!online || disabled || loading}
              loading={loading}
              onAction={() => {
                getFile().catch(() => undefined);
              }}
            >
              {online
                ? t('View file')
                : t('Connection required', { ns: 'transactions' })}
            </Button>
            <Button
              appearance="outline"
              disabled={!online || disabled || loading}
              onAction={() => {
                download()
                  .then((downloaded) => {
                    if (downloaded) saveDownload(downloaded);
                  })
                  .catch(() => {
                    toast.show({
                      description: t(
                        'The file could not be opened. Try again.',
                      ),
                      title: t('Attachment unavailable'),
                      variant: 'danger',
                    });
                  });
              }}
            >
              {t('Download file')}
            </Button>
            <Button
              disabled={!online || disabled || deleting}
              loading={deleting}
              onAction={() => {
                setDeleting(true);
                Promise.resolve(onDeleted())
                  .then((deleted) => {
                    if (deleted) setFile(undefined);
                  })
                  .then(
                    () => setDeleting(false),
                    () => setDeleting(false),
                  );
              }}
              variant="danger"
            >
              {t('Delete file')}
            </Button>
          </>
        }
        name={name}
      />
      {file ? (
        <Drawer.Root
          onOpenChange={(open) => !open && setFile(undefined)}
          open
          triggerless
        >
          <Drawer.Content
            adjacent={{ inlineEndOffset: 768 }}
            placement={{ base: 'bottom', md: 'end' }}
          >
            <Drawer.Description>
              {t('Transaction attachment')}
            </Drawer.Description>
            <Drawer.Title>{name}</Drawer.Title>
            <Surface
              border="none"
              className="-m-6 min-h-full"
              padding="none"
              tone="subtle"
            >
              <Surface className="sticky top-0 z-10" padding="compact">
                <Inline justify="end">
                  <Button
                    appearance="outline"
                    onAction={() => saveDownload(file)}
                  >
                    {t('Download file')}
                  </Button>
                </Inline>
              </Surface>
              {imageUrl ? (
                <div className="p-6">
                  <img
                    alt={name}
                    className="mx-auto max-h-[70dvh] max-w-full"
                    src={imageUrl}
                  />
                </div>
              ) : (
                <section aria-label={t('PDF preview')} className="p-6">
                  <Suspense fallback={<p>{t('Opening PDF viewer…')}</p>}>
                    <PdfPreview file={file} />
                  </Suspense>
                </section>
              )}
            </Surface>
          </Drawer.Content>
        </Drawer.Root>
      ) : null}
    </>
  );
}
