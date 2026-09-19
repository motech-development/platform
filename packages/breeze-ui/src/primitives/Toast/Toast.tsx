import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
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

function isToastVisible(entry: IntersectionObserverEntry) {
  return entry.isIntersecting && entry.intersectionRatio >= 1;
}

function handleToastIntersection(
  entry: IntersectionObserverEntry,
  visibleIds: Set<number>,
  scheduleToast: (id: number) => void,
  clearToastTimer: (id: number) => void,
) {
  const id = Number((entry.target as HTMLElement).dataset.breezeToastId);
  if (!visibleIds.has(id)) return;

  if (isToastVisible(entry)) {
    scheduleToast(id);
  } else {
    clearToastTimer(id);
  }
}

export type ToastEnqueue = (message: string) => void;

const ToastContext = createContext<ToastEnqueue | null>(null);

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
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const update = setTimeout(() => setMessage(children), 0);
    return () => clearTimeout(update);
  }, [children]);

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
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

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
    setQueue((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const clearToastTimers = useCallback(() => {
    Array.from(timers.current.values()).forEach((timer) => clearTimeout(timer));
    timers.current.clear();
  }, []);
  const clearToastTimer = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);
  const scheduleToast = useCallback(
    (id: number) => {
      if (
        isDocumentVisible &&
        (typeof document === 'undefined' || !document.hidden) &&
        !timers.current.has(id)
      ) {
        timers.current.set(
          id,
          setTimeout(() => expireToast(id), toastLifetime),
        );
      }
    },
    [expireToast, isDocumentVisible],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      if (!visible) clearToastTimers();
      setIsDocumentVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [clearToastTimers]);

  useEffect(() => {
    const visible = queue.slice(0, limit);
    const visibleIds = new Set(visible.map(({ id }) => id));

    Array.from(timers.current.entries()).forEach(([id, timer]) => {
      if (!visibleIds.has(id)) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
    });

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
              clearToastTimer,
            ),
          );
        },
        { threshold: 1 },
      );

      Array.from(region.children).forEach((element) => {
        if (
          element instanceof HTMLElement &&
          element.dataset.breezeToastId !== undefined
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
  }, [clearToastTimer, host, isDocumentVisible, limit, queue, scheduleToast]);

  useEffect(() => clearToastTimers, [clearToastTimers]);

  const visible = queue.slice(0, limit);

  return (
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
            {visible.map(({ id, message }) => (
              <div key={id} data-breeze-toast-id={id}>
                <Toast>{message}</Toast>
              </div>
            ))}
          </div>,
          host,
        )}
    </ToastContext>
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
