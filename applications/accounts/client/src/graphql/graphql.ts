/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  line3?: Maybe<Scalars['String']['output']>;
  line4?: Maybe<Scalars['String']['output']>;
  line5?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
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

export type Bank = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type BankAccount = {
  accountIdentifications?: Maybe<Array<Maybe<BankAccountIdentification>>>;
  balance: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export type BankAccountIdentification = {
  identification?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type BankAccounts = {
  items: Array<BankAccount>;
};

export type BankCallback = {
  authorisationUrl: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
};

export type BankCallbackInput = {
  authorisationUrl: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type BankConnection = {
  status?: Maybe<Scalars['String']['output']>;
};

export type BankConnectionInput = {
  bank: Scalars['String']['input'];
  callback: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};

export type BankDetails = {
  accountNumber?: Maybe<Scalars['String']['output']>;
  sortCode?: Maybe<Scalars['String']['output']>;
};

export type BankDetailsInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  accountNumber: Scalars['String']['input'];
  sortCode: Scalars['String']['input'];
};

export type BankSettings = {
  account?: Maybe<Scalars['String']['output']>;
  bank?: Maybe<Scalars['String']['output']>;
  consent?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  user: Scalars['String']['output'];
};

export type BankSettingsInput = {
  account?: InputMaybe<Scalars['String']['input']>;
  bank?: InputMaybe<Scalars['String']['input']>;
  consent?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};

export type Banks = {
  items: Array<Bank>;
};

export type Client = {
  address?: Maybe<Address>;
  companyId?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<Contact>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
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
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Client>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Companies = {
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Company>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Company = {
  address?: Maybe<Address>;
  bank?: Maybe<BankDetails>;
  companyNumber?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<Contact>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
};

export type CompanyInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  address: AddressInput;
  bank: BankDetailsInput;
  companyNumber: Scalars['String']['input'];
  contact: ContactInput;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Contact = {
  email?: Maybe<Scalars['AWSEmail']['output']>;
  telephone?: Maybe<Scalars['String']['output']>;
};

export type ContactInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
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
  name?: Maybe<Scalars['String']['output']>;
  protect?: Maybe<Scalars['Boolean']['output']>;
  vatRate?: Maybe<Scalars['Float']['output']>;
};

export type ExpenseCategoryInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
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
  bankCallback: BankCallback;
  createBankConnection: BankConnection;
  createClient: Client;
  createCompany: Company;
  createReport: ReportRequest;
  deleteBankConnection: BankSettings;
  deleteClient: Client;
  deleteCompany: Company;
  deleteFile: Storage;
  deleteTransaction: Transaction;
  markAsRead: Notifications;
  notificationBeacon: Notification;
  requestUpload: StorageUpload;
  transactionBeacon: Balance;
  updateBankSettings: BankSettings;
  updateClient: Client;
  updateCompany: Company;
  updateSettings: Settings;
  updateTransaction: Transaction;
};

export type MutationAddTransactionArgs = {
  input: TransactionInput;
};

export type MutationBankCallbackArgs = {
  input: BankCallbackInput;
};

export type MutationCreateBankConnectionArgs = {
  input: BankConnectionInput;
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

export type MutationDeleteBankConnectionArgs = {
  id: Scalars['ID']['input'];
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

export type MutationUpdateBankSettingsArgs = {
  input: BankSettingsInput;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['String']['output']>;
  read?: Maybe<Scalars['Boolean']['output']>;
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
  getBankAccounts: BankAccounts;
  getBankSettings: BankSettings;
  getBanks: Banks;
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

export type QueryGetBankAccountsArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetBankSettingsArgs = {
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
  categories?: Maybe<Array<Maybe<ExpenseCategory>>>;
  id?: Maybe<Scalars['ID']['output']>;
  vat?: Maybe<VatSettings>;
  yearEnd?: Maybe<SettingsYearEnd>;
};

export type SettingsInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
  categories: Array<InputMaybe<ExpenseCategoryInput>>;
  id: Scalars['ID']['input'];
  vat: VatSettingsInput;
  yearEnd: SettingsYearEndInput;
};

export type SettingsYearEnd = {
  day?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
};

export type SettingsYearEndInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
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
  onBankCallback?: Maybe<BankCallback>;
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
  charge?: Maybe<Scalars['Float']['output']>;
  pay?: Maybe<Scalars['Float']['output']>;
  registration?: Maybe<Scalars['String']['output']>;
  scheme?: Maybe<VatScheme>;
};

export type VatSettingsInput = {
  __typename?: InputMaybe<Scalars['String']['input']>;
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
  getClients: {
    id?: string | null;
    items?: Array<{ id?: string | null; name?: string | null } | null> | null;
  };
  getSettings: {
    id?: string | null;
    categories?: Array<{
      name?: string | null;
      vatRate?: number | null;
    } | null> | null;
    vat?: { pay?: number | null } | null;
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
  getClients: {
    id?: string | null;
    items?: Array<{ id?: string | null; name?: string | null } | null> | null;
  };
  getSettings: {
    id?: string | null;
    categories?: Array<{
      name?: string | null;
      vatRate?: number | null;
    } | null> | null;
    vat?: { pay?: number | null } | null;
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

export type GetBanksQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetBanksQuery = {
  getBankSettings: { id: string; user: string };
  getBanks: { items: Array<{ id: string; name: string }> };
};

export type CreateBankConnectionMutationVariables = Exact<{
  input: BankConnectionInput;
}>;

export type CreateBankConnectionMutation = {
  createBankConnection: { status?: string | null };
};

export type OnBackCallbackSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type OnBackCallbackSubscription = {
  onBankCallback?: { authorisationUrl: string } | null;
};

export type UpdateBankSettingsMutationVariables = Exact<{
  input: BankSettingsInput;
}>;

export type UpdateBankSettingsMutation = {
  updateBankSettings: { account?: string | null; id: string; user: string };
};

export type GetBankAccountsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetBankAccountsQuery = {
  getBankAccounts: {
    items: Array<{
      balance: number;
      currency: string;
      id: string;
      type: string;
      accountIdentifications?: Array<{
        identification?: string | null;
        type?: string | null;
      } | null> | null;
    }>;
  };
};

export type DeleteBankConnectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteBankConnectionMutation = {
  deleteBankConnection: {
    account?: string | null;
    bank?: string | null;
    id: string;
    user: string;
  };
};

export type GetBankSettingsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetBankSettingsQuery = {
  getBankSettings: { account?: string | null; id: string; user: string };
};

export type GetNotificationsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetNotificationsQuery = {
  getNotifications: {
    id?: string | null;
    items?: Array<{
      createdAt?: string | null;
      id?: string | null;
      message?: string | null;
      read?: boolean | null;
    } | null> | null;
  };
};

export type MarkAsReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: MarkNotificationsInput;
}>;

export type MarkAsReadMutation = {
  markAsRead: {
    items?: Array<{ id?: string | null; read?: boolean | null } | null> | null;
  };
};

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
export const GetBanksDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBanks' },
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
            name: { kind: 'Name', value: 'getBankSettings' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'user' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getBanks' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
} as unknown as DocumentNode<GetBanksQuery, GetBanksQueryVariables>;
export const CreateBankConnectionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateBankConnection' },
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
              name: { kind: 'Name', value: 'BankConnectionInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createBankConnection' },
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
  CreateBankConnectionMutation,
  CreateBankConnectionMutationVariables
>;
export const OnBackCallbackDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'subscription',
      name: { kind: 'Name', value: 'OnBackCallback' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'onBankCallback' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'authorisationUrl' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OnBackCallbackSubscription,
  OnBackCallbackSubscriptionVariables
>;
export const UpdateBankSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateBankSettings' },
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
              name: { kind: 'Name', value: 'BankSettingsInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateBankSettings' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'account' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'user' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateBankSettingsMutation,
  UpdateBankSettingsMutationVariables
>;
export const GetBankAccountsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBankAccounts' },
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
            name: { kind: 'Name', value: 'getBankAccounts' },
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
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'accountIdentifications' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'identification' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'balance' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currency' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
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
  GetBankAccountsQuery,
  GetBankAccountsQueryVariables
>;
export const DeleteBankConnectionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteBankConnection' },
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
            name: { kind: 'Name', value: 'deleteBankConnection' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'account' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bank' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'user' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteBankConnectionMutation,
  DeleteBankConnectionMutationVariables
>;
export const GetBankSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBankSettings' },
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
            name: { kind: 'Name', value: 'getBankSettings' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'account' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'user' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetBankSettingsQuery,
  GetBankSettingsQueryVariables
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
