import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { MemoryRouter } from 'react-router-dom';
import BaseStyles from '../BaseStyles/BaseStyles';
import LinkButton from './LinkButton';

export default {
  component: LinkButton,
  decorators: [withKnobs],
};

const colour = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
};
const size = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};

export const BasicLinkButton = {
  name: 'Basic link button',
  render: () => (
    <MemoryRouter>
      <BaseStyles />
      <LinkButton
        block={boolean('Block display', false)}
        colour={
          select('Colour', colour, 'primary') as
            | 'danger'
            | 'primary'
            | 'secondary'
            | 'success'
        }
        size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'}
        to={text('To', '/home')}
      >
        {text('Title', 'Button')}
      </LinkButton>
    </MemoryRouter>
  ),
};
