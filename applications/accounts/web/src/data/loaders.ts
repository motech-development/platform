import { notFound } from '@tanstack/react-router';
import { z } from 'zod';
import type { AuthenticatedAccountsRouterContext } from '../auth/router';
import {
  GET_CLIENT,
  GET_CLIENTS,
  GET_COMPANIES,
  GET_COMPANY_DASHBOARD,
  GET_COMPANY_DETAILS,
  GET_COMPANY_SETTINGS,
  GET_CONFIRMED_TRANSACTIONS,
  GET_TRANSACTION,
} from './operations';

type RouterContext = AuthenticatedAccountsRouterContext;
const resourceIdSchema = z.uuid();

function requireResourceId(id: string) {
  if (!resourceIdSchema.safeParse(id).success) {
    notFound({ throw: true });
  }
}

async function queryCompanies({
  apolloClient,
  authenticatedOwner,
}: RouterContext) {
  const owner = authenticatedOwner;

  if (!owner) {
    return undefined;
  }

  return apolloClient.query({
    query: GET_COMPANIES,
    variables: { owner },
  });
}

export async function primeCompanies(context: RouterContext) {
  try {
    await queryCompanies(context);
  } catch {
    // The page query owns its recoverable error state.
  }
}

async function verifyOwnedCompany(context: RouterContext, companyId: string) {
  requireResourceId(companyId);
  const result = await queryCompanies(context);

  if (!result?.data) {
    throw new Error('The owned company list did not return data');
  }

  if (
    !result.data.getCompanies.items.some((company) => company.id === companyId)
  ) {
    notFound({ throw: true });
  }
}

async function primeOwnedCompanyResource(
  context: RouterContext,
  companyId: string,
  primeResource: () => Promise<unknown>,
) {
  if (!context.authenticatedOwner) return;

  await verifyOwnedCompany(context, companyId);

  try {
    await primeResource();
  } catch {
    // The page query owns its contextual, recoverable error state.
  }
}

export async function primeCompanyDetails(
  context: RouterContext,
  companyId: string,
) {
  await primeOwnedCompanyResource(context, companyId, () =>
    context.apolloClient.query({
      query: GET_COMPANY_DETAILS,
      variables: { id: companyId },
    }),
  );
}

export async function primeClients(context: RouterContext, companyId: string) {
  await primeOwnedCompanyResource(context, companyId, () =>
    context.apolloClient.query({
      query: GET_CLIENTS,
      variables: { id: companyId },
    }),
  );
}

export async function primeClient(
  context: RouterContext,
  companyId: string,
  clientId: string,
) {
  if (!context.authenticatedOwner) return;

  await verifyOwnedCompany(context, companyId);
  requireResourceId(clientId);

  let result;

  try {
    result = await context.apolloClient.query({
      query: GET_CLIENT,
      variables: { id: clientId },
    });
  } catch {
    return;
  }

  if (result.data?.getClient.companyId !== companyId) {
    notFound({ throw: true });
  }
}

export async function primeCompanySettings(
  context: RouterContext,
  companyId: string,
) {
  await primeOwnedCompanyResource(context, companyId, () =>
    context.apolloClient.query({
      query: GET_COMPANY_SETTINGS,
      variables: { id: companyId },
    }),
  );
}

export async function primeDashboard(
  context: RouterContext,
  companyId: string,
) {
  if (!context.authenticatedOwner) {
    return;
  }

  await verifyOwnedCompany(context, companyId);
  await context.apolloClient.query({
    query: GET_COMPANY_DASHBOARD,
    variables: { count: 5, id: companyId, status: 'confirmed' },
  });
}

export async function primeTransactions(
  context: RouterContext,
  companyId: string,
) {
  if (!context.authenticatedOwner) {
    return;
  }

  await verifyOwnedCompany(context, companyId);
  await context.apolloClient.query({
    query: GET_CONFIRMED_TRANSACTIONS,
    variables: {
      count: 100,
      id: companyId,
      status: 'confirmed',
    },
  });
}

export async function verifyRecordTransactionRoute(
  context: RouterContext,
  companyId: string,
) {
  if (!context.authenticatedOwner) {
    return;
  }

  await verifyOwnedCompany(context, companyId);
}

export async function primeTransaction(
  context: RouterContext,
  companyId: string,
  transactionId: string,
) {
  if (!context.authenticatedOwner) {
    return;
  }

  await verifyOwnedCompany(context, companyId);
  requireResourceId(transactionId);
  const result = await context.apolloClient.query({
    query: GET_TRANSACTION,
    variables: { transactionId },
  });

  if (!result.data) {
    throw new Error('The Transaction did not return data');
  }

  if (
    result.data.getTransaction.companyId !== companyId ||
    result.data.getTransaction.status !== 'confirmed'
  ) {
    notFound({ throw: true });
  }
}
