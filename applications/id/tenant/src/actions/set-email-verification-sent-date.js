exports.onExecutePreUserRegistration = async (_, api) => {
  api.user.setUserMetadata('emailVerificationSentDate', Date.now());
};
