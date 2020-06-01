import React, { ComponentType, memo } from 'react';
import styled from 'styled-components';

const Container = styled.main`
  margin: 64px 0 0;
  padding: 1rem;
`;

const withLayout = (Component: ComponentType) =>
  memo(() => (
    <Container>
      <Component />
    </Container>
  ));

export default withLayout;
