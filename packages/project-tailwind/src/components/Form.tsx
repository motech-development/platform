import { RadioGroup } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import {
  ComponentPropsWithRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Box } from 'react-polymorphic-box';
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize';
import useMergeRefs from '../utilities/refs';
import {
  Sizing,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { Typography } from './Typography';

// TODO: Select

/** Get message utility type */
type TGetMessage =
  | {
      /** Check if message exists */
      hasMessage: true;

      /** Message identifier */
      id: string;

      /** Message string */
      message: string;
    }
  | {
      /** Check if message exists */
      hasMessage: false;

      /** Message identifier */
      id?: undefined;

      /** Message string */
      message?: undefined;
    };

/**
 * Input utility to generate IDs and flag whether there are any validation errors
 *
 * @param name - Field name
 *
 * @returns Error message utility
 */
function useInput(name: string) {
  const [tooltip, setTooltip] = useState<boolean>();

  function inputDefined(input?: string): input is string {
    return Boolean(input);
  }

  /**
   * Returns details for input messages
   *
   * @param suffix - Suffix to apply to id
   *
   * @param message - Message to display
   *
   * @returns Message details
   */
  function getMessage(suffix: string, message?: string): TGetMessage {
    const id = `${name}-${suffix}`;

    const hasMessage = inputDefined(message);

    if (hasMessage) {
      return {
        hasMessage,
        id,
        message,
      };
    }

    return {
      hasMessage,
      message,
    };
  }

  return {
    getMessage,
    setTooltip,
    tooltip,
  };
}

/** Container component properties */
interface IContainerProps {
  /** Explanatory text component */
  helpText: ReactNode;

  /** Input component */
  input: ReactNode;

  /** Label component */
  label: ReactNode;

  /** Apply spacing to wrapper */
  spacing: TSizing;

  /** Component theme */
  theme: TTheme;

  /** Validation error message componenet */
  validationMessage: ReactNode;
}

/**
 * Form component container
 *
 * @param props - Component props
 *
 * @returns Container component
 */
function Container({
  helpText,
  input,
  label,
  spacing,
  theme,
  validationMessage,
}: IContainerProps) {
  const { createStyles } = useTailwind(theme, spacing);

  const containerStyles = createStyles({
    sizing: {
      lg: ['mb-6'],
      md: ['mb-4'],
      none: ['mb-0'],
      sm: ['mb-2'],
    },
  });

  return (
    <div className={containerStyles}>
      {label}

      <div className="relative mt-1 shadow-sm">
        {input}

        <div className="absolute inset-y-0 right-0 z-10 flex cursor-pointer items-center pr-3">
          {validationMessage}
        </div>
      </div>

      {helpText}
    </div>
  );
}

/** HelpText component properties */
interface IHelpTextProps {
  /** Component identifier */
  id: string;

  /** Supporting input text */
  message: string;

  /** Component theme */
  theme: TTheme;
}

/**
 * Creates form component help text
 *
 * @param props - Component props
 *
 * @returns HelpText componenet
 */
function HelpText({ id, message, theme }: IHelpTextProps) {
  const { createStyles } = useTailwind(theme);

  const helpTextStyles = createStyles({
    classNames: ['mt-2 text-sm'],
    theme: {
      danger: ['text-red-600'],
      primary: ['text-blue-600'],
      secondary: ['text-gray-600'],
      success: ['text-green-600'],
      warning: ['text-yellow-600'],
    },
  });

  return (
    <Typography className={helpTextStyles} id={id}>
      {message}
    </Typography>
  );
}

/** Label component properties */
export interface ILabelProps extends ComponentPropsWithRef<'label'> {
  /** Mark as required */
  required?: boolean;

  /** Component theme */
  theme: TTheme;
}

/**
 * Reusable input label
 *
 * @param props - Component props
 *
 * @returns Label component
 */
export function Label({
  children,
  className,
  htmlFor,
  required = false,
  theme,
  ...rest
}: ILabelProps) {
  const { createStyles } = useTailwind(theme);

  const labelStyles = createStyles({
    classNames: ['block text-sm font-medium', className],
    theme: {
      danger: ['text-red-700'],
      primary: ['text-blue-700'],
      secondary: ['text-gray-700'],
      success: ['text-green-700'],
      warning: ['text-yellow-700'],
    },
  });

  return (
    <label className={labelStyles} htmlFor={htmlFor} {...rest}>
      {children}

      {required && <span className="font-bold text-red-800">*</span>}
    </label>
  );
}

/** ValidationMessage component properties */
interface IValidationMessage {
  /** Message identifier */
  id: string;

  /** Message to be displayed */
  message: string;

  /** Callback trigger when tooltop is shown or hidden  */
  onVisibilityChange: (value: boolean) => void;
}

function ValidationMessage({
  id,
  message,
  onVisibilityChange,
}: IValidationMessage) {
  return (
    <Tooltip
      className="cursor-pointer"
      content={
        <Typography id={id} margin={Sizing.NONE}>
          {message}
        </Typography>
      }
      parent={
        <ExclamationCircleIcon className="h-5 w-5 cursor-pointer text-red-500" />
      }
      onVisibilityChange={onVisibilityChange}
      position="left"
      theme={Themes.DANGER}
    />
  );
}

/** Supported text input types */
enum InputTypes {
  /** Email */
  EMAIL = 'email',
  /** Password */
  PASSWORD = 'password',
  /** Telephone */
  TELEPHONE = 'tel',
  /** Text */
  TEXT = 'text',
}

/** Text input type */
type TInputType = `${InputTypes}`;

/** Input component properties */
export interface IInputProps extends ComponentPropsWithRef<'input'> {
  /** Limit number of digits after decimal point */
  decimalScale?: number;

  /** Validation error message */
  errorMessage?: string;

  /** Define input pattern using `#` character */
  format?: string;

  /** Supporting text */
  helpText?: string;

  /** Input label */
  label: string;

  /** Input name */
  name: string;

  /** Prefix value to display */
  prefix?: string;

  /** Component spacing */
  spacing?: TSizing;

  /** Suffix value to display */
  suffix?: string;

  /** Component theme */
  theme?: TTheme;

  /** Input type */
  type?: TInputType;
}

/**
 * Text input form component
 *
 * @param props - Component props
 *
 * @returns Input component
 */
export function Input({
  'aria-describedby': ariaDescribedby,
  className,
  decimalScale,
  errorMessage,
  format,
  helpText,
  id,
  label,
  name,
  prefix,
  spacing = Sizing.MD,
  suffix,
  theme = Themes.SECONDARY,
  type = InputTypes.TEXT,
  ...rest
}: IInputProps) {
  const { getMessage, setTooltip, tooltip } = useInput(name);

  const {
    hasMessage: hasDescription,
    id: describedById,
    message: description,
  } = getMessage('description', helpText);

  const {
    hasMessage: hasError,
    id: errorMessageId,
    message: error,
  } = getMessage('error', errorMessage);

  const { createStyles } = useTailwind(theme, spacing);

  const inputStyles = createStyles({
    classNames: ['block w-full text-sm pr-10', className],
    theme: {
      danger: ['border-red-300'],
      primary: ['border-blue-300'],
      secondary: ['border-gray-300'],
      success: ['border-green-300'],
      warning: ['border-yellow-300'],
    },
  });

  /**
   * Decide what component to render input as
   *
   * @returns Required component
   */
  function renderAs() {
    if (format) {
      return PatternFormat;
    }

    if (decimalScale || prefix || suffix) {
      return NumericFormat;
    }

    return 'input';
  }

  /**
   * Additional props for formatted inputs
   *
   * @returns Additional props
   */
  function additionalProps() {
    if (format) {
      return {
        format,
      };
    }

    if (decimalScale || prefix || suffix) {
      const valueIsNumericString = Boolean(prefix || suffix);

      return {
        decimalScale,
        fixedDecimalScale: Boolean(decimalScale),
        prefix,
        suffix,
        valueIsNumericString,
      };
    }

    return {};
  }

  return (
    <Container
      spacing={spacing}
      theme={theme}
      label={
        <Label htmlFor={name} required={rest.required} theme={theme}>
          {label}
        </Label>
      }
      input={
        <Box
          id={name}
          className={inputStyles}
          as={renderAs()}
          type={type}
          name={name}
          aria-describedby={describedById}
          aria-errormessage={tooltip ? errorMessageId : undefined}
          aria-invalid={hasError}
          {...additionalProps()}
          {...rest}
        />
      }
      helpText={
        hasDescription && (
          <HelpText id={describedById} theme={theme} message={description} />
        )
      }
      validationMessage={
        hasError && (
          <ValidationMessage
            id={errorMessageId}
            message={error}
            onVisibilityChange={setTooltip}
          />
        )
      }
    />
  );
}

/** Textarea component properties */
export interface ITextareaProps extends TextareaAutosizeProps {
  /** Validation error message */
  errorMessage?: string;

  /** Supporting text */
  helpText?: string;

  /** Input label */
  label: string;

  /** Input name */
  name: string;

  /** Component spacing */
  spacing?: TSizing;

  /** Component theme */
  theme?: TTheme;
}

/**
 * Multiline, autogrowing textarea form component
 *
 * @param props - Component props
 *
 * @returns Textarea component
 */
export function Textarea({
  className,
  errorMessage,
  helpText,
  label,
  name,
  spacing = Sizing.MD,
  theme = Themes.SECONDARY,
  ...rest
}: ITextareaProps) {
  const { getMessage, setTooltip, tooltip } = useInput(name);

  const {
    hasMessage: hasDescription,
    id: describedById,
    message: description,
  } = getMessage('description', helpText);

  const {
    hasMessage: hasError,
    id: errorMessageId,
    message: error,
  } = getMessage('error', errorMessage);

  const { createStyles } = useTailwind(theme, spacing);

  const inputStyles = createStyles({
    classNames: ['block w-full text-sm pr-10', className],
    theme: {
      danger: ['border-red-300'],
      primary: ['border-blue-300'],
      secondary: ['border-gray-300'],
      success: ['border-green-300'],
      warning: ['border-yellow-300'],
    },
  });

  return (
    <Container
      spacing={spacing}
      theme={theme}
      label={
        <Label htmlFor={name} required={rest.required} theme={theme}>
          {label}
        </Label>
      }
      input={
        <TextareaAutosize
          id={name}
          className={inputStyles}
          name={name}
          aria-describedby={describedById}
          aria-errormessage={tooltip ? errorMessageId : undefined}
          aria-invalid={hasError}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
      }
      helpText={
        hasDescription && (
          <HelpText id={describedById} theme={theme} message={description} />
        )
      }
      validationMessage={
        hasError && (
          <ValidationMessage
            id={errorMessageId}
            message={error}
            onVisibilityChange={setTooltip}
          />
        )
      }
    />
  );
}

/** Default file upload browse button text */
const BROWSE_TEXT = 'Browse';

/** Upload component properties */
export interface IUploadProps
  extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** Text to show on the browse button */
  buttonText?: string;

  /** Validation error message */
  errorMessage?: string;

  /** Supporting text */
  helpText?: string;

  /** Input label */
  label: string;

  /** Input name */
  name: string;

  /** Component spacing */
  spacing?: TSizing;

  /** Component theme */
  theme?: TTheme;
}

