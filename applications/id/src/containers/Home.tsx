import { Link, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { LoginForm } from '../components';

const Home: FC = () => {
  function login() {}

  return (
    <>
      <Typography component="h1" variant="h1">
        Welcome
      </Typography>

      <Typography component="p" variant="p">
        Not registered? <Link to="/register">Click here</Link> to sign up
      </Typography>

      <LoginForm onSubmit={login} />
    </>
  );
};

export default memo(Home);
