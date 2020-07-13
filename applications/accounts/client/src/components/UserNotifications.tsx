import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  DateTime,
  Notifications,
  TableCell,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SupportText = styled(Typography)`
  && {
    font-size: 0.9rem;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #007fa8;
  font-size: 0.75rem;
`;

export interface IUserNotificationsProps {
  messages: {
    createdAt: string;
    message: string;
    read: boolean;
  }[];
  markAsRead(): Promise<void>;
}

const UserNotifications: FC<IUserNotificationsProps> = ({
  markAsRead,
  messages,
}) => {
  const { t } = useTranslation('user-notifications');
  const unread = messages.filter(({ read }) => !read).length;
  const alert = unread > 0;

  return (
    <Notifications
      alert={alert}
      cols={2}
      items={messages}
      label={t('notifications', {
        number: unread,
      })}
      noResults={
        <Card padding="lg">
          <Typography component="p" variant="p" align="center" margin="none">
            {t('no-new-notifications')}
          </Typography>
        </Card>
      }
      placement="bottom-end"
      row={({ createdAt, message, read }) => (
        <>
          <TableCell>{!read && <Icon icon={faCircle} />}</TableCell>
          <TableCell>
            <Typography component="p" variant="h6" margin="none">
              {message}
            </Typography>

            <SupportText component="p" variant="p" margin="none">
              <DateTime value={createdAt} format="DD/MM/YYYY HH:mm" />
            </SupportText>
          </TableCell>
        </>
      )}
      onClose={markAsRead}
    />
  );
};

export default memo(UserNotifications);
