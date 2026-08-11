import { useBlocker } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

export function useFormNavigation({
  blockPendingNavigation = false,
  onClose,
  pending = false,
}: Readonly<{
  blockPendingNavigation?: boolean;
  onClose: () => Promise<unknown>;
  pending?: boolean;
}>) {
  const allowNavigation = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const navigationBlocked = dirty || blockPendingNavigation;
  const blocker = useBlocker({
    enableBeforeUnload: navigationBlocked,
    shouldBlockFn: () => navigationBlocked && !allowNavigation.current,
    withResolver: true,
  });
  const blockerRef = useRef(blocker);

  blockerRef.current = blocker;

  const clearChanges = () => {
    allowNavigation.current = true;
    setDirty(false);
    setDiscardOpen(false);
  };
  const restrictNavigation = () => {
    allowNavigation.current = false;
  };
  const leave = () => {
    clearChanges();

    if (blocker.status === 'blocked') {
      blocker.proceed();
      return;
    }

    onClose().catch(restrictNavigation);
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
    completeMutation: ({ resumeBlockedNavigation = false } = {}) => {
      const activeBlocker = blockerRef.current;
      clearChanges();

      if (activeBlocker.status === 'blocked') {
        if (resumeBlockedNavigation) {
          activeBlocker.proceed();
          return true;
        }

        activeBlocker.reset?.();
      }

      return false;
    },
    dirty,
    discardChanges: () => {
      if (pending) return;

      clearChanges();
      if (blocker.status !== 'blocked') onClose().catch(restrictNavigation);
    },
    discardOpen,
    leave,
    markDirty: () => setDirty(true),
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
    restrictNavigation,
    setDiscardOpen,
  };
}
