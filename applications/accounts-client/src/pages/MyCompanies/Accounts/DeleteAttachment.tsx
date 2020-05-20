import { useMutation } from '@apollo/react-hooks';
import { Button } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import DELETE_FILE, {
  IDeleteFileInput,
  IDeleteFileOutput,
} from '../../../graphql/storage/DELETE_FILE';

export interface IDeleteTransactionProps {
  path: string;
  onDelete(name: string): void;
}

const DeleteTransaction: FC<IDeleteTransactionProps> = ({ onDelete, path }) => {
  const { t } = useTranslation('accounts');
  // TODO: Toasts
  const [mutation, { loading }] = useMutation<
    IDeleteFileOutput,
    IDeleteFileInput
  >(DELETE_FILE, {
    onCompleted: () => {
      onDelete('');
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
