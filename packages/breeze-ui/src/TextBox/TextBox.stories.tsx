import { storiesOf } from '@storybook/react';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import BaseStyles from '../BaseStyles/BaseStyles';
import TextBox from './TextBox';

const stories = storiesOf('TextBox', module);
const initialValues = {
  email: '',
  name: 'Mo Gusbi',
  password: '',
};
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  name: Yup.string().required(),
  password: Yup.string().required(),
});

function submit() {}

stories.add('Basic textbox', () => (
  <>
    <BaseStyles />

    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {() => (
        <Form>
          <TextBox name="name" type="text" label="Name" placeholder="Name" />

          <TextBox
            name="email"
            type="email"
            label="Email address"
            placeholder="example@motechdevelopment.co.uk"
          />

          <TextBox name="password" type="password" label="Password" />
        </Form>
      )}
    </Formik>
  </>
));
