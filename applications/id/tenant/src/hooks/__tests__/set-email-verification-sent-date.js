const { advanceTo, clear } = require('jest-date-mock');
const hook = require('../set-email-verification-sent-date');

describe('set-email-verification-sent-date', () => {
  let callback;
  let context;
  let user;

  beforeAll(() => {
    advanceTo('2015-06-06T19:45:00Z');
  });

  beforeEach(() => {
    callback = jest.fn();
    context = {};
  });

  afterAll(() => {
    clear();
  });

  it('should set emailVerificationSentDate when no user_metadata exists', () => {
    user = {};

    hook(user, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      user: {
        user_metadata: {
          emailVerificationSentDate: 1433619900000,
        },
      },
    });
  });

  it('should set emailVerificationSentDate when user_metadata exists', () => {
    user = {
      user_metadata: {
        name: 'Test User',
      },
    };

    hook(user, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      user: {
        user_metadata: {
          emailVerificationSentDate: 1433619900000,
          name: 'Test User',
        },
      },
    });
  });
});
