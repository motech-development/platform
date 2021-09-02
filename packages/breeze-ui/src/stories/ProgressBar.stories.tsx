import { number, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import ProgressBar from '../components/ProgressBar';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('ProgressBar', module);

stories.addDecorator(withKnobs);

stories.add('Basic progress bar', () => (
  <>
    <ProgressBar
      max={number('Max', 100)}
      progress={number('Progress', 50)}
      theme={select<TTheme>('Theme', Theme, 'primary')}
    />
  </>
));
