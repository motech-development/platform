import React, { FC, memo } from 'react';
import Page from '../components/Page';

const MyCompanies: FC = () => (
  <Page title="My companies">
    <p>Hello world</p>
  </Page>
);

export default memo(MyCompanies);
