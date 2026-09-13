import type { ReactNode } from 'react';

interface OverlayBaseProps {
  /** Content rendered inside the labelled surface, including any loading UI. */
  children: ReactNode;
  /** Allows Escape and outside presses to close the surface. Defaults to true. */
  dismissible?: boolean;
  /** Visible and accessible surface title. */
  title: string;
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

export type OverlayProps = OverlayBaseProps &
  (ControlledOverlayProps | UncontrolledOverlayProps);
export type OverlayKind = 'dialog' | 'drawer' | 'fullscreen' | 'popover';
