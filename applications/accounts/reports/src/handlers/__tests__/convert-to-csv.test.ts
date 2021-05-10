import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { handler, IEvent } from '../convert-to-csv';

describe('convert-to-csv', () => {
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
          key: 'path/to/attchment-1.pdf',
          path: 'assets/2021/April/09/ee-mobile.pdf',
        },
        {
          key: 'path/to/attchment-2.pdf',
          path: 'assets/2021/April/08/client-for-work.pdf',
        },
      ],
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

  it('should return the correct data when attachments are returned', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      attachments: [
        {
          key: 'path/to/attchment-1.pdf',
          path: 'assets/2021/April/09/ee-mobile.pdf',
        },
        {
          key: 'path/to/attchment-2.pdf',
          path: 'assets/2021/April/08/client-for-work.pdf',
        },
      ],
      companyId: 'COMPANY-ID',
      csv: expect.any(String),
      owner: 'OWNER-ID',
    });
  });

  it('should return the correct data when no attachments are returned', async () => {
    event.attachments = [];

    await expect(handler(event, context, callback)).resolves.toEqual({
      attachments: [],
      companyId: 'COMPANY-ID',
      csv: expect.any(String),
      owner: 'OWNER-ID',
    });
  });
});