/**
 * Form file upload field
 *
 * @param props - Component props
 *
 * @returns Upload component
 */
export function Upload({
  buttonText = BROWSE_TEXT,
  className,
  errorMessage,
  helpText,
  label,
  name,
  placeholder,
  ref = null,
  spacing = Sizing.MD,
  theme = Themes.SECONDARY,
  ...rest
}: IUploadProps) {
  const [fileName, setFileName] = useState(placeholder);

  const innerRef = useRef<HTMLInputElement>(null);

  const combinedRef = useMergeRefs(ref, innerRef);

  const { getMessage, setTooltip, tooltip } = useInput(name);

  const {
    hasMessage: hasDescription,
    id: describedById,
    message: description,
  } = getMessage('description', helpText);

  const {
    hasMessage: hasError,
    id: errorMessageId,
    message: error,
  } = getMessage('error', errorMessage);

  const { createStyles } = useTailwind(theme, spacing);

  const wrapperStyles = createStyles({
    classNames: ['form-input flex p-0'],
    theme: {
      danger: ['border-red-300'],
      primary: ['border-blue-300'],
      secondary: ['border-gray-300'],
      success: ['border-green-300'],
      warning: ['border-yellow-300'],
    },
  });

  const inputStyles = createStyles({
    classNames: [
      'form-input block w-full h-full text-sm pr-10 flex items-center border-0',
      {
        'text-gray-500': fileName === placeholder,
      },
      className,
    ],
  });

  const browse = () => {
    if (combinedRef?.current) {
      combinedRef.current.click();
    }
  };

  useEffect(() => {
    if (combinedRef?.current) {
      const { current } = combinedRef;

      current.onchange = () => {
        if (current.files && current.files.length > 0) {
          const names = [...current.files]
            .map(({ name: uploadedFileName }) => uploadedFileName)
            .join(', ');

          setFileName(names);
        }
      };
    }
  }, [combinedRef]);

  return (
    <Container
      spacing={spacing}
      theme={theme}
      label={
        <Label htmlFor={name} required={rest.required} theme={theme}>
          {label}
        </Label>
      }
      input={
        <div className={wrapperStyles}>
          <Button className="z-10" type="button" theme={theme} onClick={browse}>
            {buttonText}
          </Button>

          <div className="relative block w-full overflow-hidden">
            <div className={inputStyles}>
              <p className="truncate">{fileName}</p>
            </div>

            <input
              id={name}
              className="absolute top-0 left-0 bottom-0 block w-full opacity-0"
              type="file"
              name={name}
              aria-describedby={describedById}
              aria-errormessage={tooltip ? errorMessageId : undefined}
              aria-invalid={hasError}
              ref={combinedRef}
              {...rest}
            />
          </div>
        </div>
      }
      helpText={
        hasDescription && (
          <HelpText id={describedById} theme={theme} message={description} />
        )
      }
      validationMessage={
        hasError && (
          <ValidationMessage
            id={errorMessageId}
            message={error}
            onVisibilityChange={setTooltip}
          />
        )
      }
    />
  );
}

