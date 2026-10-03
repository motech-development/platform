import type { MouseEventHandler } from 'react';
import { FieldError as AriaFieldError } from 'react-aria-components/FieldError';
import { Label as AriaLabel } from 'react-aria-components/Label';
import { Text as AriaText } from 'react-aria-components/Text';
import { Skeleton } from '../primitives/Skeleton/Skeleton';
import { fieldVariants } from './field.styles';

interface FieldLabelProps {
  htmlFor?: string;
  id?: string;
  label: string;
  loading: boolean;
  onClick?: MouseEventHandler<HTMLLabelElement>;
}

export function FieldLabel({
  htmlFor,
  id,
  label,
  loading,
  onClick,
}: Readonly<FieldLabelProps>) {
  return (
    <AriaLabel
      className={fieldVariants.base.label}
      htmlFor={htmlFor}
      id={id}
      onClick={onClick}
    >
      {loading ? (
        <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
      ) : (
        label
      )}
    </AriaLabel>
  );
}

interface FieldSupportProps {
  /** Uses the text-xs rhythm of supporting text set beside a choice control. */
  choice?: boolean;
  description?: string;
  descriptionId?: string;
  error?: string;
  errorId?: string;
  loading: boolean;
}

export function FieldSupportingContent({
  choice = false,
  description,
  descriptionId,
  error,
  errorId,
  loading,
}: Readonly<FieldSupportProps>) {
  const descriptionClassName = choice
    ? fieldVariants.base.choiceDescription
    : fieldVariants.base.description;
  const errorClassName = choice
    ? fieldVariants.base.choiceError
    : fieldVariants.base.error;

  return (
    <>
      {description && (
        <AriaText
          className={descriptionClassName}
          id={descriptionId}
          slot="description"
        >
          {loading ? (
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          ) : (
            description
          )}
        </AriaText>
      )}
      {error &&
        (loading ? (
          <span aria-hidden="true" className={errorClassName} id={errorId}>
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          </span>
        ) : (
          <AriaFieldError className={errorClassName} id={errorId}>
            {error}
          </AriaFieldError>
        ))}
    </>
  );
}
