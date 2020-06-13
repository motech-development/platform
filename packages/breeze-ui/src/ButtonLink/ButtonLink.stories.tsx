import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import ButtonLink from './ButtonLink';

const stories = storiesOf('ButtonLink', module);

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories.add('Basic button link', () => (
  <>
    <BaseStyles />

    <Card>
      <ButtonLink>{text('Text', 'This is a button')}</ButtonLink>
    </Card>
  </>
));
