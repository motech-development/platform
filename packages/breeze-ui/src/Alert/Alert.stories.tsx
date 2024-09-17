import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Alert, { AlertTheme } from './Alert';

export default {
  component: Alert,
  decorators: [withKnobs],
};

const colours = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
};
const margins = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};
const message = () => text('Message', 'Hello world');
const colour = (): AlertTheme =>
  select('Colour', colours, 'primary') as AlertTheme;
const spacing = () => select('Spacing', margins, 'md') as 'sm' | 'md' | 'lg';
const dismissable = () => boolean('Dismissable', false);

export const VariousAlerts = {
  name: 'Various alerts',
  render: () => (
    <>
      <BaseStyles />

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
        icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
        spacing={spacing()}
      />
    </>
  ),
};
