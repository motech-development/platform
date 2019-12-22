import { Link, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import RegistrationForm from '../components/RegistrationForm';

const Register: FC = () => {
  function register() {}

  return (
    <>
      <Typography align="center" component="h1" variant="h1">
        Register
      </Typography>

      <Typography align="center" component="p" variant="p">
        Already registered? <Link to="/">Click here</Link> to log in
      </Typography>

      <RegistrationForm onSubmit={register} />
    </>
  );
};

export default memo(Register);
