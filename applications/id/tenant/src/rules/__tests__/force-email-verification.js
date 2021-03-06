const { ManagementClient } = require('auth0');
const loadRule = require('../../utils/loadRule');

describe('force-email-verification', () => {
  let rule;
  let callback;
  let context;
  let user;

  beforeEach(async () => {
    rule = await loadRule('./src/rules/force-email-verification.js', {
      accessToken: 'access-token',
      domain: 'https://test.com',
    });

    callback = jest.fn();
    context = {};
    user = {
      user_id: 'user-id',
    };

    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is verified', () => {
    beforeEach(() => {
      user.email_verified = true;
    });

    it('should not update meta data if emailVerificationSentDate does not exist', async () => {
      await rule(user, context, callback);

      expect(
        ManagementClient.prototype.updateUserMetadata,
      ).not.toHaveBeenCalled();
    });

    it('should remove emailVerificationSentDate if it exists', async () => {
      user.user_metadata = {
        emailVerificationSentDate: new Date().valueOf(),
      };

      await rule(user, context, callback);

      expect(
        ManagementClient.prototype.updateUserMetadata,
      ).toHaveBeenCalledWith(
        {
          id: 'user-id',
        },
        {},
      );
    });

    it('should log an error if meta data cannot be updated', async () => {
      ManagementClient.prototype.updateUserMetadata.mockRejectedValueOnce(
        new Error('Something has gone wrong'),
      );

      user.user_metadata = {
        emailVerificationSentDate: new Date().valueOf(),
      };

      await rule(user, context, callback);

      expect(console.log).toHaveBeenCalledWith('Something has gone wrong');
    });

    it('should call the callback with the correct params', async () => {
      const result = {
        email_verified: true,
        user_id: 'user-id',
        user_metadata: {},
      };

      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(null, result, context);
    });
  });

  describe('when user is not verified', () => {
    beforeEach(() => {
      user.email_verified = false;
    });

    it('should not resend the verification email if it was already sent today', async () => {
      user.user_metadata = {
        emailVerificationSentDate: new Date().valueOf(),
      };

      await rule(user, context, callback);

      expect(
        ManagementClient.prototype.sendEmailVerification,
      ).not.toHaveBeenCalled();
    });

    it('should throw an UnauthorizedError', async () => {
      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(
        new Error('Please verify your email before logging in.'),
      );
    });

    it('should resend the verification email if it has not been sent today', async () => {
      await rule(user, context, callback);

      expect(
        ManagementClient.prototype.sendEmailVerification,
      ).toHaveBeenCalledWith({
        user_id: 'user-id',
      });
    });

    it('should log an error if meta data something cannot be completed', async () => {
      ManagementClient.prototype.updateUserMetadata.mockRejectedValueOnce(
        new Error('Something has gone wrong'),
      );

      await rule(user, context, callback);

      expect(console.log).toHaveBeenCalledWith('Something has gone wrong');
    });

    it('should update the emailVerificationSentDate to today', async () => {
      await rule(user, context, callback);

      expect(
        ManagementClient.prototype.updateUserMetadata,
      ).toHaveBeenCalledWith(
        {
          id: 'user-id',
        },
        {
          emailVerificationSentDate: expect.any(Number),
        },
      );
    });
  });
});
