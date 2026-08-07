import {
  isAuthCallback,
  requiresInteractiveAuthentication,
  returnToFromAuthError,
} from './redirect';

function authError(
  error: string,
  returnTo = 'http://localhost:3000/my-companies',
) {
  return Object.assign(new Error(error), {
    appState: { returnTo },
    error,
  });
}

describe('Auth0 redirect restoration', () => {
  it('recognises an authorization-code callback', () => {
    expect(isAuthCallback('?code=authorization-code&state=transaction')).toBe(
      true,
    );
    expect(isAuthCallback('?code=authorization-code')).toBe(false);
    expect(isAuthCallback('')).toBe(false);
  });

  it.each(['consent_required', 'interaction_required', 'login_required'])(
    'treats %s as an interactive sign-in state',
    (error) => {
      expect(requiresInteractiveAuthentication(authError(error))).toBe(true);
    },
  );

  it('restores a same-origin protected route', () => {
    expect(
      returnToFromAuthError(
        authError(
          'consent_required',
          'http://localhost:3000/my-companies?from=refresh#content',
        ),
        'http://localhost:3000',
      ),
    ).toBe('/my-companies?from=refresh#content');
  });

  it('rejects a cross-origin return destination', () => {
    expect(
      returnToFromAuthError(
        authError('login_required', 'https://example.com/redirect'),
        'http://localhost:3000',
      ),
    ).toBeUndefined();
  });
});
