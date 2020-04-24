import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { date, object, string } from 'yup';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Col from '../Col/Col';
import DatePicker from '../DatePicker/DatePicker';
import Row from '../Row/Row';
import TextBox from '../TextBox/TextBox';
import Select from '../Select/Select';
import Form from './Form';

const stories = storiesOf('Form', module);
const initialValues = {
  category: '',
  dob: '',
  email: '',
  extra: {
    sortCode: '',
    telephone: '',
  },
  name: 'Mo Gusbi',
  password: '',
};
const validationSchema = object().shape({
  category: string().required(),
  date: date().required(),
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
const options = [
  {
    name: 'Travel',
    value: 'travel',
  },
  {
    name: 'Sales',
    value: 'sales',
  },
];
const submit = () => {};
const disabled = () => boolean('Disabled', false);
const readOnly = () => boolean('Read only', false);

stories.addDecorator(withKnobs);

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
            cancel={
              <Button block colour="danger" size="lg">
                Cancel
              </Button>
            }
          >
            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="name"
              type="text"
              label="Name"
              placeholder="Name"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="email"
              type="email"
              label="Email address"
              placeholder="example@motechdevelopment.co.uk"
              helpText="Your email address"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="password"
              type="password"
              label="Password"
              spacing="lg"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="extra.telephone"
              type="text"
              label="Telephone"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="extra.sortCode"
              type="text"
              label="Sort code"
              format="##-##-##"
            />

            <Select
              disabled={disabled()}
              readOnly={readOnly()}
              options={options}
              name="category"
              label="Category"
              placeholder="Select category"
            />

            <DatePicker
              disabled={disabled()}
              readOnly={readOnly()}
              name="dob"
              label="Date of birth"
            />
          </Form>
        </Card>
      </Col>
    </Row>
  </>
));
