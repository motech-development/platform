import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dialog as AriaDialog } from 'react-aria-components/Dialog';
import { Modal, ModalOverlay } from 'react-aria-components/Modal';
import { Popover as AriaPopover } from 'react-aria-components/Popover';
import { Button } from '../primitives/Button/Button';
import { Skeleton } from '../primitives/Skeleton/Skeleton';
import { useBreezeContext } from '../provider/BreezeContext';
import type { OverlayKind, OverlayProps } from './overlay.types';
import { useOverlayPortal } from './OverlayProvider';
import { ParentOverlayContext, useOverlayLayer } from './OverlayStack';

const variants = {
  base: {
    content: 'breeze-overlay-content',
    header: 'breeze-overlay-header',
    title: 'breeze-overlay-title',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    dialog: 'breeze-dialog',
    drawer: 'breeze-drawer',
    fullscreen: 'breeze-fullscreen',
    popover: 'breeze-popover',
  },
} as const;

function OverlaySurface({
  children,
  defaultOpen = false,
  dismissible = true,
  kind,
  loading = false,
  onOpenChange,
  open: controlledOpen,
  placement = 'bottom',
  title,
  trigger,
}: Readonly<
  Omit<OverlayProps, 'open' | 'defaultOpen' | 'onOpenChange'> & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    kind: OverlayKind;
    placement?: 'top' | 'bottom' | 'start' | 'end';
  }
