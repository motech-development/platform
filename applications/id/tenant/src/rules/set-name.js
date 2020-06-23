async function setName(user, context, callback) {
  const { ManagementClient } = require('auth0@2.23.0');
  const managementClient = new ManagementClient({
    domain: auth0.domain,
    token: auth0.accessToken,
  });
  const updated = {
    ...user,
  };

  if (
    user.user_metadata &&
    user.user_metadata.family_name &&
    user.user_metadata.given_name
  ) {
    const {
      family_name: familyName,
      given_name: givenName,
    } = user.user_metadata;

    updated.family_name = familyName;
    updated.given_name = givenName;
    updated.name = `${givenName} ${familyName}`;

    delete updated.user_metadata.family_name;
    delete updated.user_metadata.given_name;

    try {
      await managementClient.updateUser(
        {
          id: user.user_id,
        },
        updated,
      );
    } catch (e) {
      callback(e);
    }
  }

  return callback(null, updated, context);
}
