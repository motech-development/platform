import { number, text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Avatar from './Avatar';

export default {
  component: Avatar,
  decorators: [withKnobs],
};

export const BasicAvatar = {
  name: 'Basic avatar',
  render: () => (
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
  ),
};
