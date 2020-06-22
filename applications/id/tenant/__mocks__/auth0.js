const auth0 = jest.genMockFromModule('auth0');

auth0.ManagementClient.prototype.sendEmailVerification = jest.fn();
auth0.ManagementClient.prototype.updateUserMetadata = jest.fn();

module.exports = auth0;
