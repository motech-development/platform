import { describe, expectTypeOf, it } from 'vitest';
import { Accordion } from './Accordion/Accordion';
import { Disclosure } from './Disclosure/Disclosure';
import { Menu } from './Menu/Menu';
import { Tabs } from './Tabs/Tabs';

<Tabs.Root value="details" onChange={() => undefined}>
  Tabs
</Tabs.Root>;
<Tabs.Root value={1} readOnly>
  Tabs
</Tabs.Root>;
// @ts-expect-error controlled tabs require a callback unless read-only
<Tabs.Root value="details">Tabs</Tabs.Root>;
// @ts-expect-error controlled and uncontrolled tab state are exclusive
<Tabs.Root defaultValue="details" value="details" onChange={() => undefined}>
  Tabs
</Tabs.Root>;

<Disclosure.Root open onOpenChange={() => undefined}>
  Disclosure
</Disclosure.Root>;
<Disclosure.Root open readOnly>
  Disclosure
</Disclosure.Root>;
// @ts-expect-error controlled disclosure state requires a callback unless read-only
<Disclosure.Root open>Disclosure</Disclosure.Root>;

<Accordion.Root value={[1, 'two']} onChange={() => undefined}>
  Accordion
</Accordion.Root>;
<Accordion.Root value={['one']} readOnly>
  Accordion
</Accordion.Root>;
// @ts-expect-error controlled accordion state requires a callback unless read-only
<Accordion.Root value={['one']}>Accordion</Accordion.Root>;

<Menu.Root open onOpenChange={() => undefined}>
  Menu
</Menu.Root>;
<Menu.Root open readOnly>
  Menu
</Menu.Root>;
// @ts-expect-error controlled menu state requires a callback unless read-only
<Menu.Root open>Menu</Menu.Root>;

const menuItems = [{ id: 1, label: 'One', metadata: true }];

<Menu.List items={menuItems}>
  {(item) => (
    <Menu.Item id={item.id} textValue={item.label}>
      {String(item.metadata)}
    </Menu.Item>
  )}
</Menu.List>;
// @ts-expect-error controlled selection requires a callback unless read-only
<Menu.List selection={[1]}>Item</Menu.List>;

describe('navigation public types', () => {
  it('seals React Aria implementation props', () => {
    expectTypeOf<Parameters<typeof Tabs.Root>[0]>().not.toHaveProperty(
      'selectedKey',
    );
    expectTypeOf<Parameters<typeof Menu.Root>[0]>().not.toHaveProperty(
      'isOpen',
    );
  });
});
