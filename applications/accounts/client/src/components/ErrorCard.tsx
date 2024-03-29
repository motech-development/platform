import {
  Button,
  Card,
  Col,
  LinkButton,
  Row,
  Typography,
} from '@motech-development/breeze-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import isProd from '../utils/isProd';

export interface IErrorCardProps {
  backTo?: string;
  description: string;
  errors?: string[];
  title: string;
}

function ErrorCard({ backTo, description, errors, title }: IErrorCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('error-card');
  const goBack = () => {
    navigate(-1);
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
            margin={errors ? isProd('none', 'lg') : 'none'}
          >
            {description}
          </Typography>

          {isProd(
            null,
            errors &&
              errors.map((message) => (
                <Typography
                  key={message}
                  align="center"
                  component="p"
                  variant="p"
                  margin="none"
                >
                  {message}
                </Typography>
              )),
          )}
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
}

export default ErrorCard;
