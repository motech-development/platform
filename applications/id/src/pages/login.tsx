import { Typography } from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import Layout from '../components/Layout';
import LoginForm, { IInitialValues } from '../components/LoginForm';

const LoginPage: FC = () => {
  const [alert, setAlert] = useState();

  async function login({ password, username }: IInitialValues) {
    const { default: auth0 } = await import('../clients/auth0');

    auth0.login(
      {
        password,
        realm: 'Username-Password-Authentication',
        username,
      },
      e => {
        if (e) {
          setAlert(e.description);
        }
      },
    );
  }

  return (
    <Layout>
      <Typography align="center" component="h1" variant="h1">
        Welcome
      </Typography>

      <LoginForm alert={alert} onSubmit={login} />
    </Layout>
  );
};

export default memo(LoginPage);
