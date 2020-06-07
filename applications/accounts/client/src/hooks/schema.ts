import { useTranslation } from 'react-i18next';
import { number, object, string } from 'yup';
import regex from '../regex';

export const useAddress = () => {
  const { t } = useTranslation('schema');

  return object()
    .shape({
      line1: string().required(t('address.line1.required')),
      line2: string(),
      line3: string().required(t('address.line3.required')),
      line4: string(),
      line5: string()
        .matches(regex.address.postcode, t('address.line5.invalid'))
        .required(t('address.line5.required')),
    })
    .required();
};

export const useBank = () => {
  const { t } = useTranslation('schema');

  return object()
    .shape({
      accountNumber: string()
        .matches(regex.bank.accountNumber, t('bank.account-number.invalid'))
        .required(t('bank.account-number.required')),
      sortCode: string()
        .matches(regex.bank.sortCode, t('bank.sort-code.invalid'))
        .required(t('bank.sort-code.required')),
    })
    .required();
};

export const useCompanyDetails = () => {
  const { t } = useTranslation('schema');

  return object()
    .shape({
      companyNumber: string()
        .matches(
          regex.companyNumber,
          t('company-details.company-number.invalid'),
        )
        .required(t('company-details.company-number.required')),
      name: string().required(t('company-details.name.required')),
    })
    .required();
};

export const useContactDetails = () => {
  const { t } = useTranslation('schema');

  return object()
    .shape({
      email: string()
        .email(t('contact-details.email.invalid'))
        .required(t('contact-details.email.required')),
      telephone: string()
        .matches(
          regex.contact.telephone,
          t('contact-details.telephone.invalid'),
        )
        .required(t('contact-details.telephone.required')),
    })
    .required();
};

export const useVatSettings = () => {
  const { t } = useTranslation('schema');

  return object()
    .shape({
      charge: number().required(t('vat-settings.charge.required')),
      pay: number().required(t('vat-settings.pay.required')),
      registration: string().matches(
        regex.vatRegistration,
        t('vat-settings.registration.invalid'),
      ),
      scheme: string()
        .oneOf(['flatRate', 'none', 'standard'])
        .required(t('vat-settings.scheme.required')),
    })
    .required();
};

export const useYearEnd = () => {
  const { t } = useTranslation('schema');

  return object()
    .shape({
      day: number().required(t('year-end.day.required')),
      month: number().required(t('year-end.month.required')),
    })
    .required();
};
