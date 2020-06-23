const { ManagementClient } = require('auth0');
const loadRule = require('../../utils/loadRule');

describe('set-name', () => {
  let rule;
  let callback;
  let context;
  let user;

  beforeEach(async () => {
    rule = await loadRule('./src/rules/set-name.js', {
      accessToken: 'access-token',
      domain: 'https://test.com',
    });

    callback = jest.fn();
    context = {};
    user = {
      user_id: 'user-id',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when user has no name meta data', () => {
    it('should pass through the user data when there is no meta data', async () => {
      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(null, user, context);
    });

    it('should pass through the user data when there is other meta data', async () => {
      user.user_metadata = {
        anotherRandomField: 'Hello world',
      };

      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(null, user, context);
    });

    it('should not update the user', async () => {
      await rule(user, context, callback);

      expect(ManagementClient.prototype.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('when user has name meta data', () => {
    beforeEach(() => {
      user.user_metadata = {
        anotherRandomField: 'Hello world',
        family_name: 'User',
        given_name: 'Test',
      };
    });

    it('should return the updated user data', async () => {
      const expected = {
        family_name: 'User',
        given_name: 'Test',
        name: 'Test User',
        user_id: 'user-id',
        user_metadata: {
          anotherRandomField: 'Hello world',
        },
      };

      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(null, expected, context);
    });

    it('should update the user', async () => {
      await rule(user, context, callback);

      expect(ManagementClient.prototype.updateUser).toHaveBeenCalledWith(
        {
          id: 'user-id',
        },
        {
          family_name: 'User',
          given_name: 'Test',
          name: 'Test User',
          user_metadata: {
            anotherRandomField: 'Hello world',
          },
        },
      );
    });

    it('should return an error if user cannot be updated', async () => {
      ManagementClient.prototype.updateUser.mockRejectedValueOnce(
        new Error('Something has gone wrong'),
      );

      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(
        new Error('Something has gone wrong'),
      );
    });
  });
});
