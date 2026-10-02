import { useId } from 'react';
import { Button } from '../../primitives/Button/Button';
import type { IconName } from '../../primitives/Icon/Icon';
import { IconTile } from '../../primitives/IconTile/IconTile';
import { Stack } from '../../primitives/Stack/Stack';
import { Typography } from '../../primitives/Typography/Typography';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    action: 'breeze:mbs-breeze-3',
    content: 'breeze:min-inline-0',
    panel:
      'breeze:flex breeze:items-start breeze:gap-breeze-4 breeze:px-breeze-5 breeze:py-breeze-6',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    icon: {
      empty: 'document',
      error: 'warning',
    },
    tone: {
      empty: 'brand',
      error: 'danger',
    },
  },
} as const satisfies {
  base: Record<string, string>;
  compound: Record<string, never>;
  size: Record<string, never>;
  state: Record<string, never>;
  variant: {
    icon: Record<StatePanelVariant, IconName>;
    tone: Record<StatePanelVariant, 'brand' | 'danger'>;
  };
};

export type StatePanelVariant = 'empty' | 'error';

/** One application-owned action that has a real callback. */
export interface StatePanelAction {
  /** Label shown on the recovery control. */
  label: string;
  /** Performs the action described by `label`. */
  onAction: () => void;
}

/** Props for an empty or error content state. */
export interface StatePanelProps {
  /** Optional recovery action; no control is rendered when omitted. */
  action?: StatePanelAction;
  /** Application-owned explanation of the current state. */
  description: string;
  /** Overrides the icon selected for the state. */
  icon?: IconName;
  /** Application-owned heading for the current state. */
  title: string;
  /** Selects the empty or error visual treatment. */
  variant: StatePanelVariant;
}

/** Presents an empty or error state with an optional working recovery action. */
export function StatePanel({
  action,
  description,
  icon,
  title,
  variant,
}: Readonly<StatePanelProps>) {
  useBreezeContext();

  const panelId = useId();
  const titleId = `${panelId}-title`;
  const descriptionId = `${panelId}-description`;

  if (
    action &&
    (typeof action.label !== 'string' ||
      action.label.trim() === '' ||
      typeof action.onAction !== 'function')
  ) {
    throw new Error(
      'StatePanel actions require a non-empty label and an onAction callback.',
    );
  }

  return (
    <section
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={variants.base.panel}
    >
      <IconTile
        name={icon ?? variants.variant.icon[variant]}
        size="lg"
        tone={variants.variant.tone[variant]}
      />
      <div className={variants.base.content}>
        <Stack gap={1}>
          <Typography element="h2" id={titleId} variant="title">
            {title}
          </Typography>
          <Typography
            element="p"
            id={descriptionId}
            tone="muted"
            variant="body"
          >
            {description}
          </Typography>
        </Stack>
        {action ? (
          <div className={variants.base.action}>
            <Button onAction={action.onAction}>{action.label}</Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
