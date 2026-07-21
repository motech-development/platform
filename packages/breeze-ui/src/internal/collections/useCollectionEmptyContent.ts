import type { ReactNode } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';

export default function useCollectionEmptyContent(
  emptyContent: ReactNode | undefined,
): ReactNode {
  const { messages } = useBreezeContext();

  return emptyContent === undefined ? messages.noResults : emptyContent;
}
