const {
  onExecutePreUserRegistration,
} = require('../set-email-verification-sent-date');

describe('set-email-verification-sent-date', () => {
  let api;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2015-06-06T19:45:00Z'));

    api = {
      user: {
        setUserMetadata: vi.fn(),
      },
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set emailVerificationSentDate to now', async () => {
    await onExecutePreUserRegistration({}, api);

    expect(api.user.setUserMetadata).toHaveBeenCalledWith(
      'emailVerificationSentDate',
      1433619900000,
    );
  });
});
