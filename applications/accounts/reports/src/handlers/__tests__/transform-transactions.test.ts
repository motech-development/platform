import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import Status from '../../shared/status';
import { handler, IEvent } from '../transform-transactions';

describe('transform-transactions', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: IEvent;

  beforeEach(() => {
    callback = jest.fn();

    context = ctx();

    context.done();

    event = {
      companyId: 'COMPANY-ID',
      currency: '£',
      items: [
        {
          amount: -41.11,
          attachment: 'path/to/attchment-1.pdf',
          category: 'Bills',
          companyId: 'COMPANY-ID',
          date: '2021-04-09T00:00:00.000Z',
          description: 'Mobile',
          id: 'TRANSACTION-1',
          name: 'EE',
          status: Status.Confirmed,
          vat: 6.85,
        },
        {
          amount: -2.4,
          category: 'Bills',
          companyId: 'COMPANY-ID',
          date: '2021-04-10T00:00:00.000Z',
          description: 'Domain',
          id: 'TRANSACTION-2',
          name: 'GoDaddy',
          status: Status.Confirmed,
          vat: 0.4,
        },
        {
          amount: 1000,
          attachment: 'path/to/attchment-2.pdf',
          category: 'Sales',
          companyId: 'COMPANY-ID',
          date: '2021-04-08T00:00:00.000Z',
          description: 'For work',
          id: 'TRANSACTION-3',
          name: 'Client',
          status: Status.Confirmed,
          vat: 166.67,
        },
      ],
      owner: 'OWNER-ID',
    };
  });

  it('should generate the correct output', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      attachments: [
        {
          key: 'OWNER-ID/path/to/attchment-1.pdf',
          path: 'report/assets/2021/April/09/ee-mobile.pdf',
        },
        {
          key: 'OWNER-ID/path/to/attchment-2.pdf',
          path: 'report/assets/2021/April/08/client-for-work.pdf',
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
          out: '£0.00',
        },
        {
          category: 'Bills',
          date: '09/04/2021',
          description: 'Mobile',
          in: '£0.00',
          name: 'EE',
          out: '-£41.11',
        },
        {
          category: 'Bills',
          date: '10/04/2021',
          description: 'Domain',
          in: '£0.00',
          name: 'GoDaddy',
          out: '-£2.40',
        },
      ],
      owner: 'OWNER-ID',
    });
  });
});
