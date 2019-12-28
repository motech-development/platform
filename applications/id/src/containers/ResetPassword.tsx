import { Alert, Link, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import ResetPasswordForm, {
  IInitialValues,
} from '../components/ResetPasswordForm';
import httpClient from '../services/httpClient';

const ResetPassword: FC = () => {
  const [alert, setAlert] = useState();

  async function resetPassword(body: IInitialValues) {
    const { message } = await httpClient.post(
      'api/v1/forgotten-password',
      body,
    );

    setAlert(message);
  }

  return (
    <>
      <Typography align="center" component="h1" variant="h1">
        Reset your password
      </Typography>

      {alert ? (
        <>
          <Alert message={alert} colour="success" />

          <Typography component="p" variant="p">
            To create your new password, click the link in the email and enter a
            new one
          </Typography>

          <Typography component="p" variant="p">
            Didn&apos;t receive the email? Check your junk mail
          </Typography>

          <Typography component="p" variant="p">
            <Link to="/">Click here</Link> to go back to back to log in page
          </Typography>
        </>
      ) : (
        <>
          <Typography component="p" variant="p">
            Type in your email address below and we&apos;ll send you an email
            with instructions on how to create a new password
          </Typography>

          <Typography component="p" variant="p">
            Remembered your password? <Link to="/">Click here</Link> to log in
          </Typography>

          <ResetPasswordForm onSubmit={resetPassword} />
        </>
      )}
    </>
  );
};

export default memo(ResetPassword);
