const { ManagementClient } = require('auth0');
const { onExecutePostLogin } = require('../force-email-verification');

describe('force-email-verification', () => {
  let api;
  let create;
  let event;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2015-06-06T19:45:00Z'));

    create = vi.fn();
    vi.spyOn(ManagementClient.prototype, 'jobs', 'get').mockReturnValue({
      verificationEmail: {
        create,
      },
    });

    api = {
      access: {
        deny: vi.fn(),
      },
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
        user_metadata: {},
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('when user is verified', () => {
    beforeEach(() => {
      event.user.email_verified = true;
    });

    it('should not update meta data if emailVerificationSentDate does not exist', async () => {
      await onExecutePostLogin(event, api);

      expect(api.user.setUserMetadata).not.toHaveBeenCalled();
    });

    it('should remove emailVerificationSentDate if it exists', async () => {
      event.user.user_metadata.emailVerificationSentDate = Date.now();

      await onExecutePostLogin(event, api);

      expect(api.user.setUserMetadata).toHaveBeenCalledWith(
        'emailVerificationSentDate',
        null,
      );
    });

    it('should allow the login', async () => {
      await onExecutePostLogin(event, api);

      expect(api.access.deny).not.toHaveBeenCalled();
    });
  });

  describe('when user is not verified', () => {
    beforeEach(() => {
      event.user.email_verified = false;
      console.log = vi.fn();
    });

    it('should deny the login', async () => {
      await onExecutePostLogin(event, api);

      expect(api.access.deny).toHaveBeenCalledWith(
        'Please verify your email before logging in.',
      );
    });

    it('should not resend the verification email if it was sent within a day', async () => {
      event.user.user_metadata.emailVerificationSentDate =
        Date.now() - 1000 * 60 * 60 * 23;

      await onExecutePostLogin(event, api);

      expect(create).not.toHaveBeenCalled();
      expect(api.user.setUserMetadata).not.toHaveBeenCalled();
    });

    it('should resend the verification email if it has never been sent', async () => {
      event.user.user_metadata = undefined;

      await onExecutePostLogin(event, api);

      expect(create).toHaveBeenCalledWith({
        user_id: 'user-id',
      });
    });

    it('should resend the verification email if it was sent over a day ago', async () => {
      event.user.user_metadata.emailVerificationSentDate =
        Date.now() - 1000 * 60 * 60 * 24;

      await onExecutePostLogin(event, api);

      expect(create).toHaveBeenCalledWith({
        user_id: 'user-id',
      });
    });

    it('should update the emailVerificationSentDate to now', async () => {
      await onExecutePostLogin(event, api);

      expect(api.user.setUserMetadata).toHaveBeenCalledWith(
        'emailVerificationSentDate',
        1433619900000,
      );
    });

    it('should log an error and still deny the login if the email cannot be sent', async () => {
      create.mockRejectedValueOnce(new Error('Something has gone wrong'));

      await onExecutePostLogin(event, api);

      expect(console.log).toHaveBeenCalledWith('Something has gone wrong');
      expect(api.access.deny).toHaveBeenCalledWith(
        'Please verify your email before logging in.',
      );
    });
  });
});
