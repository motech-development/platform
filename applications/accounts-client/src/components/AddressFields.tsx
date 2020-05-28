import { TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

export interface IAddressFieldsProps {
  prefix?: string;
}

const AddressFields: FC<IAddressFieldsProps> = ({ prefix = null }) => {
  const { t } = useTranslation('address-fields');
  const name = (value: string) => {
    if (prefix) {
      return `${prefix}.${value}`;
    }

    return value;
  };

  return (
    <>
      <TextBox name={name('address.line1')} label={t('line1')} />

      <TextBox name={name('address.line2')} label={t('line2')} />

      <TextBox name={name('address.line3')} label={t('line3')} />

      <TextBox name={name('address.line4')} label={t('line4')} />

      <TextBox name={name('address.line5')} label={t('line5')} />
    </>
  );
};

export default memo(AddressFields);
