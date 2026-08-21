import { notFound, rootRouteId } from '@tanstack/react-router';
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
  GET_PENDING_TRANSACTIONS,
  GET_TRANSACTION,
} from './operations';

type RouterContext = AuthenticatedAccountsRouterContext;
const resourceIdSchema = z.uuid();

function throwRootNotFound() {
  notFound({ routeId: rootRouteId, throw: true });
}

function requireResourceId(id: string) {
  if (!resourceIdSchema.safeParse(id).success) {
    throwRootNotFound();
  }
}

async function queryCompanies(
  { apolloClient, authenticatedOwner }: RouterContext,
  nextToken?: string,
) {
  const owner = authenticatedOwner;

  if (!owner) {
    return undefined;
  }

  return apolloClient.query({
    ...(nextToken === undefined ? {} : { fetchPolicy: 'no-cache' as const }),
    query: GET_COMPANIES,
    variables: nextToken === undefined ? { owner } : { nextToken, owner },
  });
}

export async function primeCompanies(context: RouterContext) {
  try {
    await queryCompanies(context);
  } catch {
    // The page query owns its recoverable error state.
  }
}

async function isOwnedCompany(
  context: RouterContext,
  companyId: string,
  nextToken?: string,
): Promise<boolean> {
  const result = await queryCompanies(context, nextToken);

  if (!result?.data) {
    throw new Error('The owned company list did not return data');
  }

  if (
    result.data.getCompanies.items.some((company) => company.id === companyId)
  ) {
    return true;
  }

  const continuation = result.data.getCompanies.nextToken ?? undefined;

  return continuation
    ? isOwnedCompany(context, companyId, continuation)
    : false;
}

async function verifyOwnedCompany(context: RouterContext, companyId: string) {
  requireResourceId(companyId);

  if (!(await isOwnedCompany(context, companyId))) {
    throwRootNotFound();
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
    throwRootNotFound();
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
  try {
    await Promise.all([
      context.apolloClient.query({
        query: GET_CONFIRMED_TRANSACTIONS,
        variables: {
          count: 100,
          id: companyId,
          status: 'confirmed',
        },
      }),
      context.apolloClient.query({
        query: GET_PENDING_TRANSACTIONS,
        variables: { count: 100, id: companyId, status: 'pending' },
      }),
    ]);
  } catch {
    // The collection owns partial-data and retry presentation.
  }
}

export async function primePendingTransactions(
  context: RouterContext,
  companyId: string,
) {
  await primeOwnedCompanyResource(context, companyId, () =>
    context.apolloClient.query({
      query: GET_PENDING_TRANSACTIONS,
      variables: { count: 100, id: companyId, status: 'pending' },
    }),
  );
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
  expectedStatus?: 'confirmed' | 'pending',
) {
  if (!context.authenticatedOwner) {
    return;
  }

  await verifyOwnedCompany(context, companyId);
  requireResourceId(transactionId);
  let result;

  try {
    result = await context.apolloClient.query({
      fetchPolicy: 'network-only',
      query: GET_TRANSACTION,
      variables: { transactionId },
    });
  } catch {
    return;
  }

  if (!result.data) {
    throw new Error('The Transaction did not return data');
  }

  if (
    result.data.getTransaction.companyId !== companyId ||
    (expectedStatus !== undefined &&
      result.data.getTransaction.status !== expectedStatus)
  ) {
    throwRootNotFound();
  }
}
