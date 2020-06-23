module.exports = (user, _, cb) => {
  const response = {};
  const now = new Date().valueOf();

  response.user = user;

  response.user.user_metadata = user.user_metadata || {};
  response.user.user_metadata.emailVerificationSentDate = now;

  cb(null, response);
};
