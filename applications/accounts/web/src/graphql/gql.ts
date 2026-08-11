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
    "\n  query Companies($owner: ID!, $nextToken: String) {\n    getCompanies(id: $owner, nextToken: $nextToken) {\n      id\n      items {\n        contact {\n          email\n        }\n        id\n        name\n        companyNumber\n      }\n      nextToken\n    }\n  }\n": typeof types.CompaniesDocument,
    "\n  query CompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.CompanyDetailsDocument,
    "\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n": typeof types.CreateCompanyDocument,
    "\n  mutation UpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.UpdateCompanyDocument,
    "\n  mutation DeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n": typeof types.DeleteCompanyDocument,
    "\n  query Clients($id: ID!, $nextToken: String) {\n    getClients(id: $id, nextToken: $nextToken) {\n      clientLoadedPageCount @client\n      clientRequestedPageCount @client\n      clientRefreshGeneration @client\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        companyId\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n      nextToken\n    }\n  }\n": typeof types.ClientsDocument,
    "\n  query Client($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.ClientDocument,
    "\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.CreateClientDocument,
    "\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": typeof types.UpdateClientDocument,
    "\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n": typeof types.DeleteClientDocument,
    "\n  query CompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": typeof types.CompanySettingsDocument,
    "\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": typeof types.UpdateSettingsDocument,
    "\n  query Dashboard($id: ID!, $status: TransactionStatus!, $count: Int) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": typeof types.DashboardDocument,
    "\n  query ConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": typeof types.ConfirmedTransactionsDocument,
    "\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n": typeof types.RecordTransactionDocument,
    "\n  mutation AddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": typeof types.AddTransactionDocument,
    "\n  query Transaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": typeof types.TransactionDocument,
    "\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n": typeof types.RequestUploadDocument,
    "\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n": typeof types.RequestDownloadDocument,
    "\n  subscription OnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n": typeof types.OnTransactionDocument,
    "\n  fragment ClientCacheValue on Client {\n    id\n    name\n  }\n": typeof types.ClientCacheValueFragmentDoc,
    "\n  fragment CompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n": typeof types.CompanyCacheValueFragmentDoc,
};
const documents: Documents = {
    "\n  query Companies($owner: ID!, $nextToken: String) {\n    getCompanies(id: $owner, nextToken: $nextToken) {\n      id\n      items {\n        contact {\n          email\n        }\n        id\n        name\n        companyNumber\n      }\n      nextToken\n    }\n  }\n": types.CompaniesDocument,
    "\n  query CompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.CompanyDetailsDocument,
    "\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  mutation UpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.UpdateCompanyDocument,
    "\n  mutation DeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n": types.DeleteCompanyDocument,
    "\n  query Clients($id: ID!, $nextToken: String) {\n    getClients(id: $id, nextToken: $nextToken) {\n      clientLoadedPageCount @client\n      clientRequestedPageCount @client\n      clientRefreshGeneration @client\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        companyId\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n      nextToken\n    }\n  }\n": types.ClientsDocument,
    "\n  query Client($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.ClientDocument,
    "\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.CreateClientDocument,
    "\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n": types.UpdateClientDocument,
    "\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n": types.DeleteClientDocument,
    "\n  query CompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": types.CompanySettingsDocument,
    "\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n": types.UpdateSettingsDocument,
    "\n  query Dashboard($id: ID!, $status: TransactionStatus!, $count: Int) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": types.DashboardDocument,
    "\n  query ConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n": types.ConfirmedTransactionsDocument,
    "\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n": types.RecordTransactionDocument,
    "\n  mutation AddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": types.AddTransactionDocument,
    "\n  query Transaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n": types.TransactionDocument,
    "\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n": types.RequestUploadDocument,
    "\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n": types.RequestDownloadDocument,
    "\n  subscription OnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n": types.OnTransactionDocument,
    "\n  fragment ClientCacheValue on Client {\n    id\n    name\n  }\n": types.ClientCacheValueFragmentDoc,
    "\n  fragment CompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n": types.CompanyCacheValueFragmentDoc,
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
export function graphql(source: "\n  query Companies($owner: ID!, $nextToken: String) {\n    getCompanies(id: $owner, nextToken: $nextToken) {\n      id\n      items {\n        contact {\n          email\n        }\n        id\n        name\n        companyNumber\n      }\n      nextToken\n    }\n  }\n"): (typeof documents)["\n  query Companies($owner: ID!, $nextToken: String) {\n    getCompanies(id: $owner, nextToken: $nextToken) {\n      id\n      items {\n        contact {\n          email\n        }\n        id\n        name\n        companyNumber\n      }\n      nextToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query CompanyDetails($id: ID!) {\n    getCompany(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCompany($input: CreateCompanyInput!) {\n    createCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n      owner\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCompany($input: CompanyInput!) {\n    updateCompany(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      bank {\n        accountNumber\n        sortCode\n      }\n      companyNumber\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCompany($id: ID!) {\n    deleteCompany(id: $id) {\n      id\n      name\n      owner\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Clients($id: ID!, $nextToken: String) {\n    getClients(id: $id, nextToken: $nextToken) {\n      clientLoadedPageCount @client\n      clientRequestedPageCount @client\n      clientRefreshGeneration @client\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        companyId\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n      nextToken\n    }\n  }\n"): (typeof documents)["\n  query Clients($id: ID!, $nextToken: String) {\n    getClients(id: $id, nextToken: $nextToken) {\n      clientLoadedPageCount @client\n      clientRequestedPageCount @client\n      clientRefreshGeneration @client\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        companyId\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n      nextToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Client($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query Client($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"): (typeof documents)["\n  query CompanySettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dashboard($id: ID!, $status: TransactionStatus!, $count: Int) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"): (typeof documents)["\n  query Dashboard($id: ID!, $status: TransactionStatus!, $count: Int) {\n    getCompany(id: $id) {\n      id\n      name\n      companyNumber\n    }\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(id: $id, status: $status, count: $count) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"): (typeof documents)["\n  query ConfirmedTransactions(\n    $id: ID!\n    $status: TransactionStatus!\n    $count: Int\n    $nextToken: String\n  ) {\n    getBalance(id: $id) {\n      id\n      balance\n      currency\n      vat {\n        owed\n        paid\n      }\n    }\n    getTransactions(\n      id: $id\n      status: $status\n      count: $count\n      nextToken: $nextToken\n    ) {\n      id\n      status\n      items {\n        id\n        amount\n        attachment\n        category\n        date\n        description\n        name\n      }\n      nextToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n"): (typeof documents)["\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      id\n      vat {\n        pay\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"): (typeof documents)["\n  mutation AddTransaction($input: TransactionInput!) {\n    addTransaction(input: $input) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Transaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"): (typeof documents)["\n  query Transaction($transactionId: ID!) {\n    getTransaction(id: $transactionId) {\n      id\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n"): (typeof documents)["\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n"): (typeof documents)["\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription OnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription OnTransaction($id: ID!, $owner: String!) {\n    onTransaction(id: $id, owner: $owner) {\n      balance\n      id\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ClientCacheValue on Client {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment ClientCacheValue on Client {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n"): (typeof documents)["\n  fragment CompanyCacheValue on Company {\n    id\n    name\n    companyNumber\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;