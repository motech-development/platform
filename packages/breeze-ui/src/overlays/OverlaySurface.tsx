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
  const layer = useOverlayLayer(kind, open && portalReady && host !== null);
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

  const restoreParentFocus = parent?.restoreFocus;
  const restoreFocus = useCallback(() => {
    const target = triggerRef.current;
    const document = host?.ownerDocument;
    const focused = document?.activeElement;
    if (
      !document ||
      (focused !== document.body && !focused?.closest('[data-exiting]'))
    )
      return;
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
  }, [host, restoreParentFocus]);

  const surfaceRef = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return undefined;
      // React Aria restores ordinary closes. Nested simultaneous exits can leave
      // focus on body; repair only that gap after its focus-scope cleanup runs.
      return () => {
        requestAnimationFrame(restoreFocus);
      };
    },
    [restoreFocus],
  );

  const parentContext = useMemo(
    () => ({ id: layer.id, open, restoreFocus }),
    [layer.id, open, restoreFocus],
  );
  const content = (
    <ParentOverlayContext value={parentContext}>
      <AriaDialog
        aria-label={title}
        className={variants.base.content}
        id={layer.id}
        ref={surfaceRef}
      >
        <div className={variants.base.header}>
          <h2 className={variants.base.title}>{title}</h2>
          <span lang={getMessageLocale('close')}>
            <Button onAction={() => changeOpen(false)} variant="quiet">
              {messages.close}
            </Button>
          </span>
        </div>
        {loading ? (
          <Skeleton
            blockSize="6rem"
            label={messages.loading}
            shape="rectangle"
          />
        ) : (
          children
        )}
      </AriaDialog>
    </ParentOverlayContext>
  );

  return (
    <>
      <Button
        aria-controls={open ? layer.id : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        onAction={() => changeOpen(true)}
        ref={triggerRef}
      >
        {trigger}
      </Button>
      {host &&
        portalReady &&
        (kind === 'popover' ? (
          <AriaPopover
            className={variants.variant.popover}
            data-breeze-overlay={kind}
            data-breeze-topmost={layer.topmost}
            inert={!layer.topmost}
            isOpen={open}
            isKeyboardDismissDisabled={!dismissible || !layer.topmost}
            onOpenChange={changeOpen}
            placement={placement}
            shouldCloseOnInteractOutside={() => dismissible && layer.topmost}
            style={{ zIndex: layer.zIndex }}
            triggerRef={triggerRef}
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
            inert={!layer.topmost}
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
