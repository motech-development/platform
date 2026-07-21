import type { ReactNode } from 'react';

const constraintClasses = {
  'application-rail': 'w-72',
  bounded: 'max-w-xl',
  'bounded-calendar': 'max-w-sm',
  'bounded-compact': 'max-w-xs',
  'bounded-content': 'max-w-2xl',
  'bounded-control': 'max-w-md',
  'bounded-layout': 'w-full max-w-3xl',
  'compact-control': 'w-48',
  'compact-height': 'h-12 [&>*]:h-full',
  'full-height': 'h-96 [&>*]:h-full',
  'narrow-control': 'w-64',
  'responsive-narrow': 'w-72 max-w-full',
} as const;

type StoryConstraintSize = keyof typeof constraintClasses;

interface StoryConstraintProps {
  children: ReactNode;
  /**
   * Story-only layout condition: controls are 12rem or 16rem wide, responsive
   * narrow hosts are 18rem capped by the viewport, bounded examples stop at
   * 20rem, 24rem, 28rem, 36rem, 42rem, or 48rem, and height fixtures are 3rem
   * or 24rem tall.
   */
  size: StoryConstraintSize;
  /** Stable browser-test hook for the constrained host. */
  testId?: string;
}

/** Keeps documentation constraints explicit without presenting them as product UI. */
export default function StoryConstraint({
  children,
  size,
  testId,
}: StoryConstraintProps) {
  return (
    <div className={constraintClasses[size]} data-testid={testId}>
      {children}
    </div>
  );
}
