import { Alert, Link, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import RegistrationForm, {
  IInitialValues,
} from '../components/RegistrationForm';
import httpClient from '../services/httpClient';

const Register: FC = () => {
  const [alert, setAlert] = useState();
  const [registered, setRegistration] = useState(false);

  async function register(body: IInitialValues) {
    try {
      await httpClient.post('api/v1/register', body);

      setRegistration(true);
    } catch (e) {
      setAlert(e.message);
    }
  }

  return (
    <>
      <Typography align="center" component="h1" variant="h1">
        Register
      </Typography>

      {registered ? (
        <>
          <Alert
            message="Your registration is nearly complete!"
            colour="success"
          />

          <Typography component="p" variant="p">
            You will shortly recieve an email with instructions to verify your
            account and complete your registration.
          </Typography>

          <Typography component="p" variant="p">
            <Link to="/">Click here</Link> to go back to the log in page
          </Typography>
        </>
      ) : (
        <>
          <Typography align="center" component="p" variant="p">
            Already registered? <Link to="/">Click here</Link> to log in
          </Typography>

          <RegistrationForm alert={alert} onSubmit={register} />
        </>
      )}
    </>
  );
};

export default memo(Register);
