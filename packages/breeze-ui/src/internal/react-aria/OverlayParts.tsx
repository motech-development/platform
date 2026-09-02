import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
} from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Dialog as AriaDialog } from 'react-aria-components/Dialog';
import { Heading as AriaHeading } from 'react-aria-components/Heading';
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components/Modal';
import { Text as AriaText } from 'react-aria-components/Text';
import { tv } from 'tailwind-variants';
import { Button, type ButtonProps } from '../../primitives/Button/Button';
import { useBreezeContext } from '../../provider/BreezeContext';
import useForwardedRef from '../hooks/useForwardedRef';
import action from '../styling/actions';
import type { VisualAppearance } from '../styling/visual';

const overlay = tv({
  base: 'breeze-modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--breeze-overlay)] p-4 forced-colors:bg-[Canvas]',
});
const modal = tv({ base: 'max-h-full max-w-full outline-none' });
const surface = tv({
  base: 'breeze-modal-surface max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-6 text-[var(--breeze-ink)] shadow-xl outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-[var(--breeze-focus)]',
});
const title = tv({
  base: 'm-0 mb-2 font-[family-name:var(--breeze-font-display)] text-xl font-bold leading-tight',
});
const description = tv({ base: 'mb-5 block text-[var(--breeze-ink-muted)]' });

const nestedBoundaryProperties = [
  '--breeze-nested-overlay-left',
  '--breeze-nested-overlay-top',
  '--breeze-nested-overlay-width',
  '--breeze-nested-overlay-height',
] as const;
const nestedBackdropSuppressedAttribute = 'data-nested-backdrop-suppressed';

interface ModalSurfaceContextValue {
  depth: number;
  ref: RefObject<HTMLElement | null>;
}

const ModalSurfaceContext = createContext<ModalSurfaceContextValue | undefined>(
  undefined,
);
const modalSurfaceDepth = new WeakMap<HTMLElement, number>();

export const OverlayDescriptionContext = createContext<string | undefined>(
  undefined,
);

function isOpenModalSurface(
  candidate: HTMLElement | undefined,
): candidate is HTMLElement {
  return (
    candidate !== undefined &&
    candidate.isConnected &&
    candidate.closest('[data-exiting]') === null
  );
}

function resolvePortalRoot(
  currentOverlay: HTMLElement,
  portalContainer: HTMLElement | null,
): HTMLElement | undefined {
  const portal =
    portalContainer ??
    currentOverlay.closest<HTMLElement>('[data-breeze-portal-root]');

  return portal?.contains(currentOverlay) ? portal : undefined;
}

function findTopmostModalSurface(
  currentOverlay: HTMLElement,
  portalContainer: HTMLElement | null,
): HTMLElement | undefined {
  const portal = resolvePortalRoot(currentOverlay, portalContainer);

  if (portal === undefined) return undefined;

  const surfaces = Array.from(
    portal.querySelectorAll<HTMLElement>('.breeze-modal-surface'),
  ).filter(
    (candidateSurface) =>
      !currentOverlay.contains(candidateSurface) &&
      isOpenModalSurface(candidateSurface),
  );

  return surfaces.reduce<HTMLElement | undefined>((topmost, candidate) => {
    const topmostDepth =
      topmost === undefined ? -1 : modalSurfaceDepth.get(topmost) ?? -1;
    const candidateDepth = modalSurfaceDepth.get(candidate) ?? -1;

    return candidateDepth >= topmostDepth ? candidate : topmost;
  }, undefined);
}

function findExitingModalOverlays(
  currentOverlay: HTMLElement,
  portalContainer: HTMLElement | null,
): HTMLElement[] {
  const portal = resolvePortalRoot(currentOverlay, portalContainer);

  if (portal === undefined) return [];

  return Array.from(
    portal.querySelectorAll<HTMLElement>('.breeze-modal-surface'),
  ).reduce<HTMLElement[]>((exitingOverlays, candidateSurface) => {
    if (
      currentOverlay.contains(candidateSurface) ||
      candidateSurface.closest('[data-exiting]') === null
    ) {
      return exitingOverlays;
    }

    const candidateOverlay = candidateSurface.closest<HTMLElement>(
      '.breeze-modal-overlay',
    );

    if (
      candidateOverlay !== null &&
      !exitingOverlays.includes(candidateOverlay)
    ) {
      exitingOverlays.push(candidateOverlay);
    }

    return exitingOverlays;
  }, []);
}

