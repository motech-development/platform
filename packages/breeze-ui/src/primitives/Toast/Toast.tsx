import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useOverlayPortal } from '../../overlays/OverlayProvider';
import { useOverlayToastZIndex } from '../../overlays/OverlayStack';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Icon } from '../Icon/Icon';

const toastLifetime = 2600;
const toastLimitError = 'BreezeProvider toastLimit must be a positive integer.';
const toastProviderError =
  'Toast components must be rendered within BreezeProvider.';

interface ToastItem {
  id: number;
  message: string;
}

interface ToastTimer {
  handle: ReturnType<typeof setTimeout> | null;
  remaining: number;
  startedAt: number | null;
}

function isToastVisible(entry: IntersectionObserverEntry) {
  return entry.isIntersecting && entry.intersectionRatio >= 1;
}

function handleToastIntersection(
  entry: IntersectionObserverEntry,
  visibleIds: Set<number>,
  scheduleToast: (id: number) => void,
  pauseToastTimer: (id: number) => void,
) {
  const id = Number((entry.target as HTMLElement).dataset.breezeToastId);
  if (!visibleIds.has(id)) return;

  if (isToastVisible(entry)) {
    scheduleToast(id);
  } else {
    pauseToastTimer(id);
  }
}

export type ToastEnqueue = (message: string) => void;

const ToastContext = createContext<ToastEnqueue | null>(null);
const ToastAnnouncementContext = createContext(true);

export interface ToastProps {
  /** Translated confirmation message. */
  children: string;
}

/**
 * Displays a positive, non-interactive confirmation.
 *
 * @summary A transient confirmation status.
 */
export function Toast({ children }: Readonly<ToastProps>) {
  useBreezeContext();
  const isDocumentVisible = useContext(ToastAnnouncementContext);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (
      !isDocumentVisible ||
      (typeof document !== 'undefined' && document.hidden) ||
      message === children
    ) {
      return undefined;
    }

    const update = setTimeout(() => setMessage(children), 0);
    return () => clearTimeout(update);
  }, [children, isDocumentVisible, message]);

  return (
    <div
      aria-atomic="true"
      aria-label={message ?? undefined}
      aria-live="polite"
      className="breeze-toast"
      role="status"
    >
      <Icon name="check" size="sm" />
      <span>{message}</span>
    </div>
  );
}

interface ToastProviderBoundaryProps {
  children: ReactNode;
  limit: number;
}

