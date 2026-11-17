const resendPeriod = 1000 * 60 * 60 * 24;

exports.onExecutePostLogin = async (event, api) => {
  const { secrets, user } = event;
  const sentDate = user.user_metadata?.emailVerificationSentDate;

  if (user.email_verified) {
    if (sentDate) {
      api.user.setUserMetadata('emailVerificationSentDate', null);
    }

    return;
  }

  const now = Date.now();

  if (!sentDate || now - sentDate >= resendPeriod) {
    api.user.setUserMetadata('emailVerificationSentDate', now);

    try {
      const { ManagementClient } = require('auth0');
      const managementClient = new ManagementClient({
        clientId: secrets.CLIENT_ID,
        clientSecret: secrets.CLIENT_SECRET,
        domain: secrets.DOMAIN,
      });

      await managementClient.jobs.verificationEmail.create({
        user_id: user.user_id,
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  api.access.deny('Please verify your email before logging in.');
};
