import type { ModalOverlayProps } from '../../overlays/overlay.types';
import OverlaySurface from '../../overlays/OverlaySurface';

export type DialogProps = ModalOverlayProps;

/**
 * Opens a labelled dialog with library-owned nesting and motion.
 * @summary A labelled dialog surface opened from its trigger or application state.
 */
export function Dialog({
  children,
  defaultOpen,
  dismissible,
  onOpenChange,
  open,
  title,
  trigger,
}: Readonly<DialogProps>) {
  return (
    <OverlaySurface
      defaultOpen={defaultOpen}
      dismissible={dismissible}
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