/** Establishes the queue owned by one BreezeProvider instance. */
export function ToastProviderBoundary({
  children,
  limit,
}: Readonly<ToastProviderBoundaryProps>) {
  const host = useOverlayPortal();
  const zIndex = useOverlayToastZIndex();
  const regionRef = useRef<HTMLDivElement>(null);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ToastTimer>());
  const renderedToastIds = useRef(new Set<number>());

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError(toastLimitError);
  }

  const enqueue = useCallback<ToastEnqueue>((message) => {
    const id = nextId.current;
    nextId.current += 1;

    setQueue((current) => [...current, { id, message }]);
  }, []);
  const expireToast = useCallback((id: number) => {
    timers.current.delete(id);
    renderedToastIds.current.delete(id);
    setQueue((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const clearToastTimers = useCallback(() => {
    Array.from(timers.current.values()).forEach(({ handle }) => {
      if (handle !== null) clearTimeout(handle);
    });
    timers.current.clear();
  }, []);
  const pauseToastTimer = useCallback(
    (id: number, now = Date.now()) => {
      const timer = timers.current.get(id);
      if (
        timer?.handle === null ||
        timer?.startedAt === null ||
        timer === undefined
      ) {
        return;
      }

      timer.remaining = Math.max(
        0,
        timer.remaining - Math.max(0, now - timer.startedAt),
      );
      clearTimeout(timer.handle);
      timer.handle = null;
      timer.startedAt = null;

      if (timer.remaining === 0) {
        expireToast(id);
      }
    },
    [expireToast],
  );
  const pauseToastTimers = useCallback(() => {
    const now = Date.now();
    Array.from(timers.current.keys()).forEach((id) => {
      pauseToastTimer(id, now);
    });
  }, [pauseToastTimer]);
  const removeToastTimer = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer?.handle !== null && timer?.handle !== undefined) {
      clearTimeout(timer.handle);
    }
    timers.current.delete(id);
  }, []);
  const scheduleToast = useCallback(
    (id: number) => {
      const current = timers.current.get(id);
      if (
        !isDocumentVisible ||
        (typeof document !== 'undefined' && document.hidden) ||
        (current !== undefined && current.handle !== null)
      ) {
        return;
      }

      const timer = current ?? {
        handle: null,
        remaining: toastLifetime,
        startedAt: null,
      };
      if (timer.remaining <= 0) {
        expireToast(id);
        return;
      }

      timer.startedAt = Date.now();
      timer.handle = setTimeout(() => expireToast(id), timer.remaining);
      timers.current.set(id, timer);
    },
    [expireToast, isDocumentVisible],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      if (!visible) pauseToastTimers();
      setIsDocumentVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pauseToastTimers]);

  useLayoutEffect(() => {
    const visible = queue.slice(0, limit);
    const visibleIds = new Set(visible.map(({ id }) => id));
    const queuedIds = new Set(queue.map(({ id }) => id));

    visible.forEach(({ id }) => renderedToastIds.current.add(id));

    Array.from(timers.current.keys()).forEach((id) => {
      if (!visibleIds.has(id)) {
        if (queuedIds.has(id)) {
          pauseToastTimer(id);
        } else {
          removeToastTimer(id);
        }
      }
    });
  }, [limit, pauseToastTimer, queue, removeToastTimer]);

  useEffect(() => {
    const visible = queue.slice(0, limit);
    const visibleIds = new Set(visible.map(({ id }) => id));
    const region = regionRef.current;
    if (host === null || region === null || !isDocumentVisible) {
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      visible.forEach((toast) => scheduleToast(toast.id));
      return undefined;
    }

    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) =>
            handleToastIntersection(
              entry,
              visibleIds,
              scheduleToast,
              pauseToastTimer,
            ),
          );
        },
        { threshold: 1 },
      );

      Array.from(region.children).forEach((element) => {
        if (
          element instanceof HTMLElement &&
          element.dataset.breezeToastId !== undefined &&
          !element.hidden
        ) {
          observer?.observe(element);
        }
      });
    };
    const observeTask = setTimeout(observe, 0);

    return () => {
      clearTimeout(observeTask);
      observer?.disconnect();
    };
  }, [
    host,
    isDocumentVisible,
    limit,
    pauseToastTimer,
    queue,
    removeToastTimer,
    scheduleToast,
  ]);

  useEffect(() => clearToastTimers, [clearToastTimers]);

  const visible = queue.slice(0, limit);
  const visibleIds = new Set(visible.map(({ id }) => id));
  const rendered = queue.filter(
    ({ id }) => visibleIds.has(id) || renderedToastIds.current.has(id),
  );

  return (
    <ToastAnnouncementContext value={isDocumentVisible}>
      <ToastContext value={enqueue}>
        {children}
        {host &&
          createPortal(
            <div
              ref={regionRef}
              className="breeze-toast-region"
              data-breeze-toast-region=""
              data-live-announcer=""
              data-react-aria-top-layer=""
              style={{ zIndex }}
            >
              {rendered.map(({ id, message }) => {
                const demoted = !visibleIds.has(id);

                return (
                  <div
                    key={id}
                    aria-hidden={demoted ? 'true' : undefined}
                    data-breeze-toast-id={id}
                    hidden={demoted}
                  >
                    <ToastAnnouncementContext
                      value={isDocumentVisible && !demoted}
                    >
                      <Toast>{message}</Toast>
                    </ToastAnnouncementContext>
                  </div>
                );
              })}
            </div>,
            host,
          )}
      </ToastContext>
    </ToastAnnouncementContext>
  );
}

/** Enqueues a confirmation in the nearest BreezeProvider. */
export function useToast(): ToastEnqueue {
  const enqueue = useContext(ToastContext);

  if (enqueue === null) {
    throw new Error(toastProviderError);
  }

  return enqueue;
}
