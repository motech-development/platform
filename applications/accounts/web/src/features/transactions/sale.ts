import Decimal from 'decimal.js';
import { z } from 'zod';
import i18n from '../../i18n';

const amountError = () =>
  i18n.t('Enter an amount greater than zero', {
    ns: 'transactions',
  });
const vatError = () =>
  i18n.t('Enter VAT of zero or more', { ns: 'transactions' });

export const confirmedSaleSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, { error: amountError })
    .refine(
      (value) => {
        try {
          return new Decimal(value).greaterThan(0);
        } catch {
          return false;
        }
      },
      {
        error: amountError,
      },
    ),
  attachment: z.string(),
  client: z
    .string()
    .trim()
    .min(1, {
      error: () => i18n.t('Choose an existing client', { ns: 'transactions' }),
    }),
  companyId: z.string().min(1),
  date: z.iso.date(),
  description: z
    .string()
    .trim()
    .min(1, {
      error: () => i18n.t('Enter a description', { ns: 'transactions' }),
    }),
  vat: z
    .string()
    .trim()
    .min(1, { error: vatError })
    .refine(
      (value) => {
        try {
          return new Decimal(value).isPositive() || new Decimal(value).isZero();
        } catch {
          return false;
        }
      },
      {
        error: vatError,
      },
    ),
});

export type ConfirmedSaleFormValues = z.input<typeof confirmedSaleSchema>;

export interface ConfirmedSaleInput {
  amount: number;
  attachment: string;
  category: 'Sales';
  companyId: string;
  date: string;
  description: string;
  id: string;
  name: string;
  refund: false;
  scheduled: false;
  status: 'confirmed';
  vat: number;
}

export function calculateSaleVat(amount: string, vatRate: number): number {
  return new Decimal(amount)
    .times(vatRate)
    .dividedBy(100)
    .toDecimalPlaces(2)
    .toNumber();
}

export function buildConfirmedSale(
  values: ConfirmedSaleFormValues,
): ConfirmedSaleInput {
  const value = confirmedSaleSchema.parse(values);

  return {
    amount: new Decimal(value.amount).toDecimalPlaces(2).toNumber(),
    attachment: value.attachment,
    category: 'Sales',
    companyId: value.companyId,
    date: new Date(`${value.date}T00:00:00.000Z`).toISOString(),
    description: value.description,
    // The add resolver generates the ID; this field is required only because
    // create and update currently share TransactionInput.
    id: '',
    name: value.client,
    refund: false,
    scheduled: false,
    status: 'confirmed',
    vat: new Decimal(value.vat).toDecimalPlaces(2).toNumber(),
  };
}
