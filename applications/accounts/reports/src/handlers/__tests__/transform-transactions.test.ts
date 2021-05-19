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
          amount: -10,
          category: 'Bills',
          companyId: 'COMPANY-ID',
          date: '2021-04-05T09:44:30Z',
          description: 'Last day of year',
          id: '42bddc61-cc9b-426b-88ca-1788ae73bfa7',
          name: 'Microsoft',
          status: Status.Confirmed,
          vat: 1.67,
        },
        {
          amount: -2,
          attachment: 'COMPANY-ID/8215eaf2-0a7b-4096-80eb-eae21ad88eae.jpg',
          category: 'Bills',
          companyId: 'COMPANY-ID',
          date: '2020-10-12T15:52:36Z',
          description: 'Cloud services',
          id: 'd45b5afd-ede7-4add-b53b-1bbcb05b1bfe',
          name: 'AWS',
          status: Status.Confirmed,
          vat: 0.33,
        },
        {
          amount: -1,
          category: 'Equipment',
          companyId: 'COMPANY-ID',
          date: '2020-10-07T09:34:58Z',
          description: 'Office 365',
          id: '8aedc78e-acfe-4573-98cc-dc1150ad7652',
          name: 'Microsoft',
          status: Status.Confirmed,
          vat: 0.17,
        },
        {
          amount: -20,
          category: 'Bills',
          companyId: 'COMPANY-ID',
          date: '2020-10-11T19:41:31.705Z',
          description: 'Cloud services',
          id: '15ccfff6-1118-4b79-a6b8-1f8cce83677b',
          name: 'AWS',
          status: Status.Confirmed,
          vat: 3.33,
        },
        {
          amount: -200,
          attachment: 'COMPANY-ID/a921a6f1-b250-4d22-9d19-65adb8d454f4.png',
          category: 'Equipment',
          companyId: 'COMPANY-ID',
          date: '2020-07-16T19:49:42Z',
          description:
            'Public and employers liability insurance + professional indemnity insurance',
          id: '4a473186-2747-4cb5-868e-14f50db7a1e1',
          name: 'QDOS',
          status: Status.Confirmed,
          vat: 0,
        },
        {
          amount: -20,
          category: 'Equipment',
          companyId: 'COMPANY-ID',
          date: '2020-07-16T09:53:36Z',
          description: 'Back support',
          id: 'f3195df0-ebe2-46dd-b1dd-5cca964f4dd5',
          name: 'Amazon',
          status: Status.Confirmed,
          vat: 3.33,
        },
        {
          amount: -1,
          category: 'Equipment',
          companyId: 'COMPANY-ID',
          date: '2020-07-15T15:22:04Z',
          description: 'Office 365',
          id: '77acd630-7f18-48b7-8289-648c57c9fb13',
          name: 'Microsoft',
          status: Status.Confirmed,
          vat: 0.17,
        },
        {
          amount: -20,
          category: 'Equipment',
          companyId: 'COMPANY-ID',
          date: '2020-07-12T15:44:56Z',
          description: 'Back support',
          id: '28313b9f-72e9-47ab-b499-b4702d0a5451',
          name: 'Amazon',
          status: Status.Confirmed,
          vat: 3.33,
        },
        {
          amount: 5000,
          category: 'Sales',
          companyId: 'COMPANY-ID',
          date: '2020-07-01T15:00:49Z',
          description: 'Invoice #2',
          id: 'fde394b6-47c6-4c4e-a9ee-a63225dd186b',
          name: 'Test Client',
          status: Status.Confirmed,
          vat: 825,
        },
        {
          amount: -20,
          category: 'Bills',
          companyId: 'COMPANY-ID',
          date: '2020-04-06T09:45:38Z',
          description: 'First day of year',
          id: 'dcefe2dc-0318-45db-86ff-4819535e523c',
          name: 'Google',
          status: Status.Confirmed,
          vat: 3.33,
        },
        {
          amount: -1,
          category: 'Equipment',
          companyId: 'COMPANY-ID',
          date: '2020-06-30T22:04:51Z',
          description: 'Cloud services',
          id: 'b8bb3d14-40ca-4add-9bfc-1765a0cee35c',
          name: 'AWS',
          status: Status.Confirmed,
          vat: 0.17,
        },
      ],
      owner: 'OWNER-ID',
    };
  });

  it('should generate the correct output', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      attachments: [
        {
          key: 'OWNER-ID/COMPANY-ID/a921a6f1-b250-4d22-9d19-65adb8d454f4.png',
          path: 'report/assets/2020/July/16/qdos-public-and-employers-liability-insurance-+-professional-indemnity-insurance.png',
        },
        {
          key: 'OWNER-ID/COMPANY-ID/8215eaf2-0a7b-4096-80eb-eae21ad88eae.jpg',
          path: 'report/assets/2020/October/12/aws-cloud-services.jpg',
        },
      ],
      companyId: 'COMPANY-ID',
      csv: [
        {
          Category: 'Bills',
          Date: '06/04/2020',
          Description: 'First day of year',
          In: '£0.00',
          Name: 'Google',
          Out: '£20.00',
        },
        {
          Category: 'Equipment',
          Date: '30/06/2020',
          Description: 'Cloud services',
          In: '£0.00',
          Name: 'AWS',
          Out: '£1.00',
        },
        {
          Category: 'Sales',
          Date: '01/07/2020',
          Description: 'Invoice #2',
          In: '£5000.00',
          Name: 'Test Client',
          Out: '£0.00',
        },
        {
          Category: 'Equipment',
          Date: '12/07/2020',
          Description: 'Back support',
          In: '£0.00',
          Name: 'Amazon',
          Out: '£20.00',
        },
        {
          Category: 'Equipment',
          Date: '15/07/2020',
          Description: 'Office 365',
          In: '£0.00',
          Name: 'Microsoft',
          Out: '£1.00',
        },
        {
          Category: 'Equipment',
          Date: '16/07/2020',
          Description: 'Back support',
          In: '£0.00',
          Name: 'Amazon',
          Out: '£20.00',
        },
        {
          Category: 'Equipment',
          Date: '16/07/2020',
          Description:
            'Public and employers liability insurance + professional indemnity insurance',
          In: '£0.00',
          Name: 'QDOS',
          Out: '£200.00',
        },
        {
          Category: 'Equipment',
          Date: '07/10/2020',
          Description: 'Office 365',
          In: '£0.00',
          Name: 'Microsoft',
          Out: '£1.00',
        },
        {
          Category: 'Bills',
          Date: '11/10/2020',
          Description: 'Cloud services',
          In: '£0.00',
          Name: 'AWS',
          Out: '£20.00',
        },
        {
          Category: 'Bills',
          Date: '12/10/2020',
          Description: 'Cloud services',
          In: '£0.00',
          Name: 'AWS',
          Out: '£2.00',
        },
        {
          Category: 'Bills',
          Date: '05/04/2021',
          Description: 'Last day of year',
          In: '£0.00',
          Name: 'Microsoft',
          Out: '£10.00',
        },
      ],
      owner: 'OWNER-ID',
    });
  });
});
