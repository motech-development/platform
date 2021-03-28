import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppBar,
  Avatar,
  Breakpoint,
  Button,
  Tooltip,
  Typography,
} from '@motech-development/breeze-ui';
import { FC, memo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AppBarItem = styled.div`
  margin: 0 1rem 0 0;
`;

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
    margin: 0 1rem 0 0;
    text-align: right;
  }
`;

export interface IUserBarProps {
  name: string;
  notifications: ReactNode;
  picture?: string;
  logOut(): void;
}

const UserBar: FC<IUserBarProps> = ({
  logOut,
  name,
  notifications,
  picture,
}) => {
  const { t } = useTranslation(['global', 'user-bar']);

  return (
    <AppBar fixed>
      <AppName component="h1" variant="h4">
        {t('app-name')}
      </AppName>

      <Toolbar>
        {picture && (
          <Breakpoint xs={false}>
            <AppBarItem>
              <Avatar alt="" src={picture} width={32} />
            </AppBarItem>
          </Breakpoint>
        )}

        <Username truncate component="p" variant="p">
          {name}
        </Username>

        <AppBarItem>{notifications}</AppBarItem>

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
