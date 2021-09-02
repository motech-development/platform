import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import useInput from '../hooks/useInput';
import useCombinedRefs from '../hooks/useCombinedRefs';
import { classNames } from '../utils/className';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';
import Button from './Button';
import InputWrapper from './InputWrapper';

export interface IFileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  buttonText: string;
  errorMessage?: string;
  helpText?: string;
  label: string;
  loading?: boolean;
  placeholder: string;
  name: string;
  spacing?: TSpacing;
  theme?: TTheme;
}

const FileUpload = forwardRef<HTMLInputElement, IFileUploadProps>(
  (
    {
      buttonText,
      className = '',
      errorMessage,
      helpText,
      label,
      loading = false,
      placeholder,
      spacing = 'lg',
      theme = 'primary',
      ...rest
    },
    ref,
  ) => {
    const [fileName, setFileName] = useState(placeholder);
    const innerRef = useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs(ref, innerRef);
    const {
      describedBy,
      errorDescription,
      inputDescription,
      inputTheme,
      styles,
    } = useInput(rest.name, theme, helpText, errorMessage, className);
    const onClick = () => {
      const { current } = combinedRef;

      if (current) {
        current.click();
      }
    };

    useEffect(() => {
      const { current } = combinedRef;

      if (current) {
        current.onchange = () => {
          if (current.files && current.files.length > 0) {
            const names = [...current.files].map(({ name }) => name).join(', ');

            setFileName(names);
          }
        };
      }
    }, [combinedRef]);

    return (
      <InputWrapper
        errorDescription={errorDescription}
        errorMessage={errorMessage}
        helpText={helpText}
        inputDescription={inputDescription}
        label={label}
        name={rest.name}
        spacing={spacing}
      >
        <div className="flex">
          <Button
            className="z-10"
            type="button"
            colour={inputTheme}
            loading={loading}
            onClick={onClick}
          >
            {buttonText}
          </Button>

          <div
            className={classNames(
              'bg-white border px-3 py-2 relative overflow-hidden',
              fileName === placeholder ? 'text-gray-500' : '',
              styles,
            )}
          >
            <p className="truncate">{fileName}</p>

            <input
              id={rest.name}
              className={classNames(
                'opacity-0 absolute top-0 left-0 bottom-0',
                styles,
              )}
              aria-describedby={describedBy}
              type="file"
              ref={combinedRef}
              {...rest}
            />
          </div>
        </div>
      </InputWrapper>
    );
  },
);

export default FileUpload;