function resolveNestedBoundary(
  currentOverlay: HTMLElement,
  portalContainer: HTMLElement | null,
  parentSurface: ModalSurfaceContextValue | undefined,
): HTMLElement | undefined {
  const contextualCandidate = parentSurface?.ref.current ?? undefined;
  const contextualSurface = isOpenModalSurface(contextualCandidate)
    ? contextualCandidate
    : undefined;
  const topmostSurface = findTopmostModalSurface(
    currentOverlay,
    portalContainer,
  );

  if (contextualSurface === undefined) return topmostSurface;
  if (topmostSurface === undefined) return contextualSurface;

  const contextualDepth =
    modalSurfaceDepth.get(contextualSurface) ?? parentSurface?.depth ?? -1;
  const topmostDepth = modalSurfaceDepth.get(topmostSurface) ?? -1;

  return topmostDepth > contextualDepth ? topmostSurface : contextualSurface;
}

function clearNestedBoundary(overlayElement: HTMLElement): void {
  const { dataset } = overlayElement;

  delete dataset.nestedBoundary;
  nestedBoundaryProperties.forEach((property) =>
    overlayElement.style.removeProperty(property),
  );
}

function trackNestedBoundary(
  overlayElement: HTMLElement,
  boundary: HTMLElement,
): () => void {
  const updateBoundary = () => {
    const bounds = boundary.getBoundingClientRect();

    if (bounds.width <= 0 || bounds.height <= 0) {
      clearNestedBoundary(overlayElement);
      return;
    }

    const { dataset } = overlayElement;

    dataset.nestedBoundary = '';
    overlayElement.style.setProperty(
      '--breeze-nested-overlay-left',
      `${bounds.left}px`,
    );
    overlayElement.style.setProperty(
      '--breeze-nested-overlay-top',
      `${bounds.top}px`,
    );
    overlayElement.style.setProperty(
      '--breeze-nested-overlay-width',
      `${bounds.width}px`,
    );
    overlayElement.style.setProperty(
      '--breeze-nested-overlay-height',
      `${bounds.height}px`,
    );
  };
  let motionFrame: number | undefined;
  const hasActiveBoundaryMotion = () =>
    boundary
      .getAnimations?.()
      .some(
        (animation) => animation.pending || animation.playState === 'running',
      ) ?? false;
  const trackBoundaryMotion = () => {
    motionFrame = undefined;
    updateBoundary();

    if (hasActiveBoundaryMotion()) {
      motionFrame = window.requestAnimationFrame(trackBoundaryMotion);
    }
  };
  const scheduleBoundaryTracking = () => {
    motionFrame ??= window.requestAnimationFrame(trackBoundaryMotion);
  };
  const observer =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(updateBoundary);
  const viewport = window.visualViewport;

  updateBoundary();
  scheduleBoundaryTracking();
  observer?.observe(boundary);
  boundary.addEventListener('animationstart', scheduleBoundaryTracking);
  boundary.addEventListener('animationend', scheduleBoundaryTracking);
  boundary.addEventListener('animationcancel', scheduleBoundaryTracking);
  boundary.addEventListener('transitionrun', scheduleBoundaryTracking);
  boundary.addEventListener('transitionend', scheduleBoundaryTracking);
  boundary.addEventListener('transitioncancel', scheduleBoundaryTracking);
  window.addEventListener('resize', updateBoundary);
  viewport?.addEventListener('resize', updateBoundary);
  viewport?.addEventListener('scroll', updateBoundary);

  return () => {
    if (motionFrame !== undefined) {
      window.cancelAnimationFrame(motionFrame);
    }
    observer?.disconnect();
    boundary.removeEventListener('animationstart', scheduleBoundaryTracking);
    boundary.removeEventListener('animationend', scheduleBoundaryTracking);
    boundary.removeEventListener('animationcancel', scheduleBoundaryTracking);
    boundary.removeEventListener('transitionrun', scheduleBoundaryTracking);
    boundary.removeEventListener('transitionend', scheduleBoundaryTracking);
    boundary.removeEventListener('transitioncancel', scheduleBoundaryTracking);
    window.removeEventListener('resize', updateBoundary);
    viewport?.removeEventListener('resize', updateBoundary);
    viewport?.removeEventListener('scroll', updateBoundary);
    clearNestedBoundary(overlayElement);
  };
}

