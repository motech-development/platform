import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import Link from '../components/Link';

const stories = storiesOf('Link', module);

stories.addDecorator(withKnobs);

stories.add('Basic link', () => (
  <Card>
    <Link href={text('To', '/home')}>{text('Text', 'This is a link')}</Link>
  </Card>
));
