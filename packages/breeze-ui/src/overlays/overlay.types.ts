import type { ReactNode } from 'react';

interface OverlayBaseProps {
  /** Content inside the labelled surface. */
  children: ReactNode;
  /** Allows Escape and outside presses to close the surface. Defaults to true. */
  dismissible?: boolean;
  /** Replaces content with the surface's skeleton, retaining its title and close action. */
  loading?: boolean;
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
