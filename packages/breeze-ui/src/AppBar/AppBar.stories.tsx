import { withA11y } from '@storybook/addon-a11y';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import BaseStyles from '../BaseStyles/BaseStyles';
import Notifications from '../Notifications/Notifications';
import TableCell from '../TableCell/TableCell';
import Typography from '../Typography/Typography';
import AppBar from './AppBar';

const Title = styled(Typography)`
  && {
    margin: 0;
  }
`;

const stories = storiesOf('AppBar', module);
const elements = {
  Div: 'div',
  Header: 'header',
};
const colours = {
  Primary: 'primary',
  Secondary: 'secondary',
};

stories.addDecorator(withA11y);
stories.addDecorator(withKnobs);

stories
  .add('Basic app bar', () => (
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
  ))
  .add('App bar with notifications', () => (
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
          onClick={() => {}}
        />
      </AppBar>
    </>
  ));
