import { type HostedStage, isHostedStage } from '../stage';

export type { HostedStage } from '../stage';

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
