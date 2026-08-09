import { describe, expect, it } from 'vitest';
import {
  companyDetailsSchema,
  companyEnrolmentDefaults,
  exactCompanyNameSchema,
  formatSortCode,
  formatVatRegistration,
  formatVatRegistrationInput,
  settingsSchema,
  sortCompaniesByName,
  vatSettingsSchema,
  yearEndSchema,
} from './company';

const validCompany = {
  address: {
    line1: '1 Example Street',
    line2: '',
    line3: 'London',
    line4: '',
    line5: 'sw1a 1aa',
  },
  bank: { accountNumber: '12345678', sortCode: '12-34-56' },
  companyNumber: '12345678',
  contact: { email: 'owner@example.com', telephone: '020 7946 0958' },
  id: 'company-id',
  name: 'Example Company',
};

describe('company details', () => {
  it('accepts the established company, bank, address, and contact formats', () => {
    expect(companyDetailsSchema.safeParse(validCompany).success).toBe(true);
  });

  it('normalises a postcode to uppercase before mutation', () => {
    expect(companyDetailsSchema.parse(validCompany).address.line5).toBe(
      'SW1A 1AA',
    );
  });

  it('requires the exact case-sensitive company name for deletion', () => {
    const schema = exactCompanyNameSchema('Example Company');

    expect(schema.safeParse('Example Company').success).toBe(true);
    expect(schema.safeParse('example company').success).toBe(false);
  });

  it('formats six sort-code digits using the established grouping', () => {
    expect(formatSortCode('308639')).toBe('30-86-39');
    expect(formatSortCode('30-86-39')).toBe('30-86-39');
  });

  it.each([
    '020 7946 0958',
    '07712 345678',
    '+44 (0)20 7946 0958',
    '0044 20 7946 0958',
    '01144 20 7946 0958',
    '020 7946 0958 ext. 123',
    '020 7946 0958-ext. 1234',
    '+44 (0)20 7946 0958 ext. 1234',
    '020 7946 0958 x123',
    '020 7946 0958 #123',
    '0800 1111',
  ])('accepts the established UK telephone format %s', (telephone) => {
    expect(
      companyDetailsSchema.safeParse({
        ...validCompany,
        contact: { ...validCompany.contact, telephone },
      }).success,
    ).toBe(true);
  });

  it.each([
    '+33 1 23 45 67 89',
    '1234567890',
    '020 7946 invalid',
    '0-7-7-1-2-3-4-5-6-7-8',
    '((((07712345678',
    '0(20)(7946)(0958)',
    '0207 9460 958',
    '020 79460 958',
    '020-79 46-0958',
    '020 7946 0958 - ext. 123',
    '020 7946 0958 ext.  123',
    '020 7946 0958 x 123',
    '020 7946 0958 # 123',
  ])('rejects the non-UK telephone format %s', (telephone) => {
    expect(
      companyDetailsSchema.safeParse({
        ...validCompany,
        contact: { ...validCompany.contact, telephone },
      }).success,
    ).toBe(false);
  });
});

describe('company enrolment and settings', () => {
  it('formats VAT registration digits using the established GB prefix', () => {
    expect(formatVatRegistration('216506516')).toBe('GB216506516');
    expect(formatVatRegistration('gb 216 506 516')).toBe('GB216506516');
    expect(formatVatRegistration('')).toBe('');
  });

  it('limits formatted VAT registration input to the supported length', () => {
    expect(formatVatRegistrationInput('1234567890123')).toBe('GB123456789012');
  });

  it.each(['GGB123456789', 'BG123456789'])(
    'rejects the malformed VAT registration prefix %s',
    (registration) => {
      expect(
        vatSettingsSchema.safeParse({
          charge: 20,
          pay: 20,
          registration,
          scheme: 'standard',
        }).success,
      ).toBe(false);
    },
  );

  it.each(['GGB123456789', 'BG123456789'])(
    'does not normalise the malformed VAT registration prefix %s into a valid value',
    (registration) => {
      expect(
        vatSettingsSchema.safeParse({
          charge: 20,
          pay: 20,
          registration: formatVatRegistration(registration),
          scheme: 'standard',
        }).success,
      ).toBe(false);
    },
  );

  it('starts with established VAT, balance, and current year-end defaults', () => {
    expect(
      companyEnrolmentDefaults(new Date('2026-08-08T10:00:00Z')),
    ).toMatchObject({
      balance: { balance: 0, vat: { owed: 0, paid: 0 } },
      vat: { charge: 20, pay: 20, registration: '', scheme: '' },
      yearEnd: { day: 8, month: 7 },
    });
  });

  it('orders owned companies by name without mutating the query result', () => {
    const companies = [
      { id: 'z', name: 'Zulu Ltd' },
      { id: 'a', name: 'Alpha Ltd' },
    ];

    expect(sortCompaniesByName(companies).map(({ id }) => id)).toEqual([
      'a',
      'z',
    ]);
    expect(companies.map(({ id }) => id)).toEqual(['z', 'a']);
  });

  it('keeps protected categories valid while rejecting empty editable categories', () => {
    const settings = {
      categories: [
        { name: 'Sales', protect: true, vatRate: 20 },
        { name: '', protect: false, vatRate: 20 },
      ],
      id: 'company-id',
      vat: { charge: 20, pay: 20, registration: '', scheme: 'standard' },
      yearEnd: { day: 31, month: 2 },
    };

    expect(settingsSchema.safeParse(settings).success).toBe(false);
    expect(
      settingsSchema.safeParse({
        ...settings,
        categories: [{ name: 'Sales', protect: true, vatRate: 20 }],
      }).success,
    ).toBe(true);
  });

  it.each([
    { day: 29, month: 1 },
    { day: 30, month: 3 },
    { day: 31, month: 0 },
  ])('accepts the valid year-end date $day/$month', (yearEnd) => {
    expect(yearEndSchema.safeParse(yearEnd).success).toBe(true);
  });

  it.each([
    { day: 30, month: 1 },
    { day: 31, month: 3 },
    { day: 31, month: 8 },
  ])('rejects the invalid year-end date $day/$month', (yearEnd) => {
    expect(yearEndSchema.safeParse(yearEnd).success).toBe(false);
  });
});