/** Shared Breeze trigger props for overlays. */
export type SharedOverlayTriggerProps = Omit<ButtonProps, 'appearance'> & {
  appearance?: VisualAppearance;
};

/** Shared Breeze close-button props for overlays. */
export interface SharedOverlayCloseProps
  extends Omit<ButtonProps, 'appearance'> {
  appearance?: VisualAppearance;
}

/** Shared Breeze title props for overlays. */
export interface SharedOverlayTitleProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'style'> {
  /** Required accessible overlay title. */
  children: ReactNode;
  /** Semantic heading level. Defaults to `2`. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Ref to the rendered heading. */
  ref?: Ref<HTMLHeadingElement>;
}

/** Shared Breeze description props for overlays. */
export interface SharedOverlayDescriptionProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Required accessible overlay description. */
  children: ReactNode;
  /** Ref to the rendered description. */
  ref?: Ref<HTMLElement>;
}

/** Internal modal-dialog surface configuration. */
export interface SharedModalContentProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  children: ReactNode;
  dismissible?: boolean;
  keyboardDismissDisabled?: boolean;
  modalClassName?: string;
  nested?: boolean;
  modalState?: {
    onOpenChange: (open: boolean) => void;
    open: boolean;
  };
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  ref?: Ref<HTMLElement>;
  role?: 'dialog' | 'alertdialog';
  surfaceClassName?: string;
}

/** React Aria-backed semantic trigger. */
export function SharedOverlayTrigger({
  appearance,
  ...props
}: Readonly<SharedOverlayTriggerProps>): ReactElement {
  return createElement(Button, {
    ...props,
    appearance,
  });
}

/** React Aria-backed semantic close action. */
export function SharedOverlayClose({
  appearance,
  children,
  className,
  disabled = false,
  onAction,
  ref,
  size,
  variant,
  ...props
}: Readonly<SharedOverlayCloseProps>): ReactElement {
  return createElement(
    AriaButton,
    {
      ...props,
      className: action({ appearance, class: className, size, variant }),
      isDisabled: disabled,
      onPress: onAction,
      ref: useForwardedRef(ref),
      slot: 'close',
    } as ComponentProps<typeof AriaButton>,
    children,
  );
}

/** React Aria title slot used as the overlay accessible name. */
export function SharedOverlayTitle({
  className,
  level = 2,
  ref,
  ...props
}: Readonly<SharedOverlayTitleProps>): ReactElement {
  return createElement(AriaHeading, {
    ...props,
    className: title({ class: className }),
    level,
    ref: useForwardedRef(ref),
    slot: 'title',
  });
}

/** React Aria description slot used as the overlay accessible description. */
export function SharedOverlayDescription({
  className,
  ref,
  ...props
}: Readonly<SharedOverlayDescriptionProps>): ReactElement {
  const generatedId = useContext(OverlayDescriptionContext);

  return createElement(AriaText, {
    ...props,
    className: description({ class: className }),
    elementType: 'p',
    id: props.id ?? generatedId,
    ref: useForwardedRef(ref),
    slot: 'description',
  });
}

