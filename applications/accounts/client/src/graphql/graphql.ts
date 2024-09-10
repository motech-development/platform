/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import {
  FieldPolicy,
  FieldReadFunction,
  TypePolicies,
  TypePolicy,
} from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDate: { input: string; output: string };
  AWSDateTime: { input: string; output: string };
  AWSEmail: { input: string; output: string };
  AWSIPAddress: { input: string; output: string };
  AWSJSON: { input: string; output: string };
  AWSPhone: { input: string; output: string };
  AWSTime: { input: string; output: string };
  AWSTimestamp: { input: number; output: number };
  AWSURL: { input: string; output: string };
};

export type Address = {
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  line3: Scalars['String']['output'];
  line4?: Maybe<Scalars['String']['output']>;
  line5: Scalars['String']['output'];
};

export type AddressInput = {
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  line3: Scalars['String']['input'];
  line4?: InputMaybe<Scalars['String']['input']>;
  line5: Scalars['String']['input'];
};

export type Balance = {
  balance: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  owner: Scalars['String']['output'];
  transactions: Array<BalanceTransaction>;
  vat: BalanceVat;
};

export type BalanceInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  balance: Scalars['Float']['input'];
  vat: BalanceVatInput;
};

export type BalanceTransaction = {
  balance: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  date: Scalars['AWSDateTime']['output'];
  items: Array<Transaction>;
};

export type BalanceTransactionInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['AWSDateTime']['input']>;
  items?: InputMaybe<Array<InputMaybe<TransactionInput>>>;
};

export type BalanceVat = {
  owed: Scalars['Float']['output'];
  paid: Scalars['Float']['output'];
};

export type BalanceVatInput = {
  owed: Scalars['Float']['input'];
  paid: Scalars['Float']['input'];
};

export type BankDetails = {
  accountNumber: Scalars['String']['output'];
  sortCode: Scalars['String']['output'];
};

export type BankDetailsInput = {
  accountNumber: Scalars['String']['input'];
  sortCode: Scalars['String']['input'];
};

export type Client = {
  address: Address;
  companyId: Scalars['String']['output'];
  contact: Contact;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ClientInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  address: AddressInput;
  companyId: Scalars['String']['input'];
  contact: ContactInput;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Clients = {
  id: Scalars['ID']['output'];
  items: Array<Client>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Companies = {
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Company>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Company = {
  address: Address;
  bank: BankDetails;
  companyNumber: Scalars['String']['output'];
  contact: Contact;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Scalars['String']['output']>;
};

export type CompanyInput = {
  address: AddressInput;
  bank: BankDetailsInput;
  companyNumber: Scalars['String']['input'];
  contact: ContactInput;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Contact = {
  email: Scalars['AWSEmail']['output'];
  telephone: Scalars['String']['output'];
};

export type ContactInput = {
  email: Scalars['AWSEmail']['input'];
  telephone: Scalars['String']['input'];
};

export type CreateCompanyInput = {
  balance: BalanceInput;
  company: CompanyInput;
  vat: VatSettingsInput;
  yearEnd: SettingsYearEndInput;
};

export type ExpenseCategory = {
  name: Scalars['String']['output'];
  protect: Scalars['Boolean']['output'];
  vatRate: Scalars['Float']['output'];
};

export type ExpenseCategoryInput = {
  name: Scalars['String']['input'];
  protect: Scalars['Boolean']['input'];
  vatRate: Scalars['Float']['input'];
};

export type MarkNotificationsInput = {
  ids: Array<InputMaybe<Scalars['ID']['input']>>;
};

export type MetadataInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  typename: Scalars['String']['input'];
};

export type Mutation = {
  addTransaction: Transaction;
  createClient: Client;
  createCompany: Company;
  createReport: ReportRequest;
  deleteClient: Client;
  deleteCompany: Company;
  deleteFile: Storage;
  deleteTransaction: Transaction;
  markAsRead: Notifications;
  notificationBeacon: Notification;
  requestUpload: StorageUpload;
  transactionBeacon: Balance;
  updateClient: Client;
  updateCompany: Company;
  updateSettings: Settings;
  updateTransaction: Transaction;
};

export type MutationAddTransactionArgs = {
  input: TransactionInput;
};

export type MutationCreateClientArgs = {
  input: ClientInput;
};

export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};

export type MutationCreateReportArgs = {
  input: ReportInput;
};

export type MutationDeleteClientArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteCompanyArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteFileArgs = {
  id: Scalars['ID']['input'];
  path: Scalars['String']['input'];
};

export type MutationDeleteTransactionArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMarkAsReadArgs = {
  id: Scalars['ID']['input'];
  input: MarkNotificationsInput;
};

export type MutationNotificationBeaconArgs = {
  id: Scalars['ID']['input'];
  input: NotificationInput;
};

export type MutationRequestUploadArgs = {
  id: Scalars['ID']['input'];
  input: StorageUploadInput;
};

export type MutationTransactionBeaconArgs = {
  id: Scalars['ID']['input'];
  input: TransactionBeaconInput;
  owner: Scalars['String']['input'];
};

export type MutationUpdateClientArgs = {
  input: ClientInput;
};

export type MutationUpdateCompanyArgs = {
  input: CompanyInput;
};

export type MutationUpdateSettingsArgs = {
  input: SettingsInput;
};

export type MutationUpdateTransactionArgs = {
  input: TransactionInput;
};

export type Notification = {
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  payload?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
};

export type NotificationInput = {
  createdAt: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  message: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  payload?: InputMaybe<Scalars['String']['input']>;
  read: Scalars['Boolean']['input'];
};

export type Notifications = {
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Notification>>>;
};

export type Query = {
  getBalance: Balance;
  getClient: Client;
  getClients: Clients;
  getCompanies: Companies;
  getCompany: Company;
  getNotifications: Notifications;
  getReports: Reports;
  getSettings: Settings;
  getTransaction: Transaction;
  getTransactions: Transactions;
  getTypeahead: Typeahead;
  requestDownload: StorageDownload;
};

export type QueryGetBalanceArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetClientArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetClientsArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetCompaniesArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetCompanyArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetNotificationsArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetReportsArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetSettingsArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetTransactionArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetTransactionsArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status: TransactionStatus;
};

export type QueryGetTypeaheadArgs = {
  id: Scalars['ID']['input'];
};

export type QueryRequestDownloadArgs = {
  id: Scalars['ID']['input'];
  path: Scalars['String']['input'];
};

export type Report = {
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  downloadUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ttl?: Maybe<Scalars['AWSTimestamp']['output']>;
};

export type ReportInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
  status: TransactionStatus;
  year: Scalars['Int']['input'];
  yearEnd: ReportYearEndInput;
};

