import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { expect, isLocalBaseUrl, test as setup } from './test';

const authFile = resolve('playwright/.auth/user.json');

setup(
  'authenticate through Auth0',
  async ({ baseURL, completeAuthentication, page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Welcome back' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Sign in securely' }).click();
    const companiesHeading = page.getByRole('heading', {
      level: 1,
      name: 'My companies',
    });

    await completeAuthentication(companiesHeading);
    await page.waitForURL((url) => url.pathname === '/my-companies');

    if (!isLocalBaseUrl(baseURL)) {
      await page.reload();
      await expect(companiesHeading).toBeVisible();
    }
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            Object.keys(window.localStorage).filter((key) =>
              key.startsWith('@@auth0spajs@@'),
            ).length,
        ),
      )
      .toBe(0);
    await mkdir(dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });
  },
);
