const { ManagementClient } = require('auth0');
const loadRule = require('../../utils/loadRule');

const load = loadRule('../rules/force-email-verification.js', {
  accessToken: 'access-token',
  domain: 'https://test.com',
});

describe('force-email-verification', () => {
  let rule;
  let callback;
  let context;
  let user;

  beforeEach(() => {
    rule = load('emailVerified');
    callback = jest.fn();
    context = {};
    user = {
      user_id: 'user-id',
    };
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

    it('should call the callback with the correct params', async () => {
      await rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(null, user, context);
    });
  });

  describe('when user is not verified', () => {
    it('should not resend the verification email if it was already sent today', async () => {
      user.user_metadata = {
        emailVerificationSentDate: new Date().valueOf(),
      };

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
