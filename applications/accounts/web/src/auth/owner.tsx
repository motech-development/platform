import type { User } from '@auth0/auth0-react';
import { createContext, type ReactNode, useContext } from 'react';

declare const accountsOwnerIdBrand: unique symbol;

export type AccountsOwnerId = string & {
  readonly [accountsOwnerIdBrand]: 'AccountsOwnerId';
};

export function accountsOwnerIdFromAuth0User(
  user: Pick<User, 'sub'> | undefined,
): AccountsOwnerId | undefined {
  return user?.sub ? (user.sub as AccountsOwnerId) : undefined;
}

const AccountsOwnerContext = createContext<AccountsOwnerId | undefined>(
  undefined,
);

export function AccountsOwnerProvider({
  children,
  ownerId,
}: Readonly<{
  children: ReactNode;
  ownerId: AccountsOwnerId;
}>) {
  return (
    <AccountsOwnerContext.Provider value={ownerId}>
      {children}
    </AccountsOwnerContext.Provider>
  );
}

export function useAccountsOwnerId(): AccountsOwnerId {
  const ownerId = useContext(AccountsOwnerContext);

  if (!ownerId) {
    throw new Error('The authenticated Accounts Owner ID is not ready');
  }

  return ownerId;
}
