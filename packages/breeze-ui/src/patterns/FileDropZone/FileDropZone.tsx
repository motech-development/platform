import {
  type ChangeEvent,
  type DragEvent,
  Fragment,
  useId,
  useRef,
  useState,
} from 'react';
import { FieldLabel } from '../../fields/field.presentation';
import { fieldVariants } from '../../fields/field.styles';
import { Button } from '../../primitives/Button/Button';
import { Icon } from '../../primitives/Icon/Icon';
import { useBreezeContext } from '../../provider/BreezeContext';

type FileDropZoneLayout = 'compact' | 'stacked';

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
      'breeze:box-border breeze:flex breeze:min-inline-0 breeze:rounded-breeze-panel breeze:border-dashed breeze:border-breeze-line-strong breeze:bg-breeze-raised breeze:data-[dragging]:border-breeze-brand breeze:data-[dragging]:bg-breeze-brand-soft',
    input: 'breeze:sr-only',
    primary: 'breeze:m-0 breeze:text-breeze-sm breeze:text-breeze-ink',
    secondary:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:leading-[calc(1/0.75)] breeze:text-breeze-ink-3',
    // Out of flow while empty so the live region stays exposed without adding a gap.
    status:
      'breeze:text-breeze-sm breeze:text-breeze-ink-2 breeze:empty:sr-only',
    text: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    thumbnail:
      'breeze:flex breeze:block-breeze-tap breeze:inline-breeze-md breeze:shrink-0 breeze:items-center breeze:justify-center breeze:rounded-breeze-sm breeze:border breeze:border-dashed breeze:border-breeze-line-strong breeze:bg-breeze-sunken breeze:text-breeze-ink-3',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    actions: {
      compact: 'breeze:shrink-0',
      stacked: 'breeze:mbs-[6px]',
    },
    dropZone: {
      compact:
        'breeze:min-block-breeze-row breeze:items-center breeze:gap-breeze-3 breeze:border breeze:px-breeze-3 breeze:py-breeze-1',
      stacked:
        'breeze:flex-col breeze:items-center breeze:gap-[6px] breeze:border-2 breeze:px-breeze-4 breeze:py-breeze-6 breeze:text-center',
    },
    primary: {
      compact: 'breeze:font-medium breeze:leading-[calc(1.25/0.875)]',
      stacked: 'breeze:font-semibold breeze:leading-breeze-snug',
    },
    text: {
      compact: 'breeze:grow breeze:gap-breeze-px breeze:text-start',
      stacked: 'breeze:items-center breeze:gap-[6px]',
    },
  },
} as const satisfies {
  base: Record<string, string>;
  compound: Record<string, never>;
  size: Record<string, never>;
  state: Record<string, never>;
  variant: Record<string, Record<FileDropZoneLayout, string>>;
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
  /** Lays the drop area out as one attachment-height row instead of a stacked panel. */
  compact?: boolean;
  /** Number of files already attached; used with `maxFiles` for total limits. */
  currentFileCount?: number;
  /** Visible field label and accessible name for the drop area. */
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
  compact = false,
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
  const limitsId = useId();
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
  const layout = compact ? 'compact' : 'stacked';
  const instructionKey = isDragging
    ? 'fileDropZoneReleaseInstructions'
    : 'fileDropZoneDropInstructions';
  const limits: FileDropZoneMessage[] = [];

  if (acceptedTypes.length > 0) {
    limits.push({
      key: 'fileDropZoneAcceptedTypes',
      values: { types: acceptedTypes.join(', ') },
    });
  }

  if (maxSize !== undefined) {
    limits.push({
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
    limits.push({
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
    <div className={fieldVariants.base.root}>
      <FieldLabel id={labelId} label={label} loading={false} />
      <section
        aria-describedby={
          limits.length > 0 ? `${instructionsId} ${limitsId}` : instructionsId
        }
        aria-labelledby={labelId}
        className={[
          variants.base.dropZone,
          variants.variant.dropZone[layout],
        ].join(' ')}
        data-dragging={isDragging || undefined}
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
        {compact ? (
          <span aria-hidden="true" className={variants.base.thumbnail}>
            <Icon name="upload" size="sm" />
          </span>
        ) : (
          <Icon name="upload" size="lg" />
        )}
        <div
          className={[variants.base.text, variants.variant.text[layout]].join(
            ' ',
          )}
        >
          <p
            className={[
              variants.base.primary,
              variants.variant.primary[layout],
            ].join(' ')}
            id={instructionsId}
            lang={getMessageLocale(instructionKey)}
          >
            {messages[instructionKey]}
          </p>
          {limits.length > 0 ? (
            <p className={variants.base.secondary} id={limitsId}>
              {limits.map((message, index) => (
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
            </p>
          ) : null}
        </div>
        <span
          className={variants.variant.actions[layout]}
          lang={getMessageLocale('fileDropZoneChooseFiles')}
        >
          <Button
            onAction={() => inputRef.current?.click()}
            size="sm"
            variant="secondary"
          >
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
      </section>
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
    </div>
  );
}
