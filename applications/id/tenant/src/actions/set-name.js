exports.onExecutePostLogin = async (event, api) => {
  const { secrets, user } = event;
  const { family_name: familyName, given_name: givenName } =
    user.user_metadata ?? {};

  if (!familyName || !givenName) {
    return;
  }

  const { ManagementClient } = require('auth0');
  const managementClient = new ManagementClient({
    clientId: secrets.CLIENT_ID,
    clientSecret: secrets.CLIENT_SECRET,
    domain: secrets.DOMAIN,
  });

  await managementClient.users.update(user.user_id, {
    family_name: familyName,
    given_name: givenName,
    name: `${givenName} ${familyName}`,
  });

  api.user.setUserMetadata('family_name', null);
  api.user.setUserMetadata('given_name', null);
};
