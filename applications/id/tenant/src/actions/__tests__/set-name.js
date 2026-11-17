const { ManagementClient } = require('auth0');
const { onExecutePostLogin } = require('../set-name');

describe('set-name', () => {
  let api;
  let event;
  let update;

  beforeEach(() => {
    update = vi.fn();
    vi.spyOn(ManagementClient.prototype, 'users', 'get').mockReturnValue({
      update,
    });

    api = {
      user: {
        setUserMetadata: vi.fn(),
      },
    };
    event = {
      secrets: {
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
        DOMAIN: 'test.auth0.com',
      },
      user: {
        user_id: 'user-id',
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when user has no name meta data', () => {
    it('should not update the user when there is no meta data', async () => {
      await onExecutePostLogin(event, api);

      expect(update).not.toHaveBeenCalled();
      expect(api.user.setUserMetadata).not.toHaveBeenCalled();
    });

    it('should not update the user when there is other meta data', async () => {
      event.user.user_metadata = {
        anotherRandomField: 'Hello world',
      };

      await onExecutePostLogin(event, api);

      expect(update).not.toHaveBeenCalled();
      expect(api.user.setUserMetadata).not.toHaveBeenCalled();
    });
  });

  describe('when user has name meta data', () => {
    beforeEach(() => {
      event.user.user_metadata = {
        anotherRandomField: 'Hello world',
        family_name: 'User',
        given_name: 'Test',
      };
    });

    it('should set the name on the user', async () => {
      await onExecutePostLogin(event, api);

      expect(update).toHaveBeenCalledWith('user-id', {
        family_name: 'User',
        given_name: 'Test',
        name: 'Test User',
      });
    });

    it('should remove the name from the meta data', async () => {
      await onExecutePostLogin(event, api);

      expect(api.user.setUserMetadata).toHaveBeenCalledWith(
        'family_name',
        null,
      );
      expect(api.user.setUserMetadata).toHaveBeenCalledWith('given_name', null);
      expect(api.user.setUserMetadata).toHaveBeenCalledTimes(2);
    });

    it('should fail the login and keep the meta data if the user cannot be updated', async () => {
      update.mockRejectedValueOnce(new Error('Something has gone wrong'));

      await expect(onExecutePostLogin(event, api)).rejects.toThrow(
        'Something has gone wrong',
      );
      expect(api.user.setUserMetadata).not.toHaveBeenCalled();
    });
  });
});
