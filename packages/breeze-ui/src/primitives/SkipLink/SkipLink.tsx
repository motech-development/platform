import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    link: 'breeze:sr-only breeze:focus-visible:not-sr-only breeze:focus-visible:fixed breeze:focus-visible:z-50 breeze:focus-visible:inset-bs-breeze-2 breeze:focus-visible:inset-s-breeze-2 breeze:focus-visible:rounded-breeze-ctl breeze:focus-visible:bg-breeze-brand breeze:focus-visible:px-breeze-4 breeze:focus-visible:py-breeze-2 breeze:focus-visible:font-breeze-sans breeze:focus-visible:text-breeze-sm breeze:focus-visible:font-semibold breeze:focus-visible:text-breeze-on-brand breeze:focus-visible:shadow-breeze-overlay breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

/** Props for a localized link to an in-page content target. */
export interface SkipLinkProps {
  /** Id of the focusable content landmark to receive focus. */
  targetId: string;
}

/**
 * Lets keyboard users bypass repeated application chrome.
 *
 * @summary A localized link that moves focus to the main content.
 */
export function SkipLink({ targetId }: Readonly<SkipLinkProps>) {
  const { getMessageLocale, messages } = useBreezeContext();

  return (
    <a
      className={variants.base.link}
      href={`#${targetId}`}
      lang={getMessageLocale('skipToMain')}
      onClick={(event) => {
        const target = document.getElementById(targetId);

        if (target) {
          event.preventDefault();
          target.focus();
        }
      }}
    >
      {messages.skipToMain}
    </a>
  );
}
