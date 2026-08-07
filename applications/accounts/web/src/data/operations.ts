import { graphql } from '../graphql';

export const GET_COMPANIES = graphql(`
  query AccountsWebCompanies($owner: ID!) {
    getCompanies(id: $owner) {
      id
      items {
        contact {
          email
        }
        id
        name
        companyNumber
      }
    }
  }
`);

export const GET_COMPANY_DASHBOARD = graphql(`
  query AccountsWebDashboard(
    $id: ID!
    $status: TransactionStatus!
    $count: Int
  ) {
    getCompany(id: $id) {
      id
      name
      companyNumber
    }
    getBalance(id: $id) {
      id
      balance
      currency
      vat {
        owed
        paid
      }
    }
    getTransactions(id: $id, status: $status, count: $count) {
      id
      status
      items {
        id
        amount
        attachment
        category
        date
        description
        name
      }
      nextToken
    }
  }
`);

export const GET_CONFIRMED_TRANSACTIONS = graphql(`
  query AccountsWebConfirmedTransactions(
    $id: ID!
    $status: TransactionStatus!
    $count: Int
    $nextToken: String
  ) {
    getBalance(id: $id) {
      id
      balance
      currency
      vat {
        owed
        paid
      }
    }
    getTransactions(
      id: $id
      status: $status
      count: $count
      nextToken: $nextToken
    ) {
      id
      status
      items {
        id
        amount
        attachment
        category
        date
        description
        name
      }
      nextToken
    }
  }
`);

export const GET_RECORD_TRANSACTION = graphql(`
  query AccountsWebRecordTransaction($id: ID!) {
    getClients(id: $id) {
      id
      items {
        id
        name
      }
    }
    getSettings(id: $id) {
      id
      vat {
        pay
      }
    }
  }
`);

export const ADD_TRANSACTION = graphql(`
  mutation AccountsWebAddTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
      id
      amount
      attachment
      category
      companyId
      date
      description
      name
      refund
      scheduled
      status
      vat
    }
  }
`);

export const GET_TRANSACTION = graphql(`
  query AccountsWebTransaction($transactionId: ID!) {
    getTransaction(id: $transactionId) {
      id
      amount
      attachment
      category
      companyId
      date
      description
      name
      refund
      scheduled
      status
      vat
    }
  }
`);

export const REQUEST_UPLOAD = graphql(`
  mutation AccountsWebRequestUpload($id: ID!, $input: StorageUploadInput!) {
    requestUpload(id: $id, input: $input) {
      id
      url
    }
  }
`);

export const REQUEST_DOWNLOAD = graphql(`
  query AccountsWebRequestDownload($id: ID!, $path: String!) {
    requestDownload(id: $id, path: $path) {
      url
    }
  }
`);

export const ON_TRANSACTION = graphql(`
  subscription AccountsWebOnTransaction($id: ID!, $owner: String!) {
    onTransaction(id: $id, owner: $owner) {
      balance
      id
      vat {
        owed
        paid
      }
    }
  }
`);
