import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{EmbeddedControlsAndSelection as c,VariableVirtualizationAndLoading as l,n as u,t as d}from"./GridList.stories-CRoRg9Zd.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Selectable interactive rows with stable keys, embedded controls, sections, actions, responsive grid layout, and optional virtualization.`}),`
`,(0,m.jsx)(t.h1,{id:`gridlist`,children:`GridList`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`GridList`}),` presents selectable or actionable rows whose content may include independently focusable controls.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { GridList } from '@motech-development/breeze-ui';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`GridList`}),` for rich rows or tiles that need collection focus, typeahead, selection, row actions, or embedded controls. Use `,(0,m.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),` for non-interactive content, `,(0,m.jsx)(t.a,{href:`?path=/docs/collections-listbox--docs`,children:`ListBox`}),` for choosing simple options, `,(0,m.jsx)(t.a,{href:`?path=/docs/collections-table--docs`,children:`Table`}),` for aligned columns, and `,(0,m.jsx)(t.a,{href:`?path=/docs/data-display-card--docs`,children:`Card`}),` for independent articles.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { GridList } from '@motech-development/breeze-ui';

const records = [
  { id: 'alpha', name: 'Alpha' },
  { id: 'beta', name: 'Beta' },
];

export function RecordList() {
  return (
    <GridList.Root aria-label="Records" items={records}>
      {(record) => (
        <GridList.Item id={record.id} textValue={record.name}>
          {record.name}
        </GridList.Item>
      )}
    </GridList.Root>
  );
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`GridList.Root`}),` owns grid semantics, focus, typeahead, selection, layout, empty content, and virtualization.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`GridList.Item`}),` is one keyed row or tile and may expose a row-level action.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`GridList.Section`}),` groups statically authored items under a stable key.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`GridList.Header`}),` is the visible heading inside a section.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`GridList.LoadMore`}),` is a visible loading row and intersection-driven load-more sentinel.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`collection-content-and-keys`,children:`Collection content and keys`}),`
`,(0,m.jsxs)(t.p,{children:[`Author static `,(0,m.jsx)(t.code,{children:`GridList.Item`}),` children, or pass `,(0,m.jsx)(t.code,{children:`items`}),` and a renderer. Dynamic items must include a stable `,(0,m.jsx)(t.code,{children:`id`}),` whose value is a `,(0,m.jsx)(t.code,{children:`string`}),` or `,(0,m.jsx)(t.code,{children:`number`}),`. Every item repeats that stable key in `,(0,m.jsx)(t.code,{children:`GridList.Item id`}),`. `,(0,m.jsx)(t.code,{children:`textValue`}),` is required for typeahead and an accessible plain-text representation, especially when visible content is structured.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Selection values are `,(0,m.jsx)(t.code,{children:`Array<string | number>`}),` or the literal `,(0,m.jsx)(t.code,{children:`'all'`}),`. Do not use array positions, translated labels, or transient object identities as keys.`]}),`
`,(0,m.jsx)(t.h2,{id:`selection-and-actions`,children:`Selection and actions`}),`
`,(0,m.jsxs)(t.p,{children:[`Uncontrolled selection uses `,(0,m.jsx)(t.code,{children:`defaultSelection`}),` and may observe changes with `,(0,m.jsx)(t.code,{children:`onSelectionChange`}),`. Controlled selection requires both `,(0,m.jsx)(t.code,{children:`selection`}),` and `,(0,m.jsx)(t.code,{children:`onSelectionChange`}),`. Read-only selection requires `,(0,m.jsx)(t.code,{children:`selection`}),`, `,(0,m.jsx)(t.code,{children:`readOnly`}),`, and no callback. The initial uncontrolled selection is empty.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`multiple`}),` defaults to `,(0,m.jsx)(t.code,{children:`false`}),`. `,(0,m.jsx)(t.code,{children:`onSelectionChange`}),` receives the complete next selection, not only the changed key. `,(0,m.jsx)(t.code,{children:`GridList.Item onAction`}),` receives that item's stable key. Keep embedded buttons and links as real controls; their activation remains separate from row selection and action.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { useState } from 'react';
import {
  GridList,
  type CollectionSelection,
} from '@motech-development/breeze-ui';

export function ControlledRecords() {
  const [selection, setSelection] = useState<CollectionSelection>(['alpha']);

  return (
    <GridList.Root
      aria-label="Records"
      onSelectionChange={setSelection}
      selection={selection}
    >
      <GridList.Item id="alpha" textValue="Alpha">
        Alpha
      </GridList.Item>
      <GridList.Item id="beta" textValue="Beta">
        Beta
      </GridList.Item>
    </GridList.Root>
  );
}
`})}),`
`,(0,m.jsx)(t.h2,{id:`layout-empty-disabled-loading-and-error-states`,children:`Layout, empty, disabled, loading, and error states`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`layout="stack"`}),` is the default. `,(0,m.jsx)(t.code,{children:`layout="grid"`}),` creates auto-fitting tiles while preserving grid-list semantics. `,(0,m.jsx)(t.code,{children:`orientation`}),` defaults to `,(0,m.jsx)(t.code,{children:`vertical`}),` and sets the primary arrow-key axis; use `,(0,m.jsx)(t.code,{children:`horizontal`}),` only when the visual arrangement and expected navigation agree. `,(0,m.jsx)(t.code,{children:`disabledKeys`}),` disables matching keys globally; `,(0,m.jsx)(t.code,{children:`GridList.Item disabled`}),` disables one item. Disabled rows cannot receive focus, selection, or actions.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`emptyContent`}),` defaults to `,(0,m.jsx)(t.code,{children:`No items`}),`; supply translated application copy. `,(0,m.jsx)(t.code,{children:`GridList.LoadMore`}),` calls `,(0,m.jsx)(t.code,{children:`onLoadMore`}),` when its sentinel approaches the viewport. Set `,(0,m.jsx)(t.code,{children:`loading`}),` while the returned request is pending so duplicate requests are suppressed. `,(0,m.jsx)(t.code,{children:`offset`}),` defaults to `,(0,m.jsx)(t.code,{children:`1`}),` viewport proportion. The collection has no built-in error presentation: replace or accompany it with application-owned feedback and offer a retry action.`]}),`
`,(0,m.jsx)(t.h2,{id:`virtualization`,children:`Virtualization`}),`
`,(0,m.jsxs)(t.p,{children:[`Pass `,(0,m.jsx)(t.code,{children:`virtualization`}),` only for collections large enough to justify windowing. Both modes require `,(0,m.jsx)(t.code,{children:`viewportHeight`}),` in pixels.`]}),`
`,(0,m.jsxs)(t.table,{children:[(0,m.jsx)(t.thead,{children:(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.th,{children:`Mode`}),(0,m.jsx)(t.th,{children:`Required`}),(0,m.jsx)(t.th,{children:`Optional defaults and behaviour`})]})}),(0,m.jsxs)(t.tbody,{children:[(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`{ mode: 'fixed' }`})}),(0,m.jsxs)(t.td,{children:[(0,m.jsx)(t.code,{children:`rowHeight`}),`, `,(0,m.jsx)(t.code,{children:`viewportHeight`})]}),(0,m.jsxs)(t.td,{children:[`Uniform authoritative row height; `,(0,m.jsx)(t.code,{children:`gap`}),` defaults to `,(0,m.jsx)(t.code,{children:`0`}),`.`]})]}),(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`{ mode: 'variable' }`})}),(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`viewportHeight`})}),(0,m.jsxs)(t.td,{children:[(0,m.jsx)(t.code,{children:`estimatedRowHeight`}),` defaults to `,(0,m.jsx)(t.code,{children:`48`}),`; rendered rows are measured.`]})]})]})]}),`
`,(0,m.jsxs)(t.p,{children:[`Both accept `,(0,m.jsx)(t.code,{children:`overscan`}),` (default `,(0,m.jsx)(t.code,{children:`0`}),` beyond the directional buffer), `,(0,m.jsx)(t.code,{children:`loadingRowHeight`}),` (default `,(0,m.jsx)(t.code,{children:`48`}),`), and `,(0,m.jsx)(t.code,{children:`estimatedSectionHeight`}),`. Grid-list virtualization also accepts `,(0,m.jsx)(t.code,{children:`minimumItemWidth`}),` (default `,(0,m.jsx)(t.code,{children:`224`}),`) and `,(0,m.jsx)(t.code,{children:`maximumColumns`}),` (defaults to available width). Keep keys stable and provide realistic estimates; do not virtualize merely to hide expensive row rendering.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`keyboard-and-accessibility`,children:`Keyboard and accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`Give every root a visible label or `,(0,m.jsx)(t.code,{children:`aria-label`}),`/`,(0,m.jsx)(t.code,{children:`aria-labelledby`}),`. Arrow keys move row focus along `,(0,m.jsx)(t.code,{children:`orientation`}),`; Home and End move to collection boundaries, typeahead uses `,(0,m.jsx)(t.code,{children:`textValue`}),`, and standard selection keys follow the current single or multiple selection mode. Enter or equivalent activation invokes an actionable row. Tab moves into and out of embedded controls without changing their semantics. Exact platform selection modifiers follow React Aria conventions.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Translate labels, empty/loading copy, section headings, and `,(0,m.jsx)(t.code,{children:`textValue`}),`. Logical layout and focus movement account for the inherited direction; do not reverse source order for RTL.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Parts support relevant native `,(0,m.jsx)(t.code,{children:`div`}),` attributes, `,(0,m.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and typed refs. Click, value, children, and inline-style props owned by the collection API are intentionally excluded where applicable.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[`Do not omit `,(0,m.jsx)(t.code,{children:`textValue`}),` or use unstable keys.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not mix `,(0,m.jsx)(t.code,{children:`selection`}),` with `,(0,m.jsx)(t.code,{children:`defaultSelection`}),`, or mark uncontrolled state read-only.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not attach click handlers to row wrappers; use `,(0,m.jsx)(t.code,{children:`onAction`}),` or an embedded control.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not leave `,(0,m.jsx)(t.code,{children:`loading`}),` false while an asynchronous load-more request is pending.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not use `,(0,m.jsx)(t.code,{children:`GridList`}),` for plain prose or tabular comparisons.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.a,{href:`?path=/docs/collections-listbox--docs`,children:`ListBox`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/collections-table--docs`,children:`Table`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),`, and `,(0,m.jsx)(t.a,{href:`?path=/docs/data-display-card--docs`,children:`Card`}),`.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};