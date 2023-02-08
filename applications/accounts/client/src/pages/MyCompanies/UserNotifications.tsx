import { gql, useMutation, useQuery } from '@apollo/client';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  DateTime,
  Notifications,
  TableCell,
  TRowData,
  Typography,
} from '@motech-development/breeze-ui';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ON_NOTIFICATION, {
  IOnNotificationInput,
  IOnNotificationOutput,
} from '../../graphql/notifications/ON_NOTIFICATION';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($id: ID!, $count: Int) {
    getNotifications(id: $id, count: $count) {
      id
      items {
        createdAt
        id
        message
        read
      }
    }
  }
`;

interface IGetNotificationsInput {
  count: number;
  id: string;
}

interface IGetNotificationsOutput {
  getNotifications?: {
    id: string;
    items: {
      createdAt: string;
      id: string;
      message: string;
      read: boolean;
    }[];
  };
}

export const MARK_AS_READ = gql`
  mutation MarkAsRead($id: ID!, $input: MarkNotificationsInput!) {
    markAsRead(id: $id, input: $input) {
      items {
        id
        read
      }
    }
  }
`;

interface IMarkAsReadInput {
  id: string;
  input: {
    ids: string[];
  };
}

interface IMarkAsReadOutput {
  markAsRead?: {
    items: {
      id: string;
      read: boolean;
    }[];
  };
}

const SupportText = styled(Typography)`
  && {
    font-size: 0.9rem;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: #007fa8;
  font-size: 0.75rem;
`;

interface IDataRow {
  t: (label: string) => string;
}

interface IDataRowComponent {
  createdAt: string;
  message: string;
  read: boolean;
}

const row: TRowData<IDataRow, IDataRowComponent> =
  ({ t }) =>
  ({ createdAt, message, read }) =>
    (
      <>
        <TableCell>{!read && <Icon icon={faCircle} />}</TableCell>
        <TableCell noWrap={false}>
          <Typography component="p" variant="h6" margin="none">
            {t(`messages.${message}`)}
          </Typography>

          <SupportText component="p" variant="p" margin="none">
            <DateTime value={createdAt} format="dd/MM/yyyy HH:mm" />
          </SupportText>
        </TableCell>
      </>
    );

export interface IUserNotificationsProps {
  id: string;
}

const UserNotifications: FC<IUserNotificationsProps> = ({ id }) => {
  const { t } = useTranslation('user-notifications');
  const { data, subscribeToMore } = useQuery<
    IGetNotificationsOutput,
    IGetNotificationsInput
  >(GET_NOTIFICATIONS, {
    variables: {
      count: 5,
      id,
    },
  });
  const [markAsRead] =
    useMutation<IMarkAsReadOutput, IMarkAsReadInput>(MARK_AS_READ);

  useEffect(
    () =>
      subscribeToMore<IOnNotificationOutput, IOnNotificationInput>({
        document: ON_NOTIFICATION,
        updateQuery: (prev, { subscriptionData }) => {
          if (
            !subscriptionData.data?.onNotification ||
            !prev.getNotifications
          ) {
            return prev;
          }

          return {
            getNotifications: {
              ...prev.getNotifications,
              items: [
                subscriptionData.data.onNotification,
                ...prev.getNotifications.items,
              ],
            },
          };
        },
        variables: {
          owner: id,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!data?.getNotifications) {
    return null;
  }

  const unreadItems = data.getNotifications.items.filter(({ read }) => !read);
  const unread = unreadItems.length;
  const alert = unread > 0;

  const onClose = async () => {
    const ids = unreadItems.map((item) => item.id);

    if (ids.length > 0) {
      await markAsRead({
        variables: {
          id,
          input: {
            ids,
          },
        },
      });
    }
  };

  return (
    <Notifications
      alert={alert}
      cols={2}
      items={data.getNotifications.items}
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
      row={row({
        t,
      })}
      onClose={onClose}
    />
  );
};

export default UserNotifications;
