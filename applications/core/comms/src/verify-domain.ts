import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { SES } from 'aws-sdk';
import { FAILED, SUCCESS, send } from 'cfn-response-async';
import { number, object, string } from 'yup';

interface IEvent {
  DMARC: string;
  Domain: string;
  Region: string;
  TTL: number;
}

const schema = object<IEvent>()
  .shape({
    DMARC: string().required(),
    Domain: string().required(),
    Region: string().required(),
    TTL: number().required(),
  })
  .required();

export const handler: CloudFormationCustomResourceHandler = async (
  event,
  context,
) => {
  try {
    const { RequestType, ResourceProperties, StackId } = event;
    const { DMARC, Domain, Region, TTL } = await schema.validate(
      ResourceProperties,
    );
    const ses = new SES({
      region: Region,
    });
    const [, , , , account] = StackId.split(':');
    const Arn = `arn:aws:ses:${Region}:${account}:identity/${Domain}`;

    switch (RequestType) {
      case 'Create':
      case 'Update': {
        const [{ VerificationToken }, { DkimTokens }] = await Promise.all([
          ses
            .verifyDomainIdentity({
              Domain,
            })
            .promise(),
          ses
            .verifyDomainDkim({
              Domain,
            })
            .promise(),
        ]);
        const dkim = DkimTokens.map(token => ({
          Name: `${token}._domainkey.${Domain}.`,
          ResourceRecords: [`${token}.dkim.amazonses.com.`],
          TTL: TTL.toString(),
          Type: 'CNAME',
        }));
        const Route53RecordSets = [
          {
            Name: `_amazonses.${Domain}.`,
            ResourceRecords: [`"${VerificationToken}"`],
            TTL: TTL.toString(),
            Type: 'TXT',
          },
          {
            Name: `_dmarc.${Domain}.`,
            ResourceRecords: [`"${DMARC}"`],
            TTL: TTL.toString(),
            Type: 'TXT',
          },
          ...dkim,
        ];

        await send(
          event,
          context,
          SUCCESS,
          {
            Arn,
            Domain,
            Route53RecordSets,
          },
          Arn,
        );

        break;
      }
      case 'Delete': {
        await ses
          .deleteIdentity({
            Identity: Domain,
          })
          .promise();

        await send(
          event,
          context,
          SUCCESS,
          {
            Arn,
            Domain,
          },
          Arn,
        );

        break;
      }
      default:
        await send(event, context, FAILED, {
          reason: 'Unrecognised request type',
        });
    }
  } catch (e) {
    await send(event, context, FAILED, {
      reason: e.message,
    });
  }
};
