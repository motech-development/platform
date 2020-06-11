declare global {
  interface Window {
    config?: {
      auth0Domain: string;
      callbackURL: string;
      clientID: string;
      dict?: {
        signin?: {
          title?: string;
        };
      };
      internalOptions: object;
    };
    passwordReset?: {
      csrfToken: string;
      email: string;
      passwordComplexityOptions: object;
      passwordPolicy: string;
      ticket: string;
    };
  }
}

export {};
