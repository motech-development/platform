import { DynamoDBRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TransactionStatus, update } from '../shared/transaction';
import { unmarshallAllRecords } from '../shared/unmarshall-records';

const updateTransactions = (
  documentClient: DocumentClient,
  tableName: string,
  records: DynamoDBRecord[],
) => {
  const unmarshalledRecords = unmarshallAllRecords(records, 'Transaction');
  const transactionItems = unmarshalledRecords
    .filter(
      ({ NewImage, OldImage }) =>
        !(
          NewImage.status === TransactionStatus.Pending &&
          OldImage.status === TransactionStatus.Pending
        ),
    )
    .map(({ NewImage, OldImage }) =>
      update(documentClient, tableName, OldImage, NewImage),
    );

  return transactionItems;
};

export default updateTransactions;
