import { URL } from 'node:url';
import {
  apiGatewayHandler,
  paramCheck,
  response,
} from '@motech-development/api-gateway-handler';
import logger from '@motech-development/node-logger';
import { number, object, string } from 'yup';
import github from '../shared/github';

enum Event {
  RUN_FINISH = 'RUN_FINISH',
  RUN_START = 'RUN_START',
  RUN_TIMEOUT = 'RUN_TIMEOUT',
}

enum State {
  Failure = 'failure',
  Pending = 'pending',
  Success = 'success',
}

const schema = object({
  buildId: string().required(),
  commit: object({
    authorEmail: string().required(),
    authorName: string().required(),
    branch: string().required(),
    message: string().required(),
    remoteOrigin: string().url().required(),
    sha: string().required(),
  }).required(),
  event: string().required(),
  failures: number().required(),
  flaky: number().required(),
  overall: number().required(),
  passes: number().required(),
  pending: number().required(),
  runUrl: string().url().required(),
  skipped: number().required(),
}).required();

export const handler = apiGatewayHandler(async (event) => {
  const body = paramCheck(event.body, 'No body found', 400);
  const eventPayload = JSON.parse(body) as unknown;

  logger.debug('Event payload', eventPayload);

  try {
    const data = await schema.validate(eventPayload, {
      abortEarly: true,
      stripUnknown: true,
    });
    const client = await github();
    const url = new URL(data.commit.remoteOrigin);
    const context = 'Cypress';
    const [, owner, repo] = url.pathname.split('/');
    const sha = data.commit.message.startsWith('Merge pull request')
      ? data.commit.sha
      : data.commit.message.split(' ')[1];

    switch (data.event) {
      case Event.RUN_FINISH: {
        logger.info('Creating commit status after RUN_FINISH event');

        const state = data.failures > 0 ? State.Failure : State.Success;
        const testStatus = (status: keyof typeof data) =>
          data[status] === 1 ? 'test' : 'tests';
        const payload = {
          context,
          description:
            data.failures > 0
              ? `${data.failures} ${testStatus('failures')} failed`
              : `${data.passes} ${testStatus('passes')} passed`,
          owner,
          repo,
          sha,
          state,
          target_url: data.runUrl,
        };

        logger.debug('createCommitStatus payload', payload);

        await client.repos.createCommitStatus(payload);

        return response(
          {
            event: Event.RUN_FINISH,
            state,
          },
          201,
        );
      }
      case Event.RUN_START: {
        logger.info('Creating commit status after RUN_START event');

        const state = State.Pending;
        const payload = {
          context,
          description: 'This check has started...',
          owner,
          repo,
          sha,
          state,
          target_url: data.runUrl,
        };

        logger.debug('createCommitStatus payload', payload);

        await client.repos.createCommitStatus(payload);

        return response(
          {
            event: Event.RUN_FINISH,
            state,
          },
          201,
        );
      }
      case Event.RUN_TIMEOUT: {
        logger.info('Creating commit status after RUN_TIMEOUT event');

        const state = State.Failure;
        const payload = {
          context,
          description: 'Test run has timed out',
          owner,
          repo,
          sha,
          state,
          target_url: data.runUrl,
        };

        logger.debug('createCommitStatus payload', payload);

        await client.repos.createCommitStatus(payload);

        return response(
          {
            event: Event.RUN_FINISH,
            state,
          },
          201,
        );
      }
      default: {
        logger.info('Unknown event', {
          event: data.event,
        });

        return response(
          {
            message: 'Invalid request',
            statusCode: 400,
          },
          400,
        );
      }
    }
  } catch (e) {
    logger.error(e);

    return response(
      {
        message: 'Invalid request',
        statusCode: 400,
      },
      400,
    );
  }
});
