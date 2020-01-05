import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import AppBar from '../AppBar/AppBar';
import BaseStyles from '../BaseStyles/BaseStyles';
import DropDownItem from '../DropDownItem/DropDownItem';
import Typography from '../Typography/Typography';
import DropDown from './DropDown';

const Title = styled(Typography)`
  && {
    margin: 0;
  }
`;

const stories = storiesOf('DropDown', module);
const size = {
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
};

stories.addDecorator(withKnobs);

stories.add('Basic drop down', () => (
  <>
    <BaseStyles />

    <AppBar>
      <Title component="h1" variant="h5">
        Motech Development
      </Title>

      <DropDown
        size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'}
        trigger={() => <>Click me</>}
      >
        <DropDownItem>Welcome back Mo Gusbi</DropDownItem>

        <DropDownItem>Dashboard</DropDownItem>

        <DropDownItem>My Account</DropDownItem>

        <DropDownItem>Sign out</DropDownItem>
      </DropDown>
    </AppBar>
  </>
));
