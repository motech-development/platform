import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Notifications from '../components/Notifications';
import TableCell from '../components/TableCell';
import Typography from '../components/Typography';
import AppBar from '../components/AppBar';
import TTheme from '../utils/theme';

const stories = storiesOf('AppBar', module);
const elements = {
  Div: 'div',
  Header: 'header',
};
const colours = {
  Primary: 'primary',
  Secondary: 'secondary',
};

stories.addDecorator(withKnobs);

stories
  .add('Basic app bar', () => (
    <>
      <AppBar
        colour={select('Colour', colours, 'primary') as TTheme}
        element={select('Element', elements, 'header') as 'header' | 'div'}
        fixed={boolean('Fixed', false)}
      >
        <Typography component="h1" variant="h5" margin="none">
          Motech Development
        </Typography>
      </AppBar>
    </>
  ))
  .add('App bar with notifications', () => (
    <>
      <AppBar
        colour={select('Colour', colours, 'primary') as TTheme}
        element={select('Element', elements, 'header') as 'header' | 'div'}
        fixed={boolean('Fixed', false)}
      >
        <Typography component="h1" variant="h5">
          Motech Development
        </Typography>

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
  ));
