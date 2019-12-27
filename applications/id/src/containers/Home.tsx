import { Link, Typography } from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import { stringify } from 'query-string';
import LoginForm, { IInitialValues } from '../components/LoginForm';
import httpClient from '../services/httpClient';

export interface IHomeProps {
  redirectUri: string;
}

const Home: FC<IHomeProps> = ({ redirectUri }) => {
  const [alert, setAlert] = useState();

  async function login(body: IInitialValues) {
    try {
      const {
        access_token: accessToken,
        expires_in: expiresIn,
        scope,
        token_type: tokenType,
      } = await httpClient.post('api/v1/auth', body);
      const params = stringify({
        access_token: accessToken,
        expires_in: expiresIn,
        scope,
        token_type: tokenType,
      });

      window.location.assign(`${redirectUri}#${params}`);
    } catch (e) {
      setAlert(e.message);
    }
  }

  return (
    <>
      <Typography align="center" component="h1" variant="h1">
        Welcome
      </Typography>

      <Typography align="center" component="p" variant="p">
        Not registered? <Link to="/register">Click here</Link> to sign up
      </Typography>

      <LoginForm alert={alert} onSubmit={login} />
    </>
  );
};

export default memo(Home);
