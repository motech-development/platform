import type { ReactNode } from 'react';
import { FormSkeletonRegion } from '../loading/AccountsPageSkeletons';
import { QueryFailureState } from './QueryFailureState';

export function CompanyFormLoadingState({
  children,
  loadingLabel,
  pageHeader,
}: Readonly<{
  children: ReactNode;
  loadingLabel: string;
  pageHeader: ReactNode;
}>) {
  return (
    <div className="min-w-0">
      {pageHeader}
      <FormSkeletonRegion loadingLabel={loadingLabel}>
        {children}
      </FormSkeletonRegion>
    </div>
  );
}

export function CompanyFormFailureState({
  onRetry,
  pageHeader,
  title,
}: Readonly<{
  onRetry: () => void;
  pageHeader: ReactNode;
  title: string;
}>) {
  return (
    <div className="min-w-0">
      {pageHeader}
      <QueryFailureState onRetry={onRetry} title={title} />
    </div>
  );
}
