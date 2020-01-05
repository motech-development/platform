import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import BaseStyles from '../BaseStyles/BaseStyles';
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

stories.addDecorator(withKnobs);

stories.add('Basic app bar', () => (
  <>
    <BaseStyles />

    <AppBar
      colour={select('Colour', colours, 'primary')}
      element={select('Element', elements, 'header') as 'header' | 'div'}
    >
      <Title component="h1" variant="h5">
        Motech Development
      </Title>
    </AppBar>
  </>
));
