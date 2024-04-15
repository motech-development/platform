import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import ErrorCard from '../components/ErrorCard';

function NotFound() {
  const { t } = useTranslation('not-found');

  return (
    <Container>
      <ErrorCard title={t('not-found')} description={t('description')} />
    </Container>
  );
}

export default NotFound;
