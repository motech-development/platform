import type { ReactNode } from 'react';
import { Stack } from '../../primitives/Stack/Stack';
import { Typography } from '../../primitives/Typography/Typography';

const variants = {
  base: {
    actions:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-wrap breeze:items-center breeze:gap-breeze-3 breeze:breeze-lg:shrink-0',
    content: 'breeze:min-inline-size-0',
    header:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-col breeze:gap-breeze-4 breeze:pbe-breeze-5 breeze:breeze-lg:flex-row breeze:breeze-lg:items-end breeze:breeze-lg:justify-between',
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
  return (
    <header className={variants.base.header}>
      <div className={variants.base.content}>
        <Stack gap={1}>
          <Typography element="h1" variant="heading">
            {title}
          </Typography>
          {description ? (
            <Typography tone="secondary" variant="body">
              {description}
            </Typography>
          ) : null}
        </Stack>
      </div>
      {actions ? <div className={variants.base.actions}>{actions}</div> : null}
    </header>
  );
}
