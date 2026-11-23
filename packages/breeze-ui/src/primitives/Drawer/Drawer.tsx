import type { ReactNode } from 'react';
import type { ModalOverlayProps } from '../../overlays/overlay.types';
import OverlaySurface from '../../overlays/OverlaySurface';

export type DrawerProps = ModalOverlayProps & {
  /** End-aligned actions pinned below the scrolling content, such as Cancel and Save. */
  footerActions?: ReactNode;
  /** Leading footer action placed before the summary, such as Delete. */
  footerStart?: ReactNode;
  /** Muted one-line footer summary that takes the free width and truncates. */
  footerSummary?: string;
};

/**
 * Opens a labelled drawer with library-owned nesting and motion.
 * @summary A labelled drawer surface opened from its trigger or application state.
 */
export function Drawer({
  children,
  defaultOpen,
  dismissible,
  footerActions,
  footerStart,
  footerSummary,
  onOpenChange,
  open,
  title,
  trigger,
}: Readonly<DrawerProps>) {
  return (
    <OverlaySurface
      defaultOpen={defaultOpen}
      dismissible={dismissible}
      footerActions={footerActions}
      footerStart={footerStart}
      footerSummary={footerSummary}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
      trigger={trigger}
      kind="drawer"
    >
      {children}
    </OverlaySurface>
  );
}
