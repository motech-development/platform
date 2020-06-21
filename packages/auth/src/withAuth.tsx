import { Loader, useToast } from '@motech-development/breeze-ui';
import useQueryString from '@motech-development/query-string-hook';
import React, { ComponentType, memo, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const withAuth = (Component: ComponentType) =>
  memo(() => {
    const query = useQueryString();
    const { isLoading, logout } = useAuth();
    const { add } = useToast();

    useEffect(() => {
      if (!isLoading) {
        const error = query.get('error');
        const message = query.get('error_description');

        if (error && message) {
          add({
            colour: 'danger',
            message,
            onDismiss: () =>
              logout({
                returnTo: window.location.origin,
              }),
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    if (isLoading) {
      return <Loader />;
    }

    return <Component />;
  });

export default withAuth;
