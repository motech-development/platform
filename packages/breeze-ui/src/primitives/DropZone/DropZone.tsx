import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react';
import {
  DropZone as AriaDropZone,
  Text as AriaText,
} from 'react-aria-components/DropZone';
import { tv } from 'tailwind-variants';
import validateFiles from '../../internal/files/validation';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type {
  DropZoneFileReadFailure,
  FileRejection,
} from '../../internal/types/file';
import { useBreezeContext } from '../../provider/BreezeContext';
import FileFeedback, { type FileFeedbackPartProps } from '../file/FileFeedback';

const dropZoneStyle = tv({
  base: 'flex min-h-36 flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-6 text-center text-[var(--breeze-ink)] transition-colors data-[drop-target]:border-[var(--breeze-primary)] data-[drop-target]:bg-[var(--breeze-primary-soft)]',
});

interface DropZoneContextValue {
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  rejections: FileRejection[];
}

interface FileReadSuccess {
  file: File;
}

interface FileReadFailure {
  failure: DropZoneFileReadFailure;
}

type FileReadResult = FileReadFailure | FileReadSuccess;

const DropZoneContext = createContext<DropZoneContextValue | null>(null);

type WithoutEventHandlers<Props> = {
  [Key in keyof Props as Key extends `on${string}` ? never : Key]: Props[Key];
};

type DropZoneNativeProps = Omit<
  WithoutEventHandlers<HTMLAttributes<HTMLDivElement>>,
  'children' | 'style'
>;

/** Props for an accessible native-file drop target. */
export interface DropZoneRootProps extends DropZoneNativeProps {
  /** Drop-zone label, guidance, trigger, and feedback. */
  children: ReactNode;
  /** Accepted MIME types, wildcard MIME groups, or extensions. */
  acceptedFileTypes?: readonly string[];
  /** Allows more than one dropped file. Defaults to `false`. */
  allowsMultiple?: boolean;
  /** Prevents focus and dropping. Defaults to `false`. */
  disabled?: boolean;
  /** Exposes invalid state to assistive technology. Defaults to `false`. */
  invalid?: boolean;
  /** Maximum accepted file size in bytes. */
  maxFileSize?: number;
  /** Called with dropped native files. */
  onFiles: (files: File[]) => void;
  /** Called with files rejected by Breeze constraints. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Called once when native file reading fails. Mixed drops are atomic: `onFiles` and `onReject` are not called when any item fails to read. */
  onFileReadError?: (failures: DropZoneFileReadFailure[]) => void;
  /** Ref to the rendered drop-zone root. */
  ref?: Ref<HTMLDivElement>;
  /** Exposes required presentation and validation state. Defaults to `false`. */
  required?: boolean;
}

/** Props for built-in dropped-file rejection feedback. */
export type DropZoneFeedbackProps = FileFeedbackPartProps;

