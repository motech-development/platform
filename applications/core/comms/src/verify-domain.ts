import {
  DeleteIdentityCommand,
  SESClient,
  VerifyDomainDkimCommand,
  VerifyDomainIdentityCommand,
} from '@aws-sdk/client-ses';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { AWSLambda } from '@sentry/serverless';
import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { FAILED, SUCCESS, send } from 'cfn-response-async';
import { number, object, string } from 'yup';

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
});

interface IEvent {
  DMARC: string;
  Domain: string;
  Region: string;
  SPF: string;
  TTL: number;
}

const schema = object<IEvent>()
  .shape({
    DMARC: string().required(),
    Domain: string().required(),
    Region: string().required(),
    SPF: string().required(),
    TTL: number().required(),
  })
  .required();

export const handler: CloudFormationCustomResourceHandler =
  AWSLambda.wrapHandler(async (event, context) => {
    try {
      const { RequestType, ResourceProperties, StackId } = event;
      const { DMARC, Domain, Region, SPF, TTL } = await schema.validate(
        ResourceProperties,
      );
      const ses = new SESClient({
        region: Region,
      });
      const [, , , , account] = StackId.split(':');
      const Arn = `arn:aws:ses:${Region}:${account}:identity/${Domain}`;

      switch (RequestType) {
        case 'Create':
        case 'Update': {
          const [{ VerificationToken }, { DkimTokens }] = await Promise.all([
            ses.send(
              new VerifyDomainIdentityCommand({
                Domain,
              }),
            ),
            ses.send(
              new VerifyDomainDkimCommand({
                Domain,
              }),
            ),
          ]);
          const dkim = (DkimTokens ?? []).map((token) => ({
            Name: `${token}._domainkey.${Domain}.`,
            ResourceRecords: [`${token}.dkim.amazonses.com.`],
            TTL: TTL.toString(),
            Type: 'CNAME',
          }));
          const Route53RecordSets = [
            ...(VerificationToken
              ? [
                  {
                    Name: `_amazonses.${Domain}.`,
                    ResourceRecords: [`"${VerificationToken}"`],
                    TTL: TTL.toString(),
                    Type: 'TXT',
                  },
                ]
              : []),
            {
              Name: `_dmarc.${Domain}.`,
              ResourceRecords: [`"${DMARC}"`],
              TTL: TTL.toString(),
              Type: 'TXT',
            },
            {
              Name: `${Domain}.`,
              ResourceRecords: [`"${SPF}"`],
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
          const command = new DeleteIdentityCommand({
            Identity: Domain,
          });
          await ses.send(command);

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
      if (e instanceof Error) {
        await send(event, context, FAILED, {
          reason: e.message,
        });
      } else {
        await send(event, context, FAILED, {
          reason: 'Unhandled exception',
        });
      }
    }
  });
