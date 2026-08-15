import Decimal from 'decimal.js';
import { z } from 'zod';
import i18n from '../../i18n';

const requiredText = (message: string) =>
  z
    .string()
    .trim()
    .min(1, {
      error: () => i18n.t(message, { ns: 'transactions' }),
    });
const nonNegativeDecimal = z
  .string()
  .trim()
  .min(1, {
    error: () => i18n.t('Enter VAT of zero or more', { ns: 'transactions' }),
  })
  .refine(
    (value) => {
      try {
        return new Decimal(value).greaterThanOrEqualTo(0);
      } catch {
        return false;
      }
    },
    {
      error: () => i18n.t('Enter VAT of zero or more', { ns: 'transactions' }),
    },
  );

export const transactionSchema = z
  .object({
    amount: z
      .string()
      .trim()
      .min(1, {
        error: () =>
          i18n.t('Enter an amount greater than zero', { ns: 'transactions' }),
      })
      .refine(
        (value) => {
          try {
            return new Decimal(value).greaterThan(0);
          } catch {
            return false;
          }
        },
        {
          error: () =>
            i18n.t('Enter an amount greater than zero', {
              ns: 'transactions',
            }),
        },
      ),
    attachment: z.string(),
    category: z.string(),
    companyId: z.string().min(1),
    date: z.iso.date(),
    description: requiredText('Enter a description'),
    id: z.string(),
    name: requiredText('Enter a supplier or choose a client'),
    refund: z.boolean(),
    scheduled: z.boolean(),
    status: z
      .string()
      .refine((value) => value === 'confirmed' || value === 'pending', {
        error: () => i18n.t('Choose a status', { ns: 'transactions' }),
      })
      .transform((value) => value),
    transactionType: z.enum(['purchase', 'sale']),
    vat: nonNegativeDecimal,
  })
  .superRefine((value, context) => {
    if (value.transactionType === 'purchase' && !value.category.trim()) {
      context.addIssue({
        code: 'custom',
        message: i18n.t('Choose a category', { ns: 'transactions' }),
        path: ['category'],
      });
    }
  });

export type TransactionFormValues = z.input<typeof transactionSchema>;

export interface TransactionInput {
  amount: number;
  attachment: string;
  category: string;
  companyId: string;
  date: string;
  description: string;
  id: string;
  name: string;
  refund: boolean;
  scheduled: boolean;
  status: 'confirmed' | 'pending';
  vat: number;
}

export function calculateSaleVat(amount: string, vatRate: number): number {
  return new Decimal(amount)
    .times(vatRate)
    .dividedBy(100)
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculatePurchaseVat(amount: string, vatRate: number): number {
  const total = new Decimal(amount);
  const divisor = new Decimal(vatRate).dividedBy(100).plus(1);

  return total.minus(total.dividedBy(divisor)).toDecimalPlaces(2).toNumber();
}

export function buildTransactionInput(
  values: TransactionFormValues,
): TransactionInput {
  const value = transactionSchema.parse(values);
  const amount = new Decimal(value.amount).toDecimalPlaces(2);
  const vat = new Decimal(value.vat).toDecimalPlaces(2);
  const purchase = value.transactionType === 'purchase';
  let signedAmount = purchase ? amount.negated() : amount;

  if (value.refund) {
    signedAmount = signedAmount.negated();
  }

  return {
    amount: signedAmount.toNumber(),
    attachment: value.attachment,
    category: purchase ? value.category : 'Sales',
    companyId: value.companyId,
    date: new Date(`${value.date}T00:00:00.000Z`).toISOString(),
    description: value.description,
    id: value.id,
    name: value.name,
    refund: value.refund,
    scheduled: value.status === 'pending' && value.scheduled,
    status: value.status,
    vat: (value.refund ? vat.negated() : vat).toNumber(),
  };
}

export function editableTransaction(
  transaction: TransactionInput,
): TransactionFormValues {
  return {
    amount: new Decimal(transaction.amount).abs().toString(),
    attachment: transaction.attachment,
    category: transaction.category === 'Sales' ? '' : transaction.category,
    companyId: transaction.companyId,
    date: transaction.date.substring(0, 10),
    description: transaction.description,
    id: transaction.id,
    name: transaction.name,
    refund: transaction.refund,
    scheduled: transaction.status === 'pending' && transaction.scheduled,
    status: transaction.status,
    transactionType: transaction.category === 'Sales' ? 'sale' : 'purchase',
    vat: new Decimal(transaction.vat).abs().toString(),
  };
}
