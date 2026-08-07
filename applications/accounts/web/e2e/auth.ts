import type { Locator, Page } from '@playwright/test';
import { expect } from './test';

interface AuthenticatedPageOptions {
  baseURL: string | undefined;
  content: Locator;
  page: Page;
  path: string;
}

export function isLocalBaseUrl(baseURL: string | undefined): boolean {
  if (!baseURL) {
    return true;
  }

  const { hostname } = new URL(baseURL);

  return hostname === 'localhost' || hostname === '127.0.0.1';
}

async function authenticateLocalPage(page: Page): Promise<void> {
  if (page.url() === 'about:blank') {
    await page.goto('/');
  }

  const companiesHeading = page.getByRole('heading', {
    name: 'My companies',
  });
  const signInButton = page.getByRole('button', {
    name: 'Sign in securely',
  });

  if (new URL(page.url()).pathname === '/') {
    await expect(companiesHeading.or(signInButton)).toBeVisible();
  }

  if (await signInButton.isVisible()) {
    await signInButton.click();
    const allowConsentButton = page.locator('button#allow');
    const email = page.getByLabel('Email address');

    await expect(
      companiesHeading.or(allowConsentButton).or(email),
    ).toBeVisible();

    if (await email.isVisible()) {
      await email.fill(process.env.E2E_USERNAME!);
      await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);
      await page.getByRole('button', { name: 'Log in' }).click();
      await expect(companiesHeading.or(allowConsentButton)).toBeVisible();
    }

    if (await allowConsentButton.isVisible()) {
      await allowConsentButton.click();
    }

    await expect(companiesHeading).toBeVisible();
  }
}

export async function gotoAuthenticatedPage({
  baseURL,
  content,
  page,
  path,
}: AuthenticatedPageOptions): Promise<void> {
  const destination = new URL(path, baseURL ?? page.url());

  if (isLocalBaseUrl(baseURL)) {
    await authenticateLocalPage(page);
    await page.evaluate((href) => {
      window.history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, path);
  } else {
    await page.goto(path);
  }

  await expect(content).toBeVisible();
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe(destination.pathname);
}
