import { number, /* text, */ withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Typography from '../Typography/Typography';
import Masonry from './Masonry';

const stories = storiesOf('Masonry', module);
const lg = number('Columns in large viewport', 4);
const md = number('Columns in medium viewport', 3);
const sm = number('Columns in small viewport', 2);
const xs = number('Columns in extra small viewport', 1);
const items = number('Items', 12, {
  max: 12,
  min: 1,
  range: true,
});
const input = [...new Array(items)].map((_, i) => i + 1);

stories.addDecorator(withKnobs);

stories.add('Basic masonry', () => (
  <>
    <BaseStyles />

    <Masonry xs={xs} sm={sm} md={md} lg={lg}>
      <Card>
        <div style={{ height: '200px' }}>
          <Typography rule component="h1" variant="h2">
            Outside of loop
          </Typography>
        </div>
      </Card>

      {input.map(i => {
        const height = `${200 + Math.ceil(Math.random() * 300)}px`;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Card key={i}>
            <div style={{ height }}>
              <Typography
                rule
                component="h1"
                variant="h2"
              >{`Item ${i}`}</Typography>
            </div>
          </Card>
        );
      })}
    </Masonry>
  </>
));
