async function emailVerified(user, context, callback) {
  const { ManagementClient } = require('auth0@2.23.0');

  const managementClient = new ManagementClient({
    domain: auth0.domain,
    token: auth0.accessToken,
  });

  const metadata = user.user_metadata || {};

  const resendVerificationEmailIfExpired = async () => {
    const expirationPeriod = 1000 * 60 * 60 * 24;
    const lastSent = metadata.emailVerificationSentDate;
    const now = new Date().valueOf();

    if (lastSent && now - lastSent < expirationPeriod) {
      return;
    }

    metadata.emailVerificationSentDate = now;

    try {
      await Promise.all([
        managementClient.sendEmailVerification({
          user_id: user.user_id,
        }),
        managementClient.updateUserMetadata(
          {
            id: user.user_id,
          },
          metadata,
        ),
      ]);
    } catch (e) {
      console.log(e.message);
    }
  };

  if (!user.email_verified) {
    await resendVerificationEmailIfExpired();

    return callback(
      new UnauthorizedError('Please verify your email before logging in.'),
    );
  }

  if (metadata.emailVerificationSentDate) {
    delete metadata.emailVerificationSentDate;

    try {
      await managementClient.updateUserMetadata(
        {
          id: user.user_id,
        },
        metadata,
      );
    } catch (e) {
      console.log(e.message);
    }
  }

  const updated = {
    ...user,
    user_metadata: {
      ...metadata,
    },
  };

  return callback(null, updated, context);
}
