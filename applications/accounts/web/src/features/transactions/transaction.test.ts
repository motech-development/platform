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

  it('reserves the Sales category for sale transactions', () => {
    expect(() =>
      buildTransactionInput({ ...baseValues, category: 'Sales' }),
    ).toThrow();
  });

  it('rejects amounts that round to zero at the persisted precision', () => {
    expect(() =>
      buildTransactionInput({ ...baseValues, amount: '0.001' }),
    ).toThrow();
    expect(
      buildTransactionInput({ ...baseValues, amount: '0.009' }).amount,
    ).toBe(-0.01);
  });

  it('preserves the captured form time for a new scheduled Pending Transaction', () => {
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
      date: '2026-08-15T12:59:59.999Z',
      scheduled: true,
      status: 'pending',
    });
  });

  it('combines a scheduled Transaction calendar date with the captured form time', () => {
    expect(
      buildTransactionInput(
        {
          ...baseValues,
          date: '2026-08-16',
          scheduled: true,
          status: 'pending',
        },
        '2026-08-15T23:59:59.999Z',
      ),
    ).toMatchObject({ date: '2026-08-16T23:59:59.999Z' });
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

    expect(
      editableTransaction({
        ...buildTransactionInput(baseValues),
        id: 'transaction-2',
      }),
    ).toMatchObject({
      category: 'Professional fees',
      scheduled: false,
      transactionType: 'purchase',
    });

    expect(
      editableTransaction({
        ...buildTransactionInput({
          ...baseValues,
          scheduled: false,
          status: 'pending',
        }),
        id: 'transaction-3',
      }).scheduled,
    ).toBe(false);
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
