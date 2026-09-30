import type { ReactNode } from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { I18nProvider, useLocale } from 'react-aria-components/I18nProvider';
import { OverlayProvider } from '../overlays/OverlayProvider';
import { ToastProviderBoundary } from '../primitives/Toast/Toast';
import {
  type Appearance,
  BreezeContext,
  type BreezeRouter,
} from './BreezeContext';
import enGB from './en-GB';

interface BreezeProviderBaseProps {
  /** Breeze components and application content rendered inside the provider. */
  children: ReactNode;
  /** BCP 47 locale for accessible interactions and content formatting. */
  locale: string;
  /** Accessible messages translated into the provider locale; defaults to English. */
  messages?: Partial<typeof enGB>;
  /**
   * Container for the provider-owned overlay host; defaults to document.body.
   * The container must belong to the same document as the overlay triggers.
   */
  portalContainer?: HTMLElement;
  /** Maximum number of visible confirmations; additional messages wait in FIFO order. */
  toastLimit?: number;
  /** Optional same-document router for links that need application navigation. */
  router?: BreezeRouter;
}

interface ControlledAppearanceProps {
  /** The application-owned appearance choice. */
  appearance: Appearance;
  /** Unavailable when `appearance` is controlled by the application. */
  defaultAppearance?: never;
  /** Reports a semantic appearance choice so the application can persist it. */
  onAppearanceChange: (appearance: Appearance) => void;
}

interface UncontrolledAppearanceProps {
  /** Unavailable when the provider manages its own appearance state. */
  appearance?: never;
  /** The initial appearance choice; defaults to automatic. */
  defaultAppearance?: Appearance;
  /** Reports a semantic appearance choice without persisting it. */
  onAppearanceChange?: (appearance: Appearance) => void;
}

/** The required locale and appearance boundary for Breeze components. */
export type BreezeProviderProps = BreezeProviderBaseProps &
  (ControlledAppearanceProps | UncontrolledAppearanceProps);

function resolveAppearance(appearance: Appearance, prefersDark: boolean) {
  if (appearance === 'automatic') {
    return prefersDark ? 'dark' : 'light';
  }

  return appearance;
}

function BreezeRoot({
  children,
}: Readonly<Pick<BreezeProviderProps, 'children'>>) {
  const { direction, locale } = useLocale();

  return (
    <div data-breeze-root="" dir={direction} lang={locale}>
      {children}
    </div>
  );
}

/**
 * Establishes the required locale and styling boundary.
 *
 * @summary Required locale and styling boundary for Breeze components.
 */
