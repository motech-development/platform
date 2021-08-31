import { FC, ReactNode } from 'react';
import { classNames, spacingClass } from '../utils/className';
import TSpacing from '../utils/spacing';
import InputValidation from './InputValidation';

export interface IInputWrapperProps {
  children: ReactNode;
  errorDescription: string;
  errorMessage?: string;
  helpText?: string;
  inputDescription: string;
  label: string;
  name: string;
  spacing: TSpacing;
}

const InputWrapper: FC<IInputWrapperProps> = ({
  children,
  errorDescription,
  errorMessage,
  helpText,
  inputDescription,
  label,
  name,
  spacing,
}) => (
  <>
    {/* @tailwind: mb-0 mb-2 mb-4 mb-6 */}
    <div className={spacingClass(spacing, 'mb-{spacing}')}>
      <label
        htmlFor={name}
        className={classNames(
          'block text-sm font-medium',
          errorMessage ? 'text-red-700' : 'text-gray-700',
        )}
      >
        {label}
      </label>

      <div className="mt-1 relative shadow-sm">
        {children}

        {errorMessage && (
          <InputValidation id={errorDescription} errorMessage={errorMessage} />
        )}
      </div>

      {helpText && (
        <p className="mt-2 text-sm text-gray-600" id={inputDescription}>
          {helpText}
        </p>
      )}
    </div>
  </>
);

export default InputWrapper;
