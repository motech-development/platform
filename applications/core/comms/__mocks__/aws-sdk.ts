import * as AWS from 'aws-sdk';

AWS.SES.prototype.deleteIdentity = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

AWS.SES.prototype.verifyDomainIdentity = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    VerificationToken: 'VERIFICATION_CODE',
  }),
});

AWS.SES.prototype.verifyDomainDkim = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    DkimTokens: ['DKIM-1', 'DKIM-2', 'DKIM-3'],
  }),
});

module.exports = AWS;
