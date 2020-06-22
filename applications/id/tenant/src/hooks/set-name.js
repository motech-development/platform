module.exports = (user, _, cb) => {
  const response = {};

  response.user = user;

  if (
    response.user.user_metadata &&
    response.user.user_metadata.family_name &&
    response.user.user_metadata.given_name
  ) {
    const {
      family_name: familyName,
      given_name: givenName,
    } = response.user.user_metadata;

    response.user.family_name = familyName;
    response.user.given_name = givenName;
    response.user.name = `${givenName} ${familyName}`;

    delete response.user.user_metadata.family_name;
    delete response.user.user_metadata.given_name;
  }

  cb(null, response);
};
