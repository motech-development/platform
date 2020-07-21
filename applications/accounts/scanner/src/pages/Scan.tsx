import { DocumentScanner } from '@ionic-native/document-scanner';
import React, { FC, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../components/Page';

const Scan: FC = () => {
  const { t } = useTranslation('scan');
  const launchScanner = async () => {
    await DocumentScanner.scanDoc();
  };

  useEffect(() => {
    (async () => {
      await launchScanner();
    })();
  }, []);

  return (
    <Page title={t('title')}>
      <div />
    </Page>
  );
};

export default memo(Scan);
