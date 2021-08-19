// TODO: Everything
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import LinkButton from '../components/LinkButton';
import TSize, { Size } from '../utils/size';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('LinkButton', module);

stories.addDecorator(withKnobs);

stories.add('Basic link button', () => (
  <LinkButton
    block={boolean('Block display', false)}
    colour={select<TTheme>('Colour', Theme, 'primary')}
    size={select<TSize>('Size', Size, 'md')}
    href={text('To', '/home')}
  >
    {text('Title', 'Button')}
  </LinkButton>
));
