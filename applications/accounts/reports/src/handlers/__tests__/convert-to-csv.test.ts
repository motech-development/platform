import { Readable } from 'node:stream';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { json2csv } from 'json-2-csv';
import type { Mock } from 'vitest';
import { handler, IEvent } from '../convert-to-csv';

const reportStorage = vi.hoisted(() => ({
  downloadFileStream: vi.fn(),
  objects: new Map<string, string>(),
  uploader: vi.fn(),
}));

vi.mock('@motech-development/s3-file-operations', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@motech-development/s3-file-operations')
    >();

  return {
    ...actual,
    downloadFileStream: reportStorage.downloadFileStream,
    uploader: reportStorage.uploader,
  };
});

const collectStream = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: string[] = [];

    stream.setEncoding('utf8');
    stream.on('data', (chunk: string) => chunks.push(chunk));
    stream.once('error', reject);
    stream.once('end', () => {
      resolve(chunks.join(''));
    });
  });

const parsePayload = (serialized: string): unknown =>
  JSON.parse(serialized) as unknown;

describe('convert-to-csv', () => {
  let callback: Mock;
  let context: Context;
  let event: IEvent;
  let env: NodeJS.ProcessEnv;
  let payload: {
    attachments: { key: string; path: string }[];
    companyId: string;
    csv: object[];
    owner: string;
  };

  beforeEach(() => {
    callback = vi.fn();

    context = ctx();

    context.done();

    env = {
      ...process.env,
    };
    process.env.REPORT_BUCKET = 'REPORT-BUCKET';

    payload = {
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
    reportStorage.objects.clear();
    reportStorage.objects.set('payload-key', JSON.stringify(payload));
    reportStorage.downloadFileStream.mockImplementation(
      (_bucket: string, key: string) =>
        Readable.from([reportStorage.objects.get(key) ?? '']),
    );
    reportStorage.uploader.mockImplementation(
      (_bucket: string, key: string, body: Readable) => ({
        done: async () => {
          reportStorage.objects.set(key, await collectStream(body));
        },
      }),
    );
    event = {
      companyId: 'COMPANY-ID',
      owner: 'OWNER-ID',
      payloadKey: 'payload-key',
    };

    (json2csv as Mock).mockReturnValue('MOCKED-CSV-DATA');
  });

  afterEach(() => {
    process.env = env;
  });

  it('should write the CSV and return the payload reference', async () => {
    await expect(handler(event, context, callback)).resolves.toEqual({
      companyId: 'COMPANY-ID',
      owner: 'OWNER-ID',
      payloadKey: 'payload-key',
    });

    expect(
      parsePayload(reportStorage.objects.get('payload-key') ?? ''),
    ).toEqual({
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
      csv: 'MOCKED-CSV-DATA',
      owner: 'OWNER-ID',
    });
  });

  it('should return the correct data when no attachments are returned', async () => {
    payload.attachments = [];
    reportStorage.objects.set('payload-key', JSON.stringify(payload));

    await expect(handler(event, context, callback)).resolves.toEqual({
      companyId: 'COMPANY-ID',
      owner: 'OWNER-ID',
      payloadKey: 'payload-key',
    });

    expect(
      parsePayload(reportStorage.objects.get('payload-key') ?? ''),
    ).toMatchObject({ attachments: [] });
  });

  it('should generate CSV with the correct params', async () => {
    await handler(event, context, callback);

    expect(json2csv).toHaveBeenCalledWith(
      [
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
      {
        checkSchemaDifferences: true,
      },
    );
  });
});
