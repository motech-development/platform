import type { CollectionKey } from '../types/collection';

/** Encodes collection keys for collision-safe DOM metadata. */
export default function encodeCollectionKey(key: CollectionKey): string {
  return `${typeof key}:${key}`;
}
