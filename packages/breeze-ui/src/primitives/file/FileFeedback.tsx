import type { HTMLAttributes, ReactElement, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { FileRejection } from '../../internal/types/file';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props shared by Breeze file-rejection feedback parts. */
export interface FileFeedbackPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Ref to the rendered feedback region. */
  ref?: Ref<HTMLDivElement>;
}

interface FileFeedbackProps extends FileFeedbackPartProps {
  rejections: FileRejection[];
}

/** Renders and announces stable Breeze file rejection feedback. */
export default function FileFeedback({
  className,
  ref,
  rejections,
  ...props
}: FileFeedbackProps): ReactElement | null {
  const forwardedRef = useForwardedRef(ref);
  const { messages } = useBreezeContext();
  const rejectionMessages = {
    'file-count': messages.fileCountRejection,
    'file-size': messages.fileSizeRejection,
    'file-type': messages.fileTypeRejection,
  } as const;

  if (rejections.length === 0) {
    return null;
  }

  return createElement(
    'div',
    { ...props, className, ref: forwardedRef, role: 'alert' },
    rejections.map(({ file, reasons }) =>
      createElement(
        'p',
        { key: `${file.name}-${file.size}-${file.lastModified}` },
        `${file.name}: ${reasons.map((reason) => rejectionMessages[reason]).join(' ')}`,
      ),
    ),
  );
}
