import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@motech-development/auth';
import {
  AppBar,
  Button,
  Card,
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

const Username = styled(Typography)`
  && {
    flex-grow: 1;
    margin: 0 1rem 0 0.5rem;
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
          <AppName component="h1" variant="h4">
            {t('app-name')}
          </AppName>

          {user && (
            <>
              <Username component="p" variant="p">
                {user.name}
              </Username>

              <Tooltip
                id="sign-out"
                parent={() => (
                  <Button type="button" size="sm" onClick={logOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </Button>
                )}
                placement="bottom"
                colour="primary"
                message={t('log-out')}
              />
            </>
          )}
        </AppBar>

        <Card>
          <Component />
        </Card>
      </>
    );
  });

export default withLayout;
