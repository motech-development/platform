import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import ProgressBar from '../components/ProgressBar';

const stories = storiesOf('ProgressBar', module);

stories.addDecorator(withKnobs);

stories.add('Basic progress bar', () => (
  <>
    <ProgressBar max={number('Max', 100)} progress={number('Progress', 50)} />
  </>
));
