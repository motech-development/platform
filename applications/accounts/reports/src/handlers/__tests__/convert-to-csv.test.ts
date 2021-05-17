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
          Category: 'Sales',
          Date: '08/04/2021',
          Description: 'For work',
          In: '£1000.00',
          Name: 'Client',
          Out: null,
        },
        {
          Category: 'Bills',
          Date: '09/04/2021',
          Description: 'Mobile',
          In: null,
          Name: 'EE',
          Out: '£41.11',
        },
        {
          Category: 'Bills',
          Date: '10/04/2021',
          Description: 'Domain',
          In: null,
          Name: 'GoDaddy',
          Out: '£2.40',
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
