import type { ReactElement, ReactNode } from 'react';
import { FormattedList } from '../../formatting/FormattedList/FormattedList';
import { PaperclipIcon } from '../../icons';
import type { FileRejection } from '../../internal/types/file';
import { DropZone } from '../../primitives/DropZone/DropZone';
import { FileTrigger } from '../../primitives/FileTrigger/FileTrigger';

/** Props for an accessible browse-and-drop file selection surface. */
export interface FileUploadProps {
  /** Accepted MIME types, wildcard MIME groups, or extensions. */
  acceptedFileTypes?: readonly string[];
  /** Allows more than one file. Defaults to `false`. */
  allowsMultiple?: boolean;
  /** Visible label for the browse action. */
  browseLabel: ReactNode;
  /** Prevents browse and drop interaction. Defaults to `false`. */
  disabled?: boolean;
  /** Supporting accepted-file or workflow guidance. */
  guidance?: ReactNode;
  /** Exposes invalid state and error association. Defaults to `false`. */
  invalid?: boolean;
  /** Persistent visible drop-zone label. */
  label: ReactNode;
  /** Maximum accepted file size in bytes. */
  maxFileSize?: number;
  /** Called with files selected through browse or drop. */
  onFiles: (files: File[]) => void;
  /** Called with files rejected by Breeze constraints. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Selected files owned by the application and presented as feedback. */
  selectedFiles?: readonly File[];
}

/**
 * Selects files through browse or drop while leaving upload transport
 * application-owned.
 *
 * @summary accessible browse-and-drop file selection with persistent feedback
 */
export function FileUpload({
  acceptedFileTypes,
  allowsMultiple = false,
  browseLabel,
  disabled = false,
  guidance,
  invalid = false,
  label,
  maxFileSize,
  onFiles,
  onReject,
  selectedFiles = [],
}: Readonly<FileUploadProps>): ReactElement {
  return (
    <DropZone.Root
      acceptedFileTypes={acceptedFileTypes}
      allowsMultiple={allowsMultiple}
      disabled={disabled}
      invalid={invalid}
      maxFileSize={maxFileSize}
      onFiles={onFiles}
      onReject={onReject}
      className="grid min-h-16 w-full grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-4 border border-solid border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-0 text-left transition-colors outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55 data-[drop-target]:border-[var(--breeze-primary)] data-[drop-target]:bg-[var(--breeze-surface)] data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[focus-visible]:outline-solid data-[hovered]:border-[var(--breeze-primary)]"
      data-breeze-file-upload=""
    >
      <span className="ml-4 flex size-6 items-center text-[var(--breeze-primary)]">
        <PaperclipIcon aria-hidden="true" size={20} />
      </span>
      <span className="flex min-w-0 flex-col">
        <DropZone.Label className="overflow-hidden font-[family-name:var(--breeze-font-display)] text-base leading-[1.4] font-bold text-ellipsis whitespace-nowrap">
          {selectedFiles.length === 0 ? (
            label
          ) : (
            <FormattedList values={selectedFiles.map((file) => file.name)} />
          )}
        </DropZone.Label>
        {guidance === undefined ? null : (
          <DropZone.Description className="m-0 mt-1 text-base leading-[1.4] text-[var(--breeze-ink-soft)]">
            {guidance}
          </DropZone.Description>
        )}
      </span>
      <FileTrigger.Root
        acceptedFileTypes={acceptedFileTypes}
        allowsMultiple={allowsMultiple}
        disabled={disabled}
        invalid={invalid}
        maxFileSize={maxFileSize}
        onFiles={onFiles}
        onReject={onReject}
      >
        <FileTrigger.Trigger className="h-full min-h-0 self-stretch border-0 border-l border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] px-4 py-0 text-base text-[var(--breeze-primary)] data-[focus-visible]:outline-solid data-[hovered]:bg-[var(--breeze-primary-soft)]">
          {browseLabel}
        </FileTrigger.Trigger>
        <FileTrigger.Feedback className="col-span-3 px-4 pb-3" />
      </FileTrigger.Root>
      <DropZone.Feedback className="col-span-3 px-4 pb-3" />
    </DropZone.Root>
  );
}
