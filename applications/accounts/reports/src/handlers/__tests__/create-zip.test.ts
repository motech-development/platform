import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import archive from '../../shared/archive';
import { handler, IEvent } from '../create-zip';

jest.mock('../../shared/archive', () =>
  jest.fn().mockResolvedValue({
    Key: 'PATH/TO/KEY.zip',
  }),
);

describe('create-zip', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    event = {
      attachments: [
        {
          key: 'OWNER-ID/COMPANY-ID/path/to/invice.pdf',
          path: 'assets/2021/January/01/client-invoice.pdf',
        },
        {
          key: 'OWNER-ID/COMPANY-ID/path/to/bill.pdf',
          path: 'assets/2021/January/02/bt-broadband.pdf',
        },
      ],
      companyId: 'COMPANY-ID',
      csv: `
        date,category,name,description,in,out
        01/01/2021,Sales,Client,Invoice,£300.00,£0.00
        02/01/2021,Bills,BT,Broadband,£0.00,£30.00
      `,
      owner: 'OWNER-ID',
    };
  });

  it('should throw an error if destination bucket is not set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No destination bucket set',
    );
  });

  describe('when destination bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.DESTINATION_BUCKET = 'DESTINATION-BUCKET';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should throw an error if origin bucket is not set', async () => {
      await expect(handler(event, context, callback)).rejects.toThrow(
        'No origin bucket set',
      );
    });
  });

  describe('when destination and origin bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.DESTINATION_BUCKET = 'DESTINATION-BUCKET';
      process.env.ORIGIN_BUCKET = 'ORIGIN-BUCKET';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should call the archiver with the correct params', async () => {
      await handler(event, context, callback);

      expect(archive).toHaveBeenCalledWith(
        event.csv,
        {
          bucket: 'DESTINATION-BUCKET',
          key: 'OWNER-ID/COMPANY-ID/test-uuid.zip',
        },
        {
          bucket: 'ORIGIN-BUCKET',
          keys: [
            {
              key: 'OWNER-ID/COMPANY-ID/path/to/invice.pdf',
              path: 'assets/2021/January/01/client-invoice.pdf',
            },
            {
              key: 'OWNER-ID/COMPANY-ID/path/to/bill.pdf',
              path: 'assets/2021/January/02/bt-broadband.pdf',
            },
          ],
        },
      );
    });

    it('should return the correct data', async () => {
      await expect(handler(event, context, callback)).resolves.toEqual({
        companyId: 'COMPANY-ID',
        key: 'PATH/TO/KEY.zip',
        owner: 'OWNER-ID',
      });
    });
  });
});
