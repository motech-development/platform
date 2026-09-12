import type { OverlayProps } from '../../overlays/overlay.types';
import OverlaySurface from '../../overlays/OverlaySurface';

export type DrawerProps = OverlayProps;

/**
 * Opens a labelled drawer with library-owned nesting and motion.
 * @summary A labelled drawer surface with a trigger and close action.
 */
export function Drawer({
  children,
  defaultOpen,
  dismissible,
  loading,
  onOpenChange,
  open,
  title,
  trigger,
}: Readonly<DrawerProps>) {
  return (
    <OverlaySurface
      defaultOpen={defaultOpen}
      dismissible={dismissible}
      loading={loading}
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
