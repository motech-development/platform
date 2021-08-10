import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Loader from '../components/Loader';
import TTheme from '../utils/theme';

const stories = storiesOf('Loader', module);
const colour = {
  Default: 'default',
  Secondary: 'secondary',
};

stories.addDecorator(withKnobs);

stories.add('Basic loader', () => (
  <>
    <Loader colour={select('Colour', colour, 'default') as TTheme} />
  </>
));