/** Props for supporting drop-zone guidance. */
export interface DropZoneDescriptionProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'id' | 'style'> {
  /** Guidance describing accepted files or interaction. */
  children: ReactNode;
  /** Ref to the rendered description. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Props for accessible invalid-state feedback. */
export interface DropZoneErrorProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'id' | 'style'> {
  /** Validation message shown while the root is invalid. */
  children: ReactNode;
  /** Ref to the rendered error. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Props for the visible drop-zone label. */
export interface DropZoneLabelProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Persistent label that names the drop target. */
  children: ReactNode;
  /** Ref to the rendered label. */
  ref?: Ref<HTMLElement>;
}

/** Receives file drops through React Aria's pointer and keyboard model. */
export function Root({
  acceptedFileTypes,
  allowsMultiple = false,
  children,
  className,
  disabled = false,
  invalid = false,
  maxFileSize,
  onFiles,
  onFileReadError,
  onReject,
  ref,
  required = false,
  ...props
}: Readonly<DropZoneRootProps>): ReactElement {
  useBreezeContext();

  const suppliedRef = useForwardedRef(ref);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const descriptionId = useId();
  const errorId = useId();
  const describedBy = [
    props['aria-describedby'],
    descriptionId,
    invalid ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const forwardedRef = useCallback(
    (element: HTMLDivElement | null) => {
      suppliedRef(element);
      if (!element) {
        return;
      }

      const { dataset } = element;

      element.setAttribute('aria-describedby', describedBy);
      if (invalid) {
        element.setAttribute('aria-invalid', 'true');
      } else {
        element.removeAttribute('aria-invalid');
      }
      if (required) {
        dataset.required = 'true';
      } else {
        delete dataset.required;
      }
    },
    [describedBy, invalid, required, suppliedRef],
  );

  return createElement(
    DropZoneContext.Provider,
    { value: { descriptionId, errorId, invalid, rejections } },
    createElement(
      AriaDropZone,
      {
        ...props,
        'aria-describedby': describedBy,
        'aria-invalid': invalid || undefined,
        className: dropZoneStyle({ class: className }),
        isDisabled: disabled,
        onDrop: (event) => {
          const fileItems = event.items.filter((item) => item.kind === 'file');

          Promise.all(
            fileItems.map(async (item, itemIndex): Promise<FileReadResult> => {
              try {
                const file = await item.getFile();

                return { file };
              } catch (cause: unknown) {
                return {
                  failure: {
                    cause,
                    itemIndex,
                    name: item.name,
                    type: item.type,
                  },
                };
              }
            }),
          ).then(
            (readResults) => {
              const failures = readResults.flatMap((result) =>
                'failure' in result ? [result.failure] : [],
              );

              if (failures.length > 0) {
                setRejections([]);
                onFileReadError?.(failures);
              } else {
                const files = readResults.flatMap((result) =>
                  'file' in result ? [result.file] : [],
                );
                const result = validateFiles(files, {
                  acceptedFileTypes,
                  allowsMultiple,
                  maxFileSize,
                });

                setRejections(result.rejected);
                onFiles(result.accepted);
                if (result.rejected.length > 0) {
                  onReject?.(result.rejected);
                }
              }
            },
            (cause: unknown) => {
              const failures = fileItems.map((item, itemIndex) => ({
                cause,
                itemIndex,
                name: item.name,
                type: item.type,
              }));

              setRejections([]);
              onFileReadError?.(failures);
            },
          );
        },
        ref: forwardedRef,
      } as ComponentProps<typeof AriaDropZone>,
      children,
    ),
  );
}

/** Renders supporting guidance associated with the drop target. */
export function Description({
  ref,
  ...props
}: Readonly<DropZoneDescriptionProps>): ReactElement {
  const context = useContext(DropZoneContext);
  const forwardedRef = useForwardedRef(ref);

  if (!context) {
    throw new globalThis.Error(
      'DropZone.Description must be inside DropZone.Root.',
    );
  }

  return createElement('p', {
    ...props,
    id: context.descriptionId,
    ref: forwardedRef,
  });
}

/** Renders an associated validation message while the root is invalid. */
function ErrorMessage({
  ref,
  ...props
}: Readonly<DropZoneErrorProps>): ReactElement | null {
  const context = useContext(DropZoneContext);
  const forwardedRef = useForwardedRef(ref);

  if (!context) {
    throw new globalThis.Error('DropZone.Error must be inside DropZone.Root.');
  }

  if (!context.invalid) {
    return null;
  }

  return createElement('p', {
    ...props,
    id: context.errorId,
    ref: forwardedRef,
    role: 'alert',
  });
}

export { ErrorMessage as Error };

/** Announces Breeze-owned type, size, and count rejection feedback. */
export function Feedback(
  props: Readonly<DropZoneFeedbackProps>,
): ReactElement | null {
  const context = useContext(DropZoneContext);

  if (!context) {
    throw new globalThis.Error(
      'DropZone.Feedback must be inside DropZone.Root.',
    );
  }

  return createElement(FileFeedback, {
    ...props,
    rejections: context.rejections,
  });
}

/** Renders the visible label consumed by React Aria's drop affordance. */
export function Label({
  className,
  ref,
  ...props
}: Readonly<DropZoneLabelProps>): ReactElement {
  return createElement(AriaText, {
    ...props,
    className,
    ref: useForwardedRef(ref),
    slot: 'label',
  });
}

/**
 * Accepts native file drops through an accessible drop target while Breeze
 * validates file constraints and applications own upload processing.
 *
 * @summary accessible native-file drop target with validation feedback
 */
export const DropZone = {
  /** Supporting drop guidance. */
  Description,
  /** Invalid-state validation feedback. */
  Error: ErrorMessage,
  /** Accessible Breeze-owned file rejection feedback. */
  Feedback,
  /** Persistent accessible drop-target label. */
  Label,
  /** Native-file drop interaction boundary. */
  Root,
};
