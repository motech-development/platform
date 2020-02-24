import {
  Button,
  Card,
  Col,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import history from '../history';
import withLayout from '../hoc/withLayout';

const NotFound: FC = () => {
  const { t } = useTranslation('not-found');

  function goBack() {
    history.goBack();
  }

  return (
    <Row>
      <Col sm={8} smOffset={3} md={6} mdOffset={4}>
        <Card>
          <Typography align="center" component="h2" variant="h2">
            {t('not-found')}
          </Typography>

          <Typography align="center" component="h3" variant="lead">
            {t('description')}
          </Typography>
        </Card>

        <Button block type="button" size="lg" onClick={goBack}>
          {t('go-back')}
        </Button>
      </Col>
    </Row>
  );
};

export default withLayout(NotFound);
