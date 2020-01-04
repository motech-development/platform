import { useAuth } from '@motech-development/auth';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 50px 0;
`;

const Index: FC = () => {
  const { loginWithRedirect } = useAuth();
  const { t } = useTranslation(['home', 'translation']);
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
            {t('translation:app-name')}
          </Typography>

          <Card>
            <Typography align="center" component="h2" variant="h2">
              {t('welcome')}
            </Typography>

            <Typography align="center" component="p" variant="p">
              {t('intro')}
            </Typography>
          </Card>

          <Button block type="button" size="lg" onClick={login}>
            {t('log-in')}
          </Button>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default memo(Index);
