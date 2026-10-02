import type { ReactNode } from 'react';
import { Typography } from '../../primitives/Typography/Typography';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    actions:
      'breeze:flex breeze:min-inline-0 breeze:flex-wrap breeze:items-center breeze:gap-breeze-3 breeze:breeze-md:shrink-0',
    content: 'breeze:min-inline-0',
    header:
      'breeze:flex breeze:min-inline-0 breeze:flex-wrap breeze:items-center breeze:justify-between breeze:gap-[10px] breeze:breeze-md:flex-nowrap breeze:breeze-md:gap-breeze-4',
    title:
      'breeze:m-0 breeze:font-breeze-sans breeze:text-breeze-2xl breeze:font-semibold breeze:tracking-breeze-tighter breeze:text-breeze-ink',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

/** Props for a semantic page title with optional supporting content. */
export interface PageHeaderProps {
  /** Application-owned page-level actions. */
  actions?: ReactNode;
  /** Optional explanatory text beneath the page title. */
  description?: ReactNode;
  /** Main page title, rendered as the document's level-one heading. */
  title: ReactNode;
}

/**
 * Presents a page's main heading, description and optional page actions.
 *
 * @summary A responsive page title and action row.
 */
export function PageHeader({
  actions,
  description,
  title,
}: Readonly<PageHeaderProps>) {
  useBreezeContext();

  return (
    <header className={variants.base.header}>
      <div className={variants.base.content}>
        <h1 className={variants.base.title}>{title}</h1>
        {description ? (
          <Typography tone="muted" variant="body">
            {description}
          </Typography>
        ) : null}
      </div>
      {actions ? <div className={variants.base.actions}>{actions}</div> : null}
    </header>
  );
}
