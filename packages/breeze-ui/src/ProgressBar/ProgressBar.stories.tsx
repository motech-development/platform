import { number, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import ProgressBar from './ProgressBar';

export default {
  component: ProgressBar,
  decorators: [withKnobs],
};

export const BasicProgressBar = {
  name: 'Basic progress bar',
  render: () => (
    <>
      <BaseStyles />

      <ProgressBar max={number('Max', 100)} progress={number('Progress', 50)} />
    </>
  ),
};
