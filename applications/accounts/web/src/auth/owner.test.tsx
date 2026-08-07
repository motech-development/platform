import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  accountsOwnerIdFromAuth0User,
  AccountsOwnerProvider,
  useAccountsOwnerId,
} from './owner';

describe('Accounts Owner ID', () => {
  it('adapts the established Auth0 identity without changing its value', () => {
    expect(accountsOwnerIdFromAuth0User({ sub: 'auth0|accounts-owner' })).toBe(
      'auth0|accounts-owner',
    );
    expect(accountsOwnerIdFromAuth0User(undefined)).toBeUndefined();
  });

  it('provides the domain identity without exposing Auth0 to consumers', () => {
    const ownerId = accountsOwnerIdFromAuth0User({
      sub: 'auth0|accounts-owner',
    });

    if (!ownerId) {
      throw new Error('Expected an Accounts Owner ID');
    }

    const wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
      <AccountsOwnerProvider ownerId={ownerId}>
        {children}
      </AccountsOwnerProvider>
    );
    const { result } = renderHook(() => useAccountsOwnerId(), { wrapper });

    expect(result.current).toBe('auth0|accounts-owner');
  });

  it('rejects use outside the authenticated owner boundary', () => {
    expect(() => renderHook(() => useAccountsOwnerId())).toThrow(
      'The authenticated Accounts Owner ID is not ready',
    );
  });
});
