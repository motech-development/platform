import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Typography from './Typography';

type Components = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

const stories = storiesOf('Typography', module);
const components = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',

  Paragraph: 'p',
};
const variants = {
  ...components,
  Lead: 'lead',
};

stories.addDecorator(withKnobs);

stories.add('Basic typography', () => (
  <>
    <BaseStyles />

    <Card>
      <Typography
        variant={select('Variant', variants, 'h1') as Components | 'lead'}
        component={select('Component', components, 'h1') as Components}
      >
        {text('Text', 'Hello world')}
      </Typography>
    </Card>
  </>
));
