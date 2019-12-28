import { Alert } from '@motech-development/breeze-ui';
import React, { FC, memo, useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import Window from './components/Window';
import { Home, Register, ResetPassword } from './containers';

const App: FC = () => {
  const { search } = useLocation();
  const { redirect_uri: uriToUse } = parse(search);
  const [redirectUri, setRedirectUri] = useState(uriToUse);

  useEffect(() => {
    if (uriToUse) {
      setRedirectUri(uriToUse);
    }
  }, [uriToUse]);

  return (
    <Window>
      {redirectUri ? (
        <Switch>
          <Route exact path="/">
            <Home redirectUri={redirectUri as string} />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/reset-password">
            <ResetPassword />
          </Route>
        </Switch>
      ) : (
        <Alert message="Error: No redirect URI set." colour="danger" />
      )}
    </Window>
  );
};

export default memo(App);
