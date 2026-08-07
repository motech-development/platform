import {
  beginAccessTokenRenewal,
  completeAccessTokenRenewal,
  getAccessToken,
  setAccessTokenProvider,
} from './token';

describe('access token renewal', () => {
  afterEach(() => {
    completeAccessTokenRenewal();
    setAccessTokenProvider(undefined);
  });

  it('holds authenticated requests until token renewal completes', async () => {
    const provider = vi.fn().mockResolvedValue('renewed-token');

    setAccessTokenProvider(provider);
    beginAccessTokenRenewal();

    const token = getAccessToken();
    await Promise.resolve();

    expect(provider).not.toHaveBeenCalled();

    completeAccessTokenRenewal();

    await expect(token).resolves.toBe('renewed-token');
    expect(provider).toHaveBeenCalledOnce();
  });
});
