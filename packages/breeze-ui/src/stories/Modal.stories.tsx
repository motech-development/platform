import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';
import Modal from '../components/Modal';

const stories = storiesOf('Modal', module);
const onDismiss = () => {};

stories.addDecorator(withKnobs);

stories.add('Basic modal', () => (
  <>
    <Modal
      content={text(
        'Content',
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.',
      )}
      footer={
        <>
          <Button colour="secondary">Actually, don&#39;t bother</Button>
          <Button colour="primary">Yes, go for it</Button>
        </>
      }
      isOpen={boolean('Show', true)}
      title="Are you sure you want to do this?"
      onDismiss={onDismiss}
    />
  </>
));
