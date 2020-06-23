import { Auth0Error } from 'auth0-js';
import getErrorMessage from '../getErrorMessage';

describe('getErrorMessage', () => {
  it('should use the fallback value', () => {
    const error: Auth0Error = {
      error: 'invalid_signup',
    };
    const message = getErrorMessage(error);

    expect(message).toEqual([true, 'fallback']);
  });

  it('should use the local string', () => {
    const error: Auth0Error = {
      code: 'access_denied',
      description: 'Hello world',
      error: 'error',
    };
    const message = getErrorMessage(error);

    expect(message).toEqual([false, 'Hello world']);
  });

  it('should use the supplied error message', () => {
    const error: Auth0Error = {
      code: 'use_i18n',
      error: 'handled_locally',
    };
    const message = getErrorMessage(error);

    expect(message).toEqual([true, 'use_i18n']);
  });

  it('should use the fallback if there is no error', () => {
    const message = getErrorMessage(null);

    expect(message).toEqual([true, 'fallback']);
  });
});
