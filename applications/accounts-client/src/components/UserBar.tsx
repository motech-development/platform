import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Avatar,
  Button,
  Tooltip,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AppName = styled(Typography)`
  && {
    flex-grow: 1;
    margin: 0 1rem 0 0;
    padding: 0;
  }
`;

const Toolbar = styled.div`
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

export interface IUserBarProps {
  name: string;
  picture?: string;
  logOut(): void;
}

const UserBar: FC<IUserBarProps> = ({ logOut, name, picture }) => {
  const { t } = useTranslation(['global', 'user-bar']);

  return (
    <AppBar fixed>
      <AppName component="h1" variant="h4">
        {t('app-name')}
      </AppName>

      <Toolbar>
        {picture && <Avatar alt="" src={picture} width={32} />}

        <Username component="p" variant="p">
          {name}
        </Username>

        <Tooltip
          id="sign-out"
          parent={
            <Button
              type="button"
              aria-label={t('user-bar:log-out')}
              size="sm"
              onClick={logOut}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </Button>
          }
          placement="bottom"
          colour="primary"
          message={t('user-bar:log-out')}
        />
      </Toolbar>
    </AppBar>
  );
};

export default memo(UserBar);
