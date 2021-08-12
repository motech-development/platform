import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Logo from '../components/Logo';
import Notifications from '../components/Notifications';
import TableCell from '../components/TableCell';
import Typography from '../components/Typography';
import AppBar, { TAppBarElement } from '../components/AppBar';
import TTheme, { Theme } from '../utils/theme';

enum Elements {
  Div = 'div',
  Header = 'header',
  Nav = 'nav',
}

const stories = storiesOf('AppBar', module);
const border = () => boolean('Border', true);
const colour = () => select<TTheme>('Colour', Theme, 'secondary');
const element = () => select<TAppBarElement>('Element', Elements, 'header');
const fixed = () => boolean('Fixed', false);

stories.addDecorator(withKnobs);

stories
  .add('Basic app bar', () => (
    <>
      <AppBar
        border={border()}
        colour={colour()}
        element={element()}
        fixed={fixed()}
      >
        <div className="flex-shrink-0">
          <Typography component="h1" variant="h5" margin="none">
            Motech Development
          </Typography>
        </div>
      </AppBar>
    </>
  ))
  .add('App bar with notifications', () => (
    <>
      <AppBar
        border={border()}
        colour={colour()}
        element={element()}
        fixed={fixed()}
      >
        <div className="flex-shrink-0">
          <Logo className="text-blue-600 w-10 h-10" alt="logo" />
        </div>

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
