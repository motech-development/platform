const previewStage = /^pr-\d+$/;

export type HostedStage = 'develop' | 'production' | `pr-${number}`;

export function isHostedStage(value: string): value is HostedStage {
  return (
    value === 'develop' || value === 'production' || previewStage.test(value)
  );
}
