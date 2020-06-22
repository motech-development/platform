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
    user = {};
  });

  describe('when user is verified', () => {
    beforeEach(() => {
      user.email_verified = true;
    });

    it.todo('should remove emailVerificationSentDate if it exists');

    it.todo(
      'should not update meta data if emailVerificationSentDate does not exist',
    );

    it('should call the callback with the correct params', () => {
      rule(user, context, callback);

      expect(callback).toHaveBeenCalledWith(null, user, context);
    });
  });

  describe('when user is not verified', () => {
    it.todo('should throw an UnauthorizedError');

    it.todo(
      'should not resend the verification email if it was already sent today',
    );

    it.todo(
      'should resend the verification email if it has not been sent today',
    );

    it.todo('should update the emailVerificationSentDate to today');
  });
});
