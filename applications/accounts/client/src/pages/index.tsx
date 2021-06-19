import { FC, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const MyCompanies = lazy(() => import('./MyCompanies'));
const LogIn = lazy(() => import('./LogIn'));
const NotFound = lazy(() => import('./NotFound'));

const Pages: FC = () => (
  <Switch>
    <Route exact path="/" component={LogIn} />
    <Route path="/my-companies" component={MyCompanies} />
    <Route component={NotFound} />
  </Switch>
);

export default Pages;
