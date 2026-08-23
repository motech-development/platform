import type { CollectionKey } from '../types/collection';

/** Encodes collection keys for collision-safe DOM metadata. */
export default function encodeCollectionKey(key: CollectionKey): string {
  return `${typeof key}:${key}`;
}

/** Encodes an iterable while treating a bare string as one collection key. */
export function encodeCollectionKeys(
  keys: Iterable<CollectionKey>,
): ReadonlySet<string> {
  const values = typeof keys === 'string' ? [keys] : keys;

  return new Set(Array.from(values, encodeCollectionKey));
}
