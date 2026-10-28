export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDate: { input: string; output: string; }
  AWSDateTime: { input: string; output: string; }
  AWSEmail: { input: string; output: string; }
  AWSIPAddress: { input: string; output: string; }
  AWSJSON: { input: string; output: string; }
  AWSPhone: { input: string; output: string; }
  AWSTime: { input: string; output: string; }
  AWSTimestamp: { input: number; output: number; }
  AWSURL: { input: string; output: string; }
};

export type Address = {
  __typename?: 'Address';
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
  __typename?: 'Balance';
  balance: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  owner: Scalars['String']['output'];
  vat: BalanceVat;
};

export type BalanceInput = {
  balance: Scalars['Float']['input'];
  vat: BalanceVatInput;
};

export type BalanceTransactionInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type BalanceVat = {
  __typename?: 'BalanceVat';
  owed: Scalars['Float']['output'];
  paid: Scalars['Float']['output'];
};

export type BalanceVatInput = {
  owed: Scalars['Float']['input'];
  paid: Scalars['Float']['input'];
};

export type BankDetails = {
  __typename?: 'BankDetails';
  accountNumber: Scalars['String']['output'];
  sortCode: Scalars['String']['output'];
};

export type BankDetailsInput = {
  accountNumber: Scalars['String']['input'];
  sortCode: Scalars['String']['input'];
};

export type Client = {
  __typename?: 'Client';
  address: Address;
  companyId: Scalars['String']['output'];
  contact: Contact;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ClientInput = {
  address: AddressInput;
  companyId: Scalars['String']['input'];
  contact: ContactInput;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Clients = {
  __typename?: 'Clients';
  id: Scalars['ID']['output'];
  items: Array<Client>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Companies = {
  __typename?: 'Companies';
  id: Scalars['ID']['output'];
  items: Array<Company>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Company = {
  __typename?: 'Company';
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
  __typename?: 'Contact';
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
  __typename?: 'ExpenseCategory';
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
  __typename?: 'Mutation';
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
  transactionChangeBeacon: TransactionChange;
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


export type MutationTransactionChangeBeaconArgs = {
  id: Scalars['ID']['input'];
  owner: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
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
  __typename?: 'Notification';
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
  __typename?: 'Notifications';
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Notification>>>;
};

export type Query = {
  __typename?: 'Query';
  getBalance: Balance;
  getClient: Client;
  getClients: Clients;
  getCompanies: Companies;
  getCompany: Company;
  getNotifications: Notifications;
  getReports: Reports;
  getSettings: Settings;
  getTransaction: Transaction;
  getTransactionState?: Maybe<Transaction>;
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


export type QueryGetTransactionStateArgs = {
  companyId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
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
  __typename?: 'Report';
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  downloadUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ttl?: Maybe<Scalars['AWSTimestamp']['output']>;
};

export type ReportInput = {
  companyId: Scalars['ID']['input'];
  currency: Scalars['String']['input'];
  status: TransactionStatus;
  year: Scalars['Int']['input'];
  yearEnd: ReportYearEndInput;
};

export type ReportRequest = {
  __typename?: 'ReportRequest';
  status?: Maybe<Scalars['String']['output']>;
};

export type ReportYearEndInput = {
  day: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
};

export type Reports = {
  __typename?: 'Reports';
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Report>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Settings = {
  __typename?: 'Settings';
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
  __typename?: 'SettingsYearEnd';
  day: Scalars['Float']['output'];
  month: Scalars['Float']['output'];
};

export type SettingsYearEndInput = {
  day: Scalars['Float']['input'];
  month: Scalars['Float']['input'];
};

export type Storage = {
  __typename?: 'Storage';
  path?: Maybe<Scalars['String']['output']>;
};

export type StorageDownload = {
  __typename?: 'StorageDownload';
  url?: Maybe<Scalars['String']['output']>;
};

export type StorageUpload = {
  __typename?: 'StorageUpload';
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
};

export type StorageUploadInput = {
  contentType: Scalars['String']['input'];
  extension: Scalars['String']['input'];
  metadata: MetadataInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  onNotification?: Maybe<Notification>;
  onTransaction?: Maybe<Balance>;
  onTransactionChange?: Maybe<TransactionChange>;
};


export type SubscriptionOnNotificationArgs = {
  owner: Scalars['String']['input'];
};


export type SubscriptionOnTransactionArgs = {
  id: Scalars['ID']['input'];
  owner: Scalars['String']['input'];
};


export type SubscriptionOnTransactionChangeArgs = {
  id: Scalars['ID']['input'];
  owner: Scalars['String']['input'];
};

export type Transaction = {
  __typename?: 'Transaction';
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
  balance?: InputMaybe<Scalars['Float']['input']>;
  vat?: InputMaybe<TransactionBeaconVatInput>;
};

export type TransactionBeaconTransactionsItemInput = {
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

/** An owner-scoped signal to read current transaction state; repeated signals are harmless. */
export type TransactionChange = {
  __typename?: 'TransactionChange';
  id: Scalars['ID']['output'];
  owner: Scalars['String']['output'];
  transactionId: Scalars['ID']['output'];
};

export type TransactionInput = {
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

export type TransactionStatus =
  | 'confirmed'
  | 'pending';

export type Transactions = {
  __typename?: 'Transactions';
  id: Scalars['ID']['output'];
  items: Array<Transaction>;
  nextToken?: Maybe<Scalars['String']['output']>;
  status: TransactionStatus;
};

export type Typeahead = {
  __typename?: 'Typeahead';
  id: Scalars['ID']['output'];
  purchases: Array<Scalars['String']['output']>;
  sales: Array<Scalars['String']['output']>;
  suppliers: Array<Scalars['String']['output']>;
};

export type VatScheme =
  | 'flatRate'
  | 'none'
  | 'standard';

export type VatSettings = {
  __typename?: 'VatSettings';
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

export type NotificationBeaconMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: NotificationInput;
}>;


export type NotificationBeaconMutation = { __typename?: 'Mutation', notificationBeacon: { __typename?: 'Notification', createdAt: string, id: string, message: string, owner: string, payload?: string | null, read: boolean } };

export type TransactionChangeBeaconMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  owner: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
}>;


export type TransactionChangeBeaconMutation = { __typename?: 'Mutation', transactionChangeBeacon: { __typename?: 'TransactionChange', id: string, owner: string, transactionId: string } };

export type TransactionBeaconMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  owner: Scalars['String']['input'];
  input: TransactionBeaconInput;
}>;


export type TransactionBeaconMutation = { __typename?: 'Mutation', transactionBeacon: { __typename?: 'Balance', balance: number, id: string, owner: string, vat: { __typename?: 'BalanceVat', owed: number, paid: number } } };
