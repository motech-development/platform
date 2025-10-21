import { join } from 'node:path';
import { expect, test as setup } from '@playwright/test';

const authFile = join(__dirname, '../playwright/.auth/user.json');

setup('Authenticate', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('button', {
      name: 'Log in',
    })
    .click();

  await page.getByLabel('Email address').fill(process.env.E2E_USERNAME!);

  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);

  await page
    .getByRole('button', {
      name: 'Log in',
    })
    .click();

  await page.waitForURL('/my-companies');

  await expect(
    page.getByRole('heading', {
      name: 'My companies',
    }),
  ).toBeVisible();

  await page.context().storageState({
    path: authFile,
  });
});
