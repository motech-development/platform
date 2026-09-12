import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { UNSAFE_PortalProvider as PortalProvider } from 'react-aria/PortalProvider';
import { useLocale } from 'react-aria-components/I18nProvider';
import { createOverlayStack, OverlayStackContext } from './OverlayStack';

const PortalContext = createContext<HTMLElement | null>(null);
const portalBoundaryError =
  'BreezeProvider portalContainer must belong to the current document and light DOM.';

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
    if (
      container.ownerDocument !== document ||
      container.getRootNode() !== document
    ) {
      throw new Error(portalBoundaryError);
    }
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
    <PortalProvider getContainer={() => host}>
      <OverlayStackContext value={stack}>
        <PortalContext value={host}>{children}</PortalContext>
      </OverlayStackContext>
    </PortalProvider>
  );
}

export function useOverlayPortal() {
  return useContext(PortalContext);
}
