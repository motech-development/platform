import { FieldError as AriaFieldError } from 'react-aria-components/FieldError';
import { Label as AriaLabel } from 'react-aria-components/Label';
import { Text as AriaText } from 'react-aria-components/Text';
import { Skeleton } from '../Skeleton/Skeleton';
import { fieldVariants } from './field.styles';

interface FieldLabelProps {
  label: string;
  loading: boolean;
}

export function FieldLabel({ label, loading }: Readonly<FieldLabelProps>) {
  return (
    <AriaLabel className={fieldVariants.base.label}>
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
  error?: string;
  loading: boolean;
}

export function FieldSupportingContent({
  description,
  error,
  loading,
}: Readonly<FieldSupportProps>) {
  return (
    <>
      {description && (
        <AriaText className={fieldVariants.base.description} slot="description">
          {loading ? (
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          ) : (
            description
          )}
        </AriaText>
      )}
      {error &&
        (loading ? (
          <span aria-hidden="true" className={fieldVariants.base.error}>
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          </span>
        ) : (
          <AriaFieldError className={fieldVariants.base.error}>
            {error}
          </AriaFieldError>
        ))}
    </>
  );
}
