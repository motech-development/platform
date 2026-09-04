const previewStage = /^pr-\d+$/;

export type HostedStage = 'develop' | 'production' | `pr-${number}`;

function isHostedStage(value: string): value is HostedStage {
  return (
    value === 'develop' || value === 'production' || previewStage.test(value)
  );
}

export function parseStage(arguments_: readonly string[]): HostedStage {
  const index = arguments_.indexOf('--stage');
  const stage = index >= 0 ? arguments_[index + 1] : undefined;

  if (!stage || !isHostedStage(stage)) {
    throw new Error(
      'Accounts web requires --stage develop, production or pr-<number>',
    );
  }

  return stage;
}

export function branchForStage(stage: HostedStage) {
  return `amplify/${stage}`;
}

export function hostedUrlForStage(stage: HostedStage, appId: string) {
  if (stage === 'develop') {
    return 'https://accounts-develop.motechdevelopment.co.uk';
  }

  return `https://amplify-${stage}.${appId}.amplifyapp.com`;
}
