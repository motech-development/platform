import { number, text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Col from '../Col/Col';
import Row from '../Row/Row';

export default {
  component: Row,
  decorators: [withKnobs],
};

export const BasicGrid = {
  name: 'Basic grid',
  render: () => (
    <>
      <BaseStyles />

      {[...Array(number('Rows', 1))].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Row gutter={text('Gutter', '1rem')} key={i}>
          {[
            ...Array(
              number('Columns', 12, {
                max: 12,
                min: 1,
                range: true,
              }),
            ),
          ].map((__, j) => (
            <Col
              key={j} // eslint-disable-line react/no-array-index-key
              xs={number('xs', 1, {
                max: 12,
                min: 1,
                range: true,
              })}
              sm={number('sm', 0, {
                max: 12,
                min: 0,
                range: true,
              })}
              md={number('md', 0, {
                max: 12,
                min: 0,
                range: true,
              })}
              lg={number('lg', 0, {
                max: 12,
                min: 0,
                range: true,
              })}
            >
              <Card>Hello</Card>
            </Col>
          ))}
        </Row>
      ))}
    </>
  ),
};
