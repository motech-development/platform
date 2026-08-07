import { resolveNavigation } from './navigation';

describe('service-worker navigation', () => {
  it('uses the network response while online', async () => {
    const networkResponse = new Response('online shell');
    const offlineShell = vi.fn();

    await expect(
      resolveNavigation(() => Promise.resolve(networkResponse), offlineShell),
    ).resolves.toBe(networkResponse);
    expect(offlineShell).not.toHaveBeenCalled();
  });

  it('boots the precached public shell when navigation is offline', async () => {
    const offlineResponse = new Response('offline shell');

    await expect(
      resolveNavigation(
        () => Promise.reject(new TypeError('Failed to fetch')),
        () => Promise.resolve(offlineResponse),
      ),
    ).resolves.toBe(offlineResponse);
  });
});
