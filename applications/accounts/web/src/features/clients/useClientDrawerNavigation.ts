import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

export function useClientDrawerNavigation({
  companyId,
  pending,
}: Readonly<{ companyId: string; pending: boolean }>) {
  const navigate = useNavigate();
  const allowNavigation = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const blocker = useBlocker({
    enableBeforeUnload: dirty || pending,
    shouldBlockFn: () => (dirty || pending) && !allowNavigation.current,
    withResolver: true,
  });
  const blockerRef = useRef(blocker);

  blockerRef.current = blocker;

  const discardChanges = () => {
    allowNavigation.current = true;
    setDirty(false);
    setDiscardOpen(false);
  };
  const navigateToClients = (targetCompanyId = companyId) =>
    navigate({
      params: { companyId: targetCompanyId },
      to: '/my-companies/clients/$companyId',
    });
  const leave = () => {
    discardChanges();

    if (blocker.status === 'blocked') {
      blocker.proceed();
      return;
    }

    navigateToClients().catch(() => undefined);
  };
  const requestClose = () => {
    if (pending) return;
    if (dirty) setDiscardOpen(true);
    else leave();
  };

  useEffect(() => {
    if (blocker.status === 'blocked' && !pending) setDiscardOpen(true);
  }, [blocker.status, pending]);

  return {
    blocker,
    completeMutation: () => {
      const activeBlocker = blockerRef.current;
      allowNavigation.current = true;
      setDirty(false);

      if (activeBlocker.status === 'blocked') {
        activeBlocker.proceed();
        return true;
      }

      return false;
    },
    discardChanges: () => {
      if (pending) return;

      discardChanges();
      if (blocker.status !== 'blocked') {
        navigateToClients().catch(() => undefined);
      }
    },
    discardOpen,
    markDirty: () => setDirty(true),
    navigateToClients,
    navigateToCompanies: () => navigate({ to: '/my-companies' }),
    proceedBlockedNavigationIfPristine: () => {
      const activeBlocker = blockerRef.current;
      if (activeBlocker.status !== 'blocked' || dirty) return false;

      allowNavigation.current = true;
      activeBlocker.proceed();
      return true;
    },
    requestClose,
    resetBlockedNavigation: () => {
      const activeBlocker = blockerRef.current;
      if (activeBlocker.status === 'blocked') activeBlocker.reset?.();
    },
    restrictNavigation: () => {
      allowNavigation.current = false;
    },
    setDiscardOpen,
  };
}
