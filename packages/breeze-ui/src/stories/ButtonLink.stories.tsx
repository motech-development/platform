import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import ButtonLink from './ButtonLink';

const stories = storiesOf('ButtonLink', module);

stories.addDecorator(withKnobs);

stories.add('Basic button link', () => (
  <>
    <BaseStyles />

    <Card>
      <ButtonLink>{text('Text', 'This is a button')}</ButtonLink>
    </Card>
  </>
));
