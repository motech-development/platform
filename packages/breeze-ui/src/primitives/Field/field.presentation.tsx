import { FieldError as AriaFieldError } from 'react-aria-components/FieldError';
import { Label as AriaLabel } from 'react-aria-components/Label';
import { Text as AriaText } from 'react-aria-components/Text';
import { Skeleton } from '../Skeleton/Skeleton';
import { fieldVariants } from './field.styles';

interface FieldLabelProps {
  htmlFor?: string;
  id?: string;
  label: string;
  loading: boolean;
}

export function FieldLabel({
  htmlFor,
  id,
  label,
  loading,
}: Readonly<FieldLabelProps>) {
  return (
    <AriaLabel className={fieldVariants.base.label} htmlFor={htmlFor} id={id}>
      {loading ? (
        <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
      ) : (
        label
      )}
    </AriaLabel>
  );
}

interface FieldSupportProps {
  description?: string;
  descriptionId?: string;
  error?: string;
  errorId?: string;
  loading: boolean;
}

export function FieldSupportingContent({
  description,
  descriptionId,
  error,
  errorId,
  loading,
}: Readonly<FieldSupportProps>) {
  return (
    <>
      {description && (
        <AriaText
          className={fieldVariants.base.description}
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
          <span
            aria-hidden="true"
            className={fieldVariants.base.error}
            id={errorId}
          >
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          </span>
        ) : (
          <AriaFieldError className={fieldVariants.base.error} id={errorId}>
            {error}
          </AriaFieldError>
        ))}
    </>
  );
}
