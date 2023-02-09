export interface IAccount {
  amount: string;
  category: string;
  description: string;
  supplier: string;
  type: string;
  vat: string;
}

export type TAccounts = IAccount[];
