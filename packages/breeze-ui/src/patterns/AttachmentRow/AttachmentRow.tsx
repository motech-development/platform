import { Button } from '../../primitives/Button/Button';
import type { IconName } from '../../primitives/Icon/Icon';
import { Icon } from '../../primitives/Icon/Icon';
import { Menu } from '../../primitives/Menu/Menu';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { VisuallyHidden } from '../../primitives/VisuallyHidden/VisuallyHidden';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    content:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col breeze:gap-breeze-px',
    documentLine:
      'breeze:block-size-breeze-px breeze:inline-size-full breeze:rounded-breeze-xs breeze:bg-breeze-line',
    documentLineStrong:
      'breeze:block-size-breeze-px breeze:inline-size-full breeze:rounded-breeze-xs breeze:bg-breeze-line-strong',
    fileDetails:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-wrap breeze:items-center breeze:gap-x-breeze-2 breeze:text-breeze-xs breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    filename:
      'breeze:block breeze:min-inline-size-0 breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap breeze:text-breeze-sm breeze:font-medium breeze:leading-breeze-snug breeze:text-breeze-ink',
    loadingContent:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col breeze:gap-breeze-2',
    photoPlaceholder: 'breeze:text-breeze-ink-3',
    row: 'breeze:box-border breeze:flex breeze:min-block-breeze-row breeze:min-inline-size-0 breeze:items-center breeze:gap-breeze-3 breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-raised breeze:ps-breeze-3 breeze:pe-breeze-3',
    thumbnail:
      'breeze:flex breeze:block-size-breeze-tap breeze:inline-size-breeze-md breeze:shrink-0 breeze:overflow-hidden breeze:rounded-breeze-sm breeze:border breeze:border-solid breeze:border-breeze-line-strong',
    thumbnailImage:
      'breeze:block breeze:block-size-full breeze:inline-size-full breeze:object-cover',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    fileType: {
      document:
        'breeze:flex-col breeze:items-stretch breeze:justify-center breeze:gap-breeze-1 breeze:bg-breeze-surface breeze:px-breeze-1',
      photo:
        'breeze:items-center breeze:justify-center breeze:bg-linear-160 breeze:from-breeze-sunken breeze:to-breeze-raised',
    },
  },
} as const satisfies {
  base: Record<string, string>;
  compound: Record<string, never>;
  size: Record<string, never>;
  state: Record<string, never>;
  variant: {
    fileType: Record<AttachmentRowFileType, string>;
  };
};

/** The neutral visual category used to distinguish a photograph from a document. */
export type AttachmentRowFileType = 'document' | 'photo';

/** An app-owned action exposed from the attachment's overflow menu. */
export interface AttachmentRowAction {
  /** Optional secondary explanation shown with the action label. */
  description?: string;
  /** Removes the action from keyboard interaction while unavailable. */
  disabled?: boolean;
  /** Optional curated Breeze icon. */
  icon?: IconName;
  /** Stable action identifier. */
  id: string;
  /** Visible and accessible action label. */
  label: string;
}

interface AttachmentRowContentProps {
  /** App-owned actions shown in the overflow menu. */
  actions?: AttachmentRowAction[];
  /** Distinguishes a photograph from other file documents. */
  fileType: AttachmentRowFileType;
  /** Visible name of the attached file. */
  filename: string;
  /** Called when the direct Open action is activated. */
  onOpen?: () => void;
  /** Called with the selected app-owned menu action. */
  onAction?: (action: AttachmentRowAction) => void;
  /** File size in bytes, formatted for the Breeze provider locale. */
  sizeBytes: number;
  /** Visible attachment state, such as “Uploaded” or “Upload failed”. */
  status: string;
  /** Optional image rendered as the file thumbnail. */
  thumbnailUrl?: string;
  /** Attachment content is available and displayed. */
  loading?: false;
}

interface AttachmentRowLoadingProps {
  /** Omits file content while its shape is unavailable. */
  loading: true;
}

/** Props for a neutral attached-file row or its owned loading placeholder. */
export type AttachmentRowProps =
  | AttachmentRowContentProps
  | AttachmentRowLoadingProps;

const fileTypeMessageKeys = {
  document: 'attachmentDocument',
  photo: 'attachmentPhoto',
} as const satisfies Record<
  AttachmentRowFileType,
  'attachmentDocument' | 'attachmentPhoto'
>;

const fileSizeUnits = [
  'byte',
  'kilobyte',
  'megabyte',
  'gigabyte',
  'terabyte',
] as const;

