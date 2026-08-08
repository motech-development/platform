import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
import { gotoAuthenticatedPage, isLocalBaseUrl } from './auth';
import { expect, test } from './test';

interface PersistedState {
  cacheEntries: { body?: string; url: string }[];
  databaseEntries: string[];
  databaseNames: (string | undefined)[];
  localStorageEntries: [string, string][];
  sessionStorageEntries: [string, string][];
}

async function focusWithKeyboard(page: Page, target: Locator): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await page.keyboard.press('Tab');
  const firstFocusedElement = await page.evaluateHandle(
    () => document.activeElement,
  );

  async function advanceUntilTarget(): Promise<void> {
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      return;
    }

    await page.keyboard.press('Tab');

    if (
      await firstFocusedElement.evaluate(
        (firstElement) => firstElement === document.activeElement,
      )
    ) {
      throw new Error('Record transaction link was not reachable by keyboard');
    }

    await advanceUntilTarget();
  }

  try {
    await advanceUntilTarget();
  } finally {
    await firstFocusedElement.dispose();
  }
}

async function openAccountsRoute(page: Page, baseURL: string | undefined) {
  await gotoAuthenticatedPage({
    baseURL,
    content: page.getByRole('heading', { name: 'My companies' }),
    page,
    path: '/my-companies',
  });
  await page.getByTestId('VAT registered co.').click();
  const companyId = new URL(page.url()).pathname.split('/').at(-1);

  if (!companyId) {
    throw new Error('Company route did not expose its identifier');
  }

  const path = `/my-companies/accounts/${companyId}`;

  await gotoAuthenticatedPage({
    baseURL,
    content: page.getByRole('heading', { name: 'Accounts' }).last(),
    page,
    path,
  });

  return path;
}

test.describe('hosted Accounts foundation', () => {
  test.skip(
    process.env.ACCOUNTS_WEB_HOSTED_SMOKE !== 'true',
    'Requires the designated Accounts smoke-test fixture',
  );

  test('supports keyboard use and the configured viewport without overflow', async ({
    baseURL,
    page,
  }) => {
    await openAccountsRoute(page, baseURL);
    const recordTransaction = page.getByRole('link', {
      name: 'Record transaction',
    });

    await focusWithKeyboard(page, recordTransaction);
    await expect(recordTransaction).toBeFocused();

    if (isLocalBaseUrl(baseURL)) {
      await recordTransaction.evaluate((element) => {
        element.addEventListener(
          'click',
          (event) => {
            event.preventDefault();
            element.setAttribute('data-keyboard-activated', 'true');
          },
          { once: true },
        );
      });
    }

    await page.keyboard.press('Enter');
    const recordTransactionHeading = page.getByRole('heading', {
      name: 'Record transaction',
    });

    if (isLocalBaseUrl(baseURL)) {
      await expect(recordTransaction).toHaveAttribute(
        'data-keyboard-activated',
        'true',
      );
      const recordTransactionPath =
        await recordTransaction.getAttribute('href');

      if (!recordTransactionPath) {
        throw new Error('Record transaction link did not expose a path');
      }

      await gotoAuthenticatedPage({
        baseURL,
        content: recordTransactionHeading,
        page,
        path: recordTransactionPath,
      });
    }

    await expect(recordTransactionHeading).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
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
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(violations).toEqual([]);
  });

  test('serves direct links and an offline public shell without persisting account data', async ({
    baseURL,
    page,
  }) => {
    const directPath = await openAccountsRoute(page, baseURL);

    await gotoAuthenticatedPage({
      baseURL,
      content: page.getByRole('heading', { name: 'Accounts' }).last(),
      page,
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
    expect(JSON.stringify(persistedState)).not.toContain('VAT registered co.');

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
    baseURL,
    page,
  }) => {
    await openAccountsRoute(page, baseURL);
    await page.getByRole('link', { name: 'Record transaction' }).click();
    await page.getByRole('button', { name: /Supplier/ }).click();
    await page.getByRole('option', { name: 'Motech Development' }).click();
    await page.getByLabel('Description').fill('Offline draft');
    await page.getByLabel('Amount').fill('100');
    const save = page.locator('button[type="submit"]');

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
    await expect(page.getByText('Sale could not be recorded')).toBeVisible();
    expect(mutationAttempts).toBe(1);
    await page.context().setOffline(true);

    try {
      await expect(save).toHaveAccessibleName('Connection required');
      await expect(save).toBeDisabled();
      const refetchAfterReconnect = page.waitForRequest(
        (request) =>
          request.method() === 'POST' &&
          request.postData()?.includes('AccountsWebRecordTransaction') === true,
      );
      await page.context().setOffline(false);
      await refetchAfterReconnect;
      await expect(save).toHaveAccessibleName('Save');
      await expect(save).toBeEnabled();

      expect(mutationAttempts).toBe(1);
      await expect(page.getByLabel('Description')).toHaveValue('Offline draft');
    } finally {
      await page.context().setOffline(false);
    }
  });
});
