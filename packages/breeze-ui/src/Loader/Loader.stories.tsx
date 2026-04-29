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

      <div
        data-testid="loader-baseline"
        style={{ height: '160px', position: 'relative', width: '160px' }}
      >
        <Loader
          colour={
            select('Colour', colour, 'default') as 'default' | 'secondary'
          }
        />
      </div>
    </>
  ),
};
