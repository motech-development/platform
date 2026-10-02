import {
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FocusScope } from 'react-aria/FocusScope';
import { usePreventScroll } from 'react-aria/usePreventScroll';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Dialog as AriaDialog } from 'react-aria-components/Dialog';
import { Modal, ModalOverlay } from 'react-aria-components/Modal';
import { Popover as AriaPopover } from 'react-aria-components/Popover';
import { buttonVariants } from '../buttons/button.styles';
import { Button } from '../primitives/Button/Button';
import { Icon } from '../primitives/Icon/Icon';
import { useBreezeContext } from '../provider/BreezeContext';
import type { OverlayKind, OverlayProps } from './overlay.types';
import { useOverlayPortal } from './OverlayProvider';
import { ParentOverlayContext, useOverlayLayer } from './OverlayStack';

const variants = {
  base: {
    // The design's close is an outlined icon button wider than IconButton's square.
    close:
      'breeze:inline-flex breeze:shrink-0 breeze:items-center breeze:justify-center breeze:block-breeze-8 breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:border breeze:border-solid breeze:rounded-breeze-ctl breeze:cursor-pointer breeze:select-none breeze:outline-offset-2 breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap breeze:[&>svg]:block-[14px] breeze:[&>svg]:inline-[14px]',
    content: 'breeze-overlay-content',
    drawerBody: 'breeze-drawer-body',
    drawerContent: 'breeze-drawer-content',
    drawerFooter: 'breeze-drawer-footer',
    drawerFooterGroup: 'breeze-drawer-footer-group',
    drawerSummary: 'breeze-drawer-summary',
    header: 'breeze-overlay-header',
    title: 'breeze-overlay-title',
    viewerContent: 'breeze-document-viewer-overlay-content',
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

function hasOverlayMarker(element: Element) {
  return (
    (element as Element & { dataset?: DOMStringMap }).dataset?.breezeOverlay !==
    undefined
  );
}

function OverlaySurface({
  children,
  defaultOpen = false,
  dismissible = true,
  footerActions,
  footerStart,
  footerSummary,
  kind,
  onOpenChange,
  open: controlledOpen,
  placement = 'bottom',
  closingTransition = false,
  showHeader = true,
  viewerSurface = false,
  title,
  trigger,
}: Readonly<
  Omit<OverlayProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'trigger'> & {
    open?: boolean;
    defaultOpen?: boolean;
    closingTransition?: boolean;
    footerActions?: ReactNode;
    footerStart?: ReactNode;
    footerSummary?: string;
    showHeader?: boolean;
    viewerSurface?: boolean;
    onOpenChange?: (open: boolean) => void;
    kind: OverlayKind;
    placement?: 'top' | 'bottom' | 'start' | 'end';
    trigger?: string;
  }
>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const nonModal = kind === 'popover' || kind === 'fullscreen';
  const host = useOverlayPortal();
  const parent = useContext(ParentOverlayContext);
  const [portalReady, setPortalReady] = useState(parent === null);
  // Mount nested portals after the parent's modality effects. Otherwise a
  // default-open parent can aria-hide its already mounted child portal.
  useEffect(() => setPortalReady(true), []);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const requestedOpen = controlledOpen ?? uncontrolledOpen;
  const parentOpen = parent?.open ?? true;
  const open = requestedOpen && parentOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const [surfaceMounted, setSurfaceMounted] = useState(false);
  const refocusingRef = useRef(false);
  const refocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pointerDownTargetRef = useRef<Node | null>(null);
  const blurDismissTargetRef = useRef<Node | null>(null);
  const parentCloseReportedRef = useRef(false);
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
  }, [host]);
  // Full-screen surfaces belong to the viewport, not the sheet's scrollable
  // trigger. Keep the actual trigger separately for focus restoration.
  const positionRef = useMemo(
    () => (kind === 'fullscreen' ? { current: host } : triggerRef),
    [host, kind],
  );
  const layer = useOverlayLayer(
    kind,
    open && portalReady && host !== null,
    open || (surfaceMounted && !closingTransition),
  );
  // React Aria only locks scroll for modal overlays.
  usePreventScroll({ isDisabled: kind !== 'fullscreen' || !open });
  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && !parentOpen) {
        if (parentCloseReportedRef.current) return;
        if (requestedOpen) parentCloseReportedRef.current = true;
      }
      if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange, parentOpen, requestedOpen],
  );
  // A ref keeps the gesture-tracking document listeners subscribed across new callbacks.
  const changeOpenRef = useRef(changeOpen);
  useLayoutEffect(() => {
    changeOpenRef.current = changeOpen;
  }, [changeOpen]);

  useEffect(() => {
    if (parentOpen) {
      parentCloseReportedRef.current = false;
    } else if (requestedOpen) {
      changeOpen(false);
    }
  }, [changeOpen, parentOpen, requestedOpen]);

  useEffect(() => {
    if (kind !== 'popover' || !open || !dismissible || !layer.topmost || !host)
      return undefined;
    // RAC non-modal popovers close on blur, but not on outside clicks. Wait for
    // click when available, falling back after a completed outside pointerup.
    const clearPointerDismissTimer = () => {
      if (pointerDismissTimerRef.current !== null) {
        clearTimeout(pointerDismissTimerRef.current);
        pointerDismissTimerRef.current = null;
      }
    };
    const sameTarget = (left: Node | null, right: Node | null) =>
      !!left &&
      !!right &&
      (left === right || left.contains(right) || right.contains(left));
    const isPrimaryPointer = (event: PointerEvent) => event.button === 0;
    const isOutside = (target: Node | null) =>
      isNode(target) &&
      !popoverRef.current?.contains(target) &&
      !triggerRef.current?.contains(target);
    const onPointerDown = (event: PointerEvent) => {
      if (!isPrimaryPointer(event)) return;
      // A blur caused by a previous keyboard interaction must not suppress a
      // later pointer dismissal.
      clearPointerDismissTimer();
      blurDismissTargetRef.current = null;
      pointerDownTargetRef.current = isNode(event.target) ? event.target : null;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!isPrimaryPointer(event)) return;
      const pointerUpTarget = isNode(event.target) ? event.target : null;
      if (!isOutside(pointerUpTarget)) return;
      // Pointer state lasts until the click, or one task if no click follows.
      const startedOutside = isOutside(pointerDownTargetRef.current);
      clearPointerDismissTimer();
      pointerDismissTimerRef.current = setTimeout(() => {
        pointerDismissTimerRef.current = null;
        const blurTarget = blurDismissTargetRef.current;
        const pointerTarget = pointerDownTargetRef.current;
        blurDismissTargetRef.current = null;
        pointerDownTargetRef.current = null;
        if (
          !startedOutside ||
          (sameTarget(blurTarget, pointerUpTarget) &&
            sameTarget(blurTarget, pointerTarget))
        ) {
          return;
        }
        changeOpenRef.current(false);
      }, 0);
    };
    const onPointerCancel = () => {
      clearPointerDismissTimer();
      blurDismissTargetRef.current = null;
      pointerDownTargetRef.current = null;
    };
    const onOutsideClick = (event: MouseEvent) => {
      const target = isNode(event.target) ? event.target : null;
      const blurTarget = blurDismissTargetRef.current;
      const pointerTarget = pointerDownTargetRef.current;
      clearPointerDismissTimer();
      blurDismissTargetRef.current = null;
      pointerDownTargetRef.current = null;
      if (
        !isOutside(target) ||
        // Chromium targets a drag's click at the common ancestor, so drags from inside land here.
        (pointerTarget !== null && !isOutside(pointerTarget)) ||
        (sameTarget(blurTarget, target) &&
          sameTarget(blurTarget, pointerTarget))
      ) {
        return;
      }
      changeOpenRef.current(false);
    };
    host.ownerDocument.addEventListener('pointerdown', onPointerDown, true);
    host.ownerDocument.addEventListener('pointerup', onPointerUp, true);
    host.ownerDocument.addEventListener('pointercancel', onPointerCancel, true);
    host.ownerDocument.addEventListener('click', onOutsideClick, true);
    return () => {
      clearPointerDismissTimer();
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
      host.ownerDocument.removeEventListener('click', onOutsideClick, true);
      blurDismissTargetRef.current = null;
      pointerDownTargetRef.current = null;
    };
  }, [dismissible, host, kind, layer.topmost, open]);

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
    const topmost = host.querySelector('[data-breeze-topmost="true"]');
    const canFocus = (element: HTMLElement) =>
      (!topmost || topmost.contains(element)) &&
      !element.closest('[inert], [aria-hidden="true"], [data-exiting]');
    if (target?.isConnected) {
      if (canFocus(target)) target.focus({ preventScroll: true });
      return;
    }
    // The trigger was removed with this surface: an open parent keeps focus, a closing one defers.
    if (parentSurface && canFocus(parentSurface)) {
      parentSurface.focus({ preventScroll: true });
      return;
    }
    restoreParentFocus?.();
  }, [host, parentId, restoreParentFocus]);

  const clearRefocusTimer = useCallback(() => {
    if (refocusTimerRef.current !== null) {
      clearTimeout(refocusTimerRef.current);
      refocusTimerRef.current = null;
    }
  }, []);
  // Covers a first mount, a deferred portal mount and a reopen while still exiting.
  const focusOnOpen = nonModal && open && surfaceMounted;
  useEffect(() => {
    const element = contentRef.current;
    if (!focusOnOpen || !element) return undefined;
    let cancelled = false;
    // On reopen the layer stays inert until the stack's synchronous re-render.
    queueMicrotask(() => {
      if (
        cancelled ||
        !element.isConnected ||
        element.closest('[inert], [data-exiting]')
      ) {
        return;
      }
      element.focus({ preventScroll: true });
      // Mirrors useDialog's 500ms refocus for iOS VoiceOver; any blur cancels it.
      refocusTimerRef.current = setTimeout(() => {
        refocusTimerRef.current = null;
        const { ownerDocument } = element;
        const { activeElement: focused } = ownerDocument;
        if (
          !element.isConnected ||
          element.closest('[inert], [data-exiting]') ||
          (focused !== element && focused !== ownerDocument.body)
        ) {
          return;
        }
        refocusingRef.current = true;
        element.blur();
        element.focus({ preventScroll: true });
        refocusingRef.current = false;
      }, 500);
    });
    return () => {
      cancelled = true;
      clearRefocusTimer();
    };
  }, [clearRefocusTimer, focusOnOpen]);

  const surfaceRef = useCallback(
    (element: HTMLElement | null) => {
      contentRef.current = element;
      const cleanup = () => {
        contentRef.current = null;
        setSurfaceMounted(false);
        requestAnimationFrame(restoreFocus);
      };
      if (!element) {
        cleanup();
        return undefined;
      }
      setSurfaceMounted(true);
      // React Aria restores ordinary closes. Nested simultaneous exits can leave
      // focus on body; repair only that gap after its focus-scope cleanup runs.
      return cleanup;
    },
    [restoreFocus],
  );

  const parentContext = useMemo(
    () => ({ id: layer.id, open, restoreFocus }),
    [layer.id, open, restoreFocus],
  );
  const drawer = kind === 'drawer';
  const contentClassName = [
    variants.base.content,
    viewerSurface && variants.base.viewerContent,
    drawer && variants.base.drawerContent,
  ]
    .filter(Boolean)
    .join(' ');
  const body = (
    <>
      {showHeader ? (
        <div className={variants.base.header}>
          <h2 className={variants.base.title}>{title}</h2>
          <AriaButton
            aria-label={messages.close}
            className={`${variants.base.close} ${buttonVariants.variant.secondary}`}
            onPress={() => changeOpen(false)}
            render={(buttonProps) =>
              createElement('button', {
                ...buttonProps,
                lang: getMessageLocale('close'),
                type: 'button',
              })
            }
          >
            <Icon name="close" size="sm" />
          </AriaButton>
        </div>
      ) : null}
      {drawer ? (
        <div className={variants.base.drawerBody}>{children}</div>
      ) : (
        children
      )}
      {drawer && (footerStart || footerSummary || footerActions) ? (
        <footer className={variants.base.drawerFooter}>
          {footerStart ? (
            <div className={variants.base.drawerFooterGroup}>{footerStart}</div>
          ) : null}
          <span className={variants.base.drawerSummary}>{footerSummary}</span>
          {footerActions ? (
            <div className={variants.base.drawerFooterGroup}>
              {footerActions}
            </div>
          ) : null}
        </footer>
      ) : null}
    </>
  );
  const section = (
    <section
      aria-label={title}
      className={contentClassName}
      id={layer.id}
      onBlur={(event) => {
        if (refocusingRef.current) {
          event.stopPropagation();
          return;
        }
        clearRefocusTimer();
        const { relatedTarget } = event;
        if (
          kind === 'popover' &&
          dismissible &&
          layer.topmost &&
          isNode(relatedTarget) &&
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
  );
  // Contains Tab without making anything behind it inert (ADR 0002).
  const nonModalSurface =
    kind === 'fullscreen' ? (
      <FocusScope contain={layer.interactive}>{section}</FocusScope>
    ) : (
      section
    );
  const content = (
    <ParentOverlayContext value={parentContext}>
      {nonModal ? (
        nonModalSurface
      ) : (
        <AriaDialog
          aria-label={title}
          className={contentClassName}
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
      {trigger ? (
        <Button
          aria-controls={open ? layer.id : undefined}
          aria-expanded={open}
          aria-haspopup="dialog"
          onAction={() => changeOpen(nonModal ? !open : true)}
          ref={triggerRef}
        >
          {trigger}
        </Button>
      ) : null}
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
            ref={popoverRef}
            // Leave the trigger in the blur scope so its action can toggle the popover.
            shouldCloseOnInteractOutside={(element) =>
              kind === 'popover' &&
              dismissible &&
              layer.topmost &&
              !triggerRef.current?.contains(element)
            }
            style={{ zIndex: layer.zIndex }}
            triggerRef={positionRef}
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
              layer.topmost && hasOverlayMarker(element)
            }
            style={{ zIndex: layer.zIndex }}
          >
            <Modal className={variants.variant[kind]}>{content}</Modal>
          </ModalOverlay>
        ))}
    </>
  );
}

export default OverlaySurface;
