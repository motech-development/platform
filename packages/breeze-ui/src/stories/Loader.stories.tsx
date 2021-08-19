import { storiesOf } from '@storybook/react';
import Loader from '../components/Loader';

const stories = storiesOf('Loader', module);

stories.add('Basic loader', () => (
  <>
    <Loader />
  </>
));
