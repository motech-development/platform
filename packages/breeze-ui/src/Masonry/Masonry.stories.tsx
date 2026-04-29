import { number, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Typography from '../Typography/Typography';
import Masonry from './Masonry';

const masonryItems = [
  {
    height: '220px',
    title: 'Item 1',
  },
  {
    height: '320px',
    title: 'Item 2',
  },
  {
    height: '260px',
    title: 'Item 3',
  },
  {
    height: '380px',
    title: 'Item 4',
  },
  {
    height: '240px',
    title: 'Item 5',
  },
  {
    height: '340px',
    title: 'Item 6',
  },
];

export default {
  component: Masonry,
  decorators: [withKnobs],
};

export const BasicMasonry = {
  name: 'Basic masonry',
  render: () => (
    <>
      <BaseStyles />

      <div data-testid="masonry-baseline">
        <Masonry
          xs={number('Columns in extra small viewport', 1)}
          sm={number('Columns in small viewport', 2)}
          md={number('Columns in medium viewport', 3)}
          lg={number('Columns in large viewport', 4)}
        >
          <Card>
            <div data-masonry-item style={{ height: '200px' }}>
              <Typography rule component="h1" variant="h2">
                Outside of loop
              </Typography>
            </div>
          </Card>

          {masonryItems.map(({ height, title }) => (
            <Card key={title}>
              <div data-masonry-item style={{ height }}>
                <Typography rule component="h1" variant="h2">
                  {title}
                </Typography>
              </div>
            </Card>
          ))}
        </Masonry>
      </div>
    </>
  ),
};
