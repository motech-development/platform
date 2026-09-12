import type { OverlayProps } from '../../overlays/overlay.types';
import OverlaySurface from '../../overlays/OverlaySurface';

export type DialogProps = OverlayProps;

/**
 * Opens a labelled dialog with library-owned nesting and motion.
 * @summary A labelled dialog surface with a trigger and close action.
 */
export function Dialog({
  children,
  defaultOpen,
  dismissible,
  loading,
  onOpenChange,
  open,
  title,
  trigger,
}: Readonly<DialogProps>) {
  return (
    <OverlaySurface
      defaultOpen={defaultOpen}
      dismissible={dismissible}
      loading={loading}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
      trigger={trigger}
      kind="dialog"
    >
      {children}
    </OverlaySurface>
  );
}
