import { Auth0Error } from 'auth0-js';

export type ErrorMessage = [boolean, string];

const getErrorMessage = (e: Auth0Error | null): ErrorMessage => {
  if (e) {
    const useLocal = [
      'access_denied',
      'invalid_user_password',
      'unauthorized',
    ].includes(e.error);
    const useFallback = [
      'invalid_signup',
      'mfa_required',
      'PasswordHistoryError',
    ].includes(e.error);

    if (useLocal) {
      return [false, e.description as string];
    }

    return useFallback ? [true, 'fallback'] : [true, e.code as string];
  }

  return [true, 'fallback'];
};

export default getErrorMessage;
