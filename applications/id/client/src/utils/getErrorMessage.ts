import { Auth0Error } from 'auth0-js';

export type ErrorMessage = [boolean, string];

const getErrorMessage = (e: Auth0Error | null): ErrorMessage => {
  if (e?.code) {
    const useLocal = [
      'access_denied',
      'invalid_user_password',
      'unauthorized',
    ].includes(e.code);
    const useFallback = [
      'invalid_signup',
      'mfa_required',
      'PasswordHistoryError',
    ].includes(e.code);

    if (useLocal) {
      return [false, e.description as string];
    }

    return useFallback ? [true, 'fallback'] : [true, e.code];
  }

  return [true, 'fallback'];
};

export default getErrorMessage;
