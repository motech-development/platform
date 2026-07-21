import { describe, expectTypeOf, it } from 'vitest';
import { AlertDialog } from './AlertDialog/AlertDialog';
import { Dialog } from './Dialog/Dialog';
import { Drawer } from './Drawer/Drawer';
import { Popover } from './Popover/Popover';
import { Tooltip } from './Tooltip/Tooltip';

<Dialog.Root open onOpenChange={() => undefined}>
  Dialog
</Dialog.Root>;
<Dialog.Root open readOnly>
  Dialog
</Dialog.Root>;
// @ts-expect-error controlled dialog state requires a callback unless read-only
<Dialog.Root open>Dialog</Dialog.Root>;
// @ts-expect-error controlled and uncontrolled state are exclusive
<Dialog.Root defaultOpen open onOpenChange={() => undefined}>
  Dialog
</Dialog.Root>;

<AlertDialog.Root defaultOpen>Alert</AlertDialog.Root>;
<AlertDialog.Actions aria-label="Decision actions" className="actions">
  Actions
</AlertDialog.Actions>;
// @ts-expect-error alert-dialog actions require decision children
<AlertDialog.Actions />;
<Drawer.Root open readOnly>
  Drawer
</Drawer.Root>;
<Drawer.Root triggerless open onOpenChange={() => undefined}>
  Drawer
</Drawer.Root>;
// @ts-expect-error triggerless drawers require a controlled state callback
<Drawer.Root triggerless open>
  Drawer
</Drawer.Root>;
// @ts-expect-error triggerless drawers cannot own uncontrolled state
<Drawer.Root defaultOpen triggerless open onOpenChange={() => undefined}>
  Drawer
</Drawer.Root>;
<Popover.Root open onOpenChange={() => undefined}>
  Popover
</Popover.Root>;
<Tooltip.Root open readOnly>
  Tooltip
</Tooltip.Root>;
// @ts-expect-error controlled tooltip state requires a callback unless read-only
<Tooltip.Root open>Tooltip</Tooltip.Root>;

<Drawer.Content placement={{ base: 'bottom', md: 'end' }}>
  Content
</Drawer.Content>;
<Drawer.Content size="wide">Content</Drawer.Content>;
// @ts-expect-error drawer size is constrained
<Drawer.Content size="large">Content</Drawer.Content>;
// @ts-expect-error drawer placement is constrained
<Drawer.Content placement="left">Content</Drawer.Content>;
// @ts-expect-error text appearance is exclusive to Button
<Drawer.Trigger appearance="text">Open</Drawer.Trigger>;
// @ts-expect-error text appearance is exclusive to Button
<Drawer.Close appearance="text">Close</Drawer.Close>;
// @ts-expect-error generic overlay implementation props are not public
<Dialog.Content isDismissable>Content</Dialog.Content>;

describe('overlay public types', () => {
  it('seals React Aria implementation props', () => {
    expectTypeOf<Parameters<typeof Dialog.Root>[0]>().not.toHaveProperty(
      'isOpen',
    );
    expectTypeOf<Parameters<typeof Popover.Content>[0]>().not.toHaveProperty(
      'isNonModal',
    );
    expectTypeOf<Parameters<typeof Tooltip.Content>[0]>().not.toHaveProperty(
      'UNSTABLE_portalContainer',
    );
  });
});
