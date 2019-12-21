import { BaseStyles } from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Window } from './components';
import { Home } from './containers';

const App: FC = () => (
  <Router>
    <BaseStyles />

    <Window>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Window>
  </Router>
);

export default App;
