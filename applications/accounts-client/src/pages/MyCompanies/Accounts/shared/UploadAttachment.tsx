import { useMutation } from '@apollo/react-hooks';
import { usePut } from '@motech-development/axios-hooks';
import { FileUpload, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

interface IRequestUploadInput {
  id: string;
  input: {
    contentType: string;
    extension: string;
  };
}

interface IRequestUploadOutput {
  requestUpload: {
    id: string;
    url: string;
  };
}

export const REQUEST_UPLOAD = gql`
  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {
    requestUpload(id: $id, input: $input) {
      id
      url
    }
  }
`;

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
  const { add } = useToast();
  const onError = () => {
    add({
      colour: 'danger',
      message: t('uploads.add.error'),
    });
  };
  const [mutation, { loading: mutationLoading }] = useMutation<
    IRequestUploadOutput,
    IRequestUploadInput
  >(REQUEST_UPLOAD, {
    onError,
  });
  const [put, { loading: putLoading }] = usePut<null, File>({
    onCompleted: () => {
      add({
        colour: 'success',
        message: t('uploads.add.success'),
      });
    },
    onError,
  });

  return (
    <FileUpload
      buttonText={t('transaction-form.upload.upload.button')}
      label={t('transaction-form.upload.upload.label')}
      loading={mutationLoading || putLoading}
      name={name}
      onSelect={(file, form) => {
        (async () => {
          try {
            const extIndex = file.name.lastIndexOf('.');

            if (extIndex > 0) {
              const extension = file.name.substring(extIndex + 1);

              const result = await mutation({
                variables: {
                  id,
                  input: {
                    contentType: file.type,
                    extension,
                  },
                },
              });

              if (result?.data) {
                const { requestUpload } = result.data;
                const headers = {
                  'Content-Type': file.type,
                };

                const uploadResult = await put(
                  requestUpload.url,
                  file,
                  headers,
                );

                if (uploadResult !== undefined) {
                  const attachment = `${id}/${requestUpload.id}.${extension}`;

                  form.setFieldValue('attachment', attachment);

                  onUpload(attachment);
                }
              }
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        })();
      }}
    />
  );
};

export default memo(UploadAttachment);