export function BreezeProvider({
  appearance: controlledAppearance,
  children,
  defaultAppearance = 'automatic',
  locale,
  messages,
  onAppearanceChange,
  portalContainer,
  router,
  toastLimit = 3,
}: Readonly<BreezeProviderProps>) {
  const [preferredColorSchemeQuery] = useState(() =>
    typeof window === 'undefined' || !window.matchMedia
      ? null
      : window.matchMedia('(prefers-color-scheme: dark)'),
  );
  const [prefersDark, setPrefersDark] = useState(
    () => preferredColorSchemeQuery?.matches ?? false,
  );
  const [uncontrolledAppearance, setUncontrolledAppearance] =
    useState(defaultAppearance);
  const appearance = controlledAppearance ?? uncontrolledAppearance;
  const resolvedAppearance = resolveAppearance(appearance, prefersDark);

  useEffect(() => {
    if (!preferredColorSchemeQuery) {
      return undefined;
    }

    setPrefersDark(preferredColorSchemeQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    preferredColorSchemeQuery.addEventListener('change', handleChange);

    return () =>
      preferredColorSchemeQuery.removeEventListener('change', handleChange);
  }, [preferredColorSchemeQuery]);

  useLayoutEffect(() => {
    const { documentElement } = document;
    const previousTheme = documentElement.dataset.theme;
    const previousColorScheme = documentElement.style.colorScheme;

    documentElement.dataset.theme = resolvedAppearance;
    documentElement.style.colorScheme = resolvedAppearance;

    return () => {
      if (previousTheme === undefined) {
        delete documentElement.dataset.theme;
      } else {
        documentElement.dataset.theme = previousTheme;
      }

      documentElement.style.colorScheme = previousColorScheme;
    };
  }, [resolvedAppearance]);

  const setAppearance = useCallback(
    (nextAppearance: Appearance) => {
      if (controlledAppearance === undefined) {
        setUncontrolledAppearance(nextAppearance);
      }

      onAppearanceChange?.(nextAppearance);
    },
    [controlledAppearance, onAppearanceChange],
  );
  const getMessageLocale = useCallback(
    (message: keyof typeof enGB) =>
      messages?.[message] === undefined ? 'en-GB' : locale,
    [locale, messages],
  );

  const context = useMemo(
    () => ({
      appearance,
      getMessageLocale,
      locale,
      messages: {
        appearance: messages?.appearance ?? enGB.appearance,
        appearanceAutomatic:
          messages?.appearanceAutomatic ?? enGB.appearanceAutomatic,
        appearanceDark: messages?.appearanceDark ?? enGB.appearanceDark,
        appearanceLight: messages?.appearanceLight ?? enGB.appearanceLight,
        attachmentDocument:
          messages?.attachmentDocument ?? enGB.attachmentDocument,
        attachmentMoreActions:
          messages?.attachmentMoreActions ?? enGB.attachmentMoreActions,
        attachmentOpen: messages?.attachmentOpen ?? enGB.attachmentOpen,
        attachmentPhoto: messages?.attachmentPhoto ?? enGB.attachmentPhoto,
        close: messages?.close ?? enGB.close,
        documentViewerAccessibility:
          messages?.documentViewerAccessibility ??
          enGB.documentViewerAccessibility,
        documentViewerDownload:
          messages?.documentViewerDownload ?? enGB.documentViewerDownload,
        documentViewerExitFullScreen:
          messages?.documentViewerExitFullScreen ??
          enGB.documentViewerExitFullScreen,
        documentViewerFallback:
          messages?.documentViewerFallback ?? enGB.documentViewerFallback,
        documentViewerFullScreen:
          messages?.documentViewerFullScreen ?? enGB.documentViewerFullScreen,
        documentViewerImageUnavailable:
          messages?.documentViewerImageUnavailable ??
          enGB.documentViewerImageUnavailable,
        documentViewerLoading:
          messages?.documentViewerLoading ?? enGB.documentViewerLoading,
        documentViewerNextPage:
          messages?.documentViewerNextPage ?? enGB.documentViewerNextPage,
        documentViewerPage:
          messages?.documentViewerPage ?? enGB.documentViewerPage,
        documentViewerPreviousPage:
          messages?.documentViewerPreviousPage ??
          enGB.documentViewerPreviousPage,
        documentViewerRemove:
          messages?.documentViewerRemove ?? enGB.documentViewerRemove,
        documentViewerReplace:
          messages?.documentViewerReplace ?? enGB.documentViewerReplace,
        documentViewerRotate:
          messages?.documentViewerRotate ?? enGB.documentViewerRotate,
        documentViewerRotateLabel:
          messages?.documentViewerRotateLabel ?? enGB.documentViewerRotateLabel,
        documentViewerZoom:
          messages?.documentViewerZoom ?? enGB.documentViewerZoom,
        documentViewerZoomIn:
          messages?.documentViewerZoomIn ?? enGB.documentViewerZoomIn,
        documentViewerZoomOut:
          messages?.documentViewerZoomOut ?? enGB.documentViewerZoomOut,
        fileDropZoneAcceptedTypes:
          messages?.fileDropZoneAcceptedTypes ?? enGB.fileDropZoneAcceptedTypes,
        fileDropZoneAddedMany:
          messages?.fileDropZoneAddedMany ?? enGB.fileDropZoneAddedMany,
        fileDropZoneAddedOne:
          messages?.fileDropZoneAddedOne ?? enGB.fileDropZoneAddedOne,
        fileDropZoneAttachedCount:
          messages?.fileDropZoneAttachedCount ?? enGB.fileDropZoneAttachedCount,
        fileDropZoneChooseFiles:
          messages?.fileDropZoneChooseFiles ?? enGB.fileDropZoneChooseFiles,
        fileDropZoneCountRejectedMany:
          messages?.fileDropZoneCountRejectedMany ??
          enGB.fileDropZoneCountRejectedMany,
        fileDropZoneCountRejectedOne:
          messages?.fileDropZoneCountRejectedOne ??
          enGB.fileDropZoneCountRejectedOne,
        fileDropZoneDropInstructions:
          messages?.fileDropZoneDropInstructions ??
          enGB.fileDropZoneDropInstructions,
        fileDropZoneMaximumFileSize:
          messages?.fileDropZoneMaximumFileSize ??
          enGB.fileDropZoneMaximumFileSize,
        fileDropZoneNoFilesAdded:
          messages?.fileDropZoneNoFilesAdded ?? enGB.fileDropZoneNoFilesAdded,
        fileDropZoneReleaseInstructions:
          messages?.fileDropZoneReleaseInstructions ??
          enGB.fileDropZoneReleaseInstructions,
        fileDropZoneSizeRejected:
          messages?.fileDropZoneSizeRejected ?? enGB.fileDropZoneSizeRejected,
        fileDropZoneTypeRejected:
          messages?.fileDropZoneTypeRejected ?? enGB.fileDropZoneTypeRejected,
        loading: messages?.loading ?? enGB.loading,
        noItemsToDisplay: messages?.noItemsToDisplay ?? enGB.noItemsToDisplay,
        primaryNavigation:
          messages?.primaryNavigation ?? enGB.primaryNavigation,
        required: messages?.required ?? enGB.required,
        selectDate: messages?.selectDate ?? enGB.selectDate,
        skipToMain: messages?.skipToMain ?? enGB.skipToMain,
      },
      resolvedAppearance,
      router,
      setAppearance,
    }),
    [
      appearance,
      getMessageLocale,
      locale,
      messages,
      resolvedAppearance,
      router,
      setAppearance,
    ],
  );

  return (
    <I18nProvider locale={locale}>
      <BreezeContext value={context}>
        <OverlayProvider locale={locale} portalContainer={portalContainer}>
          <ToastProviderBoundary limit={toastLimit}>
            <BreezeRoot>{children}</BreezeRoot>
          </ToastProviderBoundary>
        </OverlayProvider>
      </BreezeContext>
    </I18nProvider>
  );
}
