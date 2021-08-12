import { CheckCircleIcon } from '@heroicons/react/solid';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Alert from '../components/Alert';
import TSpacing, { Spacing } from '../utils/spacing';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('Alert', module);
const message = () => text('Message', 'Hello world');
const colour = () => select<TTheme>('Colour', Theme, 'primary');
const spacing = () => select<TSpacing>('Spacing', Spacing, 'md');
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
