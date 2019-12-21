import { BaseStyles } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Window } from './components';
import { Home, Register } from './containers';

const App: FC = () => (
  <Router>
    <BaseStyles />

    <Window>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
      </Switch>
    </Window>
  </Router>
);

export default memo(App);
