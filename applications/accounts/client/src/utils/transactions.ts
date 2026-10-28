import type { Reference } from '@apollo/client';
import type { Transaction } from '../graphql/graphql';

type ITransaction = Pick<Transaction, 'description' | 'name'>;

type TProperty = keyof ITransaction;

export const findUnique =
  (transaction: ITransaction, property: TProperty) => (prop: string) =>
    prop === transaction[property];

export const setItems = (items: string[] | Reference) =>
  (items || []) as string[];

export const spread = (statement: boolean, unique: boolean) =>
  statement && unique;
