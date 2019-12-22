import React, { FC, memo } from 'react';
import { Link } from '@motech-development/breeze-ui';
import { LoginForm } from '../components';

const Home: FC = () => {
  function login() {}

  return (
    <>
      <LoginForm onSubmit={login} />
      Not registered? <Link to="/register">Click here</Link> to sign up
    </>
  );
};

export default memo(Home);
