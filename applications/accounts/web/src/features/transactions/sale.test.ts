import {
  buildConfirmedSale,
  calculateSaleVat,
  confirmedSaleSchema,
} from './sale';

describe('confirmed sale input', () => {
  it('calculates VAT with decimal arithmetic', () => {
    expect(calculateSaleVat('99.99', 20)).toBe(20);
  });

  it('uses the server-generated ID contract for a new transaction', () => {
    expect(
      buildConfirmedSale({
        amount: '99.99',
        attachment: 'company-1/upload-1.pdf',
        client: 'Acme Ltd',
        companyId: 'company-1',
        date: '2026-07-27',
        description: 'Consulting',
        vat: '17.50',
      }),
    ).toEqual({
      amount: 99.99,
      attachment: 'company-1/upload-1.pdf',
      category: 'Sales',
      companyId: 'company-1',
      date: '2026-07-27T00:00:00.000Z',
      description: 'Consulting',
      id: '',
      name: 'Acme Ltd',
      refund: false,
      scheduled: false,
      status: 'confirmed',
      vat: 17.5,
    });
  });

  it.each(['0', '0.00'])('rejects a zero sale amount: %s', (amount) => {
    expect(
      confirmedSaleSchema.safeParse({
        amount,
        attachment: '',
        client: 'Acme Ltd',
        companyId: 'company-1',
        date: '2026-07-27',
        description: 'Consulting',
        vat: '0',
      }).success,
    ).toBe(false);
  });

  it('resolves validation messages when validation runs', () => {
    const result = confirmedSaleSchema.safeParse({
      amount: '',
      attachment: '',
      client: '',
      companyId: 'company-1',
      date: '2026-07-27',
      description: '',
      vat: '',
    });

    if (result.success) {
      throw new Error('Expected the empty sale draft to be invalid');
    }

    expect(result.error.issues.map(({ message }) => message)).toEqual(
      expect.arrayContaining([
        'Enter an amount greater than zero',
        'Choose an existing client',
        'Enter a description',
        'Enter VAT of zero or more',
      ]),
    );
  });
});
