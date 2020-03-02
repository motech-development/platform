import { storiesOf } from '@storybook/react';
import React from 'react';
import { object, string } from 'yup';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Col from '../Col/Col';
import Row from '../Row/Row';
import TextBox from '../TextBox/TextBox';
import Form from './Form';

const stories = storiesOf('Form', module);
const initialValues = {
  email: '',
  extra: {
    sortCode: '',
    telephone: '',
  },
  name: 'Mo Gusbi',
  password: '',
};
const validationSchema = object().shape({
  email: string()
    .email()
    .required(),
  extra: object().shape({
    sortCode: string().required(),
    telephone: string().required(),
  }),
  name: string().required(),
  password: string().required(),
});
const submit = () => {};

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
            cancel={() => (
              <Button block colour="danger" size="lg">
                Cancel
              </Button>
            )}
          >
            <TextBox name="name" type="text" label="Name" placeholder="Name" />

            <TextBox
              name="email"
              type="email"
              label="Email address"
              placeholder="example@motechdevelopment.co.uk"
              helpText="Your email address"
            />

            <TextBox
              name="password"
              type="password"
              label="Password"
              spacing="lg"
            />

            <TextBox name="extra.telephone" type="text" label="Telephone" />

            <TextBox
              name="extra.sortCode"
              type="text"
              label="Sort code"
              format="##-##-##"
            />
          </Form>
        </Card>
      </Col>
    </Row>
  </>
));
