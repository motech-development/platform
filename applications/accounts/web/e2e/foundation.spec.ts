import {
  expect,
  getFormInput,
  isLocalBaseUrl,
  selectRadioOption,
  test,
} from './test';

interface PersistedState {
  cacheEntries: { body?: string; url: string }[];
  databaseEntries: string[];
  databaseNames: (string | undefined)[];
  localStorageEntries: [string, string][];
  sessionStorageEntries: [string, string][];
}

test.describe('hosted Accounts foundation', () => {
  test.skip(
    process.env.ACCOUNTS_WEB_HOSTED_SMOKE !== 'true',
    'Requires the designated Accounts smoke-test fixture',
  );

  test('supports keyboard use and the configured viewport without overflow', async ({
    baseURL,
    expectNoA11yViolations,
    focusWithKeyboard,
    gotoAuthenticatedPage,
    openAccountsRoute,
    page,
  }) => {
    await openAccountsRoute();
    const recordTransaction = page.getByRole('link', {
      name: 'Record transaction',
    });

    await focusWithKeyboard(
      recordTransaction,
      'Record transaction link was not reachable by keyboard',
    );
    await expect(recordTransaction).toBeFocused();

    const recordTransactionHeading = page.getByRole('heading', {
      name: 'Record transaction',
    });
    const recordTransactionPath = isLocalBaseUrl(baseURL)
      ? await recordTransaction.getAttribute('href')
      : null;

    if (isLocalBaseUrl(baseURL) && !recordTransactionPath) {
      throw new Error('Record transaction link did not expose a path');
    }

    await page.keyboard.press('Enter');

    if (recordTransactionPath) {
      await expect
        .poll(() => new URL(page.url()).pathname)
        .toBe(recordTransactionPath);

      const browserSession = await page.context().newCDPSession(page);

      await browserSession.send('Page.stopLoading');
      await browserSession.detach();
      await gotoAuthenticatedPage({
        content: recordTransactionHeading,
        path: recordTransactionPath,
      });

      const unavailableForm = page.getByRole('region', {
        name: 'Transaction form unavailable',
      });

      if (await unavailableForm.isVisible()) {
        await unavailableForm
          .getByRole('button', { name: 'Try again' })
          .click();
      }
    }

    await expect(recordTransactionHeading).toBeVisible();
    const description = getFormInput(page, 'Description');

    await expect(description).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() =>
          Boolean(document.activeElement?.closest('[role="dialog"]')),
        ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expectNoA11yViolations(description);
  });

  test('serves direct links and an offline public shell without persisting account data', async ({
    companies,
    gotoAuthenticatedPage,
    openAccountsRoute,
    page,
  }) => {
    const directPath = await openAccountsRoute();

    await gotoAuthenticatedPage({
      content: page.getByRole('heading', { name: 'Transactions' }).last(),
      path: directPath,
    });

    const manifestResponse = await page.request.get('/manifest.webmanifest');

    expect(manifestResponse.ok()).toBe(true);
    await expect(manifestResponse.json()).resolves.toMatchObject({
      display: 'standalone',
      start_url: '/',
    });

    const persistedState = await page.evaluate<PersistedState>(async () => {
      const requestResult = <Value>(request: IDBRequest<Value>) =>
        new Promise<Value>((resolve, reject) => {
          request.addEventListener('error', () =>
            reject(request.error ?? new Error('IndexedDB request failed')),
          );
          request.addEventListener('success', () => resolve(request.result));
        });
      const openDatabase = (name: string) => {
        const request = indexedDB.open(name);

        return requestResult(request);
      };
      const storageEntries = (storage: Storage): [string, string][] =>
        Array.from({ length: storage.length }, (_, index) => {
          const key = storage.key(index) ?? '';

          return [key, storage.getItem(key) ?? ''];
        });
      const cacheEntries = (
        await Promise.all(
          (await caches.keys()).map(async (cacheName) => {
            const cache = await caches.open(cacheName);

            return Promise.all(
              (await cache.keys()).map(async (request) => ({
                body: await (await cache.match(request))?.text(),
                url: request.url,
              })),
            );
          }),
        )
      ).flat();
      const databaseNames = (await indexedDB.databases()).map(
        ({ name }) => name,
      );
      const databaseEntries = (
        await Promise.all(
          databaseNames.map(async (databaseName) => {
            if (!databaseName) {
              return [];
            }

            const database = await openDatabase(databaseName);

            try {
              return await Promise.all(
                Array.from(database.objectStoreNames).map(
                  async (objectStoreName) => {
                    const transaction = database.transaction(
                      objectStoreName,
                      'readonly',
                    );
                    const records = await requestResult(
                      transaction
                        .objectStore(objectStoreName)
                        .getAll() as IDBRequest<unknown[]>,
                    );

                    return JSON.stringify({
                      databaseName,
                      objectStoreName,
                      records,
                    });
                  },
                ),
              );
            } finally {
              database.close();
            }
          }),
        )
      ).flat();

      return {
        cacheEntries,
        databaseEntries,
        databaseNames,
        localStorageEntries: storageEntries(localStorage),
        sessionStorageEntries: storageEntries(sessionStorage),
      };
    });

    expect(
      [
        ...persistedState.localStorageEntries.flat(),
        ...persistedState.sessionStorageEntries.flat(),
        ...persistedState.databaseNames,
        ...persistedState.databaseEntries,
      ].filter((value) => /apollo|auth0|draft|transaction/iu.test(value ?? '')),
    ).toEqual([]);
    expect(
      persistedState.cacheEntries.filter(({ url }) => {
        const resource = new URL(url);

        return (
          resource.pathname.includes('/graphql') ||
          /amazonaws|auth0/iu.test(resource.hostname)
        );
      }),
    ).toEqual([]);
    expect(JSON.stringify(persistedState)).not.toContain(
      companies[0].company.name,
    );

    await page.goto('/');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;

      if (!navigator.serviceWorker.controller) {
        await new Promise<void>((resolve) => {
          navigator.serviceWorker.addEventListener(
            'controllerchange',
            () => resolve(),
            { once: true },
          );
        });
      }
    });
    await page.context().setOffline(true);

    try {
      const offlineResponse = await page.goto('/offline-shell-check', {
        waitUntil: 'domcontentloaded',
      });

      expect(offlineResponse?.ok()).toBe(true);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.getByText('Accounts').first()).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Page not found' }),
      ).toBeVisible();
    } finally {
      await page.context().setOffline(false);
    }
  });

  test('does not queue or replay an accounting write after reconnect', async ({
    openAccountsRoute,
    page,
  }) => {
    await openAccountsRoute();
    await page.getByRole('link', { name: 'Record transaction' }).click();
    await selectRadioOption(page, 'Transaction type', 'Sale');
    await page.getByRole('button', { name: /Client/ }).click();
    await page.getByRole('option', { name: 'Motech Development' }).click();
    await getFormInput(page, 'Description').fill('Offline draft');
    await selectRadioOption(page, undefined, 'Confirmed');
    await page.getByLabel('Amount').fill('100');
    const save = page.getByRole('button', {
      name: /Connection required|Save/,
    });

    let mutationAttempts = 0;

    await page.route('**/*', async (route) => {
      const request = route.request();

      if (
        request.method() === 'POST' &&
        request.postData()?.includes('AddTransaction') === true
      ) {
        mutationAttempts += 1;
        await route.abort('failed');
        return;
      }

      await route.fallback();
    });
    await expect(save).toHaveAccessibleName('Save');
    await expect(save).toBeEnabled();
    await save.click();
    await expect(
      page.getByText('Transaction could not be saved'),
    ).toBeVisible();
    expect(mutationAttempts).toBeGreaterThan(0);
    const mutationAttemptsBeforeReconnect = mutationAttempts;
    await page.context().setOffline(true);

    try {
      await expect(save).toHaveAccessibleName('Connection required');
      await expect(save).toBeDisabled();
      const refetchAfterReconnect = page.waitForRequest(
        (request) =>
          request.method() === 'POST' &&
          request.postData()?.includes('RecordTransaction') === true,
      );
      await page.context().setOffline(false);
      await refetchAfterReconnect;
      await expect(save).toHaveAccessibleName('Save');
      await expect(save).toBeEnabled();

      expect(mutationAttempts).toBe(mutationAttemptsBeforeReconnect);
      await expect(getFormInput(page, 'Description')).toHaveValue(
        'Offline draft',
      );
    } finally {
      await page.context().setOffline(false);
    }
  });
});
