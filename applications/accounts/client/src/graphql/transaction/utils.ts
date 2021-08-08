interface ITransaction {
  description: string;
  name: string;
}

type TProperty = keyof ITransaction;

export const findUnique =
  (transaction: ITransaction, property: TProperty) => (prop: string) =>
    prop === transaction[property];

export const setItems = (items: string[] | null) => items || [];

export const spread = (statement: boolean, unique: boolean) =>
  statement && unique;
