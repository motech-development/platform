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
  onUpload: (value: string) => void;
}

interface IFormData {
  extension: string;
  file: File;
  form: FormikProps<FormikValues>;
}

interface IUploadData {
  id: string;
  url: string;
}

const UploadAttachment: FC<IUploadAttachmentProps> = ({
  id,
  name,
  onUpload,
  transactionId,
}) => {
  const [formData, setFormData] = useState<IFormData>();
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
    onCompleted: (data) => {
      const { requestUpload } = data;

      if (requestUpload) {
        setUploadData(requestUpload);
      } else {
        add({
          colour: 'danger',
          message: t('uploads.add.retry'),
        });
      }
    },
    onError,
  });
  const [put, { loading: putLoading }] = usePut<null, File>({
    onCompleted: () => {
      if (formData && uploadData) {
        const { extension, form } = formData;

        const attachment = `${id}/${uploadData.id}.${extension}`;

        form.setFieldValue('attachment', attachment);

        onUpload(attachment);

        add({
          colour: 'success',
          message: t('uploads.add.success'),
        });
      }
    },
    onError,
  });

  useEffect(() => {
    if (formData && uploadData) {
      (async () => {
        const { file } = formData;
        const headers = {
          'Content-Type': file.type,
        };

        await put(uploadData.url, file, headers);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, uploadData]);

  return (
    <FileUpload
      accept="application/pdf,image/*"
      buttonText={t('transaction-form.upload.upload.button')}
      label={t('transaction-form.upload.upload.label')}
      loading={mutationLoading || putLoading}
      name={name}
      onSelect={async (file, form) => {
        const extIndex = file.name.lastIndexOf('.');

        if (extIndex > 0) {
          const extension = file.name.substring(extIndex + 1).toLowerCase();

          setFormData({
            extension,
            file,
            form,
          });

          await mutation({
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
        }
      }}
    />
  );
};

export default UploadAttachment;
