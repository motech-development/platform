import AxeBuilder from '@axe-core/playwright';
import {
  type BrowserContextOptions,
  expect,
  type Locator,
  type Response,
  test as base,
} from '@playwright/test';
import accountFixtures from './fixtures/data/account.json' with { type: 'json' };
import clientFixtures from './fixtures/data/client.json' with { type: 'json' };
import companyFixtures from './fixtures/data/company.json' with { type: 'json' };
import settingFixtures from './fixtures/data/setting.json' with { type: 'json' };

export function isLocalBaseUrl(baseURL: string | undefined): boolean {
  if (!baseURL) return true;

  const { hostname } = new URL(baseURL);

  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export interface AccountsFixtures {
  accounts: typeof accountFixtures;
  addCompanyCategory: (name: string, vatRate: string) => Promise<void>;
  clients: typeof clientFixtures;
  completeAuthentication: (content: Locator) => Promise<void>;
  dismissNotifications: (notifications: Locator) => Promise<void>;
  expectNoA11yViolations: (readyState: Locator) => Promise<void>;
  focusWithKeyboard: (
    target: Locator,
    unreachableMessage: string,
  ) => Promise<void>;
  format: (type: string, value: string) => string;
  gotoAuthenticatedPage: (options: {
    content: Locator;
    path: string;
  }) => Promise<void>;
  openAccountsRoute: () => Promise<string>;
  openCompany: (companyName: string) => Promise<void>;
  openCompanyClients: (companyName: string) => Promise<void>;
  openCompanyDetails: (companyName: string) => Promise<void>;
  openCompanySettings: (companyName: string) => Promise<void>;
  selectMonth: (month: string) => Promise<void>;
  settings: typeof settingFixtures;
}

interface AccountsWorkerFixtures {
  cleanupCompany: (options: {
    baseURL: string | undefined;
    companyName: string;
    storageState: BrowserContextOptions['storageState'];
  }) => Promise<void>;
  companies: typeof companyFixtures;
}

export const test = base.extend<AccountsFixtures, AccountsWorkerFixtures>({
  accounts: async ({}, use) => {
    await use(accountFixtures);
  },
  addCompanyCategory: async ({ page }, use) => {
    await use(async (name, vatRate) => {
      await page.getByRole('button', { name: 'Add a new category' }).click();
      await page.getByLabel('New category name').fill(name);
      await page.getByLabel(`VAT rate for ${name}`).fill(vatRate);
    });
  },
  cleanupCompany: [
    async ({ browser }, use) => {
      await use(async ({ baseURL, companyName, storageState }) => {
        const page = await browser.newPage({ baseURL, storageState });

        try {
          async function openCompanyList(): Promise<Locator> {
            await page.goto('/my-companies');
            await expect(
              page.getByRole('heading', { name: 'My companies' }),
            ).toBeVisible();
            await expect(
              page.getByRole('status', { name: 'Loading companies' }),
            ).toHaveCount(0);

            return page.getByTestId(companyName);
          }

          async function deleteMatchingCompanies(): Promise<void> {
            const company = await openCompanyList();
            const remainingCompanies = await company.count();

            if (remainingCompanies === 0) return;

            await company.first().click();
            await page
              .getByRole('link', { name: /Manage company details/ })
              .click();
            await page.getByRole('button', { name: 'Delete company' }).click();
            await page
              .getByLabel(`Type ${companyName} to confirm`)
              .fill(companyName);
            await page
              .getByRole('button', { name: 'Permanently delete company' })
              .click();
            await expect(
              page.getByRole('heading', { name: 'My companies' }),
            ).toBeVisible();
            await expect(await openCompanyList()).toHaveCount(
              remainingCompanies - 1,
            );

            await deleteMatchingCompanies();
          }

          await deleteMatchingCompanies();
        } finally {
          await page.close();
        }
      });
    },
    { scope: 'worker' },
  ],
  clients: async ({}, use) => {
    await use(clientFixtures);
  },
  companies: [async ({}, use) => use(companyFixtures), { scope: 'worker' }],
  completeAuthentication: async ({ baseURL, page }, use) => {
    await use(async (content) => {
      const consent = page.locator('button#allow');
      const email = page.getByLabel('Email address');

      if (
        baseURL &&
        new URL(page.url()).hostname === new URL(baseURL).hostname
      ) {
        await expect(content).toBeVisible();

        return;
      }

      await expect(content.or(consent).or(email)).toBeVisible();

      if (await email.isVisible()) {
        await email.fill(process.env.E2E_USERNAME!);
        await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);
        await page.getByRole('button', { name: 'Log in' }).click();
        await expect(content.or(consent)).toBeVisible();
      }

      if (await consent.isVisible()) {
        await consent.click();
      }

      await expect(content).toBeVisible();
    });
  },
  dismissNotifications: async ({ page }, use) => {
    await use(async (notifications) => {
      let resolveMarkReadResponse: (response: Response) => void = () =>
        undefined;
      const markReadResponse = new Promise<Response>((resolve) => {
        resolveMarkReadResponse = resolve;
      });
      const captureMarkReadResponse = (response: Response) => {
        const request = response.request();

        if (request.method() !== 'POST') return;

        try {
          const body = request.postDataJSON() as { operationName?: unknown };

          if (body.operationName === 'MarkNotificationsRead') {
            resolveMarkReadResponse(response);
          }
        } catch {
          // Other POST responses do not participate in notification dismissal.
        }
      };

      page.on('response', captureMarkReadResponse);

      try {
        const hasUnreadNotifications = await notifications.evaluate(
          (button) => {
            const hasUnread =
              button.getAttribute('aria-label') !== 'Notifications (0 unread)';

            if (!(button instanceof HTMLElement)) {
              throw new Error('Notifications trigger is not interactive');
            }

            button.click();

            return hasUnread;
          },
        );

        if (hasUnreadNotifications) {
          const response = await markReadResponse;
          const result = (await response.json()) as {
            data?: {
              markAsRead?: {
                items?: Array<{ read?: boolean } | null> | null;
              } | null;
            };
            errors?: unknown;
          };
          const items = result.data?.markAsRead?.items;

          expect(response.ok()).toBe(true);
          expect(result.errors).toBeUndefined();
          expect(items?.length).toBeGreaterThan(0);
          expect(items?.every((item) => item?.read)).toBe(true);
        }
      } finally {
        page.off('response', captureMarkReadResponse);
      }

      await expect(
        page.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toBeVisible();
    });
  },
  expectNoA11yViolations: async ({ page }, use) => {
    await use(async (readyState) => {
      await expect(readyState).toBeVisible();
      await readyState.evaluate(async (element) => {
        await Promise.allSettled(
          element.ownerDocument
            .getAnimations()
            .map((animation) => animation.finished),
        );
      });
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(violations).toEqual([]);
    });
  },
  focusWithKeyboard: async ({ page }, use) => {
    await use(async (target, unreachableMessage) => {
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
          throw new Error(unreachableMessage);
        }

        await advanceUntilTarget();
      }

      try {
        await advanceUntilTarget();
      } finally {
        await firstFocusedElement.dispose();
      }
    });
  },
  format: async ({}, use) => {
    await use((type, value) => {
      switch (type) {
        case 'currency':
          return `£${Math.abs(parseFloat(value)).toFixed(2)}`;
        case 'month':
          return new Intl.DateTimeFormat('en-GB', {
            month: 'long',
            timeZone: 'UTC',
          }).format(new Date(Date.UTC(2000, parseInt(value, 10), 1)));
        case 'percentage':
          return `${value}%`;
        case 'sort code':
          return value.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
        case 'VAT registration':
          return `GB${value}`;
        default:
          throw new Error('Format unknown');
      }
    });
  },
  gotoAuthenticatedPage: async (
    { baseURL, completeAuthentication, page },
    use,
  ) => {
    await use(async ({ content, path }) => {
      const destination = new URL(path, baseURL ?? page.url());

      if (isLocalBaseUrl(baseURL)) {
        if (page.url() === 'about:blank') {
          await page.goto('/');
        }

        const companiesHeading = page.getByRole('heading', {
          name: 'My companies',
        });
        const signIn = page.getByRole('button', {
          name: 'Sign in securely',
        });

        if (new URL(page.url()).pathname === '/') {
          await expect(companiesHeading.or(signIn)).toBeVisible();
        }

        if (await signIn.isVisible()) {
          await signIn.click();
          await completeAuthentication(companiesHeading);
        }

        await page.evaluate((href) => {
          window.history.pushState(null, '', href);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, path);
      } else {
        await page.goto(path);
      }

      await completeAuthentication(content);
      await expect
        .poll(() => new URL(page.url()).pathname)
        .toBe(destination.pathname);
    });
  },
  openAccountsRoute: async (
    { companies, gotoAuthenticatedPage, page },
    use,
  ) => {
    await use(async () => {
      await gotoAuthenticatedPage({
        content: page.getByRole('heading', { name: 'My companies' }),
        path: '/my-companies',
      });
      await page.getByTestId(companies[0].company.name).click();
      const companyId = new URL(page.url()).pathname.split('/').at(-1);

      if (!companyId) {
        throw new Error('Company route did not expose its identifier');
      }

      const path = `/my-companies/accounts/${companyId}`;

      await gotoAuthenticatedPage({
        content: page.getByRole('heading', { name: 'Accounts' }).last(),
        path,
      });

      return path;
    });
  },
  openCompany: async ({ page }, use) => {
    await use(async (companyName) => {
      await page.getByTestId(companyName).click();
      await expect(
        page.getByRole('heading', { level: 1, name: companyName }),
      ).toBeVisible();
    });
  },
  openCompanyClients: async ({ openCompany, page }, use) => {
    await use(async (companyName) => {
      await openCompany(companyName);
      await page.getByRole('link', { name: /Manage clients/ }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' }),
      ).toBeVisible();
      await expect(page).toHaveURL(/my-companies\/clients\/[0-9a-f-]+$/);
    });
  },
  openCompanyDetails: async ({ openCompany, page }, use) => {
    await use(async (companyName) => {
      await openCompany(companyName);
      await page.getByRole('link', { name: /Manage company details/ }).click();
      await expect(
        page.getByRole('heading', { level: 1, name: 'Company details' }),
      ).toBeVisible();
    });
  },
  openCompanySettings: async ({ openCompany, page }, use) => {
    await use(async (companyName) => {
      await openCompany(companyName);
      await page.getByRole('link', { name: /Manage settings/ }).click();
      await expect(
        page.getByRole('heading', { exact: true, name: 'Settings' }),
      ).toBeVisible();
    });
  },
  selectMonth: async ({ format, page }, use) => {
    await use(async (month) => {
      await page.getByLabel('Month').click();
      await page
        .getByRole('option', { exact: true, name: format('month', month) })
        .click();
    });
  },
  settings: async ({}, use) => {
    await use(settingFixtures);
  },
});

export { expect };
