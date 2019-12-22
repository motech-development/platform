import { storiesOf } from '@storybook/react';
import React from 'react';
import { object, string } from 'yup';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Col from '../Col/Col';
import Row from '../Row/Row';
import TextBox from '../TextBox/TextBox';
import Form from './Form';

const stories = storiesOf('Form', module);
const initialValues = {
  email: '',
  name: 'Mo Gusbi',
  password: '',
};
const validationSchema = object().shape({
  email: string()
    .email()
    .required(),
  name: string().required(),
  password: string().required(),
});

function submit() {}

stories.add('Basic form', () => (
  <>
    <BaseStyles />

    <Row>
      <Col md={6} mdOffset={4}>
        <Card padding="lg">
          <Form
            submitLabel="Register"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
          >
            <TextBox name="name" type="text" label="Name" placeholder="Name" />

            <TextBox
              name="email"
              type="email"
              label="Email address"
              placeholder="example@motechdevelopment.co.uk"
            />

            <TextBox
              name="password"
              type="password"
              label="Password"
              spacing="lg"
            />
          </Form>
        </Card>
      </Col>
    </Row>
  </>
));
