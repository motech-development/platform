import { FC, ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import NumberFormat from 'react-number-format';
import useInput from '../hooks/useInput';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';
import InputWrapper from './InputWrapper';

type TTextBoxType = 'email' | 'password' | 'tel' | 'text';

export interface ITextBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  decimalScale?: number;
  errorMessage?: string;
  format?: string;
  helpText?: string;
  label: string;
  name: string;
  prefix?: string;
  spacing?: TSpacing;
  suffix?: string;
  theme?: TTheme;
  type?: TTextBoxType;
}

const TextBox: FC<ITextBoxProps> = forwardRef<
  HTMLInputElement | NumberFormat,
  ITextBoxProps
>(
  (
    {
      className = '',
      errorMessage,
      helpText,
      label,
      spacing = 'lg',
      theme = 'primary',
      type = 'text',
      ...rest
    },
    ref,
  ) => {
    const { describedBy, errorDescription, inputDescription, styles } =
      useInput(rest.name, theme, helpText, errorMessage, className);
    const useFormat = Boolean(
      rest.decimalScale || rest.format || rest.prefix || rest.suffix,
    );
    const isNumericString = Boolean(rest.prefix || rest.suffix);
    const { defaultValue, value, ...formattedRest } = rest;

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
        {useFormat ? (
          <NumberFormat
            id={rest.name}
            className={styles}
            aria-describedby={describedBy}
            fixedDecimalScale={!!rest.decimalScale}
            isNumericString={isNumericString}
            ref={ref as ForwardedRef<NumberFormat>}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...formattedRest}
          />
        ) : (
          <input
            id={rest.name}
            className={styles}
            aria-describedby={describedBy}
            type={type}
            ref={ref as ForwardedRef<HTMLInputElement>}
            {...rest}
          />
        )}
      </InputWrapper>
    );
  },
);

export default TextBox;
