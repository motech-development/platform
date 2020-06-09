import { Typography } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';

const AppTitle: FC = () => {
  const { title } = window.config.dict.signin;

  return (
    <Typography align="center" component="h2" variant="h1" margin="lg">
      {title}
    </Typography>
  );
};

export default memo(AppTitle);
