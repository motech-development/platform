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
      passwordPolicy: string;
      ticket: string;
    };
  }
}

export {};
