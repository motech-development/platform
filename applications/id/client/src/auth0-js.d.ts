import 'auth0-js';

// The sign-up API accepts these root profile fields, but @types/auth0-js omits them.
declare module 'auth0-js' {
  interface DbSignUpOptions {
    family_name?: string;
    given_name?: string;
    name?: string;
  }
}
