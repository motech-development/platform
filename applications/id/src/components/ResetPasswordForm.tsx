import { Form, TextBox } from '@motech-development/breeze-ui';
import { forgottenPassword } from '@motech-development/schema';
import React, { FC, memo } from 'react';

export interface IInitialValues {
  email: string;
}

const initialValues = {
  email: '',
};

export interface IResetPasswordForm {
  onSubmit(value: IInitialValues): void;
}

const ResetPasswordForm: FC<IResetPasswordForm> = ({ onSubmit }) => (
  <Form
    submitLabel="Reset password"
    initialValues={initialValues}
    validationSchema={forgottenPassword}
    onSubmit={onSubmit}
  >
    <TextBox name="email" label="Email address" />
  </Form>
);

export default memo(ResetPasswordForm);
