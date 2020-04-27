import { DynamoDBRecord } from 'aws-lambda';
import aggregatedDay from '../shared/aggregated-day';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const deleteTransactions = (tableName: string, records: DynamoDBRecord[]) => {
  const unmarshalledRecords = unmarshallOldRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords.map(({ OldImage }) => ({
    Update: {
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#itemProperty': aggregatedDay(OldImage.date),
        '#items': 'items',
        '#updatedAt': 'updatedAt',
        '#vat': 'vat',
        '#vatProperty': OldImage.category === 'Sales' ? 'owed' : 'paid',
      },
      ExpressionAttributeValues: {
        ':balance': OldImage.amount,
        ':updatedAt': now.toISOString(),
        ':vat': OldImage.vat,
      },
      Key: {
        __typename: 'Balance',
        id: OldImage.companyId,
      },
      TableName: tableName,
      UpdateExpression:
        'SET #updatedAt = :updatedAt, #balance = #balance - :balance, #vat.#vatProperty = #vat.#vatProperty - :vat, #items.#itemProperty = #items.#itemProperty - :balance',
    },
  }));

  return transactionItems;
};

export default deleteTransactions;
