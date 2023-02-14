import {
  Loader,
  Modal,
  Overlay,
  Typography,
} from '@motech-development/breeze-ui';
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

function DeleteItem({
  display,
  loading,
  name,
  onDelete,
  onDismiss,
  title,
  warning,
}: IDeleteItemProps) {
  return loading ? (
    <Overlay>
      <Loader />
    </Overlay>
  ) : (
    <Modal isOpen={display} title={title} onDismiss={onDismiss}>
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
}

export default DeleteItem;
