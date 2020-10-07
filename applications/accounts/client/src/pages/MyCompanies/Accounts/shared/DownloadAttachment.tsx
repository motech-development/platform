import { useLazyGet } from '@motech-development/axios-hooks';
import { useToast } from '@motech-development/breeze-ui';
import { saveAs } from 'file-saver';
import { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface IDownloadAttachmentProps {
  loading: boolean;
  path: string;
  url: string;
}

const DownloadAttachment: FC<IDownloadAttachmentProps> = ({
  loading,
  path,
  url,
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

  useEffect(() => {
    (async () => {
      if (!loading) {
        await download(url);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return null;
};

export default memo(DownloadAttachment);
