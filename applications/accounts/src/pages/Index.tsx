import { useAuth } from '@motech-development/auth';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 50px 0;
`;

const Index: FC = () => {
  const { loginWithRedirect } = useAuth();
  const login = () =>
    loginWithRedirect({
      appState: {
        targetUrl: '/dashboard',
      },
    });

  return (
    <Wrapper>
      <Row>
        <Col sm={8} smOffset={3} md={6} mdOffset={4} lg={4} lgOffset={5}>
          <Typography align="center" component="h1" variant="h1">
            Accounts
          </Typography>

          <Card>
            <Typography align="center" component="h2" variant="h2">
              Welcome
            </Typography>

            <Typography align="center" component="p" variant="p">
              Click the button below to log in or register to get started
            </Typography>
          </Card>

          <Button block type="button" size="lg" onClick={login}>
            Log in
          </Button>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default memo(Index);
