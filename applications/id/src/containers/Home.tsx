import React, { FC, memo } from 'react';
import { Link } from '@motech-development/breeze-ui';

const Home: FC = () => (
  <>
    Not registered? <Link to="/register">Click here</Link> to sign up
  </>
);

export default memo(Home);
