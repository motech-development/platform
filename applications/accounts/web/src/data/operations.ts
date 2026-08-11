import { graphql } from '../graphql';

export const GET_COMPANIES = graphql(`
  query Companies($owner: ID!) {
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

export const GET_COMPANY_DETAILS = graphql(`
  query CompanyDetails($id: ID!) {
    getCompany(id: $id) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      bank {
        accountNumber
        sortCode
      }
      companyNumber
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const CREATE_COMPANY = graphql(`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      bank {
        accountNumber
        sortCode
      }
      companyNumber
      contact {
        email
        telephone
      }
      id
      name
      owner
    }
  }
`);

export const UPDATE_COMPANY = graphql(`
  mutation UpdateCompany($input: CompanyInput!) {
    updateCompany(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      bank {
        accountNumber
        sortCode
      }
      companyNumber
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const DELETE_COMPANY = graphql(`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
      name
      owner
    }
  }
`);

export const GET_CLIENTS = graphql(`
  query Clients($id: ID!, $nextToken: String) {
    getClients(id: $id, nextToken: $nextToken) {
      id
      items {
        address {
          line1
          line2
          line3
          line4
          line5
        }
        companyId
        contact {
          email
          telephone
        }
        id
        name
      }
      nextToken
    }
  }
`);

export const GET_CLIENT = graphql(`
  query Client($id: ID!) {
    getClient(id: $id) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const CREATE_CLIENT = graphql(`
  mutation CreateClient($input: ClientInput!) {
    createClient(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const UPDATE_CLIENT = graphql(`
  mutation UpdateClient($input: ClientInput!) {
    updateClient(input: $input) {
      address {
        line1
        line2
        line3
        line4
        line5
      }
      companyId
      contact {
        email
        telephone
      }
      id
      name
    }
  }
`);

export const DELETE_CLIENT = graphql(`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      companyId
      id
      name
    }
  }
`);

export const GET_COMPANY_SETTINGS = graphql(`
  query CompanySettings($id: ID!) {
    getCompany(id: $id) {
      id
      name
    }
    getSettings(id: $id) {
      categories {
        name
        protect
        vatRate
      }
      id
      vat {
        charge
        pay
        registration
        scheme
      }
      yearEnd {
        day
        month
      }
    }
  }
`);

export const UPDATE_SETTINGS = graphql(`
  mutation UpdateSettings($input: SettingsInput!) {
    updateSettings(input: $input) {
      categories {
        name
        protect
        vatRate
      }
      id
      vat {
        charge
        pay
        registration
        scheme
      }
      yearEnd {
        day
        month
      }
    }
  }
`);

export const GET_COMPANY_DASHBOARD = graphql(`
  query Dashboard($id: ID!, $status: TransactionStatus!, $count: Int) {
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
  query ConfirmedTransactions(
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
  query RecordTransaction($id: ID!) {
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
  mutation AddTransaction($input: TransactionInput!) {
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
  query Transaction($transactionId: ID!) {
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
  mutation RequestUpload($id: ID!, $input: StorageUploadInput!) {
    requestUpload(id: $id, input: $input) {
      id
      url
    }
  }
`);

export const REQUEST_DOWNLOAD = graphql(`
  query RequestDownload($id: ID!, $path: String!) {
    requestDownload(id: $id, path: $path) {
      url
    }
  }
`);

export const ON_TRANSACTION = graphql(`
  subscription OnTransaction($id: ID!, $owner: String!) {
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
