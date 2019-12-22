import { Link, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import LoginForm from '../components/LoginForm';

const Home: FC = () => {
  function login() {}

  return (
    <>
      <Typography align="center" component="h1" variant="h1">
        Welcome
      </Typography>

      <Typography align="center" component="p" variant="p">
        Not registered? <Link to="/register">Click here</Link> to sign up
      </Typography>

      <LoginForm onSubmit={login} />
    </>
  );
};

export default memo(Home);
