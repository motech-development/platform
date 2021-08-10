import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import ButtonLink from '../components/ButtonLink';

const stories = storiesOf('ButtonLink', module);

stories.addDecorator(withKnobs);

stories.add('Basic button link', () => (
  <>
    <Card>
      <ButtonLink>{text('Text', 'This is a button')}</ButtonLink>
    </Card>
  </>
));
