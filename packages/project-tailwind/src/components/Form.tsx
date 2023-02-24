import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { ComponentPropsWithRef, ReactNode, useState } from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Box } from 'react-polymorphic-box';
import {
  Sizing,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';
import { Tooltip } from './Tooltip';
import { Typography } from './Typography';

// TODO: Textarea
// TODO: Radio
// TODO: Checkbox
// TODO: Upload

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
      warning: ['text-warning-600'],
    },
  });

  return (
    <Typography className={helpTextStyles} id={id}>
      {message}
    </Typography>
  );
}

interface ILabelProps extends ComponentPropsWithRef<'label'> {
  /** Component theme */
  theme: TTheme;
}

function Label({ className, htmlFor, theme, ...rest }: ILabelProps) {
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

  return <label className={labelStyles} htmlFor={htmlFor} {...rest} />;
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
enum TextInputTypes {
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
type TTextInputType = `${TextInputTypes}`;

/** TextInput component properties */
export interface ITextInputProps extends ComponentPropsWithRef<'input'> {
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
  type?: TTextInputType;
}

export function TextInput({
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
  type = TextInputTypes.TEXT,
  ...rest
}: ITextInputProps) {
  const [tooltip, setTooltip] = useState<boolean>();

  const { getMessage } = useInput(name);

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
    classNames: ['block w-full sm:text-sm pr-10', className],
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
        <Label htmlFor={name} theme={theme}>
          {label}

          {rest.required && <span className="font-bold text-red-800">*</span>}
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
