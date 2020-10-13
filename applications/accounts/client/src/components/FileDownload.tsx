import { FC, memo, useEffect } from 'react';

export interface IFileDownload {
  loading: boolean;
  onDownload(): Promise<void>;
}

const FileDownload: FC<IFileDownload> = ({ loading, onDownload }) => {
  useEffect(() => {
    if (!loading) {
      (async () => {
        await onDownload();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return null;
};

export default memo(FileDownload);
