import {
  type ChangeEvent,
  type DragEvent,
  Fragment,
  useId,
  useRef,
  useState,
} from 'react';
import { Button } from '../../primitives/Button/Button';
import { Typography } from '../../primitives/Typography/Typography';
import { useBreezeContext } from '../../provider/BreezeContext';

type FileDropZoneVariant = 'idle' | 'dragging';

type FileDropZoneMessage =
  | {
      key: 'fileDropZoneAddedOne' | 'fileDropZoneNoFilesAdded';
    }
  | {
      key: 'fileDropZoneDropInstructions' | 'fileDropZoneReleaseInstructions';
    }
  | {
      key: 'fileDropZoneAddedMany';
      values: { count: number };
    }
  | {
      key: 'fileDropZoneAttachedCount';
      values: { current: number; max: number };
    }
  | {
      key: 'fileDropZoneAcceptedTypes';
      values: { types: string };
    }
  | {
      key: 'fileDropZoneMaximumFileSize';
      values: { size: string };
    }
  | {
      key: 'fileDropZoneTypeRejected';
      values: { fileName: string; types: string };
    }
  | {
      key: 'fileDropZoneSizeRejected';
      values: { fileName: string; size: string };
    }
  | {
      key: 'fileDropZoneCountRejectedMany';
      values: { current: number; fileNames: string; max: number };
    }
  | {
      key: 'fileDropZoneCountRejectedOne';
      values: { current: number; fileNames: string };
    };

type FileDropZoneAnnouncement = FileDropZoneMessage & { id: number };

const variants = {
  base: {
    dropZone:
      'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:items-center breeze:gap-breeze-3 breeze:rounded-breeze-panel breeze:border-2 breeze:border-dashed breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:px-breeze-4 breeze:py-breeze-6 breeze:text-center',
    input: 'breeze:sr-only',
    status:
      'breeze:min-block-[1lh] breeze:text-breeze-sm breeze:text-breeze-ink-2',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    dropZone: {
      dragging: 'breeze:border-breeze-brand breeze:bg-breeze-brand-soft',
      idle: '',
    },
  },
} as const satisfies {
  base: Record<string, string>;
  compound: Record<string, never>;
  size: Record<string, never>;
  state: Record<string, never>;
  variant: {
    dropZone: Record<FileDropZoneVariant, string>;
  };
};

