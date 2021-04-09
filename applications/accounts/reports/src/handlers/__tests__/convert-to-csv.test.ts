import { createFile } from '@motech-development/s3-file-operations';
import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler, IEvent } from '../convert-to-csv';

jest.mock('@motech-development/s3-file-operations');

describe('convert-to-csv', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    event = {
      companyId: 'COMPANY-ID',
      csv: [
        {
          category: 'Sales',
          date: '08/04/2021',
          description: 'For work',
          in: '£1000.00',
          name: 'Client',
          out: null,
        },
        {
          category: 'Bills',
          date: '09/04/2021',
          description: 'Mobile',
          in: null,
          name: 'EE',
          out: '-£41.11',
        },
        {
          category: 'Bills',
          date: '10/04/2021',
          description: 'Domain',
          in: null,
          name: 'GoDaddy',
          out: '-£2.40',
        },
      ],
      owner: 'OWNER-ID',
    };
  });

  it('should throw an error if no table is set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No bucket set',
    );
  });

  describe('with bucket set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.BUCKET = 'BUCKET-NAME';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should upload the CSV to the correct location', async () => {
      await handler(event, context, callback);

      expect(createFile).toHaveBeenCalledWith(
        'BUCKET-NAME',
        'OWNER-ID/COMPANY-ID/report.csv',
        expect.any(String),
      );
    });
  });
});
