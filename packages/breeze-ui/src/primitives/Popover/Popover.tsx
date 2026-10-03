import type { OverlayProps } from '../../overlays/overlay.types';
import OverlaySurface from '../../overlays/OverlaySurface';

interface PopoverCommonProps {
  /** Preferred logical placement; flips when space is limited. `bottom end` aligns the end edges. */
  placement?: 'top' | 'bottom' | 'start' | 'end' | 'bottom end';
}

interface PopoverTitledProps {
  /** `titled` shows the title and a close button; `panel` shows edge-to-edge content only. */
  variant?: 'titled';
}

interface PopoverPanelProps {
  /** A panel has no close button, so it must stay dismissible. */
  dismissible?: true;
  /** `titled` shows the title and a close button; `panel` shows edge-to-edge content only. */
  variant: 'panel';
}

interface PopoverTextTriggerProps {
  triggerIndicator?: never;
  triggerInitials?: never;
}

interface PopoverInitialsTriggerProps {
  /** Adds an attention dot to the initials trigger; describe it in `trigger`. */
  triggerIndicator?: boolean;
  /** Shows these initials in a circular trigger; `trigger` becomes its accessible name. */
  triggerInitials: string;
}

export type PopoverProps = OverlayProps &
  PopoverCommonProps &
  (PopoverTitledProps | PopoverPanelProps) &
  (PopoverTextTriggerProps | PopoverInitialsTriggerProps);

/**
 * Opens a labelled popover with library-owned nesting and motion.
 * @summary A labelled popover surface with a trigger and close action.
 */
export function Popover({
  children,
  defaultOpen,
  dismissible,
  onOpenChange,
  open,
  title,
  trigger,
  triggerIndicator,
  triggerInitials,
  placement,
  variant = 'titled',
}: Readonly<PopoverProps>) {
  return (
    <OverlaySurface
      defaultOpen={defaultOpen}
      dismissible={dismissible}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
      trigger={trigger}
      triggerIndicator={triggerIndicator}
      triggerInitials={triggerInitials}
      placement={placement}
      panel={variant === 'panel'}
      kind="popover"
    >
      {children}
    </OverlaySurface>
  );
}
