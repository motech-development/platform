import { useEffect } from 'react';

export interface IFileDownload {
  loading: boolean;
  onDownload(): Promise<void>;
}

function FileDownload({ loading, onDownload }: IFileDownload) {
  useEffect(() => {
    if (!loading) {
      onDownload().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return null;
}

export default FileDownload;
