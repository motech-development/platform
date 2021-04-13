import { Context } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import ctx from 'aws-lambda-mock-context';
import { advanceTo, clear } from 'jest-date-mock';
import { handler, IEvent } from '../add-report';

describe('add-report', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeAll(() => {
    advanceTo('2021-04-11T19:45:00+00:00');
  });

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    event = {
      companyId: 'COMPANY-ID',
      key: 'PATH/TO/REPORT.zip',
      owner: 'OWNER-ID',
    };
  });

  afterAll(clear);

  it('should throw an error if table is not set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No table set',
    );
  });

  describe('when table is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.TABLE = 'TABLE-NAME';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call batchWrite with the correct params', async () => {
      await handler(event, context, callback);

      expect(DocumentClient.prototype.batchWrite).toHaveBeenCalledWith({
        RequestItems: {
          'TABLE-NAME': [
            {
              PutRequest: {
                Item: {
                  __typename: 'Notification',
                  createdAt: '2021-04-11T19:45:00.000Z',
                  data: 'OWNER-ID:Notification:2021-04-11T19:45:00.000Z',
                  id: 'test-uuid',
                  message: 'REPORT_READY_TO_DOWNLOAD',
                  owner: 'OWNER-ID',
                  read: false,
                },
              },
            },
            {
              PutRequest: {
                Item: {
                  __typename: 'Report',
                  createdAt: '2021-04-11T19:45:00.000Z',
                  data: 'OWNER-ID:COMPANY-ID:2021-04-11T19:45:00.000Z',
                  id: 'test-uuid',
                  key: 'PATH/TO/REPORT.zip',
                  owner: 'OWNER-ID',
                  ttl: 1618256700000,
                },
              },
            },
          ],
        },
      });
    });

    it('should return true when complete', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        complete: true,
      });
    });
  });
});