export type ReportRequest = {
  status?: Maybe<Scalars['String']['output']>;
};

export type ReportYearEndInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  day: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
};

export type Reports = {
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Report>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Settings = {
  categories: Array<ExpenseCategory>;
  id: Scalars['ID']['output'];
  vat: VatSettings;
  yearEnd: SettingsYearEnd;
};

export type SettingsInput = {
  categories: Array<ExpenseCategoryInput>;
  id: Scalars['ID']['input'];
  vat: VatSettingsInput;
  yearEnd: SettingsYearEndInput;
};

export type SettingsYearEnd = {
  day: Scalars['Float']['output'];
  month: Scalars['Float']['output'];
};

export type SettingsYearEndInput = {
  day: Scalars['Float']['input'];
  month: Scalars['Float']['input'];
};

export type Storage = {
  path?: Maybe<Scalars['String']['output']>;
};

export type StorageDownload = {
  url?: Maybe<Scalars['String']['output']>;
};

export type StorageUpload = {
  id?: Maybe<Scalars['ID']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type StorageUploadInput = {
  contentType: Scalars['String']['input'];
  extension: Scalars['String']['input'];
  metadata: MetadataInput;
};

export type Subscription = {
  onNotification?: Maybe<Notification>;
  onTransaction?: Maybe<Balance>;
};

export type SubscriptionOnNotificationArgs = {
  owner: Scalars['String']['input'];
};

export type SubscriptionOnTransactionArgs = {
  id: Scalars['ID']['input'];
  owner: Scalars['String']['input'];
};

export type Transaction = {
  amount: Scalars['Float']['output'];
  attachment?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  companyId: Scalars['String']['output'];
  date: Scalars['AWSDateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  refund: Scalars['Boolean']['output'];
  scheduled: Scalars['Boolean']['output'];
  status: TransactionStatus;
  vat: Scalars['Float']['output'];
};

export type TransactionBeaconInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['Float']['input']>;
  transactions?: InputMaybe<
    Array<InputMaybe<TransactionBeaconTransactionsInput>>
  >;
  vat?: InputMaybe<TransactionBeaconVatInput>;
};

export type TransactionBeaconTransactionsInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['AWSDateTime']['input']>;
  items?: InputMaybe<Array<InputMaybe<TransactionBeaconTransactionsItemInput>>>;
};

export type TransactionBeaconTransactionsItemInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  attachment?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TransactionBeaconVatInput = {
  owed: Scalars['Float']['input'];
  paid: Scalars['Float']['input'];
};

export type TransactionInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  amount: Scalars['Float']['input'];
  attachment: Scalars['String']['input'];
  category: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  date: Scalars['AWSDateTime']['input'];
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  refund: Scalars['Boolean']['input'];
  scheduled: Scalars['Boolean']['input'];
  status: TransactionStatus;
  vat: Scalars['Float']['input'];
};

