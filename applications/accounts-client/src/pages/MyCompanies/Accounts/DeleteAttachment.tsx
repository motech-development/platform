import { useMutation } from '@apollo/react-hooks';
import { Button, useToast } from '@motech-development/breeze-ui';
import { gql } from 'apollo-boost';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

interface IDeleteFileInput {
  path: string;
}

interface IDeleteFileOutput {
  deleteFile: {
    path: string;
  };
}

export const DELETE_FILE = gql`
  mutation DeleteFile($path: ID!) {
    deleteFile(path: $path) {
      path
    }
  }
`;

export interface IDeleteTransactionProps {
  path: string;
  onDelete(name: string): void;
}

const DeleteTransaction: FC<IDeleteTransactionProps> = ({ onDelete, path }) => {
  const { t } = useTranslation('accounts');
  const { add } = useToast();
  const [mutation, { loading }] = useMutation<
    IDeleteFileOutput,
    IDeleteFileInput
  >(DELETE_FILE, {
    onCompleted: () => {
      add({
        colour: 'success',
        message: t('uploads.delete.success'),
      });

      onDelete('');
    },
    onError: () => {
      add({
        colour: 'success',
        message: t('uploads.delete.error'),
      });
    },
  });

  return (
    <Button
      block
      colour="danger"
      loading={loading}
      onClick={() => {
        (async () => {
          await mutation({
            variables: {
              path,
            },
          });
        })();
      }}
    >
      {t('transaction-form.upload.delete-file')}
    </Button>
  );
};

export default memo(DeleteTransaction);
