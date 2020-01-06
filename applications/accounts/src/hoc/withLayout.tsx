import { useAuth } from '@motech-development/auth';
import {
  AppBar,
  Button,
  Card,
  Typography,
} from '@motech-development/breeze-ui';
import React, { ComponentType, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Avatar = styled.img`
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-block;
  height: 20px;
  margin-left: 1rem;
  vertical-align: middle;
`;

const AppName = styled(Typography)`
  && {
    border-left: 5px solid #fff;
    flex-grow: 1;
    margin: 0;
    padding: 0 0 0 1rem;
  }
`;

const Username = styled(Typography)`
  && {
    flex-grow: 1;
    margin: 0;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const withLayout = (Component: ComponentType) =>
  memo(() => {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const logOut = () =>
      logout({
        returnTo: window.location.origin,
      });

    return (
      <>
        <AppBar>
          {/* TODO: Logo */}
          <AppName component="h1" variant="h4">
            {t('app-name')}
          </AppName>

          {user && (
            <Username component="p" variant="p">
              {user.name}
            </Username>
          )}
        </AppBar>

        <Card>
          <Button type="button" size="sm" onClick={logOut}>
            {user && <Avatar alt={user.name} src={user.picture} />}
          </Button>
          <Component />
        </Card>
      </>
    );
  });

export default withLayout;
