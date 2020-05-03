// TODO: Update balance when going from pending to confirmed and back
import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Decimal } from 'decimal.js';
import aggregatedDay from '../shared/aggregated-day';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallAllRecords(records, 'Transaction');
  const now = new Date();

  const transactionItems = unmarshalledRecords.map(({ NewImage, OldImage }) => {
    const isSameDate =
      aggregatedDay(NewImage.date) === aggregatedDay(OldImage.date);
    const UpdateExpression = isSameDate
      ? 'SET #updatedAt = :updatedAt ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemProperty :balance'
      : 'SET #updatedAt = :updatedAt, #items.#itemPropertyOld = #items.#itemPropertyOld - :itemPropertyOld ADD #balance :balance, #vat.#vatProperty :vat, #items.#itemPropertyNew :itemPropertyNew';

    return documentClient
      .update({
        ExpressionAttributeNames: {
          '#balance': 'balance',
          ...(isSameDate
            ? {
                '#itemProperty': aggregatedDay(NewImage.date),
              }
            : {
                '#itemPropertyNew': aggregatedDay(NewImage.date),
                '#itemPropertyOld': aggregatedDay(OldImage.date),
              }),
          '#items': 'items',
          '#updatedAt': 'updatedAt',
          '#vat': 'vat',
          '#vatProperty': NewImage.category === 'Sales' ? 'owed' : 'paid',
        },
        ExpressionAttributeValues: {
          ':balance': new Decimal(NewImage.amount)
            .minus(OldImage.amount)
            .toNumber(),
          ...(isSameDate
            ? {}
            : {
                ':itemPropertyNew': NewImage.amount,
                ':itemPropertyOld': OldImage.amount,
              }),
          ':updatedAt': now.toISOString(),
          ':vat': new Decimal(NewImage.vat).minus(OldImage.vat).toNumber(),
        },
        Key: {
          __typename: 'Balance',
          id: NewImage.companyId,
        },
        TableName: tableName,
        UpdateExpression,
      })
      .promise();
  });

  return transactionItems;
};

export default updateTransactions;
