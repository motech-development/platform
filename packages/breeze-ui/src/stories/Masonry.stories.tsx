import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import Typography from '../components/Typography';
import Masonry from '../components/Masonry';
import { TColumn, TGap } from '../utils/grid';

const stories = storiesOf('Masonry', module);

stories.addDecorator(withKnobs);

stories.add('Basic masonry', () => (
  <>
    <Masonry
      gutter={
        number('Gutter', 5, {
          max: 5,
          min: 0,
          range: true,
        }) as TGap
      }
      xs={number('Columns in extra small viewport', 1) as TColumn}
      sm={number('Columns in small viewport', 2) as TColumn}
      md={number('Columns in medium viewport', 3) as TColumn}
      lg={number('Columns in large viewport', 4) as TColumn}
    >
      <Card>
        <div style={{ height: '200px' }}>
          <Typography rule component="h1" variant="h2">
            Outside of loop
          </Typography>
        </div>
      </Card>

      {[...Array(number('Items', 5))].map((_, i) => {
        const height = `${200 + Math.ceil(Math.random() * 300)}px`;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Card key={i}>
            <div style={{ height }}>
              <Typography rule component="h1" variant="h2">{`Item ${
                i + 1
              }`}</Typography>
            </div>
          </Card>
        );
      })}
    </Masonry>
  </>
));
