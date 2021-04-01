export enum TransactionStatus {
  Confirmed = 'confirmed',
  Pending = 'pending',
}

export interface ITransaction {
  __typename: string;
  amount: number;
  attachment: string;
  category: string;
  companyId: string;
  date: string;
  description: string;
  id: string;
  name: string;
  owner: string;
  refund: boolean;
  scheduled: boolean;
  status: TransactionStatus;
  vat: number;
}
