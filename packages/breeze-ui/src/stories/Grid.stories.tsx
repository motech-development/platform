import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import Col from '../components/Col';
import Row from '../components/Row';
import { TColumn, TGap } from '../utils/grid';

const stories = storiesOf('Grid', module);
const columns = () =>
  number('Columns', 12, {
    max: 12,
    min: 1,
    range: true,
  }) as TColumn;

stories.addDecorator(withKnobs);

stories.add('Basic grid', () => (
  <>
    {[...Array(number('Rows', 1))].map((_, i) => (
      <Row
        columns={columns()}
        gutter={
          number('Gutter', 0, {
            max: 5,
            min: 0,
            range: true,
          }) as TGap
        }
        // eslint-disable-next-line react/no-array-index-key
        key={i}
      >
        {[...Array(columns())].map((__, j) => (
          <Col
            key={j} // eslint-disable-line react/no-array-index-key
            xs={
              number('xs', 1, {
                max: 12,
                min: 1,
                range: true,
              }) as TColumn
            }
            sm={
              number('sm', 0, {
                max: 12,
                min: 0,
                range: true,
              }) as TColumn
            }
            md={
              number('md', 0, {
                max: 12,
                min: 0,
                range: true,
              }) as TColumn
            }
            lg={
              number('lg', 0, {
                max: 12,
                min: 0,
                range: true,
              }) as TColumn
            }
          >
            <Card>Hello</Card>
          </Col>
        ))}
      </Row>
    ))}
  </>
));
