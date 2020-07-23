// TODO: This needs work
import { Plugins } from '@capacitor/core';
import { IonButton, isPlatform } from '@ionic/react';
import {
  DocumentScanner,
  DocumentScannerSourceType,
} from '@ionic-native/document-scanner';
import React, { FC, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Page from '../components/Page';

const { Filesystem } = Plugins;

const Scan: FC = () => {
  const [scan, setScan] = useState<string>();
  const { t } = useTranslation('scan');
  const launchScanner = async () => {
    if (isPlatform('capacitor')) {
      const path = await DocumentScanner.scanDoc({
        sourceType: DocumentScannerSourceType.CAMERA,
      });

      const { data } = await Filesystem.readFile({
        path,
      });

      setScan(data);

      await Filesystem.deleteFile({
        path,
      });
    }
  };

  return (
    <Page title={t('title')}>
      <div className="ion-padding">
        <IonButton onClick={launchScanner}>Scan</IonButton>

        {scan && <img src={`data:image/jpeg;base64,${scan}`} alt={scan} />}
      </div>
    </Page>
  );
};

export default memo(Scan);