/** React Aria modal engine shared by Dialog, AlertDialog, and Drawer. */
export function SharedModalContent({
  children,
  className,
  dismissible = true,
  keyboardDismissDisabled = false,
  modalClassName,
  modalState,
  nested = false,
  overlayClassName,
  overlayStyle,
  ref,
  role = 'dialog',
  surfaceClassName,
  ...props
}: Readonly<SharedModalContentProps>): ReactElement {
  const { portalContainer } = useBreezeContext();
  const descriptionId = useId();
  const parentSurface = useContext(ModalSurfaceContext);
  const surfaceRef = useRef<HTMLElement | null>(null);
  const surfaceDepth = (parentSurface?.depth ?? -1) + 1;
  const surfaceContext = useMemo<ModalSurfaceContextValue>(
    () => ({ depth: surfaceDepth, ref: surfaceRef }),
    [surfaceDepth],
  );
  const forwardedSurfaceRef = useForwardedRef(ref);
  const setSurfaceRef = useCallback(
    (currentSurface: HTMLElement | null) => {
      surfaceRef.current = currentSurface;
      if (currentSurface !== null) {
        modalSurfaceDepth.set(currentSurface, surfaceDepth);
      }
      forwardedSurfaceRef(currentSurface);
    },
    [forwardedSurfaceRef, surfaceDepth],
  );
  const nestedOverlayCleanupRef = useRef<(() => void) | undefined>(undefined);
  const overlayRef = useCallback(
    (currentOverlay: HTMLDivElement | null) => {
      nestedOverlayCleanupRef.current?.();
      nestedOverlayCleanupRef.current = undefined;

      if (!nested || currentOverlay === null) return;

      let boundaryCleanup: (() => void) | undefined;
      let boundaryRetryFrame: number | undefined;
      let trackedBoundary: HTMLElement | undefined;
      const suppressedBackdrops = new Set<HTMLElement>();
      const syncSuppressedBackdrops = () => {
        const exitingOverlays = new Set(
          findExitingModalOverlays(currentOverlay, portalContainer),
        );

        suppressedBackdrops.forEach((suppressedOverlay) => {
          if (!exitingOverlays.has(suppressedOverlay)) {
            suppressedOverlay.removeAttribute(
              nestedBackdropSuppressedAttribute,
            );
            suppressedBackdrops.delete(suppressedOverlay);
          }
        });
        exitingOverlays.forEach((exitingOverlay) => {
          exitingOverlay.setAttribute(nestedBackdropSuppressedAttribute, '');
          suppressedBackdrops.add(exitingOverlay);
        });
      };
      const releaseSuppressedBackdrops = () => {
        suppressedBackdrops.forEach((suppressedOverlay) =>
          suppressedOverlay.removeAttribute(nestedBackdropSuppressedAttribute),
        );
        suppressedBackdrops.clear();
      };
      const bindBoundary = () => {
        syncSuppressedBackdrops();
        const boundary = resolveNestedBoundary(
          currentOverlay,
          portalContainer,
          parentSurface,
        );

        if (boundary === trackedBoundary) return;

        boundaryCleanup?.();
        boundaryCleanup = undefined;
        trackedBoundary = boundary;

        if (boundary === undefined) {
          clearNestedBoundary(currentOverlay);
        } else {
          boundaryCleanup = trackNestedBoundary(currentOverlay, boundary);
        }
      };

      const portalRoot = resolvePortalRoot(currentOverlay, portalContainer);
      const boundaryObserver =
        typeof MutationObserver === 'undefined' || portalRoot === undefined
          ? undefined
          : new MutationObserver(bindBoundary);

      bindBoundary();

      // React completes all refs in the current commit before the next paint.
      // Reconcile once so a simultaneously mounted inner layer takes precedence
      // over an inherited outer surface.
      boundaryRetryFrame = window.requestAnimationFrame(() => {
        boundaryRetryFrame = undefined;
        bindBoundary();
      });
      if (boundaryObserver !== undefined && portalRoot !== undefined) {
        boundaryObserver.observe(portalRoot, {
          attributeFilter: ['data-exiting'],
          attributes: true,
          childList: true,
          subtree: true,
        });
      }

      nestedOverlayCleanupRef.current = () => {
        if (boundaryRetryFrame !== undefined) {
          window.cancelAnimationFrame(boundaryRetryFrame);
        }
        boundaryObserver?.disconnect();
        boundaryCleanup?.();
        releaseSuppressedBackdrops();
      };
    },
    [nested, parentSurface, portalContainer],
  );

  return createElement(
    AriaModalOverlay,
    {
      className: overlay({
        class: [
          nested ? 'breeze-modal-overlay-nested' : undefined,
          overlayClassName,
        ],
      }),
      isDismissable: dismissible,
      isKeyboardDismissDisabled: keyboardDismissDisabled,
      isOpen: modalState?.open,
      onOpenChange: modalState?.onOpenChange,
      ref: overlayRef,
      style: overlayStyle,
    } as ComponentProps<typeof AriaModalOverlay>,
    createElement(
      AriaModal,
      {
        className: modal({
          class: [nested ? 'breeze-modal-nested' : undefined, modalClassName],
        }),
      },
      createElement(
        AriaDialog,
        {
          ...props,
          'aria-describedby': descriptionId,
          className: surface({ class: [surfaceClassName, className] }),
          ref: setSurfaceRef,
          role,
        } as ComponentProps<typeof AriaDialog>,
        createElement(
          ModalSurfaceContext.Provider,
          { value: surfaceContext },
          createElement(
            OverlayDescriptionContext,
            { value: descriptionId },
            children,
          ),
        ),
      ),
    ),
  );
}
