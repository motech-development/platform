import { describe, expect, it } from 'vitest';
import {
  companyDetailsSchema,
  companyEnrolmentDefaults,
  exactCompanyNameSchema,
  formatSortCode,
  normaliseCompanyDetails,
  settingsSchema,
  sortCompaniesByName,
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
    expect(normaliseCompanyDetails(validCompany).address.line5).toBe(
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
});

describe('company enrolment and settings', () => {
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
});