export enum TransactionStatus {
  Confirmed = 'confirmed',
  Pending = 'pending',
}

export type Transactions = {
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Transaction>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
  status?: Maybe<TransactionStatus>;
};

export type Typeahead = {
  id?: Maybe<Scalars['ID']['output']>;
  purchases?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  sales?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  suppliers?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export enum VatScheme {
  FlatRate = 'flatRate',
  None = 'none',
  Standard = 'standard',
}

export type VatSettings = {
  charge: Scalars['Float']['output'];
  pay: Scalars['Float']['output'];
  registration?: Maybe<Scalars['String']['output']>;
  scheme: VatScheme;
};

export type VatSettingsInput = {
  charge: Scalars['Float']['input'];
  pay: Scalars['Float']['input'];
  registration?: InputMaybe<Scalars['String']['input']>;
  scheme: VatScheme;
};

export type GetBalanceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetBalanceQuery = {
  getBalance: {
    balance: number;
    currency: string;
    id: string;
    transactions: Array<{
      balance: number;
      currency: string;
      date: string;
      items: Array<{
        amount: number;
        attachment?: string | null;
        description: string;
        id: string;
        name: string;
      }>;
    }>;
    vat: { owed: number; paid: number };
  };
};

export type RecordTransactionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type RecordTransactionQuery = {
  getClients: { id: string; items: Array<{ id: string; name: string }> };
  getSettings: {
    id: string;
    categories: Array<{ name: string; vatRate: number }>;
    vat: { pay: number };
  };
  getTypeahead: {
    id?: string | null;
    purchases?: Array<string | null> | null;
    sales?: Array<string | null> | null;
    suppliers?: Array<string | null> | null;
  };
};

export type ViewTransactionQueryVariables = Exact<{
  companyId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
}>;

export type ViewTransactionQuery = {
  getClients: { id: string; items: Array<{ id: string; name: string }> };
  getSettings: {
    id: string;
    categories: Array<{ name: string; vatRate: number }>;
    vat: { pay: number };
  };
  getTransaction: {
    amount: number;
    attachment?: string | null;
    category: string;
    companyId: string;
    date: string;
    description: string;
    id: string;
    name: string;
    refund: boolean;
    scheduled: boolean;
    status: TransactionStatus;
    vat: number;
  };
  getTypeahead: {
    id?: string | null;
    purchases?: Array<string | null> | null;
    sales?: Array<string | null> | null;
    suppliers?: Array<string | null> | null;
  };
};

export type RequestUploadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: StorageUploadInput;
}>;

export type RequestUploadMutation = {
  requestUpload: { id?: string | null; url?: string | null };
};

export type DeleteFileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  path: Scalars['String']['input'];
}>;

export type DeleteFileMutation = { deleteFile: { path?: string | null } };

export type RequestDownloadQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  path: Scalars['String']['input'];
}>;

export type RequestDownloadQuery = { requestDownload: { url?: string | null } };

export type NewClientFragment = {
  companyId: string;
  id: string;
  name: string;
  address: {
    line1: string;
    line2?: string | null;
    line3: string;
    line4?: string | null;
    line5: string;
  };
  contact: { email: string; telephone: string };
} & { ' $fragmentName'?: 'NewClientFragment' };

export type CreateClientMutationVariables = Exact<{
  input: ClientInput;
}>;

export type CreateClientMutation = {
  createClient: {
    companyId: string;
    id: string;
    name: string;
    address: {
      line1: string;
      line2?: string | null;
      line3: string;
      line4?: string | null;
      line5: string;
    };
    contact: { email: string; telephone: string };
  };
};

