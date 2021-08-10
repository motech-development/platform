// TODO: Everything
import { boolean, /* select, */ text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import LinkButton from '../components/LinkButton';

const stories = storiesOf('LinkButton', module);
// const colour = {
//   Danger: 'danger',
//   Primary: 'primary',
//   Secondary: 'secondary',
//   Success: 'success',
// };
// const size = {
//   Large: 'lg',
//   Medium: 'md',
//   Small: 'sm',
// };

stories.addDecorator(withKnobs);

stories.add('Basic link button', () => (
  <LinkButton
    block={boolean('Block display', false)}
    // colour={
    //   select('Colour', colour, 'primary') as
    //     | 'danger'
    //     | 'primary'
    //     | 'secondary'
    //     | 'success'
    // }
    // size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'}
    // to={text('To', '/home')}
  >
    {text('Title', 'Button')}
  </LinkButton>
));
