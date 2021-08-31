import { FC, forwardRef, SelectHTMLAttributes } from 'react';
import useInput from '../hooks/useInput';
import { classNames } from '../utils/className';
import IOption from '../utils/option';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';
import InputWrapper from './InputWrapper';

export interface ISelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  errorMessage?: string;
  helpText?: string;
  label: string;
  name: string;
  options: IOption[];
  placeholder: string;
  spacing?: TSpacing;
  theme?: TTheme;
}

const Select: FC<ISelectProps> = forwardRef<HTMLSelectElement, ISelectProps>(
  (
    {
      className = '',
      errorMessage,
      helpText,
      label,
      options,
      placeholder,
      spacing = 'lg',
      theme = 'primary',
      ...rest
    },
    ref,
  ) => {
    const { describedBy, errorDescription, inputDescription, styles } =
      useInput(rest.name, theme, helpText, errorMessage, className);

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
        <select
          id={rest.name}
          className={classNames(styles, 'cursor-pointer pl-3 pr-10 py-2')}
          aria-describedby={describedBy}
          ref={ref}
          {...rest}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      </InputWrapper>
    );
  },
);

export default Select;
