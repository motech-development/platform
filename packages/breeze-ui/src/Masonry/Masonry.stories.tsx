import { number, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Typography from '../Typography/Typography';
import Masonry from './Masonry';

export default {
  component: Masonry,
  decorators: [withKnobs],
};

export const BasicMasonry = {
  name: 'Basic masonry',
  render: () => (
    <>
      <BaseStyles />

      <Masonry
        xs={number('Columns in extra small viewport', 1)}
        sm={number('Columns in small viewport', 2)}
        md={number('Columns in medium viewport', 3)}
        lg={number('Columns in large viewport', 4)}
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
  ),
};
