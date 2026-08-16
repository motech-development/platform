import {
  buildTransactionInput,
  calculatePurchaseVat,
  calculateSaleVat,
  editableTransaction,
  transactionSchema,
} from './transaction';

const baseValues = {
  amount: '120',
  attachment: 'company-1/invoice.pdf',
  category: 'Professional fees',
  companyId: 'company-1',
  date: '2026-08-15',
  description: 'Quarterly bookkeeping',
  id: '',
  name: 'Oak & Co Accountants',
  refund: false,
  scheduled: false,
  status: 'confirmed' as const,
  transactionType: 'purchase' as const,
  vat: '20',
};

describe('Transaction accounting input', () => {
  it.each([
    {
      expected: { amount: 120, category: 'Sales', vat: 24 },
      refund: false,
      transactionType: 'sale' as const,
    },
    {
      expected: { amount: -120, category: 'Sales', vat: -24 },
      refund: true,
      transactionType: 'sale' as const,
    },
    {
      expected: { amount: -120, category: 'Professional fees', vat: 20 },
      refund: false,
      transactionType: 'purchase' as const,
    },
    {
      expected: { amount: 120, category: 'Professional fees', vat: -20 },
      refund: true,
      transactionType: 'purchase' as const,
    },
  ])(
    'maps $transactionType refund=$refund with the established signs',
    ({ expected, refund, transactionType }) => {
      expect(
        buildTransactionInput({
          ...baseValues,
          category: transactionType === 'sale' ? '' : baseValues.category,
          refund,
          transactionType,
          vat: transactionType === 'sale' ? '24' : baseValues.vat,
        }),
      ).toMatchObject(expected);
    },
  );

  it('preserves the form time when mapping its calendar date and clears scheduling when confirmed', () => {
    expect(
      buildTransactionInput(
        {
          ...baseValues,
          scheduled: true,
        },
        '2026-08-14T12:13:14.567Z',
      ),
    ).toMatchObject({
      date: '2026-08-15T12:13:14.567Z',
      scheduled: false,
      status: 'confirmed',
    });
  });

  it('preserves scheduling only for a Pending Transaction', () => {
    expect(
      buildTransactionInput(
        {
          ...baseValues,
          scheduled: true,
          status: 'pending',
        },
        '2026-08-15T12:59:59.999Z',
      ),
    ).toMatchObject({
      date: '2026-08-15T13:00:00.000Z',
      scheduled: true,
      status: 'pending',
    });
  });

  it('keeps a new scheduled Transaction in the future across a UTC day boundary', () => {
    expect(
      buildTransactionInput(
        {
          ...baseValues,
          scheduled: true,
          status: 'pending',
        },
        '2026-08-15T23:59:59.999Z',
      ),
    ).toMatchObject({ date: '2026-08-16T00:00:00.000Z' });
  });

  it('uses exact decimal VAT calculations for sale and inclusive purchase rates', () => {
    expect(calculateSaleVat('99.99', 20)).toBe(20);
    expect(calculatePurchaseVat('119.99', 20)).toBe(20);
    expect(calculatePurchaseVat('100', 0)).toBe(0);
  });

  it('restores saved type and refund meaning without changing signed values', () => {
    expect(
      editableTransaction({
        ...buildTransactionInput({
          ...baseValues,
          refund: true,
          transactionType: 'sale',
          vat: '24',
        }),
        id: 'transaction-1',
      }),
    ).toMatchObject({
      amount: '120',
      refund: true,
      transactionType: 'sale',
      vat: '24',
    });
  });

  it('requires a status and purchase category while allowing a sale category to be derived', () => {
    expect(
      transactionSchema.safeParse({
        ...baseValues,
        category: '',
        status: '' as const,
      }).success,
    ).toBe(false);
    expect(
      transactionSchema.safeParse({
        ...baseValues,
        category: '',
        transactionType: 'sale',
      }).success,
    ).toBe(true);
  });
});
