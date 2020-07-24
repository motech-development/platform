import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorCard from './ErrorCard';
import Page from './Page';

export interface IErrorPageProps {
  namespace: string;
}

const ErrorPage: FC<IErrorPageProps> = ({ namespace }) => {
  const { t } = useTranslation('error-page');
  const translation = (key: string) => t(`${namespace}.${key}`);

  return (
    <Page title={translation('title')}>
      <ErrorCard description={translation('description')} />
    </Page>
  );
};

export default memo(ErrorPage);
