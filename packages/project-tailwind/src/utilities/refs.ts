import { LegacyRef, MutableRefObject, useMemo, useRef } from 'react';

/**
 * Check if ref is a mutable ref object
 *
 * @param ref - Reference object or function
 *
 * @returns If ref is a mutable ref object
 */
function isMutableRefObject<T>(
  ref: MutableRefObject<T> | LegacyRef<T>,
): ref is MutableRefObject<T | null> {
  return ref != null;
}

/** useMergeRefs arguments */
type TUseMergeRefsInput<T> = Array<MutableRefObject<T> | LegacyRef<T>>;

/**
 * Combines multiple refs into a single memoized callback instance
 *
 * @param refs - Reference object or function
 *
 * @returns Combined ref object
 */
export default function useMergeRefs<T>(...refs: TUseMergeRefsInput<T>) {
  const targetRef = useRef<T>(null);

  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else if (isMutableRefObject(ref)) {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current;
      }
    });

    return targetRef;
  }, [refs]);
}