type TRadioGroupClassNameFunction = (input: {
  active: boolean;

  checked: boolean;
}) => string;

/** Radio component properties */
export interface IRadioProps {
  /** Validation error message */
  errorMessage?: string;

  /** Supporting text */
  helpText?: string;

  /** Input label */
  label: string;

  /** Field name */
  name: string;

  /** Selectable options */
  options: {
    /** Disable option */
    disabled?: boolean;

    /** Value to display on screen */
    label: string;

    /** Value to submit when selected */
    value: string;
  }[];

  /** Defines if value is required */
  required?: boolean;

  /** Component spacing */
  spacing?: TSizing;

  /** Component theme */
  theme?: TTheme;
}

/**
 * Radio group form component
 *
 * @param props - Component props
 *
 * @returns Radio component
 */
export function Radio({
  errorMessage,
  helpText,
  label,
  name,
  options,
  required = false,
  spacing = Sizing.MD,
  theme = Themes.SECONDARY,
}: IRadioProps) {
  const [value, setValue] = useState<string | null>(null);

  const { getMessage, setTooltip, tooltip } = useInput(name);

  const {
    hasMessage: hasDescription,
    id: describedById,
    message: description,
  } = getMessage('description', helpText);

  const {
    hasMessage: hasError,
    id: errorMessageId,
    message: error,
  } = getMessage('error', errorMessage);

  const { createStyles } = useTailwind(theme, spacing);

  const inputStyles =
    (disabled = false): TRadioGroupClassNameFunction =>
    ({ active, checked }) =>
      createStyles({
        classNames: [
          'flex-1 items-center justify-center text-sm text-center py-2 px-3 cursor-pointer focus:outline-none font-display',
          {
            'cursor-not-allowed opacity-25': disabled,
          },
        ],
        theme: {
          danger: [
            {
              'bg-red-600 text-red-50 ring-1 ring-inset ring-red-500': checked,
              'bg-red-800 text-red-50 ring-2 ring-red-500 ring-offset-2':
                active,
              'hover:bg-red-700 hover:text-red-50': !disabled,
              'text-red-500': !checked,
            },
          ],
          primary: [
            {
              'bg-blue-600 text-blue-50 ring-1 ring-inset ring-blue-500':
                checked,
              'bg-blue-800 text-blue-50 ring-2 ring-blue-500 ring-offset-2':
                active,
              'hover:bg-blue-700 hover:text-blue-50': !disabled,
              'text-blue-500': !checked,
            },
          ],
          secondary: [
            {
              'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200':
                checked,
              'bg-gray-400 text-gray-600 ring-2 ring-gray-400 ring-offset-2':
                active,
              'hover:bg-gray-300 hover:text-gray-600': !disabled,
              'text-gray-500': !checked,
            },
          ],
          success: [
            {
              'bg-green-600 text-green-50 ring-1 ring-inset ring-green-500':
                checked,
              'bg-green-800 text-green-50 ring-2 ring-green-500 ring-offset-2':
                active,
              'hover:bg-green-700 hover:text-green-50': !disabled,
              'text-green-500': !checked,
            },
          ],
          warning: [
            {
              'bg-yellow-600 text-yellow-50 ring-1 ring-inset ring-yellow-500':
                checked,
              'bg-yellow-800 text-yellow-50 ring-2 ring-yellow-500 ring-offset-2':
                active,
              'hover:bg-yellow-700 hover:text-yellow-50': !disabled,
              'text-yellow-500': !checked,
            },
          ],
        },
      });

  const wrapperStyles = createStyles({
    classNames: ['grid grid-cols-6 pr-12 border bg-white'],
    theme: {
      danger: ['border-red-300'],
      primary: ['border-blue-300'],
      secondary: ['border-gray-300'],
      success: ['border-green-300'],
      warning: ['border-yellow-300'],
    },
  });

  return (
    <RadioGroup
      name={name}
      value={value}
      aria-errormessage={tooltip ? errorMessageId : undefined}
      aria-invalid={hasError}
      onChange={setValue}
    >
      <Container
        label={
          <RadioGroup.Label as={Label} required={required} theme={theme}>
            {label}
          </RadioGroup.Label>
        }
        input={
          <div className={wrapperStyles}>
            {options.map((option) => (
              <RadioGroup.Option
                key={option.value}
                className={inputStyles(option.disabled)}
                disabled={option.disabled}
                value={option.value}
              >
                <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        }
        helpText={
          hasDescription && (
            <RadioGroup.Description
              as={HelpText}
              id={describedById}
              theme={theme}
              message={description}
            />
          )
        }
        validationMessage={
          hasError && (
            <ValidationMessage
              id={errorMessageId}
              message={error}
              onVisibilityChange={setTooltip}
            />
          )
        }
        spacing={spacing}
        theme={theme}
      />
    </RadioGroup>
  );
}