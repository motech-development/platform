import { Link } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { RegistrationForm } from '../components';

const Register: FC = () => {
  function register() {}

  return (
    <>
      <RegistrationForm onSubmit={register} />
      Already registered? <Link to="/">Click here</Link> to log in
    </>
  );
};

export default memo(Register);