function getAcceptedTypes(accept: string) {
  return accept
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function acceptsFile(file: File, acceptedTypes: readonly string[]) {
  if (acceptedTypes.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase().split(';')[0];

  return acceptedTypes.some((acceptedType) => {
    if (acceptedType === '*/*') return true;
    if (acceptedType.startsWith('.')) return fileName.endsWith(acceptedType);
    if (acceptedType.endsWith('/*')) {
      return mimeType.startsWith(acceptedType.slice(0, -1));
    }

    return mimeType === acceptedType;
  });
}

function isFileDrag(dataTransfer: DataTransfer) {
  return Array.from(dataTransfer.types).includes('Files');
}

function formatFileSize(size: number, locale: string) {
  const units = [
    'byte',
    'kilobyte',
    'megabyte',
    'gigabyte',
    'terabyte',
  ] as const;
  let unitIndex = Math.min(
    Math.floor(Math.log10(Math.max(size, 1)) / 3),
    units.length - 1,
  );
  let value = size / 1000 ** unitIndex;

  if (
    unitIndex > 0 &&
    unitIndex < units.length - 1 &&
    Math.round(value * 10) / 10 >= 1000
  ) {
    unitIndex += 1;
    value /= 1000;
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: 'unit',
    unit: units[unitIndex],
    unitDisplay: 'long',
  }).format(value);
}

function interpolateMessage(
  message: string,
  values: Readonly<Record<string, string | number>> | undefined,
  locale: string,
) {
  return message.replace(/{(\w+)}/g, (placeholder, key: string) => {
    const value = values?.[key];

    if (value === undefined) return placeholder;

    return typeof value === 'number'
      ? new Intl.NumberFormat(locale).format(value)
      : value;
  });
}

/** Props for a file chooser that accepts files by drop or picker. */
export interface FileDropZoneProps {
  /** Allowed file extensions and MIME types, in the native `accept` format. */
  accept?: string;
  /** Number of files already attached; used with `maxFiles` for total limits. */
  currentFileCount?: number;
  /** Visible, accessible name for the drop area. */
  label: string;
  /** Maximum size for one file, in bytes. */
  maxSize?: number;
  /** Maximum total number of attached files, including `currentFileCount`. */
  maxFiles?: number;
  /** Reports only accepted files, without exposing a browser event. */
  onFilesAdded: (files: readonly File[]) => void;
}

/**
 * Accepts files through a drop area or an accessible file picker button.
 *
 * @summary A file picker and drop target with visible validation feedback.
 */
export function FileDropZone({
  accept,
  currentFileCount = 0,
  label,
  maxFiles,
  maxSize,
  onFilesAdded,
}: Readonly<FileDropZoneProps>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const announcementSequence = useRef(0);
  const labelId = useId();
  const instructionsId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [announcements, setAnnouncements] = useState<
    FileDropZoneAnnouncement[]
  >([]);

  if (!Number.isInteger(currentFileCount) || currentFileCount < 0) {
    throw new RangeError(
      'FileDropZone currentFileCount must be a non-negative integer.',
    );
  }

  if (maxFiles !== undefined && (!Number.isInteger(maxFiles) || maxFiles < 1)) {
    throw new RangeError('FileDropZone maxFiles must be a positive integer.');
  }

  if (maxSize !== undefined && (!Number.isFinite(maxSize) || maxSize < 0)) {
    throw new RangeError('FileDropZone maxSize must be a non-negative number.');
  }

  const acceptedTypes = getAcceptedTypes(accept ?? '');
  const variant = isDragging ? 'dragging' : 'idle';
  const instructions: FileDropZoneMessage[] = [
    {
      key: isDragging
        ? 'fileDropZoneReleaseInstructions'
        : 'fileDropZoneDropInstructions',
    },
  ];

  if (acceptedTypes.length > 0) {
    instructions.push({
      key: 'fileDropZoneAcceptedTypes',
      values: { types: acceptedTypes.join(', ') },
    });
  }

  if (maxSize !== undefined) {
    instructions.push({
      key: 'fileDropZoneMaximumFileSize',
      values: {
        size: formatFileSize(
          maxSize,
          getMessageLocale('fileDropZoneMaximumFileSize'),
        ),
      },
    });
  }

  if (maxFiles !== undefined) {
    instructions.push({
      key: 'fileDropZoneAttachedCount',
      values: { current: currentFileCount, max: maxFiles },
    });
  }

  function addFiles(files: FileList | readonly File[]) {
    if (files.length === 0) return;

    const fileResults = Array.from(files, (file) => {
      const reasons: FileDropZoneMessage[] = [];

      if (!acceptsFile(file, acceptedTypes)) {
        reasons.push({
          key: 'fileDropZoneTypeRejected',
          values: { fileName: file.name, types: acceptedTypes.join(', ') },
        });
      }

      if (maxSize !== undefined && file.size > maxSize) {
        reasons.push({
          key: 'fileDropZoneSizeRejected',
          values: {
            fileName: file.name,
            size: formatFileSize(
              maxSize,
              getMessageLocale('fileDropZoneSizeRejected'),
            ),
          },
        });
      }

      return {
        file,
        reasons,
      };
    });
    const eligibleFiles = fileResults
      .filter(({ reasons }) => reasons.length === 0)
      .map(({ file }) => file);
    const rejections = fileResults.flatMap(({ reasons }) => reasons);

    const availableCount =
      maxFiles === undefined
        ? eligibleFiles.length
        : Math.max(0, maxFiles - currentFileCount);
    const acceptedFiles = eligibleFiles.slice(0, availableCount);
    const countRejectedFiles = eligibleFiles.slice(availableCount);

    if (countRejectedFiles.length > 0 && maxFiles !== undefined) {
      const fileNames = countRejectedFiles.map((file) => file.name).join(', ');
      rejections.push(
        maxFiles === 1
          ? {
              key: 'fileDropZoneCountRejectedOne',
              values: { current: currentFileCount, fileNames },
            }
          : {
              key: 'fileDropZoneCountRejectedMany',
              values: { current: currentFileCount, fileNames, max: maxFiles },
            },
      );
    }

    const results: FileDropZoneMessage[] = [];

    if (acceptedFiles.length === 1) {
      results.push({ key: 'fileDropZoneAddedOne' });
    } else if (acceptedFiles.length > 1) {
      results.push({
        key: 'fileDropZoneAddedMany',
        values: { count: acceptedFiles.length },
      });
    } else {
      results.push({ key: 'fileDropZoneNoFilesAdded' });
    }

    results.push(...rejections);

    const firstAnnouncementId = announcementSequence.current;
    const nextAnnouncements = results.map((message, index) => ({
      ...message,
      id: firstAnnouncementId + index,
    }));
    announcementSequence.current += results.length;

    setAnnouncements(nextAnnouncements);

    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles);
    }
  }

  function handlePickerChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    addFiles(input.files ?? []);
    input.value = '';
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    if (!isFileDrag(event.dataTransfer)) {
      setIsDragging(false);
      return;
    }

    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleDragEnter(event: DragEvent<HTMLElement>) {
    setIsDragging(isFileDrag(event.dataTransfer));
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setIsDragging(false);
  }

  return (
    <section
      aria-describedby={instructionsId}
      aria-labelledby={labelId}
      className={[
        variants.base.dropZone,
        variants.variant.dropZone[variant],
      ].join(' ')}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(event) => {
        if (!isFileDrag(event.dataTransfer)) {
          setIsDragging(false);
          return;
        }

        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={handleDrop}
    >
      <Typography element="p" id={labelId} variant="title">
        {label}
      </Typography>
      <Typography
        element="p"
        id={instructionsId}
        tone="secondary"
        variant="body"
      >
        {instructions.map((message, index) => (
          <Fragment key={message.key}>
            {index > 0 ? ' ' : null}
            <span lang={getMessageLocale(message.key)}>
              {interpolateMessage(
                messages[message.key],
                'values' in message ? message.values : undefined,
                getMessageLocale(message.key),
              )}
            </span>
          </Fragment>
        ))}
      </Typography>
      <span lang={getMessageLocale('fileDropZoneChooseFiles')}>
        <Button onAction={() => inputRef.current?.click()} variant="secondary">
          {messages.fileDropZoneChooseFiles}
        </Button>
      </span>
      <input
        accept={accept}
        aria-hidden="true"
        className={variants.base.input}
        multiple
        onChange={handlePickerChange}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
      <output
        aria-atomic="true"
        aria-live="polite"
        className={variants.base.status}
      >
        {announcements.map((message, index) => (
          <Fragment key={message.id}>
            {index > 0 ? ' ' : null}
            <span lang={getMessageLocale(message.key)}>
              {interpolateMessage(
                messages[message.key],
                'values' in message ? message.values : undefined,
                getMessageLocale(message.key),
              )}
            </span>
          </Fragment>
        ))}
      </output>
    </section>
  );
}
