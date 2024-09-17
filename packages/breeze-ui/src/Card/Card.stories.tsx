import { select, text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from './Card';

export default {
  component: Card,
  decorators: [withKnobs],
};

const padding = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};

export const BasicCard = {
  name: 'Basic card',
  render: () => (
    <>
      <BaseStyles />

      <Card padding={select('Padding', padding, 'md') as 'sm' | 'md' | 'lg'}>
        {text('Text', 'Hello world')}
      </Card>
    </>
  ),
};
