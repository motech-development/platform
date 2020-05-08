import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import aggregatedDay from '../shared/aggregated-day';
import { unmarshallNewRecords } from '../shared/unmarshall-records';

const insertTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallNewRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords
    .filter(({ NewImage }) => NewImage.status === 'confirmed')
    .map(({ NewImage }) =>
      documentClient
        .update({
          ExpressionAttributeNames: {
            '#balance': 'balance',
            '#itemProperty': aggregatedDay(NewImage.date),
            '#items': 'items',
            '#updatedAt': 'updatedAt',
            '#vat': 'vat',
            '#vatProperty': NewImage.category === 'Sales' ? 'owed' : 'paid',
          },
          ExpressionAttributeValues: {
            ':balance': NewImage.amount,
            ':updatedAt': now.toISOString(),
            ':vat': NewImage.vat,
          },
          Key: {
            __typename: 'Balance',
            id: NewImage.companyId,
          },
          TableName: tableName,
          UpdateExpression:
            'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance',
        })
        .promise(),
    );

  return transactionItems;
};

export default insertTransactions;
