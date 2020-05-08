import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import aggregatedDay from '../shared/aggregated-day';
import { unmarshallOldRecords } from '../shared/unmarshall-records';

const deleteTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallOldRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords
    .filter(({ OldImage }) => OldImage.status === 'confirmed')
    .map(({ OldImage }) =>
      documentClient
        .update({
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
        })
        .promise(),
    );

  return transactionItems;
};

export default deleteTransactions;
