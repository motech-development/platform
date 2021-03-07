import {
  Loader,
  Modal,
  Overlay,
  Typography,
} from '@motech-development/breeze-ui';
import { FC, memo } from 'react';
import ConfirmDelete from './ConfirmDelete';

export interface IDeleteItemProps {
  display: boolean;
  loading: boolean;
  name: string;
  title: string;
  warning: string;
  onDelete(): void;
  onDismiss(): void;
}

const DeleteItem: FC<IDeleteItemProps> = ({
  display,
  loading,
  name,
  onDelete,
  onDismiss,
  title,
  warning,
}) =>
  loading ? (
    <Overlay>
      <Loader />
    </Overlay>
  ) : (
    <Modal isOpen={display} onDismiss={onDismiss}>
      <Typography rule component="h3" variant="h3" margin="lg">
        {title}
      </Typography>

      <Typography component="p" variant="p">
        {warning}
      </Typography>

      <ConfirmDelete
        loading={loading}
        name={name}
        onCancel={onDismiss}
        onDelete={onDelete}
      />
    </Modal>
  );

export default memo(DeleteItem);
