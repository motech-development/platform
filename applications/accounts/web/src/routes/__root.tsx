import { BreezeProvider } from '@motech-development/breeze-ui';
import breezeReset from '@motech-development/breeze-ui/reset.css?url';
import breezeStyles from '@motech-development/breeze-ui/styles.css?url';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from '@tanstack/react-router';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { AuthenticationLoading } from '../auth/AuthenticationLoading';
import type { AccountsRouterContext } from '../auth/router';
import i18n from '../i18n';
import { ConnectivityStatus } from '../pwa/connectivity';
import { registerServiceWorker } from '../pwa/registration';
import styles from '../styles.css?url';

registerServiceWorker();

function RootProviders({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const breezeRouter = useMemo(
    () => ({
      navigate: (href: string) => {
        router.navigate({ href }).catch(() => undefined);
      },
    }),
    [router],
  );
  useEffect(() => {
    setPortalContainer(
      document.querySelector<HTMLElement>('#breeze-portal-root'),
    );
  }, []);

  return (
    <BreezeProvider
      locale={i18n.language}
      messages={{
        selectFiles: i18n.t('Select file to upload', {
          ns: 'attachments',
        }),
      }}
      portalContainer={portalContainer}
      router={breezeRouter}
    >
      <AuthenticationLoading
        authentication={router.options.context.authentication}
      >
        {children}
      </AuthenticationLoading>
      <ConnectivityStatus />
    </BreezeProvider>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <RootProviders>
        <Outlet />
      </RootProviders>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className="[color-scheme:light]"
      lang="en-GB"
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#eef1f5]">
        {children}
        <div id="breeze-portal-root" />
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRouteWithContext<AccountsRouterContext>()({
  component: RootComponent,
  head: () => ({
    links: [
      {
        href: '/favicon-196.png',
        rel: 'icon',
        sizes: '196x196',
        type: 'image/png',
      },
      { href: breezeReset, rel: 'stylesheet' },
      { href: styles, rel: 'stylesheet' },
      { href: breezeStyles, rel: 'stylesheet' },
      { href: '/manifest.webmanifest', rel: 'manifest' },
    ],
    meta: [
      { charSet: 'utf-8' },
      { content: 'yes', name: 'mobile-web-app-capable' },
      { content: 'yes', name: 'apple-mobile-web-app-capable' },
      { content: 'Accounts', name: 'apple-mobile-web-app-title' },
      {
        content: 'black',
        name: 'apple-mobile-web-app-status-bar-style',
      },
      {
        content: 'width=device-width, initial-scale=1',
        name: 'viewport',
      },
      { content: '#151c2b', name: 'theme-color' },
      { title: i18n.t('Accounts', { ns: 'shell' }) },
    ],
  }),
});
