import type { AnchorHTMLAttributes, ReactNode, Ref } from 'react';
import { useHover } from 'react-aria/useHover';
import { buttonVariants } from '../../buttons/button.styles';
import type { ViewTransitionType } from '../../motion/view-transitions';
import { useBreezeContext } from '../../provider/BreezeContext';
import routeAnchorClick from './link-routing';

const variants = {
  base: {
    button: 'breeze:justify-center breeze:whitespace-nowrap',
    link: 'breeze:inline-flex breeze:items-center breeze:font-breeze-sans breeze:no-underline breeze:outline-offset-2 breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap',
    // The design's text action: a 13px standalone label at the body's line height, without an underline.
    text: 'breeze:rounded-breeze-chip breeze:px-breeze-1 breeze:text-breeze-sm breeze:font-normal breeze:leading-breeze-snug breeze:max-breeze-md:min-block-breeze-tap',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    default: 'breeze:text-breeze-brand-text',
    subtle: 'breeze:text-breeze-ink-2 breeze:hover:text-breeze-ink',
  },
} as const;

type TextLinkVariant = keyof typeof variants.variant;
type ButtonLinkVariant = 'primary' | 'secondary';

export type LinkVariant = ButtonLinkVariant | TextLinkVariant;

/** Button sizes available to a link with a button treatment. */
export type LinkSize = 'md' | 'sm';

interface TextLinkProps {
  /** Text links have one size. */
  size?: never;
  /** Selects the text treatment. Defaults to `default`. */
  variant?: TextLinkVariant;
}

interface ButtonLinkProps {
  /** Selects the button size. Defaults to `md`. */
  size?: LinkSize;
  /** Gives the link a primary or secondary button treatment. */
  variant: ButtonLinkVariant;
}

interface LinkCommonProps {
  /** Identifies additional elements that describe the link. */
  'aria-describedby'?: AnchorHTMLAttributes<HTMLAnchorElement>['aria-describedby'];
  /** Provides an accessible name when it differs from the visible content. */
  'aria-label'?: AnchorHTMLAttributes<HTMLAnchorElement>['aria-label'];
  /** Identifies elements that provide the link's accessible name. */
  'aria-labelledby'?: AnchorHTMLAttributes<HTMLAnchorElement>['aria-labelledby'];
  /** Identifies the current page or location when this link represents it. */
  'aria-current'?: AnchorHTMLAttributes<HTMLAnchorElement>['aria-current'];
  /** Visible link content. */
  children: ReactNode;
  /** Downloads the destination instead of navigating when the browser allows it. */
  download?: string | boolean;
  /** The link destination. */
  href: string;
  /** Language of the linked resource. */
  hrefLang?: AnchorHTMLAttributes<HTMLAnchorElement>['hrefLang'];
  /** Sets the rendered link's HTML `id`. */
  id?: AnchorHTMLAttributes<HTMLAnchorElement>['id'];
  /** Language for the link content. */
  lang?: AnchorHTMLAttributes<HTMLAnchorElement>['lang'];
  /** Relation between the current page and the destination. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
  /** Provides access to the rendered anchor element. */
  ref?: Ref<HTMLAnchorElement>;
  /** Names the browsing context for the destination. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** Supplies advisory information about the destination. */
  title?: AnchorHTMLAttributes<HTMLAnchorElement>['title'];
  /** MIME type of the linked resource. */
  type?: AnchorHTMLAttributes<HTMLAnchorElement>['type'];
  /** Transition types offered to the configured router for this navigation. */
  transitionTypes?: readonly ViewTransitionType[];
}

/** Props for a text link, or a link with a button treatment and size. */
export type LinkProps = LinkCommonProps & (ButtonLinkProps | TextLinkProps);

/** Navigates to a resource while preserving native anchor behavior. */
export function Link({
  'aria-current': ariaCurrent,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  download,
  href,
  hrefLang,
  id,
  lang,
  ref,
  rel,
  size = 'md',
  target,
  title,
  type,
  transitionTypes = [],
  variant = 'default',
}: Readonly<LinkProps>) {
  const { router } = useBreezeContext();
  const {
    hoverProps: { onPointerEnter, onPointerLeave },
    isHovered,
  } = useHover({});
  const className =
    variant === 'primary' || variant === 'secondary'
      ? [
          variants.base.link,
          variants.base.button,
          buttonVariants.base.box,
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          size === 'md' && buttonVariants.compound.md[variant],
        ]
      : [variants.base.link, variants.base.text, variants.variant[variant]];

  return (
    <a
      aria-current={ariaCurrent}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className.filter(Boolean).join(' ')}
      data-hovered={isHovered || undefined}
      download={download}
      href={href}
      hrefLang={hrefLang}
      id={id}
      lang={lang}
      onClick={(event) =>
        routeAnchorClick(event, router, transitionTypes, download)
      }
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      ref={ref}
      rel={rel}
      target={target}
      title={title}
      type={type}
    >
      {children}
    </a>
  );
}
