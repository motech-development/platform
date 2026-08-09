import { z } from 'zod';

const postcodePattern =
  /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}\d[ABD-HJLN-UW-Z]{2}|GIR 0AA)$/;
const vatRegistrationPattern = /^(?:GB)?(?:[1-9]\d{8}|[1-9]\d{11})$/;
const telephoneExtensionPattern = /[\s-]*(?:x|ext\.?|#)\s*\d+$/i;
const internationalTelephonePrefixes = [
  /^\+44[\s-]?(?:\(0\)[\s-]?)?/,
  /^0044[\s-]?(?:\(0\)[\s-]?)?/,
  /^01144[\s-]?(?:\(0\)[\s-]?)?/,
  /^\(\+44\)[\s-]?(?:\(0\)[\s-]?)?/,
  /^\(0044\)[\s-]?(?:\(0\)[\s-]?)?/,
  /^\(01144\)[\s-]?(?:\(0\)[\s-]?)?/,
] as const;
const standardUkTelephonePatterns = [
  /^0\d{2}[\s-]?\d{4}[\s-]?\d{4}$/,
  /^0\d{3}[\s-]?\d{3}[\s-]?\d{3,4}$/,
  /^0\d{4}[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})$/,
  /^0\d{5}[\s-]?\d{4,5}$/,
] as const;
const specialUkTelephonePatterns = [
  /^0800[\s-]?11[\s-]?11$/,
  /^0845[\s-]?46[\s-]?4\d$/,
] as const;

const required = (message: string) => z.string().trim().min(1, message);

function nationalTelephone(value: string): string | undefined {
  let telephone = value;
  const internationalPrefix = internationalTelephonePrefixes.find((prefix) =>
    prefix.test(telephone),
  );

  if (internationalPrefix) {
    telephone = `0${telephone.replace(internationalPrefix, '')}`;
  }

  const parenthesisedNationalArea = /^\((0\d{2,5})\)(.*)$/.exec(telephone);
  const parenthesisedArea = /^0\((\d{2,5})\)(.*)$/.exec(telephone);

  if (parenthesisedNationalArea) {
    telephone = `${parenthesisedNationalArea[1]}${parenthesisedNationalArea[2]}`;
  } else if (parenthesisedArea) {
    telephone = `0${parenthesisedArea[1]}${parenthesisedArea[2]}`;
  }

  return /[()]/.test(telephone) ? undefined : telephone;
}

function isValidUkTelephone(value: string) {
  const trimmed = value.trim();
  const extension = telephoneExtensionPattern.exec(trimmed);
  const telephone = trimmed.slice(0, extension?.index ?? trimmed.length).trim();
  const national = nationalTelephone(telephone);

  return Boolean(
    national &&
      [...standardUkTelephonePatterns, ...specialUkTelephonePatterns].some(
        (pattern) => pattern.test(national),
      ),
  );
}

export const companyDetailsSchema = z.object({
  address: z.object({
    line1: required('Address line 1 is required'),
    line2: z.string(),
    line3: required('Town or city is required'),
    line4: z.string(),
    line5: z
      .string()
      .transform((value) => value.toUpperCase())
      .pipe(
        required('Postcode is required').regex(
          postcodePattern,
          'Enter a valid UK postcode',
        ),
      ),
  }),
  bank: z.object({
    accountNumber: required('Account number is required').regex(
      /^\d{8}$/,
      'Account number must contain 8 digits',
    ),
    sortCode: required('Sort code is required').regex(
      /^\d{2}-\d{2}-\d{2}$/,
      'Sort code must use the format 00-00-00',
    ),
  }),
  companyNumber: required('Company number is required').regex(
    /^\d{8}$/,
    'Company number must contain 8 digits',
  ),
  contact: z.object({
    email: required('Email address is required').pipe(
      z.email('Enter a valid email address'),
    ),
    telephone: required('Telephone number is required').refine(
      isValidUkTelephone,
      'Enter a valid UK telephone number',
    ),
  }),
  id: z.string(),
  name: required('Company name is required'),
});

export type CompanyDetails = z.output<typeof companyDetailsSchema>;
export type NormalisedCompanyDetails = z.output<typeof companyDetailsSchema>;

export const vatSettingsSchema = z.object({
  charge: z.number({ error: 'Charge rate is required' }),
  pay: z.number({ error: 'Pay rate is required' }),
  registration: z
    .string()
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
      name: required('Category name is required'),
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

export function sortCompaniesByName<T extends { name: string }>(
  companies: readonly T[],
): T[] {
  return [...companies].sort((left, right) =>
    left.name.localeCompare(right.name, 'en-GB', { sensitivity: 'base' }),
  );
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

export function exactCompanyNameSchema(companyName: string) {
  return z.string().refine((value) => value === companyName, {
    message: `Enter ${companyName} exactly`,
  });
}
