import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { PaperclipIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for a selected file with persistent application-owned actions. */
export interface FileAttachmentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** View, replace, download, or removal actions owned by the application. */
  actions: ReactNode;
  /** Persistent visible file name. */
  name: ReactNode;
  /** Ref to the rendered attachment row. */
  ref?: Ref<HTMLDivElement>;
}

interface FileAttachmentElementProps extends HTMLAttributes<HTMLDivElement> {
  'data-breeze-file-attachment': string;
  ref: Ref<HTMLDivElement>;
}

/**
 * Presents a selected file and its actions with canonical responsive geometry.
 *
 * @summary responsive selected-file row with application-owned actions
 */
export function FileAttachment({
  actions,
  className,
  name,
  ref,
  ...props
}: FileAttachmentProps): ReactElement {
  useBreezeContext();

  return createElement(
    'div',
    {
      ...props,
      className: `flex min-h-16 flex-col items-stretch justify-between gap-4 py-2.5 sm:flex-row sm:items-center ${className ?? ''}`,
      'data-breeze-file-attachment': '',
      ref: useForwardedRef(ref),
    } as FileAttachmentElementProps,
    <>
      <span className="flex min-w-0 items-center gap-2.5">
        <PaperclipIcon size={16} />
        <strong className="min-w-0 truncate font-bold">{name}</strong>
      </span>
      <div
        className="flex flex-wrap gap-2.5 [&>*]:w-full sm:[&>*]:w-auto"
        data-breeze-file-attachment-actions=""
      >
        {actions}
      </div>
    </>,
  );
}
