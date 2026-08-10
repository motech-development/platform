import { z } from 'zod';
import {
  contactDetailsSchema,
  postalAddressSchema,
  requiredTextSchema,
} from '../entity-details';

const vatRegistrationPattern = /^(?:GB)?(?:[1-9]\d{8}|[1-9]\d{11})$/;
export const vatRegistrationMaxLength = 14;

export const companyDetailsSchema = z.object({
  address: postalAddressSchema,
  bank: z.object({
    accountNumber: requiredTextSchema('Account number is required').regex(
      /^\d{8}$/,
      'Account number must contain 8 digits',
    ),
    sortCode: requiredTextSchema('Sort code is required').regex(
      /^\d{2}-\d{2}-\d{2}$/,
      'Sort code must use the format 00-00-00',
    ),
  }),
  companyNumber: requiredTextSchema('Company number is required').regex(
    /^\d{8}$/,
    'Company number must contain 8 digits',
  ),
  contact: contactDetailsSchema,
  id: z.string(),
  name: requiredTextSchema('Company name is required'),
});
export type CompanyDetails = z.output<typeof companyDetailsSchema>;
export type NormalisedCompanyDetails = z.output<typeof companyDetailsSchema>;

export const vatSettingsSchema = z.object({
  charge: z.number({ error: 'Charge rate is required' }),
  pay: z.number({ error: 'Pay rate is required' }),
  registration: z
    .string()
    .max(vatRegistrationMaxLength, 'Enter a valid VAT registration number')
    .refine(
      (value) => value === '' || vatRegistrationPattern.test(value),
      'Enter a valid VAT registration number',
    ),
  scheme: z.enum(['none', 'standard', 'flatRate'], {
    error: 'Select a VAT scheme',
  }),
});

const yearEndDayMessage = 'Enter a valid day for the selected month';
const yearEndMonthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function maximumYearEndDay(month: number): number {
  return yearEndMonthDays[month] ?? 31;
}

export const yearEndSchema = z
  .object({
    day: z
      .number({ error: yearEndDayMessage })
      .int({ error: yearEndDayMessage })
      .min(1, { error: yearEndDayMessage })
      .max(31, { error: yearEndDayMessage }),
    month: z.number().int().min(0).max(11),
  })
  .superRefine(({ day, month }, context) => {
    if (day > maximumYearEndDay(month)) {
      context.addIssue({
        code: 'custom',
        message: yearEndDayMessage,
        path: ['day'],
      });
    }
  });

export const settingsSchema = z.object({
  categories: z.array(
    z.object({
      name: requiredTextSchema('Category name is required'),
      protect: z.boolean(),
      vatRate: z.number({ error: 'VAT rate is required' }),
    }),
  ),
  id: z.string().min(1),
  vat: vatSettingsSchema,
  yearEnd: yearEndSchema,
});

export type CompanySettings = z.output<typeof settingsSchema>;

export const companyEnrolmentSchema = z.object({
  balance: z.object({
    balance: z.number({ error: 'Opening balance is required' }),
    vat: z.object({
      owed: z.number({ error: 'VAT owed is required' }),
      paid: z.number({ error: 'VAT paid is required' }),
    }),
  }),
  company: companyDetailsSchema,
  vat: vatSettingsSchema,
  yearEnd: yearEndSchema,
});

export type CompanyEnrolment = z.output<typeof companyEnrolmentSchema>;

export type CompanyEnrolmentDraft = Omit<CompanyEnrolment, 'vat'> & {
  vat: Omit<CompanyEnrolment['vat'], 'scheme'> & {
    scheme: CompanyEnrolment['vat']['scheme'] | '';
  };
};

export function companyEnrolmentDefaults(
  date = new Date(),
): CompanyEnrolmentDraft {
  return {
    balance: { balance: 0, vat: { owed: 0, paid: 0 } },
    company: {
      address: { line1: '', line2: '', line3: '', line4: '', line5: '' },
      bank: { accountNumber: '', sortCode: '' },
      companyNumber: '',
      contact: { email: '', telephone: '' },
      id: '',
      name: '',
    },
    vat: { charge: 20, pay: 20, registration: '', scheme: '' },
    yearEnd: { day: date.getDate(), month: date.getMonth() },
  };
}

export function formatSortCode(value: string): string {
  return value
    .replace(/\D/gu, '')
    .slice(0, 6)
    .replace(/^(\d{2})(\d)/u, '$1-$2')
    .replace(/^(\d{2}-\d{2})(\d)/u, '$1-$2');
}

export function formatVatRegistration(value: string): string {
  const compact = value.toUpperCase().replace(/\s/gu, '');

  if (!compact) return '';
  if (/^\d+$/u.test(compact)) return `GB${compact}`;

  return compact;
}

export function formatVatRegistrationInput(value: string): string {
  return formatVatRegistration(value).slice(0, vatRegistrationMaxLength);
}
