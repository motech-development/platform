async function setName(user, context, callback) {
  const { ManagementClient } = require('auth0@3.0.1');
  const managementClient = new ManagementClient({
    domain: auth0.domain,
    token: auth0.accessToken,
  });

  if (
    user.user_metadata &&
    user.user_metadata.family_name &&
    user.user_metadata.given_name
  ) {
    const updated = {
      user_metadata: {
        ...user.user_metadata,
      },
    };
    const { family_name: familyName, given_name: givenName } =
      user.user_metadata;

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

      const mergedUser = {
        ...user,
        ...updated,
      };

      return callback(null, mergedUser, context);
    } catch (e) {
      callback(e);
    }
  }

  return callback(null, user, context);
}
