import { TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

const AddressFields: FC = () => {
  const { t } = useTranslation('address-fields');

  return (
    <>
      <TextBox name="address.line1" label={t('line1')} />

      <TextBox name="address.line2" label={t('line2')} />

      <TextBox name="address.line3" label={t('line3')} />

      <TextBox name="address.line4" label={t('line4')} />

      <TextBox name="address.line5" label={t('line5')} />
    </>
  );
};

export default memo(AddressFields);
