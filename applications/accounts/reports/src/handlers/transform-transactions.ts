import { Handler } from 'aws-lambda';
import { DateTime } from 'luxon';
import { extname, join } from 'path';
import { array, number, object, string } from 'yup';
import slug from '../shared/slug';
import Status from '../shared/status';

const schema = object({
  companyId: string().required(),
  currency: string().required(),
  items: array(
    object({
      amount: number().required(),
      attachment: string().optional(),
      category: string().required(),
      date: string().required(),
      description: string().required(),
      name: string().required(),
      vat: number().required(),
    }).required(),
  ).required(),
  owner: string().required(),
}).required();

interface ITransaction {
  amount: number;
  attachment?: string;
  category: string;
  date: string;
  description: string;
  name: string;
  vat: number;
}

interface ITransactionWithAttachment extends ITransaction {
  attachment: string;
}

const hasAttachment = (
  item: ITransaction,
): item is ITransactionWithAttachment => !!item.attachment;

export interface IEvent {
  companyId: string;
  currency: string;
  items: {
    amount: number;
    attachment?: string;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    status: Status;
    vat: number;
  }[];
  owner: string;
}

export const handler: Handler<IEvent> = async (event) => {
  const result = await schema.validate(event, {
    abortEarly: true,
    stripUnknown: true,
  });
  const sorted = result.items.sort((a, b) => {
    const d1 = DateTime.fromISO(a.date);
    const d2 = DateTime.fromISO(b.date);

    return d1 > d2 ? 1 : -1;
  });

  /* eslint-disable sort-keys */
  const csv = sorted.map(({ amount, category, date, description, name }) => ({
    date: DateTime.fromISO(date).toFormat('dd/LL/yyyy'),
    category,
    name,
    description,
    in:
      amount >= 0
        ? `${result.currency}${amount.toFixed(2)}`
        : `${result.currency}0.00`,
    out:
      amount < 0
        ? `-${result.currency}${Math.abs(amount).toFixed(2)}`
        : `${result.currency}0.00`,
  }));
  /* eslint-enable sort-keys */

  const attachments = sorted
    .filter(hasAttachment)
    .map(({ attachment, date, description, name }) => {
      const isoDate = DateTime.fromISO(date);
      const extension = extname(attachment);

      return {
        key: join(result.owner, attachment),
        path: join(
          'report',
          'assets',
          isoDate.toFormat('yyyy'),
          isoDate.toFormat('MMMM'),
          isoDate.toFormat('dd'),
          `${slug(name)}-${slug(description)}${extension}`,
        ),
      };
    });

  return {
    attachments,
    companyId: result.companyId,
    csv,
    owner: result.owner,
  };
};
