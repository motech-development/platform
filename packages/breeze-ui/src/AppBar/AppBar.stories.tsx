import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import styled from 'styled-components';
import BaseStyles from '../BaseStyles/BaseStyles';
import Notifications from '../Notifications/Notifications';
import TableCell from '../TableCell/TableCell';
import Typography from '../Typography/Typography';
import AppBar from './AppBar';

export default {
  component: AppBar,
  decorators: [withKnobs],
};

const Title = styled(Typography)`
  && {
    margin: 0;
  }
`;

const elements = {
  Div: 'div',
  Header: 'header',
};
const colours = {
  Primary: 'primary',
  Secondary: 'secondary',
};

export const BasicAppBar = {
  name: 'Basic app bar',
  render: () => (
    <>
      <BaseStyles />

      <AppBar
        colour={select('Colour', colours, 'primary')}
        element={select('Element', elements, 'header') as 'header' | 'div'}
        fixed={boolean('Fixed', false)}
      >
        <Title component="h1" variant="h5">
          Motech Development
        </Title>
      </AppBar>
    </>
  ),
};

export const AppBarWithNotifications = {
  name: 'App bar with notifications',
  render: () => (
    <>
      <BaseStyles />

      <AppBar
        colour={select('Colour', colours, 'primary')}
        element={select('Element', elements, 'header') as 'header' | 'div'}
        fixed={boolean('Fixed', false)}
      >
        <Title component="h1" variant="h5">
          Motech Development
        </Title>

        <Notifications
          alert
          items={[
            {
              message: 'This is a notification',
            },
            {
              message: 'This is another notification',
            },
          ]}
          label="Notifications"
          noResults={<div />}
          row={({ message }) => <TableCell>{message}</TableCell>}
          onClose={() => {}}
        />
      </AppBar>
    </>
  ),
};
