import { Typography, useToast } from '@motech-development/breeze-ui';
import React, { FC, memo, useState } from 'react';
import LogInForm, { FormSchema } from '../components/LogInForm';
import Window from '../components/Window';
import useAuth from '../hooks/auth';

const LogIn: FC = () => {
  const client = useAuth();
  const { add } = useToast();
  const [loading, setLoading] = useState(false);
  const logIn = (values: FormSchema) => {
    if (client) {
      setLoading(true);

      client.login(
        {
          ...values,
          realm: 'Username-Password-Authentication',
        },
        e => {
          if (e) {
            add({
              colour: 'danger',
              message: e.description || 'Something has gone wrong',
            });

            setLoading(false);
          }
        },
      );
    }
  };

  return (
    <Window>
      <Typography align="center" component="h1" variant="h1" margin="lg">
        Motech Development ID
      </Typography>

      <LogInForm loading={loading} onSubmit={logIn} />
    </Window>
  );
};

export default memo(LogIn);
