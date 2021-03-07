import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from '../components/ErrorCard';
import Container from '../components/Container';

const NotFound: FC = () => {
  const { t } = useTranslation('not-found');

  return (
    <Container>
      <ErrorCard title={t('not-found')} description={t('description')} />
    </Container>
  );
};

export default memo(NotFound);
