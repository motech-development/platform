import type {
  ComponentProps,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { PressResponder } from 'react-aria/private/interactions/PressResponder';
import { Button as AriaButton } from 'react-aria-components/Button';
import validateFiles from '../../internal/files/validation';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import action from '../../internal/styling/actions';
import type { FileRejection } from '../../internal/types/file';
import type { NativeButtonProps } from '../../internal/types/native';
import { useBreezeContext } from '../../provider/BreezeContext';
import FileFeedback, { type FileFeedbackPartProps } from '../file/FileFeedback';

interface FileTriggerContextValue {
  disabled: boolean;
  invalid: boolean;
  rejections: FileRejection[];
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const FileTriggerContext = createContext<FileTriggerContextValue | null>(null);

type WithoutEventHandlers<Props> = {
  [Key in keyof Props as Key extends `on${string}` ? never : Key]: Props[Key];
};

type NativeFileInputProps = Omit<
  WithoutEventHandlers<InputHTMLAttributes<HTMLInputElement>>,
  | 'accept'
  | 'capture'
  | 'children'
  | 'className'
  | 'disabled'
  | 'form'
  | 'multiple'
  | 'name'
  | 'required'
  | 'style'
  | 'type'
>;

interface DirectoryFileInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
}

/** Props for the native file-dialog boundary. */
export interface FileTriggerRootProps extends NativeFileInputProps {
  /** Pressable trigger and file-selection feedback. */
  children: ReactNode;
  /** Accepted MIME types, wildcard MIME groups, or extensions. */
  acceptedFileTypes?: readonly string[];
  /** Enables native directory selection instead of individual files. Defaults to `false`. */
  acceptDirectory?: boolean;
  /** Allows more than one file to be selected. Defaults to `false`. */
  allowsMultiple?: boolean;
  /** Prevents opening the native file dialog. Defaults to `false`. */
  disabled?: boolean;
  /** Requests the user-facing or environment camera for media capture. */
  defaultCamera?: 'environment' | 'user';
  /** External native form id. */
  form?: string;
  /** Exposes invalid state to assistive technology. Defaults to `false`. */
  invalid?: boolean;
  /** Maximum accepted file size in bytes. */
  maxFileSize?: number;
  /** Native form field name. */
  name?: string;
  /** Called with selected native files. */
  onFiles: (files: File[]) => void;
  /** Called with files rejected by Breeze constraints. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Marks file selection as required for assistive technology. Defaults to `false`. */
  required?: boolean;
  /** Ref to the hidden native file input. */
  ref?: Ref<HTMLInputElement>;
}

/** Props for built-in file-selection rejection feedback. */
export type FileTriggerFeedbackProps = FileFeedbackPartProps;

/** Props for the keyboard-operable dialog trigger. */
export interface FileTriggerButtonProps extends NativeButtonProps {
  /** Trigger label or content. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Ref to the rendered trigger button. */
  ref?: Ref<HTMLButtonElement>;
}

/** Coordinates native file selection with a React Aria pressable trigger. */
export function Root({
  acceptDirectory = false,
  acceptedFileTypes,
  allowsMultiple = false,
  children,
  disabled = false,
  defaultCamera,
  form,
  invalid = false,
  maxFileSize,
  name,
  onFiles,
  onReject,
  ref,
  required = false,
  ...props
}: FileTriggerRootProps): ReactElement {
  const { messages } = useBreezeContext();

  const suppliedRef = useForwardedRef(ref);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [nativeInvalid, setNativeInvalid] = useState(false);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const forwardedRef = useCallback(
    (input: HTMLInputElement | null) => {
      inputRef.current = input;
      suppliedRef(input);
    },
    [suppliedRef],
  );

  const selectFiles = (fileList: FileList | null) => {
    if (disabled) {
      return;
    }

    const result = validateFiles(fileList ? Array.from(fileList) : [], {
      acceptedFileTypes,
      allowsMultiple,
      maxFileSize,
    });

    if (result.rejected.length > 0 && inputRef.current !== null) {
      if (typeof DataTransfer === 'undefined') {
        inputRef.current.value = '';
      } else {
        const acceptedFiles = new DataTransfer();

        result.accepted.forEach((file) => acceptedFiles.items.add(file));
        inputRef.current.files = acceptedFiles.files;
      }
    }

    setNativeInvalid(required && result.accepted.length === 0);
    setRejections(result.rejected);
    onFiles(result.accepted);
    if (result.rejected.length > 0) {
      onReject?.(result.rejected);
    }
  };

  return createElement(
    FileTriggerContext.Provider,
    {
      value: {
        disabled,
        invalid: invalid || nativeInvalid,
        rejections,
        triggerRef,
      },
    },
    createElement(
      PressResponder,
      {
        isDisabled: disabled,
        onPress: () => {
          if (inputRef.current?.value) {
            inputRef.current.value = '';
          }

          inputRef.current?.click();
        },
      } as unknown as ComponentProps<typeof PressResponder>,
      children,
    ),
    createElement('input', {
      ...props,
      accept: acceptedFileTypes?.join(','),
      'aria-invalid': invalid || undefined,
      'aria-label': messages.selectFiles,
      'aria-required': required || undefined,
      capture: defaultCamera,
      disabled,
      form,
      multiple: allowsMultiple,
      name,
      onChange: (event) => selectFiles(event.currentTarget.files),
      onInvalid: (event) => {
        event.preventDefault();
        setNativeInvalid(true);
        triggerRef.current?.setAttribute('aria-invalid', 'true');
        triggerRef.current?.focus();
      },
      ref: forwardedRef,
      required,
      style: {
        border: 0,
        clip: 'rect(0, 0, 0, 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      },
      type: 'file',
      webkitdirectory: acceptDirectory ? '' : undefined,
    } as DirectoryFileInputProps),
  );
}

/** Announces Breeze-owned type, size, and count rejection feedback. */
export function Feedback(props: FileTriggerFeedbackProps): ReactElement | null {
  const context = useContext(FileTriggerContext);

  if (!context) {
    throw new Error('FileTrigger.Feedback must be inside FileTrigger.Root.');
  }

  return createElement(FileFeedback, {
    ...props,
    rejections: context.rejections,
  });
}

/** Opens the associated native file dialog by pointer or keyboard. */
export function Trigger({
  children,
  className,
  ref,
  ...props
}: FileTriggerButtonProps): ReactElement {
  const context = useContext(FileTriggerContext);

  if (!context) {
    throw new Error('FileTrigger.Trigger must be inside FileTrigger.Root.');
  }

  const suppliedRef = useForwardedRef(ref);
  const forwardedRef = useCallback(
    (button: HTMLButtonElement | null) => {
      context.triggerRef.current = button;
      suppliedRef(button);
    },
    [context.triggerRef, suppliedRef],
  );

  return createElement(
    AriaButton,
    {
      ...props,
      'aria-invalid': context.invalid || undefined,
      className: action({ class: className }),
      isDisabled: context.disabled,
      ref: forwardedRef,
    } as ComponentProps<typeof AriaButton>,
    children,
  );
}

/**
 * Opens the native file dialog from a keyboard-operable trigger, validates the
 * selected files, and returns accepted files through semantic callbacks.
 *
 * @summary accessible native file selection with validation feedback
 */
export const FileTrigger = {
  /** Accessible Breeze-owned file rejection feedback. */
  Feedback,
  /** Native input and selection boundary. */
  Root,
  /** Keyboard-operable file-dialog trigger. */
  Trigger,
};
