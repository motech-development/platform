import type { ReactNode } from 'react';

interface OverlayBaseProps {
  /** Content rendered inside the labelled surface, including any loading UI. */
  children: ReactNode;
  /** Allows Escape and outside presses to close the surface. Defaults to true. */
  dismissible?: boolean;
  /** Visible and accessible surface title. */
  title: string;
}

interface OverlayTriggerProps {
  /** Label for the library-owned trigger button. */
  trigger: string;
}

interface ControlledOverlayProps {
  defaultOpen?: never;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

interface UncontrolledOverlayProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: never;
}

interface TriggerlessOverlayProps extends ControlledOverlayProps {
  /** Omit, and control `open`, to open the surface from your own control or route. */
  trigger?: never;
}

type TriggeredOverlayProps = OverlayTriggerProps &
  (ControlledOverlayProps | UncontrolledOverlayProps);

export type OverlayProps = OverlayBaseProps & TriggeredOverlayProps;
export type ModalOverlayProps = OverlayBaseProps &
  (TriggeredOverlayProps | TriggerlessOverlayProps);
export type OverlayKind = 'dialog' | 'drawer' | 'fullscreen' | 'popover';
