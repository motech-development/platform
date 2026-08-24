import Decimal from 'decimal.js';
import { z } from 'zod';
import i18n from '../../i18n';

const SALES_CATEGORY = 'Sales';

export type TransactionType = 'purchase' | 'sale';

function persistedDecimal(value: string): Decimal {
  return new Decimal(value).toDecimalPlaces(2);
}

function isSafelyRepresentedAsNumber(value: Decimal): boolean {
  const number = value.toNumber();

  return (
    Number.isFinite(number) && new Decimal(number.toString()).equals(value)
  );
}

export function isSaleTransactionCategory(category: string): boolean {
  return category === SALES_CATEGORY;
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

interface TransactionTypePolicy {
  amountSign: -1 | 1;
  calculateVat: (amount: string, vatRate: number) => number;
  category: 'fixed' | 'selected';
  counterparty: 'client' | 'supplier';
  descriptionSuggestions: 'purchases' | 'sales';
  vatRate: 'category' | 'company';
}

const transactionTypePolicies: Record<TransactionType, TransactionTypePolicy> =
  {
    purchase: {
      amountSign: -1,
      calculateVat: calculatePurchaseVat,
      category: 'selected',
      counterparty: 'supplier',
      descriptionSuggestions: 'purchases',
      vatRate: 'category',
    },
    sale: {
      amountSign: 1,
      calculateVat: calculateSaleVat,
      category: 'fixed',
      counterparty: 'client',
      descriptionSuggestions: 'sales',
      vatRate: 'company',
    },
  };

export function transactionTypePolicy(type: TransactionType) {
  return transactionTypePolicies[type];
}

function transactionTypeForCategory(category: string): TransactionType {
  return isSaleTransactionCategory(category) ? 'sale' : 'purchase';
}

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
        const decimal = new Decimal(value);

        return (
          decimal.isFinite() &&
          decimal.greaterThanOrEqualTo(0) &&
          isSafelyRepresentedAsNumber(decimal.toDecimalPlaces(2))
        );
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
            const decimal = persistedDecimal(value);

            return (
              decimal.isFinite() &&
              decimal.greaterThan(0) &&
              isSafelyRepresentedAsNumber(decimal)
            );
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
    category: z.string().trim(),
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
    transactionType: z.enum(['', 'purchase', 'sale']).refine(Boolean, {
      error: () => i18n.t('Choose a transaction type', { ns: 'transactions' }),
    }),
    vat: nonNegativeDecimal,
  })
  .superRefine((value, context) => {
    const policy = value.transactionType
      ? transactionTypePolicy(value.transactionType)
      : undefined;

    if (
      policy?.category === 'selected' &&
      (!value.category.trim() || isSaleTransactionCategory(value.category))
    ) {
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

type EditableTransaction = Omit<TransactionInput, 'refund' | 'scheduled'> & {
  readonly refund?: boolean | null;
  readonly scheduled?: boolean | null;
};

export function buildTransactionInput(
  values: TransactionFormValues,
): TransactionInput {
  const value = transactionSchema.parse(values);
  const amount = persistedDecimal(value.amount);
  const vat = persistedDecimal(value.vat);

  if (!value.transactionType) {
    throw new TypeError('Validated Transaction type is missing');
  }

  const policy = transactionTypePolicy(value.transactionType);
  let signedAmount = amount.times(policy.amountSign);

  if (value.refund) {
    signedAmount = signedAmount.negated();
  }

  const scheduled = value.status === 'pending' && value.scheduled;

  return {
    amount: signedAmount.toNumber(),
    attachment: value.attachment,
    category: policy.category === 'fixed' ? SALES_CATEGORY : value.category,
    companyId: value.companyId,
    date: `${value.date}T00:00:00.000Z`,
    description: value.description,
    id: value.id,
    name: value.name,
    refund: value.refund,
    scheduled,
    status: value.status,
    vat: (value.refund ? vat.negated() : vat).toNumber(),
  };
}

export function editableTransaction(
  transaction: EditableTransaction,
): TransactionFormValues {
  const transactionType = transactionTypeForCategory(transaction.category);
  const policy = transactionTypePolicy(transactionType);

  return {
    amount: new Decimal(transaction.amount).abs().toString(),
    attachment: transaction.attachment,
    category: policy.category === 'fixed' ? '' : transaction.category,
    companyId: transaction.companyId,
    date: transaction.date.substring(0, 10),
    description: transaction.description,
    id: transaction.id,
    name: transaction.name,
    refund: transaction.refund ?? false,
    scheduled:
      transaction.status === 'pending' && (transaction.scheduled ?? false),
    status: transaction.status,
    transactionType,
    vat: new Decimal(transaction.vat).abs().toString(),
  };
}
