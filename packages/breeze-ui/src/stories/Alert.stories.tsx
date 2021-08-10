import { CheckCircleIcon } from '@heroicons/react/solid';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Alert from '../components/Alert';
import TSpacing from '../utils/spacing';
import TTheme from '../utils/theme';

const stories = storiesOf('Alert', module);
const colours = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
};
const margins = {
  Large: 'lg',
  Medium: 'md',
  None: 'none',
  Small: 'sm',
};
const message = () => text('Message', 'Hello world');
const colour = () => select('Colour', colours, 'primary') as TTheme;
const spacing = () => select('Spacing', margins, 'md') as TSpacing;
const dismissable = () => boolean('Dismissable', false);

stories.addDecorator(withKnobs);

stories.add('Various alerts', () => (
  <>
    <Alert
      message={message()}
      colour={colour()}
      dismissable={dismissable()}
      spacing={spacing()}
    />

    <Alert
      message={message()}
      colour={colour()}
      dismissable={dismissable()}
      icon={<CheckCircleIcon aria-hidden="true" />}
      spacing={spacing()}
    />
  </>
));
