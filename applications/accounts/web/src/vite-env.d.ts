/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_APPSYNC_URL?: string;
  readonly VITE_AUTH0_AUDIENCE?: string;
  readonly VITE_AUTH0_CLIENT_ID?: string;
  readonly VITE_AUTH0_DOMAIN?: string;
  readonly VITE_AWS_REGION?: string;
  readonly VITE_COMMIT_SHA?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_STAGE?: string;
}
