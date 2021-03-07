import { Context } from 'aws-lambda';
import ctx from 'aws-lambda-mock-context';
import { updateDefinitions } from '../../shared/clam-av';
import { createFile } from '../../shared/file-operations';
import { handler } from '../update-definitions';

jest.mock('fs');

jest.mock('../../shared/clam-av', () => ({
  updateDefinitions: jest.fn(),
}));

jest.mock('../../shared/file-operations', () => ({
  createFile: jest.fn(),
}));

describe('update-definitions', () => {
  let callback: jest.Mock;
  let context: Context;
  let event: Record<string, unknown>;

  beforeEach(() => {
    context = ctx();

    context.done();

    callback = jest.fn();

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
        (updateDefinitions as jest.Mock).mockRejectedValueOnce('');

        await expect(handler(event, context, callback)).rejects.toThrow(
          'Unable to update virus definitions',
        );
      });
    });
  });
});
