import { gql } from '@apollo/client';

export interface IOnTransactionInput {
  id: string;
  owner: string;
}

export interface IOnTransactionOutput {
  onTransaction?: {
    balance: number;
    currency: string;
    id: string;
    transactions: {
      balance: number;
      currency: string;
      date: string;
      items: {
        amount: number;
        attachment: string;
        description: string;
        id: string;
        name: string;
      }[];
    }[];
    vat: {
      owed: number;
      paid: number;
    };
  };
}

const ON_TRANSACTION = gql`
  subscription OnTransaction($id: ID!, $owner: String!) {
    onTransaction(id: $id, owner: $owner) {
      balance
      transactions {
        balance
        currency
        date
        items {
          amount
          attachment
          category
          companyId
          date
          description
          id
          name
          refund
          scheduled
          status
          vat
        }
      }
      vat {
        owed
        paid
      }
    }
  }
`;

export default ON_TRANSACTION;
