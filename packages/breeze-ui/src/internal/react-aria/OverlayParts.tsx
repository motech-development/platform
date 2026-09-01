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

const ModalSurfaceContext = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

export const OverlayDescriptionContext = createContext<string | undefined>(
  undefined,
);

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
  useBreezeContext();
  const descriptionId = useId();
  const parentSurfaceRef = useContext(ModalSurfaceContext);
  const surfaceRef = useRef<HTMLElement | null>(null);
  const forwardedSurfaceRef = useForwardedRef(ref);
  const setSurfaceRef = useCallback(
    (currentSurface: HTMLElement | null) => {
      surfaceRef.current = currentSurface;
      forwardedSurfaceRef(currentSurface);
    },
    [forwardedSurfaceRef],
  );
  const nestedOverlayCleanupRef = useRef<(() => void) | undefined>(undefined);
  const overlayRef = useCallback(
    (currentOverlay: HTMLDivElement | null) => {
      nestedOverlayCleanupRef.current?.();
      nestedOverlayCleanupRef.current = undefined;

      if (!nested || currentOverlay === null) return;

      const boundary = parentSurfaceRef?.current;

      if (boundary === undefined || boundary === null) return;

      const boundaryProperties = [
        '--breeze-nested-overlay-left',
        '--breeze-nested-overlay-top',
        '--breeze-nested-overlay-width',
        '--breeze-nested-overlay-height',
      ];
      const clearBoundary = () => {
        currentOverlay.removeAttribute('data-nested-boundary');
        boundaryProperties.forEach((property) =>
          currentOverlay.style.removeProperty(property),
        );
      };

      const updateBoundary = () => {
        const bounds = boundary.getBoundingClientRect();

        if (bounds.width <= 0 || bounds.height <= 0) {
          clearBoundary();
          return;
        }

        currentOverlay.setAttribute('data-nested-boundary', '');
        currentOverlay.style.setProperty(
          '--breeze-nested-overlay-left',
          `${bounds.left}px`,
        );
        currentOverlay.style.setProperty(
          '--breeze-nested-overlay-top',
          `${bounds.top}px`,
        );
        currentOverlay.style.setProperty(
          '--breeze-nested-overlay-width',
          `${bounds.width}px`,
        );
        currentOverlay.style.setProperty(
          '--breeze-nested-overlay-height',
          `${bounds.height}px`,
        );
      };
      let animationFrame: number | undefined;
      const hasActiveBoundaryMotion = () =>
        boundary
          .getAnimations?.()
          .some(
            (animation) =>
              animation.pending || animation.playState === 'running',
          ) ?? false;
      const trackBoundaryMotion = () => {
        animationFrame = undefined;
        updateBoundary();

        if (hasActiveBoundaryMotion()) {
          animationFrame = window.requestAnimationFrame(trackBoundaryMotion);
        }
      };
      const scheduleBoundaryTracking = () => {
        if (animationFrame === undefined) {
          animationFrame = window.requestAnimationFrame(trackBoundaryMotion);
        }
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
      nestedOverlayCleanupRef.current = () => {
        if (animationFrame !== undefined) {
          window.cancelAnimationFrame(animationFrame);
        }
        observer?.disconnect();
        boundary.removeEventListener(
          'animationstart',
          scheduleBoundaryTracking,
        );
        boundary.removeEventListener('animationend', scheduleBoundaryTracking);
        boundary.removeEventListener(
          'animationcancel',
          scheduleBoundaryTracking,
        );
        boundary.removeEventListener('transitionrun', scheduleBoundaryTracking);
        boundary.removeEventListener('transitionend', scheduleBoundaryTracking);
        boundary.removeEventListener(
          'transitioncancel',
          scheduleBoundaryTracking,
        );
        window.removeEventListener('resize', updateBoundary);
        viewport?.removeEventListener('resize', updateBoundary);
        viewport?.removeEventListener('scroll', updateBoundary);
        clearBoundary();
      };
    },
    [nested, parentSurfaceRef],
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
          { value: surfaceRef },
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
