import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { useLocale } from 'react-aria-components/I18nProvider';
import { createOverlayStack, OverlayStackContext } from './OverlayStack';

const PortalContext = createContext<HTMLElement | null>(null);

/** A dedicated host keeps locale and scoped styles on every portalled surface. */
export function OverlayProvider({
  children,
  portalContainer,
  locale,
}: Readonly<{
  children: ReactNode;
  portalContainer?: HTMLElement;
  locale: string;
}>) {
  const { direction } = useLocale();
  const [stack] = useState(createOverlayStack);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const container = portalContainer ?? document.body;
    const element = container.ownerDocument.createElement('div');
    element.dataset.breezeRoot = '';
    element.dataset.breezePortal = '';
    container.append(element);
    setHost(element);
    return () => element.remove();
  }, [portalContainer]);

  useLayoutEffect(() => {
    if (host) {
      host.lang = locale;
      host.dir = direction;
    }
  }, [direction, host, locale]);

  return (
    <OverlayStackContext value={stack}>
      <PortalContext value={host}>{children}</PortalContext>
    </OverlayStackContext>
  );
}

export function useOverlayPortal() {
  return useContext(PortalContext);
}
