// TODO: Handle date change
import { DynamoDBRecord } from 'aws-lambda';
import { Decimal } from 'decimal.js';
import aggregatedDay from '../shared/aggregated-day';
import unmarshallRecords from '../shared/unmarshall-records';

const updateTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = unmarshallRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords.map(
    ({ NewImage, OldImage }) => ({
      Update: {
        ExpressionAttributeNames: {
          '#balance': 'balance',
          '#itemProperty': aggregatedDay(NewImage.date),
          '#items': 'items',
          '#updatedAt': 'updatedAt',
          '#vat': 'vat',
          '#vatProperty': NewImage.category === 'Sales' ? 'owed' : 'paid',
        },
        ExpressionAttributeValues: {
          ':balance': new Decimal(NewImage.amount)
            .minus(OldImage.amount)
            .toNumber(),
          ':updatedAt': now.toISOString(),
          ':vat': new Decimal(NewImage.vat).minus(OldImage.vat).toNumber(),
        },
        Key: {
          __typename: 'Balance',
          id: NewImage.companyId,
        },
        TableName: tableName,
        UpdateExpression:
          'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
      },
    }),
  );

  return transactionItems;
};

export default updateTransactions;
