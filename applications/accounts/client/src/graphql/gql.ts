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
 */
const documents = {
  '\n  query GetBalance($id: ID!) {\n    getBalance(id: $id) {\n      balance\n      currency\n      id\n      transactions {\n        balance\n        currency\n        date\n        items {\n          amount\n          attachment\n          description\n          id\n          name\n        }\n      }\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n':
    types.GetBalanceDocument,
  '\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        vatRate\n      }\n      id\n      vat {\n        pay\n      }\n    }\n    getTypeahead(id: $id) {\n      id\n      purchases\n      sales\n      suppliers\n    }\n  }\n':
    types.RecordTransactionDocument,
  '\n  query ViewTransaction($companyId: ID!, $transactionId: ID!) {\n    getClients(id: $companyId) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $companyId) {\n      categories {\n        name\n        vatRate\n      }\n      id\n      vat {\n        pay\n      }\n    }\n    getTransaction(id: $transactionId) {\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      id\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n    getTypeahead(id: $companyId) {\n      id\n      purchases\n      sales\n      suppliers\n    }\n  }\n':
    types.ViewTransactionDocument,
  '\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n':
    types.RequestUploadDocument,
  '\n  mutation DeleteFile($id: ID!, $path: String!) {\n    deleteFile(id: $id, path: $path) {\n      path\n    }\n  }\n':
    types.DeleteFileDocument,
  '\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n':
    types.RequestDownloadDocument,
  '\n              fragment NewClient on Client {\n                address {\n                  line1\n                  line2\n                  line3\n                  line4\n                  line5\n                }\n                companyId\n                contact {\n                  email\n                  telephone\n                }\n                id\n                name\n              }\n            ':
    types.NewClientFragmentDoc,
  '\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n':
    types.CreateClientDocument,
  '\n  query GetClients($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n    }\n    getCompany(id: $id) {\n      id\n      name\n    }\n  }\n':
    types.GetClientsDocument,
  '\n  query GetClient($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n':
    types.GetClientDocument,
  '\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n':
    types.UpdateClientDocument,
  '\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n':
    types.DeleteClientDocument,
  '\n  query GetSettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n':
    types.GetSettingsDocument,
  '\n  mutation CreateReport($input: ReportInput!) {\n    createReport(input: $input) {\n      status\n    }\n  }\n':
    types.CreateReportDocument,
  '\n  query GetReports($id: ID!, $count: Int, $nextToken: String) {\n    getReports(id: $id, count: $count, nextToken: $nextToken) {\n      id\n      items {\n        createdAt\n        downloadUrl\n        id\n        ttl\n      }\n    }\n  }\n':
    types.GetReportsDocument,
  '\n  subscription OnNotification($owner: String!) {\n    onNotification(owner: $owner) {\n      createdAt\n      id\n      message\n      owner\n      payload\n      read\n    }\n  }\n':
    types.OnNotificationDocument,
  '\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n':
    types.UpdateSettingsDocument,
  '\n  query GetNotifications($id: ID!, $count: Int) {\n    getNotifications(id: $id, count: $count) {\n      id\n      items {\n        createdAt\n        id\n        message\n        read\n      }\n    }\n  }\n':
    types.GetNotificationsDocument,
  '\n  mutation MarkAsRead($id: ID!, $input: MarkNotificationsInput!) {\n    markAsRead(id: $id, input: $input) {\n      items {\n        id\n        read\n      }\n    }\n  }\n':
    types.MarkAsReadDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetBalance($id: ID!) {\n    getBalance(id: $id) {\n      balance\n      currency\n      id\n      transactions {\n        balance\n        currency\n        date\n        items {\n          amount\n          attachment\n          description\n          id\n          name\n        }\n      }\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetBalance($id: ID!) {\n    getBalance(id: $id) {\n      balance\n      currency\n      id\n      transactions {\n        balance\n        currency\n        date\n        items {\n          amount\n          attachment\n          description\n          id\n          name\n        }\n      }\n      vat {\n        owed\n        paid\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        vatRate\n      }\n      id\n      vat {\n        pay\n      }\n    }\n    getTypeahead(id: $id) {\n      id\n      purchases\n      sales\n      suppliers\n    }\n  }\n',
): (typeof documents)['\n  query RecordTransaction($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        vatRate\n      }\n      id\n      vat {\n        pay\n      }\n    }\n    getTypeahead(id: $id) {\n      id\n      purchases\n      sales\n      suppliers\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ViewTransaction($companyId: ID!, $transactionId: ID!) {\n    getClients(id: $companyId) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $companyId) {\n      categories {\n        name\n        vatRate\n      }\n      id\n      vat {\n        pay\n      }\n    }\n    getTransaction(id: $transactionId) {\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      id\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n    getTypeahead(id: $companyId) {\n      id\n      purchases\n      sales\n      suppliers\n    }\n  }\n',
): (typeof documents)['\n  query ViewTransaction($companyId: ID!, $transactionId: ID!) {\n    getClients(id: $companyId) {\n      id\n      items {\n        id\n        name\n      }\n    }\n    getSettings(id: $companyId) {\n      categories {\n        name\n        vatRate\n      }\n      id\n      vat {\n        pay\n      }\n    }\n    getTransaction(id: $transactionId) {\n      amount\n      attachment\n      category\n      companyId\n      date\n      description\n      id\n      name\n      refund\n      scheduled\n      status\n      vat\n    }\n    getTypeahead(id: $companyId) {\n      id\n      purchases\n      sales\n      suppliers\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n',
): (typeof documents)['\n  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {\n    requestUpload(id: $id, input: $input) {\n      id\n      url\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation DeleteFile($id: ID!, $path: String!) {\n    deleteFile(id: $id, path: $path) {\n      path\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteFile($id: ID!, $path: String!) {\n    deleteFile(id: $id, path: $path) {\n      path\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n',
): (typeof documents)['\n  query RequestDownload($id: ID!, $path: String!) {\n    requestDownload(id: $id, path: $path) {\n      url\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n              fragment NewClient on Client {\n                address {\n                  line1\n                  line2\n                  line3\n                  line4\n                  line5\n                }\n                companyId\n                contact {\n                  email\n                  telephone\n                }\n                id\n                name\n              }\n            ',
): (typeof documents)['\n              fragment NewClient on Client {\n                address {\n                  line1\n                  line2\n                  line3\n                  line4\n                  line5\n                }\n                companyId\n                contact {\n                  email\n                  telephone\n                }\n                id\n                name\n              }\n            '];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateClient($input: ClientInput!) {\n    createClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetClients($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n    }\n    getCompany(id: $id) {\n      id\n      name\n    }\n  }\n',
): (typeof documents)['\n  query GetClients($id: ID!) {\n    getClients(id: $id) {\n      id\n      items {\n        address {\n          line1\n          line2\n          line3\n          line4\n          line5\n        }\n        contact {\n          email\n          telephone\n        }\n        id\n        name\n      }\n    }\n    getCompany(id: $id) {\n      id\n      name\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetClient($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n',
): (typeof documents)['\n  query GetClient($id: ID!) {\n    getClient(id: $id) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateClient($input: ClientInput!) {\n    updateClient(input: $input) {\n      address {\n        line1\n        line2\n        line3\n        line4\n        line5\n      }\n      companyId\n      contact {\n        email\n        telephone\n      }\n      id\n      name\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteClient($id: ID!) {\n    deleteClient(id: $id) {\n      companyId\n      id\n      name\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetSettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetSettings($id: ID!) {\n    getCompany(id: $id) {\n      id\n      name\n    }\n    getSettings(id: $id) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateReport($input: ReportInput!) {\n    createReport(input: $input) {\n      status\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateReport($input: ReportInput!) {\n    createReport(input: $input) {\n      status\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetReports($id: ID!, $count: Int, $nextToken: String) {\n    getReports(id: $id, count: $count, nextToken: $nextToken) {\n      id\n      items {\n        createdAt\n        downloadUrl\n        id\n        ttl\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetReports($id: ID!, $count: Int, $nextToken: String) {\n    getReports(id: $id, count: $count, nextToken: $nextToken) {\n      id\n      items {\n        createdAt\n        downloadUrl\n        id\n        ttl\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  subscription OnNotification($owner: String!) {\n    onNotification(owner: $owner) {\n      createdAt\n      id\n      message\n      owner\n      payload\n      read\n    }\n  }\n',
): (typeof documents)['\n  subscription OnNotification($owner: String!) {\n    onNotification(owner: $owner) {\n      createdAt\n      id\n      message\n      owner\n      payload\n      read\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateSettings($input: SettingsInput!) {\n    updateSettings(input: $input) {\n      categories {\n        name\n        protect\n        vatRate\n      }\n      id\n      vat {\n        charge\n        pay\n        registration\n        scheme\n      }\n      yearEnd {\n        day\n        month\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetNotifications($id: ID!, $count: Int) {\n    getNotifications(id: $id, count: $count) {\n      id\n      items {\n        createdAt\n        id\n        message\n        read\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetNotifications($id: ID!, $count: Int) {\n    getNotifications(id: $id, count: $count) {\n      id\n      items {\n        createdAt\n        id\n        message\n        read\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation MarkAsRead($id: ID!, $input: MarkNotificationsInput!) {\n    markAsRead(id: $id, input: $input) {\n      items {\n        id\n        read\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation MarkAsRead($id: ID!, $input: MarkNotificationsInput!) {\n    markAsRead(id: $id, input: $input) {\n      items {\n        id\n        read\n      }\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
