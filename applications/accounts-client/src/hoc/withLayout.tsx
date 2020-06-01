import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@motech-development/auth';
import {
  AppBar,
  Avatar,
  Button,
  Tooltip,
  Typography,
} from '@motech-development/breeze-ui';
import React, { ComponentType, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AppName = styled(Typography)`
  && {
    flex-grow: 1;
    margin: 0 0.5rem 0 0;
    padding: 0;
  }
`;

const Container = styled.main`
  margin: 64px 0 0;
  padding: 1rem;
`;

const UserBar = styled.div`
  display: flex;
  overflow: hidden;
`;

const Username = styled(Typography)`
  && {
    flex-grow: 1;
    font-weight: 500;
    line-height: 32px;
    margin: 0 1rem;
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
        <AppBar fixed>
          <AppName component="h1" variant="h4">
            {t('app-name')}
          </AppName>

          {user && (
            <UserBar>
              {user.picture && <Avatar alt="" src={user.picture} width={32} />}

              <Username component="p" variant="p">
                {user.name}
              </Username>

              <Tooltip
                id="sign-out"
                parent={
                  <Button
                    type="button"
                    aria-label={t('log-out')}
                    size="sm"
                    onClick={logOut}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </Button>
                }
                placement="bottom"
                colour="primary"
                message={t('log-out')}
              />
            </UserBar>
          )}
        </AppBar>

        <Container>
          <Component />
        </Container>
      </>
    );
  });

export default withLayout;
