const { onExecutePostLogin } = require('../set-owner-id');

describe('set-owner-id', () => {
  it('should set the owner ID claim on the access token to the user ID', async () => {
    const api = {
      accessToken: {
        setCustomClaim: vi.fn(),
      },
    };
    const event = {
      user: {
        user_id: 'auth0|user-id',
      },
    };

    await onExecutePostLogin(event, api);

    expect(api.accessToken.setCustomClaim).toHaveBeenCalledWith(
      'https://motechdevelopment.co.uk/owner_id',
      'auth0|user-id',
    );
  });
});
