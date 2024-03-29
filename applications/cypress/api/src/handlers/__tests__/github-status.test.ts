import { Octokit } from '@octokit/rest';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import github from '../../shared/github';
import { handler } from '../github-status';

jest.mock('../../shared/github', () =>
  jest.fn().mockResolvedValue({
    repos: {
      createCommitStatus: jest.fn(),
    },
  }),
);

describe('github-status', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: APIGatewayProxyEvent;
  let octokit: Octokit;

  beforeEach(async () => {
    context = ctx();

    context.done();

    callback = jest.fn();

    octokit = await github();
  });

  describe('when RUN_FINISH event is received', () => {
    it('should send the correct payload when a single test has failed', async () => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge x into y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'RUN_FINISH',
          failures: 1,
          flaky: 0,
          overall: 1,
          passes: 0,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;

      await handler(event, context, callback);

      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        context: 'Cypress',
        description: '1 test failed',
        owner: 'owner',
        repo: 'repo',
        sha: 'x',
        state: 'failure',
        target_url: 'https://path.to.location/',
      });
    });

    it('should send the correct payload when a multiple tests have failed', async () => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge x into y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'RUN_FINISH',
          failures: 2,
          flaky: 0,
          overall: 2,
          passes: 0,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;

      await handler(event, context, callback);

      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        context: 'Cypress',
        description: '2 tests failed',
        owner: 'owner',
        repo: 'repo',
        sha: 'x',
        state: 'failure',
        target_url: 'https://path.to.location/',
      });
    });

    it('should send the correct payload when a single test has passed', async () => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge x into y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'RUN_FINISH',
          failures: 0,
          flaky: 0,
          overall: 1,
          passes: 1,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;

      await handler(event, context, callback);

      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        context: 'Cypress',
        description: '1 test passed',
        owner: 'owner',
        repo: 'repo',
        sha: 'x',
        state: 'success',
        target_url: 'https://path.to.location/',
      });
    });

    it('should send the correct payload when multiple tests have passed', async () => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge x into y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'RUN_FINISH',
          failures: 0,
          flaky: 0,
          overall: 12,
          passes: 12,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;

      await handler(event, context, callback);

      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        context: 'Cypress',
        description: '12 tests passed',
        owner: 'owner',
        repo: 'repo',
        sha: 'x',
        state: 'success',
        target_url: 'https://path.to.location/',
      });
    });
  });

  describe('when RUN_START event is received', () => {
    beforeEach(() => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge pull request x from y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'RUN_START',
          failures: 0,
          flaky: 0,
          overall: 0,
          passes: 0,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;
    });

    it('should send the correct payload', async () => {
      await handler(event, context, callback);

      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        context: 'Cypress',
        description: 'This check has started...',
        owner: 'owner',
        repo: 'repo',
        sha: 'z',
        state: 'pending',
        target_url: 'https://path.to.location/',
      });
    });
  });

  describe('when RUN_TIMEOUT event is received', () => {
    beforeEach(() => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge x into y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'RUN_TIMEOUT',
          failures: 0,
          flaky: 0,
          overall: 0,
          passes: 0,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;
    });

    it('should send the correct payload', async () => {
      await handler(event, context, callback);

      expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
        context: 'Cypress',
        description: 'Test run has timed out',
        owner: 'owner',
        repo: 'repo',
        sha: 'x',
        state: 'failure',
        target_url: 'https://path.to.location/',
      });
    });
  });

  describe('when an unknown event is received', () => {
    beforeEach(() => {
      event = {
        body: JSON.stringify({
          buildId: 'build-id',
          commit: {
            authorEmail: 'test@example.com',
            authorName: 'Test User',
            branch: 'x',
            message: 'Merge x into y',
            remoteOrigin: 'https://path.to.location/owner/repo',
            sha: 'z',
          },
          event: 'UNKNOWN',
          failures: 0,
          flaky: 0,
          overall: 0,
          passes: 0,
          pending: 0,
          runUrl: 'https://path.to.location/',
          skipped: 0,
        }),
      } as APIGatewayProxyEvent;
    });

    it('should return an error response', async () => {
      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          message: 'Invalid request',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });
  });

  describe('when payload is invalid', () => {
    beforeEach(() => {
      event = {
        body: JSON.stringify({}),
      } as APIGatewayProxyEvent;
    });

    it('should return an error response', async () => {
      await handler(event, context, callback);

      expect(callback).toHaveBeenCalledWith(null, {
        body: JSON.stringify({
          message: 'Invalid request',
          statusCode: 400,
        }),
        statusCode: 400,
      });
    });
  });
});