>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const nonModal = kind === 'popover' || kind === 'fullscreen';
  const host = useOverlayPortal();
  const [portalReady, setPortalReady] = useState(false);

  // Mount nested portals after the parent's modality effects. Otherwise a
  // default-open parent can aria-hide its already mounted child portal.
  useEffect(() => setPortalReady(true), []);
  const parent = useContext(ParentOverlayContext);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const requestedOpen = controlledOpen ?? uncontrolledOpen;
  const parentOpen = parent?.open ?? true;
  const open = requestedOpen && parentOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const [surfaceMounted, setSurfaceMounted] = useState(false);
  const refocusingRef = useRef(false);
  const refocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusedChildRef = useRef<HTMLElement | null>(null);
  const pointerDownTargetRef = useRef<Node | null>(null);
  const blurDismissTargetRef = useRef<Node | null>(null);
  // Full-screen surfaces belong to the viewport, not the sheet's scrollable
  // trigger. Keep the actual trigger separately for focus restoration.
  const positionRef = useMemo(
    () => (kind === 'fullscreen' ? { current: host } : triggerRef),
    [host, kind],
  );
  const layer = useOverlayLayer(
    kind,
    open && portalReady && host !== null,
    open || surfaceMounted,
  );
  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange],
  );

  useEffect(() => {
    if (!parentOpen && requestedOpen) changeOpen(false);
  }, [changeOpen, parentOpen, requestedOpen]);

  useEffect(() => {
    if (kind !== 'popover' || !open || !dismissible || !layer.topmost || !host)
      return undefined;
    // RAC non-modal popovers close on blur, but not on outside clicks. Wait for
    // click so the sheet's pointer gesture completes while the popover is topmost.
    const onPointerDown = (event: PointerEvent) => {
      // A blur caused by a previous keyboard interaction must not suppress a
      // later pointer dismissal.
      blurDismissTargetRef.current = null;
      pointerDownTargetRef.current =
        event.target instanceof Node ? event.target : null;
    };
    const onOutsideClick = (event: MouseEvent) => {
      const { target } = event;
      if (
        target instanceof Node &&
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        const blurTarget = blurDismissTargetRef.current;
        const pointerTarget = pointerDownTargetRef.current;
        blurDismissTargetRef.current = null;
        pointerDownTargetRef.current = null;
        const sameTarget = (left: Node | null, right: Node | null) =>
          !!left &&
          !!right &&
          (left === right || left.contains(right) || right.contains(left));
        if (
          sameTarget(blurTarget, target) &&
          sameTarget(blurTarget, pointerTarget)
        ) {
          return;
        }
        changeOpen(false);
      }
    };
    host.ownerDocument.addEventListener('pointerdown', onPointerDown, true);
    host.ownerDocument.addEventListener('click', onOutsideClick, true);
    return () => {
      host.ownerDocument.removeEventListener(
        'pointerdown',
        onPointerDown,
        true,
      );
      host.ownerDocument.removeEventListener('click', onOutsideClick, true);
      blurDismissTargetRef.current = null;
      pointerDownTargetRef.current = null;
    };
  }, [changeOpen, dismissible, host, kind, layer.topmost, open]);

  const restoreParentFocus = parent?.restoreFocus;
  const parentId = parent?.id;
  const restoreFocus = useCallback(() => {
    const target = triggerRef.current;
    const document = host?.ownerDocument;
    const focused = document?.activeElement;
    if (!document || !host) return;
    const parentSurface = parentId ? document.getElementById(parentId) : null;
    const focusLost =
      focused === document.body ||
      focused === parentSurface ||
      !!focused?.closest('[data-exiting]');
    if (!focusLost) return;
    if (!target?.isConnected) {
      restoreParentFocus?.();
      return;
    }
    const topmost = host.querySelector('[data-breeze-topmost="true"]');
    if (
      (!topmost || topmost.contains(target)) &&
      !target.closest('[inert], [aria-hidden="true"]')
    ) {
      target.focus({ preventScroll: true });
    }
  }, [host, parentId, restoreParentFocus]);

  useEffect(() => {
    if (!loading || !open) return;
    const surface = contentRef.current;
    const focusedChild = focusedChildRef.current;
    if (
      !surface ||
      !focusedChild ||
      focusedChild.isConnected ||
      surface.ownerDocument.activeElement !== surface.ownerDocument.body ||
      surface.closest('[inert], [data-exiting]')
    )
      return;
    focusedChildRef.current = null;
    surface.focus({ preventScroll: true });
  }, [loading, open]);

  const surfaceRef = useCallback(
    (element: HTMLElement | null) => {
      contentRef.current = element;
      const clearRefocusTimer = () => {
        if (refocusTimerRef.current !== null) {
          clearTimeout(refocusTimerRef.current);
          refocusTimerRef.current = null;
        }
      };
      const cleanup = () => {
        clearRefocusTimer();
        contentRef.current = null;
        setSurfaceMounted(false);
        requestAnimationFrame(restoreFocus);
      };
      if (!element) {
        cleanup();
        return undefined;
      }
      setSurfaceMounted(true);
      if (nonModal) {
        queueMicrotask(() => {
          if (
            element.isConnected &&
            !element.closest('[inert], [data-exiting]')
          ) {
            element.focus({ preventScroll: true });
            refocusTimerRef.current = setTimeout(() => {
              const { ownerDocument } = element;
              const { activeElement: focused } = ownerDocument;
              if (
                element.isConnected &&
                !element.closest('[inert], [data-exiting]') &&
                (focused === element || focused === ownerDocument.body)
              ) {
                refocusingRef.current = true;
                element.blur();
                element.focus({ preventScroll: true });
                refocusingRef.current = false;
              }
              refocusTimerRef.current = null;
            }, 500);
          }
        });
      }
      // React Aria restores ordinary closes. Nested simultaneous exits can leave
      // focus on body; repair only that gap after its focus-scope cleanup runs.
      return cleanup;
    },
    [nonModal, restoreFocus],
  );

  const parentContext = useMemo(
    () => ({ id: layer.id, open, restoreFocus }),
    [layer.id, open, restoreFocus],
  );
  const body = (
    <>
      <div className={variants.base.header}>
        <h2 className={variants.base.title}>{title}</h2>
        <span lang={getMessageLocale('close')}>
          <Button onAction={() => changeOpen(false)} variant="quiet">
            {messages.close}
          </Button>
        </span>
      </div>
      {loading ? (
        <Skeleton blockSize="6rem" label={messages.loading} shape="rectangle" />
      ) : (
        children
      )}
    </>
  );
  const content = (
    <ParentOverlayContext value={parentContext}>
      {nonModal ? (
        <section
          aria-label={title}
          className={variants.base.content}
          id={layer.id}
          onFocus={(event) => {
            if (
              event.target !== event.currentTarget &&
              event.target instanceof HTMLElement
            ) {
              focusedChildRef.current = event.target;
            }
          }}
          onBlur={(event) => {
            if (refocusingRef.current) {
              event.stopPropagation();
              return;
            }
            if (event.relatedTarget instanceof HTMLElement) {
              focusedChildRef.current = null;
            }
            const { relatedTarget } = event;
            if (
              kind === 'popover' &&
              dismissible &&
              layer.topmost &&
              relatedTarget instanceof Node &&
              !event.currentTarget.contains(relatedTarget) &&
              !triggerRef.current?.contains(relatedTarget)
            ) {
              blurDismissTargetRef.current = relatedTarget;
            }
          }}
          ref={surfaceRef}
          role="dialog"
          tabIndex={-1}
        >
          {body}
        </section>
      ) : (
        <AriaDialog
          aria-label={title}
          className={variants.base.content}
          id={layer.id}
          ref={surfaceRef}
        >
          {body}
        </AriaDialog>
      )}
    </ParentOverlayContext>
  );

  return (
    <>
      <Button
        aria-controls={open ? layer.id : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        onAction={() => changeOpen(nonModal ? !open : true)}
        ref={triggerRef}
      >
        {trigger}
      </Button>
      {host &&
        portalReady &&
        (nonModal ? (
          <AriaPopover
            className={variants.variant[kind]}
            data-breeze-overlay={kind}
            data-breeze-topmost={layer.topmost}
            data-breeze-interactive={layer.interactive}
            inert={!layer.interactive}
            isNonModal
            isOpen={open}
            isKeyboardDismissDisabled={!dismissible || !layer.topmost}
            onOpenChange={changeOpen}
            placement={placement}
            // Leave the trigger in the blur scope so its action can toggle the popover.
            shouldCloseOnInteractOutside={(element) =>
              kind === 'popover' &&
              dismissible &&
              layer.topmost &&
              !triggerRef.current?.contains(element)
            }
            style={{ zIndex: layer.zIndex }}
            triggerRef={positionRef}
            UNSTABLE_portalContainer={host}
          >
            {content}
          </AriaPopover>
        ) : (
          <ModalOverlay
            className="breeze-overlay-backdrop"
            data-breeze-overlay={kind}
            data-breeze-scrim={layer.scrim}
            data-breeze-topmost={layer.topmost}
            data-breeze-interactive={layer.interactive}
            inert={!layer.interactive}
            isDismissable={dismissible && layer.topmost}
            isKeyboardDismissDisabled={!dismissible || !layer.topmost}
            isOpen={open}
            onOpenChange={changeOpen}
            shouldCloseOnInteractOutside={(element) =>
              layer.topmost && element.hasAttribute('data-breeze-overlay')
            }
            style={{ zIndex: layer.zIndex }}
            UNSTABLE_portalContainer={host}
          >
            <Modal className={variants.variant[kind]}>{content}</Modal>
          </ModalOverlay>
        ))}
    </>
  );
}

export default OverlaySurface;
