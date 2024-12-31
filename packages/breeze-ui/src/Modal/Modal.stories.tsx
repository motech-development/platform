import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Typography from '../Typography/Typography';
import Modal from './Modal';

export default {
  component: Modal,
  decorators: [withKnobs],
};

const onDismiss = () => {};

const size = {
  Large: 'lg',
  Small: 'sm',
};

export const BasicModal = {
  name: 'Basic modal',
  render: () => (
    <>
      <BaseStyles />

      <Modal
        isOpen={boolean('Show', true)}
        size={select('Size', size, 'sm') as 'sm' | 'lg'}
        title="My modal"
        onDismiss={onDismiss}
      >
        <Typography rule component="h1" variant="h2" margin="lg">
          Are you sure you want to do this?
        </Typography>
        <Typography component="p" variant="p" margin="lg">
          Clicking OK will delete this permanently
        </Typography>
        <Button colour="danger">Delete</Button>{' '}
        <Button>Actually, don&#39;t bother</Button>
      </Modal>
    </>
  ),
};
