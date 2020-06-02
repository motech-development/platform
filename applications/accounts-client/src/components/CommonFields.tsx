import { TextBox } from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

const name = (value: string, prefix?: string) => {
  if (prefix) {
    return `${prefix}.${value}`;
  }

  return value;
};

export interface IAddressFieldsProps {
  prefix?: string;
}

export const AddressFields: FC<IAddressFieldsProps> = memo(({ prefix }) => {
  const { t } = useTranslation('common-fields');
  const postcode = name('address.line5', prefix);

  return (
    <>
      <TextBox
        name={name('address.line1', prefix)}
        label={t('address.line1')}
      />

      <TextBox
        name={name('address.line2', prefix)}
        label={t('address.line2')}
      />

      <TextBox
        name={name('address.line3', prefix)}
        label={t('address.line3')}
      />

      <TextBox
        name={name('address.line4', prefix)}
        label={t('address.line4')}
      />

      <TextBox
        name={postcode}
        label={t('address.line5')}
        onChange={(e, form) => {
          const transformed = e.target.value.toUpperCase();

          form.setFieldValue(postcode, transformed);
        }}
      />
    </>
  );
});

export interface IBankFieldsProps {
  prefix?: string;
}

export const BankFields: FC<IBankFieldsProps> = memo(({ prefix }) => {
  const { t } = useTranslation('common-fields');

  return (
    <>
      <TextBox
        name={name('bank.accountNumber', prefix)}
        label={t('bank.account-number')}
        format="########"
      />

      <TextBox
        name={name('bank.sortCode', prefix)}
        label={t('bank.sort-code')}
        format="##-##-##"
      />
    </>
  );
});

export interface ICompanyDetailsFieldsProps {
  prefix?: string;
}

export const CompanyDetailsFields: FC<ICompanyDetailsFieldsProps> = memo(
  ({ prefix }) => {
    const { t } = useTranslation('common-fields');

    return (
      <>
        <TextBox
          name={name('name', prefix)}
          label={t('company-details.name')}
        />

        <TextBox
          name={name('companyNumber', prefix)}
          label={t('company-details.company-number')}
          format="########"
        />

        <TextBox
          name={name('vatRegistration', prefix)}
          label={t('company-details.vat-registration')}
          format="GB#########"
        />
      </>
    );
  },
);

export interface IContactDetailsFieldsProps {
  prefix?: string;
}

export const ContactDetailsFields: FC<IContactDetailsFieldsProps> = memo(
  ({ prefix }) => {
    const { t } = useTranslation('common-fields');

    return (
      <>
        <TextBox
          name={name('contact.email', prefix)}
          label={t('contact-details.email')}
        />

        <TextBox
          name={name('contact.telephone', prefix)}
          label={t('contact-details.telephone')}
        />
      </>
    );
  },
);

export interface IVatSettingsFieldsProps {
  prefix?: string;
}

export const VatSettingsFields: FC<IVatSettingsFieldsProps> = ({ prefix }) => {
  const { t } = useTranslation('common-fields');

  return (
    <>
      <TextBox
        suffix="%"
        name={name('charge', prefix)}
        label={t('vat-settings.charge')}
      />

      <TextBox
        suffix="%"
        name={name('pay', prefix)}
        label={t('vat-settings.pay')}
      />
    </>
  );
};
