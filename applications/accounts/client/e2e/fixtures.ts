import AxeBuilder from '@axe-core/playwright';
import { test as base } from '@playwright/test';
import { Result } from 'axe-core';
import account from './fixtures/data/account.json';
import client from './fixtures/data/client.json';
import company from './fixtures/data/company.json';
import setting from './fixtures/data/setting.json';

function format(type: string, value: string) {
  switch (type) {
    case 'currency':
      return `£${Math.abs(parseFloat(value)).toFixed(2)}`;
    case 'percentage':
      return `${value}%`;
    case 'sort code':
      return value.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
    case 'VAT registration':
      return `GB${value}`;
    default:
      throw new Error('Format unknown');
  }
}

interface IFixtures {
  a11yWithLogs: () => Promise<Result[]>;
  accounts: {
    amount: string;
    category: string;
    description: string;
    supplier: string;
    type: string;
    vat: string;
  }[];
  clients: {
    address: {
      line1: string;
      line2: string;
      line3: string;
      line4: string;
      line5: string;
    };
    contact: {
      email: string;
      telephone: string;
    };
    name: string;
  }[];
  companies: {
    balance: {
      balance: string;
      vat: {
        owed: string;
        paid: string;
      };
    };
    company: {
      address: {
        line1: string;
        line2: string;
        line3: string;
        line4: string;
        line5: string;
      };
      bank: {
        accountNumber: string;
        sortCode: string;
      };
      companyNumber: string;
      contact: {
        email: string;
        telephone: string;
      };
      name: string;
    };
    vat: {
      charge: string;
      pay: string;
      registration: string;
      scheme: string;
    };
    yearEnd: {
      day: string;
      month: string;
    };
  }[];
  format: typeof format;
  settings: {
    categories: {
      name: string;
      vatRate: string;
    }[];
    vat: {
      charge: string;
      pay: string;
      registration: string;
      scheme: string;
    };
    yearEnd: {
      day: string;
      month: string;
    };
  }[];
}

export const test = base.extend<IFixtures>({
  a11yWithLogs: async ({ page }, use) => {
    const checkAccessibility = async () => {
      const axeBuilder = new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .exclude('#element-to-ignore');

      const { violations } = await axeBuilder.analyze();

      if (violations.length > 0) {
        console.log(
          `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected`,
        );

        const violationData = violations.map(
          ({ id, impact, description, nodes }) => ({
            description,
            id,
            impact,
            nodes: nodes.length,
          }),
        );

        console.table(violationData);
      }

      return violations;
    };

    await use(checkAccessibility);
  },
  accounts: async ({}, use) => {
    await use(account as IFixtures['accounts']);
  },
  clients: async ({}, use) => {
    await use(client as IFixtures['clients']);
  },
  companies: async ({}, use) => {
    await use(company as unknown as IFixtures['companies']);
  },
  format: async ({}, use) => {
    await use(format);
  },
  settings: async ({}, use) => {
    await use(setting as unknown as IFixtures['settings']);
  },
});

export { expect } from '@playwright/test';
