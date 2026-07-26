import { ManagementClient } from 'auth0';

ManagementClient.prototype.sendEmailVerification = vi.fn();
ManagementClient.prototype.updateUser = vi.fn();
ManagementClient.prototype.updateUserMetadata = vi.fn();
