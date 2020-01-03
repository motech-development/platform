import { ProtectedRoute, useAuth } from '@motech-development/auth';
import { BaseStyles } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedPage from './containers/ProtectedPage';
import PublicPage from './containers/PublicPage';

const App: FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <BaseStyles />

      <Switch>
        <Route exact path="/" component={PublicPage} />
        <ProtectedRoute exact path="/protected" component={ProtectedPage} />
      </Switch>
    </>
  );
};

export default memo(App);
