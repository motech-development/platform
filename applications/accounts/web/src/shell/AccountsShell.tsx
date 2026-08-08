import { useApolloClient, useQuery } from '@apollo/client/react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  ApplicationShell,
  Avatar,
  ContextSwitcher,
  IconTile,
  Inline,
  Logo,
  NavigationList,
  Skeleton,
  Typography,
  UserMenu,
  VisuallyHidden,
} from '@motech-development/breeze-ui';
import {
  BuildingIcon,
  ChartIcon,
  SettingsIcon,
  WalletIcon,
} from '@motech-development/breeze-ui/icons';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthenticationTransition } from '../auth/AuthenticationLoading';
import type { AccountsOwnerId } from '../auth/owner';
import { GET_COMPANIES } from '../data/operations';
import { sortCompaniesByName } from '../features/companies/company';
import { setObservabilityCompany } from '../observability';
import { companyDestination, companyFromPath } from './navigation';

function AccountMenu({ onSignOut }: Readonly<{ onSignOut: () => void }>) {
  const { t } = useTranslation('shell');
  const auth = useAuth0();
  const apolloClient = useApolloClient();
  const signOut = async () => {
    onSignOut();

    try {
      await apolloClient.clearStore();
    } finally {
      await auth.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  };

  return (
    <UserMenu
      aria-label={t('Account menu')}
      actions={[
        {
          id: 'logout',
          label: t('Sign out'),
          onAction: () => {
            signOut().catch(() => undefined);
          },
          variant: 'danger',
        },
      ]}
      userName={auth.user?.name || auth.user?.email || t('Account owner')}
    />
  );
}

export function AccountsShell({
  authenticatedOwner,
  children,
}: Readonly<{
  authenticatedOwner?: AccountsOwnerId;
  children: ReactNode;
}>) {
  const { t } = useTranslation('shell');
  const location = useLocation();
  const navigate = useNavigate();
  const [compactNavigationOpen, setCompactNavigationOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const protectedOwner = signingOut ? undefined : authenticatedOwner;
  const companyId = protectedOwner ? companyFromPath(location.pathname) : null;
  const observabilityCompanyId = protectedOwner
    ? companyId ?? undefined
    : undefined;

  useEffect(() => {
    setObservabilityCompany(observabilityCompanyId);

    return () => {
      setObservabilityCompany();
    };
  }, [observabilityCompanyId]);

  const { data } = useQuery(GET_COMPANIES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: !protectedOwner,
    variables: { owner: protectedOwner ?? '' },
  });
  const companies = protectedOwner
    ? sortCompaniesByName(data?.getCompanies.items ?? []).map(
        ({ companyNumber, id, name }, index) => ({
          description: companyNumber,
          icon: (
            <Avatar
              initials={name[0]}
              name={name}
              shape="square"
              size="md"
              tone={index % 2 === 0 ? 'primary' : 'accent'}
            />
          ),
          id,
          name,
        }),
      )
    : [];
  const dashboard = companyId
    ? `/my-companies/dashboard/${companyId}`
    : '/my-companies';
  const transactions = companyId
    ? `/my-companies/accounts/${companyId}`
    : '/my-companies';
  const companyDetails = companyId
    ? `/my-companies/update-details/${companyId}`
    : '/my-companies';
  const settings = companyId
    ? `/my-companies/settings/${companyId}`
    : '/my-companies';

  const navigateTo = (href: string) => {
    setCompactNavigationOpen(false);
    navigate({ href }).catch(() => undefined);
  };

  if (signingOut) {
    return <AuthenticationTransition label={t('Signing out')} />;
  }

  return (
    <ApplicationShell
      account={
        protectedOwner ? (
          <AccountMenu onSignOut={() => setSigningOut(true)} />
        ) : (
          <Skeleton className="block size-10 rounded-full" />
        )
      }
      brand={
        <Inline gap="sm" wrap={false}>
          <Logo size="lg" />
          <Typography as="h1" colour="inverse" level="h3">
            {t('Accounts')}
          </Typography>
        </Inline>
      }
      compactBrand={t('Accounts')}
      compactNavigationOpen={compactNavigationOpen}
      contentFocusKey={location.pathname}
      context={
        <ContextSwitcher
          aria-label={t('Switch company')}
          currentId={companyId}
          emptyIcon={
            <IconTile bordered={false} size="sm">
              <BuildingIcon />
            </IconTile>
          }
          emptyName={t('Select company')}
          items={companies}
          manageLabel={t('Manage companies')}
          onChange={(id) =>
            navigateTo(companyDestination(location.pathname, id))
          }
          onManage={() => navigateTo('/my-companies')}
          triggerLabel={companyId ? t('Current company') : t('Company')}
        />
      }
      navigation={
        companyId ? (
          <NavigationList.Root aria-label={t('Accounts navigation')}>
            <>
              <NavigationList.Item
                current={location.pathname.startsWith(
                  '/my-companies/dashboard/',
                )}
                href={dashboard}
                id="dashboard"
                onAction={() => setCompactNavigationOpen(false)}
              >
                <ChartIcon />
                {t('Dashboard')}
              </NavigationList.Item>
              <NavigationList.Item
                current={location.pathname.startsWith(
                  '/my-companies/accounts/',
                )}
                href={transactions}
                id="transactions"
                onAction={() => setCompactNavigationOpen(false)}
              >
                <WalletIcon />
                {t('Transactions')}
                <VisuallyHidden>{t(' — Manage accounts')}</VisuallyHidden>
              </NavigationList.Item>
              <NavigationList.Item
                current={location.pathname.startsWith(
                  '/my-companies/update-details/',
                )}
                href={companyDetails}
                id="company-details"
                onAction={() => setCompactNavigationOpen(false)}
              >
                <BuildingIcon />
                {t('Company details')}
                <VisuallyHidden>
                  {t(' — Manage company details')}
                </VisuallyHidden>
              </NavigationList.Item>
              <NavigationList.Item
                current={location.pathname.startsWith(
                  '/my-companies/settings/',
                )}
                href={settings}
                id="settings"
                onAction={() => setCompactNavigationOpen(false)}
              >
                <SettingsIcon />
                {t('Settings')}
                <VisuallyHidden>{t(' — Manage settings')}</VisuallyHidden>
              </NavigationList.Item>
            </>
          </NavigationList.Root>
        ) : null
      }
      navigationLabel={t('Accounts navigation')}
      onCompactNavigationOpenChange={setCompactNavigationOpen}
      skipLinkLabel={t('Skip to accounts content')}
    >
      {children}
    </ApplicationShell>
  );
}
