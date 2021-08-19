import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';
import TSize, { Size } from '../utils/size';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('Button', module);

stories.addDecorator(withKnobs);

stories.add('Basic button', () => (
  <>
    <Button
      block={boolean('Block display', false)}
      colour={select<TTheme>('Colour', Theme, 'primary')}
      disabled={boolean('Disabled', false)}
      size={select<TSize>('Size', Size, 'md')}
      loading={boolean('Loading', false)}
    >
      {text('Title', 'Button')}
    </Button>
  </>
));