function formatFileSize(bytes: number, locale: string) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new Error('AttachmentRow sizeBytes must be a non-negative number.');
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1000 && unitIndex < fileSizeUnits.length - 1) {
    value /= 1000;
    unitIndex += 1;
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
    style: 'unit',
    unit: fileSizeUnits[unitIndex],
    unitDisplay: 'short',
  }).format(value);
}

function DocumentThumbnail() {
  return (
    <span
      aria-hidden="true"
      className={[
        variants.base.thumbnail,
        variants.variant.fileType.document,
      ].join(' ')}
    >
      <span className={variants.base.documentLineStrong} />
      <span className={variants.base.documentLine} />
      <span className={variants.base.documentLine} />
      <span className={variants.base.documentLine} />
    </span>
  );
}

function PhotoThumbnail({ thumbnailUrl }: Readonly<{ thumbnailUrl?: string }>) {
  if (thumbnailUrl) {
    return (
      <span
        aria-hidden="true"
        className={[
          variants.base.thumbnail,
          variants.variant.fileType.photo,
        ].join(' ')}
      >
        <img
          alt=""
          className={variants.base.thumbnailImage}
          src={thumbnailUrl}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={[
        variants.base.thumbnail,
        variants.variant.fileType.photo,
        variants.base.photoPlaceholder,
      ].join(' ')}
    >
      <Icon name="camera" size="sm" />
    </span>
  );
}

function AttachmentRowSkeleton({
  loadingLabel,
  loadingLanguage,
}: Readonly<{ loadingLabel: string; loadingLanguage: string }>) {
  return (
    <div aria-busy="true" className={variants.base.row} role="status">
      <span aria-hidden="true" className={variants.base.thumbnail}>
        <Skeleton blockSize={44} inlineSize={38} shape="rectangle" />
      </span>
      <div className={variants.base.loadingContent}>
        <Skeleton blockSize="1lh" inlineSize="min(100%, 14em)" />
        <Skeleton blockSize="1lh" inlineSize="min(100%, 10em)" />
        <span lang={loadingLanguage}>
          <VisuallyHidden>{loadingLabel}</VisuallyHidden>
        </span>
      </div>
    </div>
  );
}

/** Presents an attached file with a type thumbnail, readable state and actions. */
export function AttachmentRow(props: Readonly<AttachmentRowProps>) {
  const context = useBreezeContext();
  const { loading } = props;

  if (loading) {
    return (
      <AttachmentRowSkeleton
        loadingLabel={context.messages.loading}
        loadingLanguage={context.getMessageLocale('loading')}
      />
    );
  }

  const {
    actions = [],
    fileType,
    filename,
    onAction,
    onOpen,
    sizeBytes,
    status,
    thumbnailUrl,
  } = props;
  const formattedSize = formatFileSize(sizeBytes, context.locale);
  const fileTypeMessageKey = fileTypeMessageKeys[fileType];

  if (!filename.trim()) {
    throw new Error('AttachmentRow filename must be non-empty.');
  }

  if (!status.trim()) {
    throw new Error('AttachmentRow status must be non-empty.');
  }

  return (
    <div className={variants.base.row}>
      {fileType === 'document' ? (
        <DocumentThumbnail />
      ) : (
        <PhotoThumbnail thumbnailUrl={thumbnailUrl} />
      )}
      <div className={variants.base.content}>
        <span className={variants.base.filename}>{filename}</span>
        <div className={variants.base.fileDetails}>
          <span lang={context.getMessageLocale(fileTypeMessageKey)}>
            {context.messages[fileTypeMessageKey]}
          </span>
          <span aria-hidden="true">·</span>
          <span>{formattedSize}</span>
          <span aria-hidden="true">·</span>
          <span>{status}</span>
        </div>
      </div>
      {onOpen ? (
        <span lang={context.getMessageLocale('attachmentOpen')}>
          <Button onAction={onOpen} size="sm" variant="secondary">
            {context.messages.attachmentOpen}
          </Button>
        </span>
      ) : null}
      {actions.length > 0 ? (
        <span lang={context.getMessageLocale('attachmentMoreActions')}>
          <Menu
            getItem={(action) => action}
            items={actions}
            onAction={(descriptor) => {
              const action = actions.find((item) => item.id === descriptor.id);

              if (action) onAction?.(action);
            }}
            trigger={context.messages.attachmentMoreActions}
            triggerIcon="more"
          />
        </span>
      ) : null}
    </div>
  );
}
