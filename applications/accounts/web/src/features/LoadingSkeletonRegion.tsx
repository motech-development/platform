import { VisuallyHidden } from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';

export function LoadingSkeletonRegion({
  children,
  loadingLabel,
}: Readonly<{ children: ReactNode; loadingLabel: string }>) {
  return (
    <section aria-busy="true" aria-label={loadingLabel} role="status">
      <VisuallyHidden>{loadingLabel}</VisuallyHidden>
      <div aria-hidden="true" inert>
        {children}
      </div>
    </section>
  );
}
