import { describe, expect, it } from 'vitest';
import { companyDestination, companyFromPath } from './navigation';

describe('Accounts shell company navigation', () => {
  it.each([
    ['/my-companies/dashboard/old-company', 'dashboard'],
    ['/my-companies/dashboard/old-company/record-transaction', 'dashboard'],
    ['/my-companies/accounts/old-company', 'accounts'],
    ['/my-companies/accounts/old-company/record-transaction', 'accounts'],
    [
      '/my-companies/accounts/old-company/view-transaction/transaction-id',
      'accounts',
    ],
    ['/my-companies/clients/old-company', 'clients'],
    ['/my-companies/clients/old-company/update-details/client-id', 'clients'],
    ['/my-companies/reports/old-company', 'reports'],
    ['/my-companies/reports/old-company/create-report', 'reports'],
    ['/my-companies/update-details/old-company', 'update-details'],
    ['/my-companies/settings/old-company', 'settings'],
  ])('keeps the safe parent section for %s', (pathname, section) => {
    expect(companyDestination(pathname, 'new/company')).toBe(
      `/my-companies/${section}/new%2Fcompany`,
    );
  });

  it('uses Dashboard when no company section is active', () => {
    expect(companyDestination('/my-companies', 'company-id')).toBe(
      '/my-companies/dashboard/company-id',
    );
  });

  it('reads the selected company from supported company routes', () => {
    expect(
      companyFromPath(
        '/my-companies/accounts/company-id/view-transaction/transaction-id',
      ),
    ).toBe('company-id');
  });
});
