import { FC, ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import NumberFormat from 'react-number-format';
import useInput from '../hooks/useInput';
import { classNames, spacingClass, themeClass } from '../utils/className';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';
import InputValidation from './InputValidation';

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
    const { describedBy, errorDescription, inputDescription, inputTheme } =
      useInput(rest.name, theme, helpText, errorMessage);
    const useFormat = Boolean(
      rest.decimalScale || rest.format || rest.prefix || rest.suffix,
    );
    const isNumericString = Boolean(rest.prefix || rest.suffix);
    const styles = classNames(
      'block w-full sm:text-sm',
      errorMessage ? 'border-red-300 pr-10' : 'border-gray-300',
      themeClass(inputTheme, 'focus:ring-{theme}-500 focus:border-{theme}-500'),
      className,
    );
    const { defaultValue, value, ...formattedRest } = rest;

    return (
      <div className={spacingClass(spacing, 'mb-{spacing}')}>
        <label
          htmlFor={rest.name}
          className={classNames(
            'block text-sm font-medium',
            errorMessage ? 'text-red-700' : 'text-gray-700',
          )}
        >
          {label}
        </label>

        <div className="mt-1 relative shadow-sm">
          {/* @tailwind: focus:ring-blue-500 focus:border-blue-500 */}
          {/* @tailwind: focus:ring-gray-500 focus:border-gray-500 */}
          {/* @tailwind: focus:ring-green-500 focus:border-green-500 */}
          {/* @tailwind: focus:ring-red-500 focus:border-red-500 */}
          {/* @tailwind: focus:ring-yellow-500 focus:border-yellow-500 */}
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

          {errorMessage && (
            <InputValidation
              id={errorDescription}
              errorMessage={errorMessage}
            />
          )}
        </div>

        {helpText && (
          <p className="mt-2 text-sm text-gray-600" id={inputDescription}>
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

export default TextBox;
