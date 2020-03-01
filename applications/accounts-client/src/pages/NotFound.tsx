import {
  Button,
  Card,
  Col,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import withLayout from '../hoc/withLayout';

const NotFound: FC = () => {
  const history = useHistory();
  const { t } = useTranslation('not-found');

  function goBack() {
    history.goBack();
  }

  return (
    <Row>
      <Col sm={8} smOffset={3} md={6} mdOffset={4}>
        <Card padding="lg">
          <Typography
            rule
            align="center"
            component="h2"
            variant="h2"
            margin="lg"
          >
            {t('not-found')}
          </Typography>

          <Typography
            align="center"
            component="h3"
            variant="lead"
            margin="none"
          >
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
