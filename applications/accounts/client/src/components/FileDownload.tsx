import { FC, useEffect } from 'react';

export interface IFileDownload {
  loading: boolean;
  onDownload(): Promise<void>;
}

const FileDownload: FC<IFileDownload> = ({ loading, onDownload }) => {
  useEffect(() => {
    if (!loading) {
      onDownload().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return null;
};

export default FileDownload;
