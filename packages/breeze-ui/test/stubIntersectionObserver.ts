import { vi } from 'vitest';

/** Installs a deterministic IntersectionObserver test double and returns its notifier. */
export default function stubIntersectionObserver(): (
  entries: IntersectionObserverEntry[],
) => void {
  let notifyIntersection: IntersectionObserverCallback = () => undefined;

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      readonly #observedElements = new Set<Element>();

      readonly #records: IntersectionObserverEntry[] = [];

      constructor(callback: IntersectionObserverCallback) {
        notifyIntersection = callback;
      }

      disconnect() {
        this.#observedElements.clear();
      }

      observe(target: Element) {
        this.#observedElements.add(target);
      }

      takeRecords() {
        return this.#records.splice(0);
      }

      unobserve(target: Element) {
        this.#observedElements.delete(target);
      }

      readonly root = null;

      readonly rootMargin = '';

      readonly thresholds = [];
    },
  );

  return (entries) => {
    notifyIntersection(entries, {} as IntersectionObserver);
  };
}