export type GetClientsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetClientsQuery = {
  getClients: {
    id: string;
    items: Array<{
      id: string;
      name: string;
      address: {
        line1: string;
        line2?: string | null;
        line3: string;
        line4?: string | null;
        line5: string;
      };
      contact: { email: string; telephone: string };
    }>;
  };
  getCompany: { id: string; name: string };
};

export type GetClientQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetClientQuery = {
  getClient: {
    companyId: string;
    id: string;
    name: string;
    address: {
      line1: string;
      line2?: string | null;
      line3: string;
      line4?: string | null;
      line5: string;
    };
    contact: { email: string; telephone: string };
  };
};

export type UpdateClientMutationVariables = Exact<{
  input: ClientInput;
}>;

export type UpdateClientMutation = {
  updateClient: {
    companyId: string;
    id: string;
    name: string;
    address: {
      line1: string;
      line2?: string | null;
      line3: string;
      line4?: string | null;
      line5: string;
    };
    contact: { email: string; telephone: string };
  };
};

export type DeleteClientMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteClientMutation = {
  deleteClient: { companyId: string; id: string; name: string };
};

export type GetSettingsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetSettingsQuery = {
  getCompany: { id: string; name: string };
  getSettings: {
    id: string;
    categories: Array<{ name: string; protect: boolean; vatRate: number }>;
    vat: {
      charge: number;
      pay: number;
      registration?: string | null;
      scheme: VatScheme;
    };
    yearEnd: { day: number; month: number };
  };
};

export type CreateReportMutationVariables = Exact<{
  input: ReportInput;
}>;

export type CreateReportMutation = { createReport: { status?: string | null } };

export type GetReportsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetReportsQuery = {
  getReports: {
    id?: string | null;
    items?: Array<{
      createdAt?: string | null;
      downloadUrl?: string | null;
      id?: string | null;
      ttl?: number | null;
    } | null> | null;
  };
};

export type OnNotificationSubscriptionVariables = Exact<{
  owner: Scalars['String']['input'];
}>;

export type OnNotificationSubscription = {
  onNotification?: {
    createdAt: string;
    id: string;
    message: string;
    owner: string;
    payload?: string | null;
    read: boolean;
  } | null;
};

export type UpdateSettingsMutationVariables = Exact<{
  input: SettingsInput;
}>;

export type UpdateSettingsMutation = {
  updateSettings: {
    id: string;
    categories: Array<{ name: string; protect: boolean; vatRate: number }>;
    vat: {
      charge: number;
      pay: number;
      registration?: string | null;
      scheme: VatScheme;
    };
    yearEnd: { day: number; month: number };
  };
};

export type GetNotificationsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetNotificationsQuery = {
  getNotifications: {
    id?: string | null;
    items?: Array<{
      createdAt: string;
      id: string;
      message: string;
      read: boolean;
    } | null> | null;
  };
};

export type MarkAsReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: MarkNotificationsInput;
}>;

export type MarkAsReadMutation = {
  markAsRead: { items?: Array<{ id: string; read: boolean } | null> | null };
};

