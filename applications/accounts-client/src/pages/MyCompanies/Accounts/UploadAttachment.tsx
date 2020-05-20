import { useMutation } from '@apollo/react-hooks';
import { FileUpload } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import REQUEST_UPLOAD, {
  IRequestUploadInput,
  IRequestUploadOutput,
} from '../../../graphql/storage/REQUEST_UPLOAD';
import { usePut } from '../../../hooks/useFetch';

export interface IUploadAttachmentProps {
  id: string;
  name: string;
  onUpload(value: string): void;
}

const UploadAttachment: FC<IUploadAttachmentProps> = ({
  id,
  name,
  onUpload,
}) => {
  const { t } = useTranslation('accounts');
  // TODO: Toasts
  const [mutation, { loading: mutationLoading }] = useMutation<
    IRequestUploadOutput,
    IRequestUploadInput
  >(REQUEST_UPLOAD);
  const [put, { loading: putLoading }] = usePut();

  return (
    <FileUpload
      buttonText={t('transaction-form.upload.upload.button')}
      label={t('transaction-form.upload.upload.label')}
      loading={mutationLoading || putLoading}
      name={name}
      onSelect={(file, form) => {
        (async () => {
          const extension = file.name.split('.').pop();

          if (extension) {
            const { data } = await mutation({
              variables: {
                extension,
                id,
              },
            });

            if (data) {
              const { requestUpload } = data;
              const formData = new FormData();
              const headers = new Headers();

              formData.append(file.name, file, file.name);

              headers.append('Content-Type', 'multipart/form-data');

              await put(requestUpload.url, formData, headers);

              const attachment = `${id}/${requestUpload.id}.${extension}`;

              form.setFieldValue('attachment', attachment);

              onUpload(attachment);
            }
          }
        })();
      }}
    />
  );
};

export default memo(UploadAttachment);
