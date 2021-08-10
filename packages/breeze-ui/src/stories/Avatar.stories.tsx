import { number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Avatar from '../components/Avatar';

const stories = storiesOf('Avatar', module);

stories.addDecorator(withKnobs);

stories.add('Basic avatar', () => (
  <>
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
