/** Breeze-owned reason why a native file was rejected. */
export type FileRejectionReason = 'file-count' | 'file-size' | 'file-type';

/** Native file and all Breeze validation reasons that rejected it. */
export interface FileRejection {
  /** Rejected native file. */
  file: File;
  /** Stable validation reason identifiers. */
  reasons: FileRejectionReason[];
}

/** Browser-supplied context for a dropped file that could not be read. */
export interface DropZoneFileReadFailure {
  /** Original failure reported while reading the native file. */
  cause: unknown;
  /** Zero-based position of the failed file within the dropped file items. */
  itemIndex: number;
  /** Browser-supplied file name available before reading the native file. */
  name: string;
  /** Browser-supplied MIME type available before reading the native file. */
  type: string;
}
