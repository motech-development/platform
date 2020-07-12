import { Context, SQSEvent } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { handler } from '../clear-attachments';

describe('clear-attachments', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: SQSEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

    DocumentClient.prototype.query = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValueOnce({
        Items: [
          {
            __typename: 'Something',
            id: 'id-1',
          },
        ],
      }),
    });

    event = ({
      Records: [
        {
          messageAttributes: {
            key: {
              stringValue: 'path/to/file-1.pdf',
            },
            metadata: {
              stringValue: JSON.stringify({
                id: 'id-1',
                typename: 'Something',
              }),
            },
            source: {
              stringValue: 'upload-bucket',
            },
          },
        },
        {
          messageAttributes: {
            key: {
              stringValue: 'path/to/file-2.pdf',
            },
            metadata: {
              stringValue: JSON.stringify({
                id: 'id-2',
                typename: 'Something',
              }),
            },
            source: {
              stringValue: 'another-bucket',
            },
          },
        },
        {
          messageAttributes: {
            key: {
              stringValue: 'path/to/file-3.pdf',
            },
            source: {
              stringValue: 'another-bucket',
            },
          },
        },
      ],
    } as unknown) as SQSEvent;
  });

  it('should throw an error if no table is set', async () => {
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

      process.env.TABLE = 'app-table';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if no bucket is set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No source bucket set',
      );
    });
  });

  describe('when table and bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.BUCKET = 'upload-bucket';
      process.env.TABLE = 'app-table';
    });

    afterEach(() => {
      process.env = env;
    });

    describe('when there are no errors thrown by DynamoDB', () => {
      it('should update the correct number of records', async () => {
        await handler(event, context, callback);

        expect(DocumentClient.prototype.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('when DyanmoDB throws an error', () => {
      beforeEach(() => {
        (DocumentClient.prototype.update as jest.Mock).mockReturnValue({
          promise: jest
            .fn()
            .mockRejectedValue(new Error('Something has gone wrong')),
        });

        jest.spyOn(console, 'error').mockReturnValue();
      });

      it('should swallow the error', async () => {
        await handler(event, context, callback);

        expect(console.error).toHaveBeenCalledWith('Something has gone wrong');
      });
    });
  });
});
