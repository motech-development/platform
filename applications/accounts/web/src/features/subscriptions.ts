import { useCallback, useRef } from 'react';

function subscriptionControlMessage(result: unknown) {
  if (
    typeof result !== 'object' ||
    result === null ||
    !('extensions' in result) ||
    typeof result.extensions !== 'object' ||
    result.extensions === null ||
    !('controlMsgType' in result.extensions)
  ) {
    return undefined;
  }

  return result.extensions.controlMsgType;
}

export function useAppSyncSubscriptionConnection() {
  const hasConnected = useRef(false);

  return useCallback(
    (
      result: unknown,
      onReconnect: () => void,
      {
        reconcileInitialConnection = false,
      }: Readonly<{ reconcileInitialConnection?: boolean }> = {},
    ) => {
      if (subscriptionControlMessage(result) !== 'CONNECTED') {
        return false;
      }

      if (hasConnected.current || reconcileInitialConnection) {
        onReconnect();
      }

      if (!hasConnected.current) {
        hasConnected.current = true;
      }

      return true;
    },
    [],
  );
}
