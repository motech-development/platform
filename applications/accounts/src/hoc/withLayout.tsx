import { useAuth } from '@motech-development/auth';
import { Button, Card, Typography } from '@motech-development/breeze-ui';
import React, { ComponentType, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Toolbar = styled.header`
  align-items: center;
  background: #161616;
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  position: relative;
  user-select: none;
`;

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
    margin: 0;
    padding: 0 0 0 1rem;
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
        <Toolbar>
          {/* TODO: Logo */}
          <AppName component="h1" variant="h4">
            {t('app-name')}
          </AppName>

          <Button type="button" size="sm" onClick={logOut}>
            {user && (
              <>
                {user.name}
                <Avatar alt={user.name} src={user.picture} />
              </>
            )}
          </Button>
        </Toolbar>

        <Card>
          <Component />
        </Card>
      </>
    );
  });

export default withLayout;
