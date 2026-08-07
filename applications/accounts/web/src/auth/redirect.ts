export function requiresInteractiveAuthentication(error: Error | undefined) {
  if (!error || !('error' in error)) {
    return false;
  }

  return [
    'consent_required',
    'interaction_required',
    'login_required',
  ].includes(String(error.error));
}

export function isAuthCallback(search: string) {
  const parameters = new URLSearchParams(search);

  return parameters.has('code') && parameters.has('state');
}

export function returnToFromAuthError(
  error: Error | undefined,
  origin: string,
) {
  if (!error || !('appState' in error)) {
    return undefined;
  }

  const { appState } = error;

  if (
    typeof appState !== 'object' ||
    appState === null ||
    !('returnTo' in appState) ||
    typeof appState.returnTo !== 'string'
  ) {
    return undefined;
  }

  const destination = new URL(appState.returnTo, origin);

  if (destination.origin !== origin) {
    return undefined;
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
