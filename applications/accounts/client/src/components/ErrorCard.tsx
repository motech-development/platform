import {
  Button,
  Card,
  Col,
  LinkButton,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export interface IErrorCardProps {
  backTo?: string;
  description: string;
  errors?: string[];
  title: string;
}

const ErrorCard: FC<IErrorCardProps> = ({
  backTo = null,
  description,
  errors = null,
  title,
}) => {
  const history = useHistory();
  const { t } = useTranslation('error-card');
  const goBack = () => {
    history.goBack();
  };

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
            {title}
          </Typography>

          <Typography
            align="center"
            component="h3"
            variant="lead"
            margin={errors ? 'lg' : 'none'}
          >
            {description}
          </Typography>

          {errors &&
            errors.map((message) => (
              <Typography key={message} component="p" variant="p" margin="none">
                {message}
              </Typography>
            ))}
        </Card>

        {backTo ? (
          <LinkButton block size="lg" to={backTo}>
            {t('go-back')}
          </LinkButton>
        ) : (
          <Button block type="button" size="lg" onClick={goBack}>
            {t('go-back')}
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default memo(ErrorCard);
