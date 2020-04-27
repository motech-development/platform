import { gql } from 'apollo-boost';

export interface IGetBalanceInput {
  id: string;
}

export interface IGetBalanceOutput {
  getBalance: {
    balance: number;
    currency: string;
    id: string;
    transactions: {
      balance: number;
      currency: string;
      date: string;
      items: {
        amount: number;
        date: string;
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

const GET_BALANCE = gql`
  query GetBalance($id: ID!) {
    getBalance(id: $id) {
      balance
      currency
      id
      transactions {
        balance
        currency
        date
        items {
          amount
          date
          description
          id
          name
        }
      }
      vat {
        owed
        paid
      }
    }
  }
`;

export default GET_BALANCE;
