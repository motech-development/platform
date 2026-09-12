import type { OverlayProps } from '../../overlays/overlay.types';
import OverlaySurface from '../../overlays/OverlaySurface';

export type PopoverProps = OverlayProps & {
  /** Preferred logical placement; flips when space is limited. */
  placement?: 'top' | 'bottom' | 'start' | 'end';
};

/**
 * Opens a labelled popover with library-owned nesting and motion.
 * @summary A labelled popover surface with a trigger and close action.
 */
export function Popover({
  children,
  defaultOpen,
  dismissible,
  loading,
  onOpenChange,
  open,
  title,
  trigger,
  placement,
}: Readonly<PopoverProps>) {
  return (
    <OverlaySurface
      defaultOpen={defaultOpen}
      dismissible={dismissible}
      loading={loading}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
      trigger={trigger}
      placement={placement}
      kind="popover"
    >
      {children}
    </OverlaySurface>
  );
}
