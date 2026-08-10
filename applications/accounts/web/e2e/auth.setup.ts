import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { isLocalBaseUrl } from './auth';
import { expect, test as setup } from './test';

const authFile = resolve('playwright/.auth/user.json');

setup('authenticate through Auth0', async ({ baseURL, page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sign in securely' }).click();
  await page.getByLabel('Email address').fill(process.env.E2E_USERNAME!);
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL((url) => url.pathname === '/my-companies');
  await expect(
    page.getByRole('heading', { level: 1, name: 'My companies' }),
  ).toBeVisible();

  if (!isLocalBaseUrl(baseURL)) {
    await page.reload();
    await expect(
      page.getByRole('heading', { name: /companies/i }),
    ).toBeVisible();
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
});