export const NewClientFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewClient' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Client' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'address' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line3' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line4' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line5' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'companyId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contact' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'telephone' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewClientFragment, unknown>;
export const GetBalanceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBalance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getBalance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'transactions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'balance' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currency' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'attachment' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'description' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'vat' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'owed' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'paid' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBalanceQuery, GetBalanceQueryVariables>;
export const RecordTransactionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'RecordTransaction' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getClients' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categories' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vatRate' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'vat' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'pay' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getTypeahead' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'purchases' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sales' } },
                { kind: 'Field', name: { kind: 'Name', value: 'suppliers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RecordTransactionQuery,
  RecordTransactionQueryVariables
>;
export const ViewTransactionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ViewTransaction' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'companyId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'transactionId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getClients' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'companyId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'companyId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categories' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vatRate' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'vat' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'pay' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getTransaction' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'transactionId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'attachment' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'companyId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'refund' } },
                { kind: 'Field', name: { kind: 'Name', value: 'scheduled' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'vat' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getTypeahead' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'companyId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'purchases' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sales' } },
                { kind: 'Field', name: { kind: 'Name', value: 'suppliers' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewTransactionQuery,
  ViewTransactionQueryVariables
>;
export const RequestUploadDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RequestUpload' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'StorageUploadInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestUpload' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RequestUploadMutation,
  RequestUploadMutationVariables
>;
export const DeleteFileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteFile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'path' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteFile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'path' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'path' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'path' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const RequestDownloadDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'RequestDownload' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'path' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestDownload' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'path' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'path' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RequestDownloadQuery,
  RequestDownloadQueryVariables
>;
export const CreateClientDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateClient' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ClientInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createClient' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'address' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line3' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line4' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line5' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'companyId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contact' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'telephone' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateClientMutation,
  CreateClientMutationVariables
>;
export const GetClientsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetClients' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getClients' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'address' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'line1' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'line2' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'line3' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'line4' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'line5' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contact' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'telephone' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCompany' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetClientsQuery, GetClientsQueryVariables>;
export const GetClientDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetClient' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getClient' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'address' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line3' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line4' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line5' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'companyId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contact' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'telephone' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetClientQuery, GetClientQueryVariables>;
export const UpdateClientDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateClient' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ClientInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateClient' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'address' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line3' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line4' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line5' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'companyId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contact' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'telephone' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateClientMutation,
  UpdateClientMutationVariables
>;
export const DeleteClientDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteClient' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteClient' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'companyId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteClientMutation,
  DeleteClientMutationVariables
>;
export const GetSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSettings' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCompany' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categories' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'protect' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vatRate' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'vat' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'charge' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'pay' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'registration' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'scheme' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'yearEnd' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'day' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'month' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSettingsQuery, GetSettingsQueryVariables>;
export const CreateReportDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateReport' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ReportInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createReport' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateReportMutation,
  CreateReportMutationVariables
>;
export const GetReportsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetReports' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'count' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'nextToken' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getReports' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'count' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'count' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'nextToken' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'nextToken' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'downloadUrl' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'ttl' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetReportsQuery, GetReportsQueryVariables>;
export const OnNotificationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'OnNotification' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'owner' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'onNotification' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'owner' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'owner' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                { kind: 'Field', name: { kind: 'Name', value: 'payload' } },
                { kind: 'Field', name: { kind: 'Name', value: 'read' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OnNotificationSubscription,
  OnNotificationSubscriptionVariables
>;
export const UpdateSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSettings' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SettingsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categories' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'protect' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vatRate' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'vat' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'charge' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'pay' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'registration' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'scheme' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'yearEnd' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'day' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'month' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateSettingsMutation,
  UpdateSettingsMutationVariables
>;
export const GetNotificationsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetNotifications' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'count' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getNotifications' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'count' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'count' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'read' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNotificationsQuery,
  GetNotificationsQueryVariables
>;
export const MarkAsReadDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MarkAsRead' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'MarkNotificationsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'markAsRead' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'read' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MarkAsReadMutation, MarkAsReadMutationVariables>;
export type AddressKeySpecifier = (
  | 'line1'
  | 'line2'
  | 'line3'
  | 'line4'
  | 'line5'
  | AddressKeySpecifier
)[];
export type AddressFieldPolicy = {
  line1?: FieldPolicy<any> | FieldReadFunction<any>;
  line2?: FieldPolicy<any> | FieldReadFunction<any>;
  line3?: FieldPolicy<any> | FieldReadFunction<any>;
  line4?: FieldPolicy<any> | FieldReadFunction<any>;
  line5?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BalanceKeySpecifier = (
  | 'balance'
  | 'currency'
  | 'id'
  | 'owner'
  | 'transactions'
  | 'vat'
  | BalanceKeySpecifier
)[];
export type BalanceFieldPolicy = {
  balance?: FieldPolicy<any> | FieldReadFunction<any>;
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  owner?: FieldPolicy<any> | FieldReadFunction<any>;
  transactions?: FieldPolicy<any> | FieldReadFunction<any>;
  vat?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BalanceTransactionKeySpecifier = (
  | 'balance'
  | 'currency'
  | 'date'
  | 'items'
  | BalanceTransactionKeySpecifier
)[];
export type BalanceTransactionFieldPolicy = {
  balance?: FieldPolicy<any> | FieldReadFunction<any>;
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BalanceVatKeySpecifier = (
  | 'owed'
  | 'paid'
  | BalanceVatKeySpecifier
)[];
export type BalanceVatFieldPolicy = {
  owed?: FieldPolicy<any> | FieldReadFunction<any>;
  paid?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BankDetailsKeySpecifier = (
  | 'accountNumber'
  | 'sortCode'
  | BankDetailsKeySpecifier
)[];
export type BankDetailsFieldPolicy = {
  accountNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  sortCode?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ClientKeySpecifier = (
  | 'address'
  | 'companyId'
  | 'contact'
  | 'id'
  | 'name'
  | ClientKeySpecifier
)[];
export type ClientFieldPolicy = {
  address?: FieldPolicy<any> | FieldReadFunction<any>;
  companyId?: FieldPolicy<any> | FieldReadFunction<any>;
  contact?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ClientsKeySpecifier = (
  | 'id'
  | 'items'
  | 'nextToken'
  | ClientsKeySpecifier
)[];
export type ClientsFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
  nextToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CompaniesKeySpecifier = (
  | 'id'
  | 'items'
  | 'nextToken'
  | CompaniesKeySpecifier
)[];
export type CompaniesFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
  nextToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CompanyKeySpecifier = (
  | 'address'
  | 'bank'
  | 'companyNumber'
  | 'contact'
  | 'id'
  | 'name'
  | 'owner'
  | CompanyKeySpecifier
)[];
export type CompanyFieldPolicy = {
  address?: FieldPolicy<any> | FieldReadFunction<any>;
  bank?: FieldPolicy<any> | FieldReadFunction<any>;
  companyNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  contact?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  owner?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ContactKeySpecifier = (
  | 'email'
  | 'telephone'
  | ContactKeySpecifier
)[];
export type ContactFieldPolicy = {
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  telephone?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ExpenseCategoryKeySpecifier = (
  | 'name'
  | 'protect'
  | 'vatRate'
  | ExpenseCategoryKeySpecifier
)[];
export type ExpenseCategoryFieldPolicy = {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  protect?: FieldPolicy<any> | FieldReadFunction<any>;
  vatRate?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MutationKeySpecifier = (
  | 'addTransaction'
  | 'createClient'
  | 'createCompany'
  | 'createReport'
  | 'deleteClient'
  | 'deleteCompany'
  | 'deleteFile'
  | 'deleteTransaction'
  | 'markAsRead'
  | 'notificationBeacon'
  | 'requestUpload'
  | 'transactionBeacon'
  | 'updateClient'
  | 'updateCompany'
  | 'updateSettings'
  | 'updateTransaction'
  | MutationKeySpecifier
)[];
export type MutationFieldPolicy = {
  addTransaction?: FieldPolicy<any> | FieldReadFunction<any>;
  createClient?: FieldPolicy<any> | FieldReadFunction<any>;
  createCompany?: FieldPolicy<any> | FieldReadFunction<any>;
  createReport?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteClient?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteCompany?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteFile?: FieldPolicy<any> | FieldReadFunction<any>;
  deleteTransaction?: FieldPolicy<any> | FieldReadFunction<any>;
  markAsRead?: FieldPolicy<any> | FieldReadFunction<any>;
  notificationBeacon?: FieldPolicy<any> | FieldReadFunction<any>;
  requestUpload?: FieldPolicy<any> | FieldReadFunction<any>;
  transactionBeacon?: FieldPolicy<any> | FieldReadFunction<any>;
  updateClient?: FieldPolicy<any> | FieldReadFunction<any>;
  updateCompany?: FieldPolicy<any> | FieldReadFunction<any>;
  updateSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  updateTransaction?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NotificationKeySpecifier = (
  | 'createdAt'
  | 'id'
  | 'message'
  | 'owner'
  | 'payload'
  | 'read'
  | NotificationKeySpecifier
)[];
export type NotificationFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
  owner?: FieldPolicy<any> | FieldReadFunction<any>;
  payload?: FieldPolicy<any> | FieldReadFunction<any>;
  read?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NotificationsKeySpecifier = (
  | 'id'
  | 'items'
  | NotificationsKeySpecifier
)[];
export type NotificationsFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QueryKeySpecifier = (
  | 'getBalance'
  | 'getClient'
  | 'getClients'
  | 'getCompanies'
  | 'getCompany'
  | 'getNotifications'
  | 'getReports'
  | 'getSettings'
  | 'getTransaction'
  | 'getTransactions'
  | 'getTypeahead'
  | 'requestDownload'
  | QueryKeySpecifier
)[];
export type QueryFieldPolicy = {
  getBalance?: FieldPolicy<any> | FieldReadFunction<any>;
  getClient?: FieldPolicy<any> | FieldReadFunction<any>;
  getClients?: FieldPolicy<any> | FieldReadFunction<any>;
  getCompanies?: FieldPolicy<any> | FieldReadFunction<any>;
  getCompany?: FieldPolicy<any> | FieldReadFunction<any>;
  getNotifications?: FieldPolicy<any> | FieldReadFunction<any>;
  getReports?: FieldPolicy<any> | FieldReadFunction<any>;
  getSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  getTransaction?: FieldPolicy<any> | FieldReadFunction<any>;
  getTransactions?: FieldPolicy<any> | FieldReadFunction<any>;
  getTypeahead?: FieldPolicy<any> | FieldReadFunction<any>;
  requestDownload?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ReportKeySpecifier = (
  | 'createdAt'
  | 'downloadUrl'
  | 'id'
  | 'ttl'
  | ReportKeySpecifier
)[];
export type ReportFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  downloadUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  ttl?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ReportRequestKeySpecifier = (
  | 'status'
  | ReportRequestKeySpecifier
)[];
export type ReportRequestFieldPolicy = {
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ReportsKeySpecifier = (
  | 'id'
  | 'items'
  | 'nextToken'
  | ReportsKeySpecifier
)[];
export type ReportsFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
  nextToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SettingsKeySpecifier = (
  | 'categories'
  | 'id'
  | 'vat'
  | 'yearEnd'
  | SettingsKeySpecifier
)[];
export type SettingsFieldPolicy = {
  categories?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  vat?: FieldPolicy<any> | FieldReadFunction<any>;
  yearEnd?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SettingsYearEndKeySpecifier = (
  | 'day'
  | 'month'
  | SettingsYearEndKeySpecifier
)[];
export type SettingsYearEndFieldPolicy = {
  day?: FieldPolicy<any> | FieldReadFunction<any>;
  month?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StorageKeySpecifier = ('path' | StorageKeySpecifier)[];
export type StorageFieldPolicy = {
  path?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StorageDownloadKeySpecifier = (
  | 'url'
  | StorageDownloadKeySpecifier
)[];
export type StorageDownloadFieldPolicy = {
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StorageUploadKeySpecifier = (
  | 'id'
  | 'url'
  | StorageUploadKeySpecifier
)[];
export type StorageUploadFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SubscriptionKeySpecifier = (
  | 'onNotification'
  | 'onTransaction'
  | SubscriptionKeySpecifier
)[];
export type SubscriptionFieldPolicy = {
  onNotification?: FieldPolicy<any> | FieldReadFunction<any>;
  onTransaction?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TransactionKeySpecifier = (
  | 'amount'
  | 'attachment'
  | 'category'
  | 'companyId'
  | 'date'
  | 'description'
  | 'id'
  | 'name'
  | 'refund'
  | 'scheduled'
  | 'status'
  | 'vat'
  | TransactionKeySpecifier
)[];
export type TransactionFieldPolicy = {
  amount?: FieldPolicy<any> | FieldReadFunction<any>;
  attachment?: FieldPolicy<any> | FieldReadFunction<any>;
  category?: FieldPolicy<any> | FieldReadFunction<any>;
  companyId?: FieldPolicy<any> | FieldReadFunction<any>;
  date?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  refund?: FieldPolicy<any> | FieldReadFunction<any>;
  scheduled?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  vat?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TransactionsKeySpecifier = (
  | 'id'
  | 'items'
  | 'nextToken'
  | 'status'
  | TransactionsKeySpecifier
)[];
export type TransactionsFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
  nextToken?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TypeaheadKeySpecifier = (
  | 'id'
  | 'purchases'
  | 'sales'
  | 'suppliers'
  | TypeaheadKeySpecifier
)[];
export type TypeaheadFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  purchases?: FieldPolicy<any> | FieldReadFunction<any>;
  sales?: FieldPolicy<any> | FieldReadFunction<any>;
  suppliers?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type VatSettingsKeySpecifier = (
  | 'charge'
  | 'pay'
  | 'registration'
  | 'scheme'
  | VatSettingsKeySpecifier
)[];
export type VatSettingsFieldPolicy = {
  charge?: FieldPolicy<any> | FieldReadFunction<any>;
  pay?: FieldPolicy<any> | FieldReadFunction<any>;
  registration?: FieldPolicy<any> | FieldReadFunction<any>;
  scheme?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StrictTypedTypePolicies = {
  Address?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | AddressKeySpecifier
      | (() => undefined | AddressKeySpecifier);
    fields?: AddressFieldPolicy;
  };
  Balance?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | BalanceKeySpecifier
      | (() => undefined | BalanceKeySpecifier);
    fields?: BalanceFieldPolicy;
  };
  BalanceTransaction?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | BalanceTransactionKeySpecifier
      | (() => undefined | BalanceTransactionKeySpecifier);
    fields?: BalanceTransactionFieldPolicy;
  };
  BalanceVat?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | BalanceVatKeySpecifier
      | (() => undefined | BalanceVatKeySpecifier);
    fields?: BalanceVatFieldPolicy;
  };
  BankDetails?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | BankDetailsKeySpecifier
      | (() => undefined | BankDetailsKeySpecifier);
    fields?: BankDetailsFieldPolicy;
  };
  Client?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ClientKeySpecifier
      | (() => undefined | ClientKeySpecifier);
    fields?: ClientFieldPolicy;
  };
  Clients?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ClientsKeySpecifier
      | (() => undefined | ClientsKeySpecifier);
    fields?: ClientsFieldPolicy;
  };
  Companies?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CompaniesKeySpecifier
      | (() => undefined | CompaniesKeySpecifier);
    fields?: CompaniesFieldPolicy;
  };
  Company?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | CompanyKeySpecifier
      | (() => undefined | CompanyKeySpecifier);
    fields?: CompanyFieldPolicy;
  };
  Contact?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ContactKeySpecifier
      | (() => undefined | ContactKeySpecifier);
    fields?: ContactFieldPolicy;
  };
  ExpenseCategory?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ExpenseCategoryKeySpecifier
      | (() => undefined | ExpenseCategoryKeySpecifier);
    fields?: ExpenseCategoryFieldPolicy;
  };
  Mutation?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | MutationKeySpecifier
      | (() => undefined | MutationKeySpecifier);
    fields?: MutationFieldPolicy;
  };
  Notification?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | NotificationKeySpecifier
      | (() => undefined | NotificationKeySpecifier);
    fields?: NotificationFieldPolicy;
  };
  Notifications?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | NotificationsKeySpecifier
      | (() => undefined | NotificationsKeySpecifier);
    fields?: NotificationsFieldPolicy;
  };
  Query?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | QueryKeySpecifier
      | (() => undefined | QueryKeySpecifier);
    fields?: QueryFieldPolicy;
  };
  Report?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ReportKeySpecifier
      | (() => undefined | ReportKeySpecifier);
    fields?: ReportFieldPolicy;
  };
  ReportRequest?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ReportRequestKeySpecifier
      | (() => undefined | ReportRequestKeySpecifier);
    fields?: ReportRequestFieldPolicy;
  };
  Reports?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | ReportsKeySpecifier
      | (() => undefined | ReportsKeySpecifier);
    fields?: ReportsFieldPolicy;
  };
  Settings?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | SettingsKeySpecifier
      | (() => undefined | SettingsKeySpecifier);
    fields?: SettingsFieldPolicy;
  };
  SettingsYearEnd?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | SettingsYearEndKeySpecifier
      | (() => undefined | SettingsYearEndKeySpecifier);
    fields?: SettingsYearEndFieldPolicy;
  };
  Storage?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | StorageKeySpecifier
      | (() => undefined | StorageKeySpecifier);
    fields?: StorageFieldPolicy;
  };
  StorageDownload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | StorageDownloadKeySpecifier
      | (() => undefined | StorageDownloadKeySpecifier);
    fields?: StorageDownloadFieldPolicy;
  };
  StorageUpload?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | StorageUploadKeySpecifier
      | (() => undefined | StorageUploadKeySpecifier);
    fields?: StorageUploadFieldPolicy;
  };
  Subscription?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | SubscriptionKeySpecifier
      | (() => undefined | SubscriptionKeySpecifier);
    fields?: SubscriptionFieldPolicy;
  };
  Transaction?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | TransactionKeySpecifier
      | (() => undefined | TransactionKeySpecifier);
    fields?: TransactionFieldPolicy;
  };
  Transactions?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | TransactionsKeySpecifier
      | (() => undefined | TransactionsKeySpecifier);
    fields?: TransactionsFieldPolicy;
  };
  Typeahead?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | TypeaheadKeySpecifier
      | (() => undefined | TypeaheadKeySpecifier);
    fields?: TypeaheadFieldPolicy;
  };
  VatSettings?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
    keyFields?:
      | false
      | VatSettingsKeySpecifier
      | (() => undefined | VatSettingsKeySpecifier);
    fields?: VatSettingsFieldPolicy;
  };
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
