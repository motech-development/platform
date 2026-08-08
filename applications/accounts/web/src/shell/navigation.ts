type CompanySection =
  | 'accounts'
  | 'clients'
  | 'dashboard'
  | 'reports'
  | 'settings'
  | 'update-details';

const companyRoute =
  /^\/my-companies\/(accounts|clients|dashboard|reports|settings|update-details)\/([^/]+)/;

function companyRouteMatch(pathname: string) {
  return companyRoute.exec(pathname);
}

export function companyFromPath(pathname: string) {
  return companyRouteMatch(pathname)?.[2] ?? null;
}

export function companyDestination(pathname: string, companyId: string) {
  const section = (companyRouteMatch(pathname)?.[1] ??
    'dashboard') as CompanySection;

  return `/my-companies/${section}/${encodeURIComponent(companyId)}`;
}
