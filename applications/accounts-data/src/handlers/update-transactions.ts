import { DynamoDBRecord } from 'aws-lambda';
import { Decimal } from 'decimal.js';
import aggregatedDay from '../shared/aggregated-day';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = unmarshallAllRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords.map(
    ({ NewImage, OldImage }) => ({
      Update: {
        ExpressionAttributeNames: {
          '#balance': 'balance',
          '#itemPropertyNew': aggregatedDay(NewImage.date),
          '#itemPropertyOld': aggregatedDay(OldImage.date),
          '#items': 'items',
          '#updatedAt': 'updatedAt',
          '#vat': 'vat',
          '#vatProperty': NewImage.category === 'Sales' ? 'owed' : 'paid',
        },
        ExpressionAttributeValues: {
          ':balance': new Decimal(NewImage.amount)
            .minus(OldImage.amount)
            .toNumber(),
          ':itemPropertyNew': NewImage.amount,
          ':itemPropertyOld': OldImage.amount,
          ':updatedAt': now.toISOString(),
          ':vat': new Decimal(NewImage.vat).minus(OldImage.vat).toNumber(),
        },
        Key: {
          __typename: 'Balance',
          id: NewImage.companyId,
        },
        TableName: tableName,
        UpdateExpression:
          'SET #updatedAt = :updatedAt, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemPropertyNew :itemPropertyNew',
      },
    }),
  );

  return transactionItems;
};

export default updateTransactions;
