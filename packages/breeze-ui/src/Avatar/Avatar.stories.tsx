import { withA11y } from '@storybook/addon-a11y';
import { number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Avatar from './Avatar';

const stories = storiesOf('Avatar', module);

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic avatar', () => (
  <>
    <BaseStyles />
    <Avatar
      alt={text('Alt text', 'Avatar')}
      src={text(
        'Image Url',
        'https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b',
      )}
      width={number('Width', 0)}
    />
  </>
));
