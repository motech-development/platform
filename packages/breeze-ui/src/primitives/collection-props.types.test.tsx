import type { ReactElement } from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import { ComboBox, type ComboBoxRootProps } from './ComboBox/ComboBox';
import { GridList, type GridListRootProps } from './GridList/GridList';
import { ListBox, type ListBoxRootProps } from './ListBox/ListBox';
import { Select, type SelectRootProps } from './Select/Select';
import { Table, type TableRootProps } from './Table/Table';
import { Tag } from './Tag/Tag';
import { TagGroup, type TagGroupRootProps } from './TagGroup/TagGroup';

describe('collection public contracts', () => {
  it('infers generic item renderers with stable string or number ids', () => {
    const items = [
      { id: 1, label: 'One' },
      { id: 2, label: 'Two' },
    ];
    const element = (
      <ListBox.Root aria-label="Numbers" items={items}>
        {(item) => (
          <ListBox.Item id={item.id} textValue={item.label}>
            {item.label}
          </ListBox.Item>
        )}
      </ListBox.Root>
    );
    expectTypeOf(element).toMatchTypeOf<ReactElement>();
    expectTypeOf(
      <Select.ListBox items={items}>
        {(item) => (
          <Select.Item id={item.id} textValue={item.label}>
            {item.label}
          </Select.Item>
        )}
      </Select.ListBox>,
    ).toMatchTypeOf<ReactElement>();
    expectTypeOf(
      <ComboBox.ListBox items={items}>
        {(item) => (
          <ComboBox.Item id={item.id} textValue={item.label}>
            {item.label}
          </ComboBox.Item>
        )}
      </ComboBox.ListBox>,
    ).toMatchTypeOf<ReactElement>();
    expectTypeOf(
      <TagGroup.List items={items}>
        {(item) => (
          <Tag id={item.id} textValue={item.label}>
            {item.label}
          </Tag>
        )}
      </TagGroup.List>,
    ).toMatchTypeOf<ReactElement>();
    expectTypeOf(
      <GridList.Root aria-label="Numbers" items={items}>
        {(item) => (
          <GridList.Item id={item.id} textValue={item.label}>
            {item.label}
          </GridList.Item>
        )}
      </GridList.Root>,
    ).toMatchTypeOf<ReactElement>();
    expectTypeOf(
      <Table.Root aria-label="Numbers">
        <Table.Header>
          <Table.Column id="label" rowHeader>
            Label
          </Table.Column>
        </Table.Header>
        <Table.Body items={items}>
          {(item) => (
            <Table.Row id={item.id} textValue={item.label}>
              <Table.Cell column="label">{item.label}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>,
    ).toMatchTypeOf<ReactElement>();
    expectTypeOf<{
      children: null;
      items: { label: string }[];
    }>().not.toMatchTypeOf<ListBoxRootProps>();
  });

  it('enforces controlled and read-only selection ownership', () => {
    expectTypeOf<{
      children: null;
      onChange: (value: string | number | null) => void;
      value: string;
    }>().toMatchTypeOf<SelectRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      value: null;
    }>().toMatchTypeOf<SelectRootProps>();
    expectTypeOf<{
      children: null;
      value: string;
    }>().not.toMatchTypeOf<SelectRootProps>();
    expectTypeOf<{
      children: null;
      inputValue: string;
      onInputChange: (value: string) => void;
      onSelectionChange: (value: string | number | null) => void;
      selection: null;
    }>().toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      children: null;
      inputValue: string;
      readOnly: true;
      selection: null;
    }>().toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      children: null;
      selection: [];
    }>().not.toMatchTypeOf<TagGroupRootProps>();
    expectTypeOf<{
      children: null;
      selection: string[];
    }>().not.toMatchTypeOf<TagGroupRootProps>();
    expectTypeOf<{
      children: null;
      inputValue: string;
      selection: null;
    }>().not.toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      allowsCustomValue: true;
      children: null;
      inputValue: string;
      onInputChange: (value: string) => void;
      onCommit: (value: string) => void;
      defaultSelection: number;
    }>().toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      allowsCustomValue: true;
      children: null;
      inputValue: string;
      readOnly: true;
    }>().toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      children: null;
      onCommit: (value: string) => void;
    }>().not.toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      allowsCustomValue: false;
      children: null;
      onCommit: (value: string) => void;
    }>().not.toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      allowsCustomValue: true;
      children: null;
      inputValue: string;
    }>().not.toMatchTypeOf<ComboBoxRootProps>();
    expectTypeOf<{
      allowsCustomValue: true;
      children: null;
      selection: number;
    }>().not.toMatchTypeOf<ComboBoxRootProps>();
  });

  it('seals React Aria implementation props', () => {
    expectTypeOf<ListBoxRootProps>().not.toHaveProperty('selectedKeys');
    expectTypeOf<SelectRootProps>().not.toHaveProperty('selectedKey');
    expectTypeOf<ComboBoxRootProps>().not.toHaveProperty('selectedKey');
    expectTypeOf<ComboBoxRootProps>().not.toHaveProperty('defaultFilter');
    expectTypeOf<TagGroupRootProps>().not.toHaveProperty('selectedKeys');
    expectTypeOf<ListBoxRootProps>().not.toHaveProperty('style');
    expectTypeOf<GridListRootProps>().not.toHaveProperty('selectedKeys');
    expectTypeOf<TableRootProps>().not.toHaveProperty('sortDescriptor');
    expectTypeOf<TableRootProps>().not.toHaveProperty('layoutOptions');
    expectTypeOf<'grid'>().toMatchTypeOf<
      NonNullable<TableRootProps['layout']>
    >();
    expectTypeOf<'native'>().not.toMatchTypeOf<
      NonNullable<TableRootProps['layout']>
    >();
  });
});

<ListBox.Root
  aria-label="Variable"
  virtualization={{
    estimatedRowHeight: 44,
    mode: 'variable',
    viewportHeight: 220,
  }}
>
  <ListBox.Item id="one" textValue="One">
    One
  </ListBox.Item>
</ListBox.Root>;

<GridList.Root
  aria-label="Fixed"
  virtualization={{ mode: 'fixed', rowHeight: 48, viewportHeight: 240 }}
>
  <GridList.Item id="one" textValue="One">
    One
  </GridList.Item>
</GridList.Root>;

// @ts-expect-error fixed virtualization requires an authoritative row height
const invalidFixedVirtualization: ListBoxRootProps['virtualization'] = {
  mode: 'fixed',
  viewportHeight: 220,
};

<ListBox.Root
  aria-label="Invalid fixed"
  virtualization={invalidFixedVirtualization}
>
  <ListBox.Item id="one" textValue="One">
    One
  </ListBox.Item>
</ListBox.Root>;

const invalidVariableVirtualization: GridListRootProps['virtualization'] = {
  mode: 'variable',
  // @ts-expect-error variable virtualization accepts an estimate, not an authoritative row height
  rowHeight: 48,
  viewportHeight: 240,
};

<GridList.Root
  aria-label="Invalid variable"
  virtualization={invalidVariableVirtualization}
>
  <GridList.Item id="one" textValue="One">
    One
  </GridList.Item>
</GridList.Root>;
