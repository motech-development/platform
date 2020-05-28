import { TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

export interface IContactDetailsFieldsProps {
  prefix?: string;
}

const ContactDetailsFields: FC<IContactDetailsFieldsProps> = ({
  prefix = null,
}) => {
  const { t } = useTranslation('contact-details-fields');
  const name = (value: string) => {
    if (prefix) {
      return `${prefix}.${value}`;
    }

    return value;
  };

  return (
    <>
      <TextBox name={name('contact.email')} label={t('email')} />

      <TextBox name={name('contact.telephone')} label={t('telephone')} />
    </>
  );
};

export default memo(ContactDetailsFields);
