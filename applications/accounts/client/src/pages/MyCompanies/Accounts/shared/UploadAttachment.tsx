import { gql, useMutation } from '@apollo/client';
import { usePut } from '@motech-development/axios-hooks';
import { FileUpload, useToast } from '@motech-development/breeze-ui';
import { FormikProps, FormikValues } from 'formik';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IRequestUploadInput {
  id: string;
  input: {
    contentType: string;
    extension: string;
    metadata: {
      id?: string;
      typename: string;
    };
  };
}

interface IRequestUploadOutput {
  requestUpload?: {
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
  transactionId?: string;
  onUpload(value: string): void;
}

interface IUploadData {
  extension: string;
  file: File;
  form: FormikProps<FormikValues>;
  requestUpload: {
    id: string;
    url: string;
  };
}

const UploadAttachment: FC<IUploadAttachmentProps> = ({
  id,
  name,
  onUpload,
  transactionId,
}) => {
  const [uploadData, setUploadData] = useState<IUploadData>();
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

  useEffect(() => {
    if (uploadData) {
      (async () => {
        const { extension, file, form, requestUpload } = uploadData;
        const headers = {
          'Content-Type': file.type,
        };
        const uploadResult = await put(requestUpload.url, file, headers);

        if (uploadResult !== undefined) {
          const attachment = `${id}/${requestUpload.id}.${extension}`;

          form.setFieldValue('attachment', attachment);

          onUpload(attachment);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadData]);

  return (
    <FileUpload
      accept="application/pdf,image/*"
      buttonText={t('transaction-form.upload.upload.button')}
      label={t('transaction-form.upload.upload.label')}
      loading={mutationLoading || putLoading}
      name={name}
      onSelect={async (file, form) => {
        try {
          const extIndex = file.name.lastIndexOf('.');

          if (extIndex > 0) {
            const extension = file.name.substring(extIndex + 1).toLowerCase();

            const { data } = await mutation({
              variables: {
                id,
                input: {
                  contentType: file.type,
                  extension,
                  metadata: {
                    id: transactionId,
                    typename: 'Transaction',
                  },
                },
              },
            });

            if (data?.requestUpload) {
              const { requestUpload } = data;

              setUploadData({
                extension,
                file,
                form,
                requestUpload,
              });
            } else {
              add({
                colour: 'danger',
                message: t('uploads.add.retry'),
              });
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }}
    />
  );
};

export default UploadAttachment;
