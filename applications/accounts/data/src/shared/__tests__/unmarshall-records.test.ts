import { DynamoDBRecord } from 'aws-lambda';
import {
  unmarshallAllRecords,
  unmarshallNewRecords,
  unmarshallOldRecords,
} from '../unmarshall-records';

describe('unmarshall-records', () => {
  let records: DynamoDBRecord[];
  let typename: string;

  beforeEach(() => {
    typename = 'Example';

    records = [
      {
        awsRegion: 'eu-west-1',
      },
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          NewImage: {
            __typename: {
              S: 'Example',
            },
            amount: {
              N: '100.25',
            },
            category: {
              S: 'Expenses',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            vat: {
              N: '1.2',
            },
          },
          OldImage: {
            __typename: {
              S: 'Example',
            },
            amount: {
              N: '200.5',
            },
            category: {
              S: 'Expenses',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            vat: {
              N: '2.4',
            },
          },
        },
      },
      {
        awsRegion: 'eu-west-1',
        dynamodb: {
          NewImage: {
            __typename: {
              S: 'Other',
            },
            amount: {
              N: '100.25',
            },
            category: {
              S: 'Expenses',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            vat: {
              N: '1.2',
            },
          },
          OldImage: {
            __typename: {
              S: 'Other',
            },
            amount: {
              N: '200.5',
            },
            category: {
              S: 'Expenses',
            },
            date: {
              S: '2019-12-15T00:00:00.000Z',
            },
            vat: {
              N: '2.4',
            },
          },
        },
      },
    ];
  });

  describe('unmarshallAllRecords', () => {
    it('should return the correct data', () => {
      expect(unmarshallAllRecords(records, typename)).toEqual([
        {
          NewImage: {
            __typename: 'Example',
            amount: 100.25,
            category: 'Expenses',
            date: '2019-12-15T00:00:00.000Z',
            vat: 1.2,
          },
          OldImage: {
            __typename: 'Example',
            amount: 200.5,
            category: 'Expenses',
            date: '2019-12-15T00:00:00.000Z',
            vat: 2.4,
          },
        },
      ]);
    });
  });

  describe('unmarshallNewRecords', () => {
    it('should return the correct data', () => {
      expect(unmarshallNewRecords(records, typename)).toEqual([
        {
          NewImage: {
            __typename: 'Example',
            amount: 100.25,
            category: 'Expenses',
            date: '2019-12-15T00:00:00.000Z',
            vat: 1.2,
          },
        },
      ]);
    });
  });

  describe('unmarshallOldRecords', () => {
    it('should return the correct data', () => {
      expect(unmarshallOldRecords(records, typename)).toEqual([
        {
          OldImage: {
            __typename: 'Example',
            amount: 200.5,
            category: 'Expenses',
            date: '2019-12-15T00:00:00.000Z',
            vat: 2.4,
          },
        },
      ]);
    });
  });
});
