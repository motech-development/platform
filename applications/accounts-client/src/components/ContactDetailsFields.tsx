import { TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

const ContactDetailsFields: FC = () => {
  const { t } = useTranslation('contact-details-fields');

  return (
    <>
      <TextBox name="contact.email" label={t('email')} />

      <TextBox name="contact.telephone" label={t('telephone')} />
    </>
  );
};

export default memo(ContactDetailsFields);
