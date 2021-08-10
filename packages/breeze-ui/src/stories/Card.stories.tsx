import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';

const stories = storiesOf('Card', module);
const padding = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};

stories.addDecorator(withKnobs);

stories.add('Basic card', () => (
  <>
    <Card padding={select('Padding', padding, 'md') as 'sm' | 'md' | 'lg'}>
      {text('Text', 'Hello world')}
    </Card>
  </>
));
