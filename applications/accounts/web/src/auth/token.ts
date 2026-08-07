type TokenProvider = () => Promise<string>;

let tokenProvider: TokenProvider | undefined;
let finishRenewal: (() => void) | undefined;
let renewalBarrier: Promise<void> | undefined;

export function setAccessTokenProvider(provider: TokenProvider | undefined) {
  tokenProvider = provider;
}

export function beginAccessTokenRenewal() {
  renewalBarrier ??= new Promise<void>((resolve) => {
    finishRenewal = resolve;
  });
}

export function completeAccessTokenRenewal() {
  const finish = finishRenewal;

  finishRenewal = undefined;
  renewalBarrier = undefined;
  finish?.();
}

export async function getAccessToken(): Promise<string> {
  await renewalBarrier;

  if (!tokenProvider) {
    throw new Error('The authenticated Accounts session is not ready');
  }

  return tokenProvider();
}
