import { select, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Loader from './Loader';

export default {
  component: Loader,
  decorators: [withKnobs],
};

const colour = {
  Default: 'default',
  Secondary: 'secondary',
};

export const BasicLoader = {
  name: 'Basic loader',
  render: () => (
    <>
      <BaseStyles />

      <Loader
        colour={select('Colour', colour, 'default') as 'default' | 'secondary'}
      />
    </>
  ),
};
