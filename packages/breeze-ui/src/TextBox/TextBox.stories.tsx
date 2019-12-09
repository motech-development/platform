import { storiesOf } from '@storybook/react';
import { Form, Formik } from 'formik';
import React from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import TextBox from './TextBox';

const stories = storiesOf('TextBox', module);
const initialValues = {
  email: '',
  name: 'Mo Gusbi',
  password: '',
};

function submit() {}

stories.add('Basic textbox', () => (
  <>
    <BaseStyles />

    <Formik initialValues={initialValues} onSubmit={submit}>
      {() => (
        <Form>
          <TextBox name="name" type="text" label="Name" />

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
