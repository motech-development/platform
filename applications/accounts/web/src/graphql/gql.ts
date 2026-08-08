/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query AccountsWebCompanies($owner: ID!) {\n    getCompanies(id: $owner) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        bank {\n          accountNumber\n          sortCode\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n        companyNumber\n      }\n    }\n  }\n": typeof types.AccountsWebCompaniesDocument,
    "\n  query AccountsWebCompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.AccountsWebCompanyDetailsDocument,
    "\n  mutation AccountsWebCreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n": typeof types.AccountsWebCreateCompanyDocument,
    "\n  mutation AccountsWebUpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.AccountsWebUpdateCompanyDocument,
    "\n  mutation AccountsWebDeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n": typeof types.AccountsWebDeleteCompanyDocument,
    "\n  query AccountsWebCompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": typeof types.AccountsWebCompanySettingsDocument,
    "\n  mutation AccountsWebUpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": typeof types.AccountsWebUpdateSettingsDocument,
    "\n  query AccountsWebDashboard(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n  ) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": typeof types.AccountsWebDashboardDocument,
    "\n  query AccountsWebConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": typeof types.AccountsWebConfirmedTransactionsDocument,
    "\n  query AccountsWebRecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n": typeof types.AccountsWebRecordTransactionDocument,
    "\n  mutation AccountsWebAddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": typeof types.AccountsWebAddTransactionDocument,
    "\n  query AccountsWebTransaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": typeof types.AccountsWebTransactionDocument,
    "\n  mutation AccountsWebRequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n": typeof types.AccountsWebRequestUploadDocument,
    "\n  query AccountsWebRequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n": typeof types.AccountsWebRequestDownloadDocument,
    "\n  subscription AccountsWebOnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n": typeof types.AccountsWebOnTransactionDocument,
    "\n  fragment AccountsWebCompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n": typeof types.AccountsWebCompanyCacheValueFragmentDoc,
};
const documents: Documents = {
    "\n  query AccountsWebCompanies($owner: ID!) {\n    getCompanies(id: $owner) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        bank {\n          accountNumber\n          sortCode\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n        companyNumber\n      }\n    }\n  }\n": types.AccountsWebCompaniesDocument,
    "\n  query AccountsWebCompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.AccountsWebCompanyDetailsDocument,
    "\n  mutation AccountsWebCreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n": types.AccountsWebCreateCompanyDocument,
    "\n  mutation AccountsWebUpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.AccountsWebUpdateCompanyDocument,
    "\n  mutation AccountsWebDeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n": types.AccountsWebDeleteCompanyDocument,
    "\n  query AccountsWebCompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": types.AccountsWebCompanySettingsDocument,
    "\n  mutation AccountsWebUpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": types.AccountsWebUpdateSettingsDocument,
    "\n  query AccountsWebDashboard(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n  ) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": types.AccountsWebDashboardDocument,
    "\n  query AccountsWebConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": types.AccountsWebConfirmedTransactionsDocument,
    "\n  query AccountsWebRecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n": types.AccountsWebRecordTransactionDocument,
    "\n  mutation AccountsWebAddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": types.AccountsWebAddTransactionDocument,
    "\n  query AccountsWebTransaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": types.AccountsWebTransactionDocument,
    "\n  mutation AccountsWebRequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n": types.AccountsWebRequestUploadDocument,
    "\n  query AccountsWebRequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n": types.AccountsWebRequestDownloadDocument,
    "\n  subscription AccountsWebOnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n": types.AccountsWebOnTransactionDocument,
    "\n  fragment AccountsWebCompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n": types.AccountsWebCompanyCacheValueFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebCompanies($owner: ID!) {\n    getCompanies(id: $owner) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        bank {\n          accountNumber\n          sortCode\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n        companyNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebCompanies($owner: ID!) {\n    getCompanies(id: $owner) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        bank {\n          accountNumber\n          sortCode\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n        companyNumber\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebCompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebCompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AccountsWebCreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n"): (typeof documents)["\n  mutation AccountsWebCreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AccountsWebUpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation AccountsWebUpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AccountsWebDeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n"): (typeof documents)["\n  mutation AccountsWebDeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebCompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebCompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AccountsWebUpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AccountsWebUpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebDashboard(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n  ) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebDashboard(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n  ) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebRecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebRecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AccountsWebAddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"): (typeof documents)["\n  mutation AccountsWebAddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebTransaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebTransaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AccountsWebRequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n"): (typeof documents)["\n  mutation AccountsWebRequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountsWebRequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n"): (typeof documents)["\n  query AccountsWebRequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription AccountsWebOnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription AccountsWebOnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AccountsWebCompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n"): (typeof documents)["\n  fragment AccountsWebCompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;