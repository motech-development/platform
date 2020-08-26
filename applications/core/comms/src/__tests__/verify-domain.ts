import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { SES } from 'aws-sdk';
import { FAILED, SUCCESS, send } from 'cfn-response-async';
import { handler } from '../verify-domain';

jest.mock('cfn-response-async');

describe('verify-domain', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: CloudFormationCustomResourceEvent;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();
  });

  describe('with an invalid event', () => {
    it('should fail if properties are invalid', async () => {
      event = ({
        ResourceProperties: {
          Domain: 'domain.com',
          Region: 'eu-west-2',
          TTL: 1000,
        },
      } as unknown) as CloudFormationCustomResourceEvent;

      await handler(event, context, callback);

      expect(send).toHaveBeenCalledWith(event, context, FAILED, {
        reason: expect.any(String),
      });
    });
  });

  describe('with a valid event', () => {
    beforeEach(() => {
      event = ({
        ResourceProperties: {
          DMARC: 'v=DMARC1; p=none; pct=100; sp=none; aspf=r;',
          Domain: 'domain.com',
          Region: 'eu-west-2',
          SPF: 'v=spf1 include:amazonses.com ~all',
          TTL: '1000',
        },
        StackId:
          'arn:aws:cloudformation:eu-west-2:457934857934:stack/my-test-stack/89799bef-6c5e-4de4-b51d-f595365c1a71',
      } as unknown) as CloudFormationCustomResourceEvent;
    });

    it('should fail if request type is unrecognised', async () => {
      event.RequestType = 'Unknown' as 'Create';

      await handler(event, context, callback);

      expect(send).toHaveBeenCalledWith(event, context, FAILED, {
        reason: 'Unrecognised request type',
      });
    });

    describe('on create', () => {
      beforeEach(() => {
        event.RequestType = 'Create';
      });

      it('should send the success response with the correct params', async () => {
        await handler(event, context, callback);

        expect(send).toHaveBeenCalledWith(
          event,
          context,
          SUCCESS,
          {
            Arn: 'arn:aws:ses:eu-west-2:457934857934:identity/domain.com',
            Domain: 'domain.com',
            Route53RecordSets: [
              {
                Name: '_amazonses.domain.com.',
                ResourceRecords: ['"VERIFICATION_CODE"'],
                TTL: '1000',
                Type: 'TXT',
              },
              {
                Name: '_dmarc.domain.com.',
                ResourceRecords: [
                  '"v=DMARC1; p=none; pct=100; sp=none; aspf=r;"',
                ],
                TTL: '1000',
                Type: 'TXT',
              },
              {
                Name: 'domain.com.',
                ResourceRecords: ['"v=spf1 include:amazonses.com ~all"'],
                TTL: '1000',
                Type: 'TXT',
              },
              {
                Name: 'DKIM-1._domainkey.domain.com.',
                ResourceRecords: ['DKIM-1.dkim.amazonses.com.'],
                TTL: '1000',
                Type: 'CNAME',
              },
              {
                Name: 'DKIM-2._domainkey.domain.com.',
                ResourceRecords: ['DKIM-2.dkim.amazonses.com.'],
                TTL: '1000',
                Type: 'CNAME',
              },
              {
                Name: 'DKIM-3._domainkey.domain.com.',
                ResourceRecords: ['DKIM-3.dkim.amazonses.com.'],
                TTL: '1000',
                Type: 'CNAME',
              },
            ],
          },
          'arn:aws:ses:eu-west-2:457934857934:identity/domain.com',
        );
      });

      it('should validate the domain with the correct params', async () => {
        await handler(event, context, callback);

        expect(SES.prototype.verifyDomainIdentity).toHaveBeenCalledWith({
          Domain: 'domain.com',
        });
      });

      it('should validate the dkim with the correct params', async () => {
        await handler(event, context, callback);

        expect(SES.prototype.verifyDomainDkim).toHaveBeenCalledWith({
          Domain: 'domain.com',
        });
      });
    });

    describe('on update', () => {
      beforeEach(() => {
        event.RequestType = 'Update';
      });

      it('should send the success response with the correct params', async () => {
        await handler(event, context, callback);

        expect(send).toHaveBeenCalledWith(
          event,
          context,
          SUCCESS,
          {
            Arn: 'arn:aws:ses:eu-west-2:457934857934:identity/domain.com',
            Domain: 'domain.com',
            Route53RecordSets: [
              {
                Name: '_amazonses.domain.com.',
                ResourceRecords: ['"VERIFICATION_CODE"'],
                TTL: '1000',
                Type: 'TXT',
              },
              {
                Name: '_dmarc.domain.com.',
                ResourceRecords: [
                  '"v=DMARC1; p=none; pct=100; sp=none; aspf=r;"',
                ],
                TTL: '1000',
                Type: 'TXT',
              },
              {
                Name: 'domain.com.',
                ResourceRecords: ['"v=spf1 include:amazonses.com ~all"'],
                TTL: '1000',
                Type: 'TXT',
              },
              {
                Name: 'DKIM-1._domainkey.domain.com.',
                ResourceRecords: ['DKIM-1.dkim.amazonses.com.'],
                TTL: '1000',
                Type: 'CNAME',
              },
              {
                Name: 'DKIM-2._domainkey.domain.com.',
                ResourceRecords: ['DKIM-2.dkim.amazonses.com.'],
                TTL: '1000',
                Type: 'CNAME',
              },
              {
                Name: 'DKIM-3._domainkey.domain.com.',
                ResourceRecords: ['DKIM-3.dkim.amazonses.com.'],
                TTL: '1000',
                Type: 'CNAME',
              },
            ],
          },
          'arn:aws:ses:eu-west-2:457934857934:identity/domain.com',
        );
      });

      it('should validate the domain with the correct params', async () => {
        await handler(event, context, callback);

        expect(SES.prototype.verifyDomainIdentity).toHaveBeenCalledWith({
          Domain: 'domain.com',
        });
      });

      it('should validate the dkim with the correct params', async () => {
        await handler(event, context, callback);

        expect(SES.prototype.verifyDomainDkim).toHaveBeenCalledWith({
          Domain: 'domain.com',
        });
      });
    });

    describe('on delete', () => {
      beforeEach(() => {
        event.RequestType = 'Delete';
      });

      it('should send the success response with the correct params', async () => {
        await handler(event, context, callback);

        expect(send).toHaveBeenCalledWith(
          event,
          context,
          SUCCESS,
          {
            Arn: 'arn:aws:ses:eu-west-2:457934857934:identity/domain.com',
            Domain: 'domain.com',
          },
          'arn:aws:ses:eu-west-2:457934857934:identity/domain.com',
        );
      });

      it('should delete the identity with the correct params', async () => {
        await handler(event, context, callback);

        expect(SES.prototype.deleteIdentity).toHaveBeenCalledWith({
          Identity: 'domain.com',
        });
      });
    });
  });
});
