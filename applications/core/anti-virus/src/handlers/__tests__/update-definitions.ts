import { createFile } from '@motech-development/s3-file-operations';
import type { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import type { Mock } from 'vitest';
import { updateDefinitions } from '../../shared/clam-av';
import { handler } from '../update-definitions';

vi.mock('node:fs');

vi.mock('../../shared/clam-av', () => ({
  updateDefinitions: vi.fn(),
}));

vi.mock('@motech-development/s3-file-operations', () => ({
  createFile: vi.fn(),
}));

describe('update-definitions', () => {
  let callback: Mock;
  let context: Context;
  let event: Record<string, unknown>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = vi.fn();

    event = {};
  });

  it('should throw an error if a bucket is not set', async () => {
    await expect(handler(event, context, callback)).rejects.toThrow(
      'No bucket set',
    );
  });

  describe('when a bucket is set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.BUCKET = 'definitions-bucket';
    });

    afterEach(() => {
      process.env = env;
    });

    describe('when updating the definitions is successful', () => {
      it('should download the virus definitions to the correct location', async () => {
        await handler(event, context, callback);

        expect(updateDefinitions).toHaveBeenCalledWith('/tmp');
      });

      it('should upload the definitions to the correct location', async () => {
        await handler(event, context, callback);

        expect(createFile).toHaveBeenCalledWith(
          'definitions-bucket',
          'bytecode.cvd',
          undefined,
        );
        expect(createFile).toHaveBeenCalledWith(
          'definitions-bucket',
          'daily.cvd',
          undefined,
        );
        expect(createFile).toHaveBeenCalledWith(
          'definitions-bucket',
          'main.cvd',
          undefined,
        );
      });
    });

    describe('when updating the definitions is not successful', () => {
      it('should throw an error', async () => {
        (updateDefinitions as Mock).mockRejectedValueOnce('');

        await expect(handler(event, context, callback)).rejects.toThrow(
          'Unable to update virus definitions',
        );
      });
    });
  });
});
