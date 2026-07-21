import type { Ref, RefCallback } from 'react';
import { useCallback } from 'react';

export default function useForwardedRef<Element>(
  ref: Ref<Element> | undefined,
): RefCallback<Element> {
  return useCallback(
    (element: Element | null) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref !== null && ref !== undefined) {
        Object.assign(ref, {
          current: element,
        });
      }
    },
    [ref],
  );
}
