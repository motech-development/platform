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

function isNode(value: EventTarget | null): value is Node {
  return (
    value !== null &&
    typeof value === 'object' &&
    'nodeType' in value &&
    typeof (value as Node).contains === 'function'
  );
}

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
  const surfaceRef = useRef<Element | null>(null);
  const pointerDownTargetRef = useRef<Node | null>(null);
  const pointerDismissTargetRef = useRef<Node | null>(null);
  const open = requestedOpen && parentOpen;
  const layer = useOverlayLayer(
    'popover',
    open && portalReady && host !== null,
    open || surfaceMounted,
  );
  const handleSurfaceRef = useCallback((element: Element | null) => {
    surfaceRef.current = element;
    setSurfaceMounted(element !== null);
  }, []);

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
  useLayoutEffect(() => {
    if (!open || !layer.topmost || !host) return undefined;

    const isOutside = (target: Node | null) =>
      isNode(target) &&
      !surfaceRef.current?.contains(target) &&
      !triggerRef.current?.contains(target);
    const sameTarget = (left: Node | null, right: Node | null) =>
      !!left &&
      !!right &&
      (left === right || left.contains(right) || right.contains(left));
    const isPrimaryPointer = (event: PointerEvent) => event.button === 0;
    const onPointerDown = (event: PointerEvent) => {
      if (!isPrimaryPointer(event)) return;
      pointerDownTargetRef.current = isNode(event.target) ? event.target : null;
      pointerDismissTargetRef.current = null;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!isPrimaryPointer(event)) return;
      const pointerDownTarget = pointerDownTargetRef.current;
      const pointerUpTarget = isNode(event.target) ? event.target : null;
      if (!isOutside(pointerDownTarget) || !isOutside(pointerUpTarget)) return;
      pointerDismissTargetRef.current = pointerUpTarget;
      onOpenChange(false);
    };
    const onPointerCancel = () => {
      pointerDownTargetRef.current = null;
      pointerDismissTargetRef.current = null;
    };
    const onClick = (event: MouseEvent) => {
      const target = isNode(event.target) ? event.target : null;
      if (
        isOutside(target) &&
        !sameTarget(pointerDismissTargetRef.current, target)
      ) {
        onOpenChange(false);
      }
      pointerDownTargetRef.current = null;
      pointerDismissTargetRef.current = null;
    };

    host.ownerDocument.addEventListener('pointerdown', onPointerDown, true);
    host.ownerDocument.addEventListener('pointerup', onPointerUp, true);
    host.ownerDocument.addEventListener('pointercancel', onPointerCancel, true);
    host.ownerDocument.addEventListener('click', onClick, true);
    return () => {
      host.ownerDocument.removeEventListener(
        'pointerdown',
        onPointerDown,
        true,
      );
      host.ownerDocument.removeEventListener('pointerup', onPointerUp, true);
      host.ownerDocument.removeEventListener(
        'pointercancel',
        onPointerCancel,
        true,
      );
      host.ownerDocument.removeEventListener('click', onClick, true);
      pointerDownTargetRef.current = null;
      pointerDismissTargetRef.current = null;
    };
  }, [host, layer.topmost, onOpenChange, open, triggerRef]);

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
      // Defer pointer dismissal to Breeze's provider-document policy, while
      // retaining React Aria's keyboard/focus dismissal behavior.
      shouldCloseOnInteractOutside={(element) =>
        pointerDownTargetRef.current === null &&
        layer.topmost &&
        !triggerRef.current?.contains(element)
      }
      style={{ zIndex: layer.zIndex }}
      triggerRef={triggerRef}
      ref={handleSurfaceRef}
    >
      {children}
    </AriaPopover>
  );
}
