import type { ReactNode, RefObject } from 'react';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Popover as AriaPopover } from 'react-aria-components/Popover';
import { useOverlayPortal } from '../../overlays/OverlayProvider';
import {
  ParentOverlayContext,
  useOverlayLayer,
} from '../../overlays/OverlayStack';

const triggerBoundaryError =
  'Breeze overlay triggers and portal containers must belong to the current document and light DOM.';

interface CollectionPopoverProps {
  children: ReactNode;
  className: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<Element | null>;
}

/**
 * The collection popover bridge keeps listbox surfaces inside Breeze's portal
 * and overlay stack while React Aria owns positioning, focus and dismissal.
 */
export default function CollectionPopover({
  children,
  className,
  isOpen: requestedOpen,
  onOpenChange,
  triggerRef,
}: Readonly<CollectionPopoverProps>) {
  const host = useOverlayPortal();
  const parent = useContext(ParentOverlayContext);
  const parentOpen = parent?.open ?? true;
  const [portalReady, setPortalReady] = useState(parent === null);
  const [surfaceMounted, setSurfaceMounted] = useState(false);
  const parentCloseReportedRef = useRef(false);
  const open = requestedOpen && parentOpen;
  const layer = useOverlayLayer(
    'popover',
    open && portalReady && host !== null,
    open || surfaceMounted,
  );
  const handleSurfaceRef = useCallback(
    (element: Element | null) => setSurfaceMounted(element !== null),
    [],
  );

  useLayoutEffect(() => {
    if (
      host &&
      triggerRef.current &&
      (triggerRef.current.ownerDocument !== document ||
        triggerRef.current.getRootNode() !== document ||
        host.ownerDocument !== document ||
        host.getRootNode() !== document)
    ) {
      throw new Error(triggerBoundaryError);
    }
  });

  useEffect(() => setPortalReady(true), []);
  useEffect(() => {
    if (parentOpen) {
      parentCloseReportedRef.current = false;
    } else if (requestedOpen && !parentCloseReportedRef.current) {
      parentCloseReportedRef.current = true;
      onOpenChange(false);
    }
  }, [onOpenChange, parentOpen, requestedOpen]);

  return (
    <AriaPopover
      className={`${className} breeze-popover`}
      data-breeze-interactive={layer.interactive}
      data-breeze-overlay="popover"
      data-breeze-topmost={layer.topmost}
      inert={!layer.interactive}
      isKeyboardDismissDisabled={!layer.topmost}
      isNonModal
      isOpen={open}
      onOpenChange={onOpenChange}
      placement="bottom start"
      shouldCloseOnInteractOutside={(element) =>
        layer.topmost && !triggerRef.current?.contains(element)
      }
      style={{ zIndex: layer.zIndex }}
      triggerRef={triggerRef}
      ref={handleSurfaceRef}
    >
      {children}
    </AriaPopover>
  );
}
