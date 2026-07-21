import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{ControlledSortingAndSelection as c,ResponsiveGroupedSections as l,VariableVirtualizationAndLoading as u,n as d,t as f}from"./Table.stories-nWP1rX_4.js";function p(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Responsive compound data table with ordered columns, keyed rows, selection, consumer-owned sorting, actions, grouped sections, loading, and optional virtualization.`}),`
`,(0,h.jsx)(t.h1,{id:`table`,children:`Table`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Table`}),` presents comparable records in ordered columns while coordinating responsive labels, row focus, selection, sorting, actions, and large collections.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Table } from '@motech-development/breeze-ui';
`})}),`
`,(0,h.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,h.jsxs)(t.p,{children:[`Use a table when people need to scan or compare the same attributes across records. Use `,(0,h.jsx)(t.a,{href:`?path=/docs/data-display-descriptionlist--docs`,children:`DescriptionList`}),` for the attributes of one record, `,(0,h.jsx)(t.a,{href:`?path=/docs/collections-gridlist--docs`,children:`GridList`}),` for rich selectable rows without aligned columns, and `,(0,h.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),` for non-interactive sequences.`]}),`
`,(0,h.jsx)(t.p,{children:`Avoid a table when each row has a different information structure or when a small-screen record cannot be understood from compact labels.`}),`
`,(0,h.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Table } from '@motech-development/breeze-ui';

export function RecordsTable() {
  return (
    <Table.Root aria-label="Records">
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="alpha" textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id="beta" textValue="Beta In review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">In review</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
`})}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,h.jsxs)(t.ul,{children:[`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Root`}),` owns table semantics, layout, responsive labels, row state, sorting, and virtualization.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Header`}),` renders the ordered column-heading section from static children or generic `,(0,h.jsx)(t.code,{children:`items`}),`.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Column`}),` renders one keyed heading and configures row-header, sorting, compact label, alignment, and width behaviour.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Body`}),` renders one ordered row section and its empty content.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Row`}),` renders one keyed data or section row, with optional action and tone.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Cell`}),` associates one cell with a stable column key.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Disclosure`}),` renders the canonical bare arrow cell for an actionable row.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.Footer`}),` renders an optional ordered footer row section.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`Table.LoadMore`}),` renders a visible loading row and intersection-driven request sentinel.`]}),`
`]}),`
`,(0,h.jsxs)(t.p,{children:[`Keep `,(0,h.jsx)(t.code,{children:`Header`}),`, each `,(0,h.jsx)(t.code,{children:`Body`}),`, and optional `,(0,h.jsx)(t.code,{children:`Footer`}),` in meaningful source order. Every data row must contain exactly one cell for every visible column, in the same order, even after conditional column changes.`]}),`
`,(0,h.jsx)(t.h2,{id:`keys-and-collection-content`,children:`Keys and collection content`}),`
`,(0,h.jsxs)(t.p,{children:[`Column, row, and section identifiers are stable `,(0,h.jsx)(t.code,{children:`string | number`}),` keys. Do not use array positions or translated labels. Each `,(0,h.jsx)(t.code,{children:`Table.Cell column`}),` must exactly match its `,(0,h.jsx)(t.code,{children:`Table.Column id`}),`. `,(0,h.jsx)(t.code,{children:`Table.Row textValue`}),` is required for typeahead and a plain-text accessible representation. Provide `,(0,h.jsx)(t.code,{children:`Table.Column textValue`}),` and `,(0,h.jsx)(t.code,{children:`Table.Cell textValue`}),` when visible content is not plain text; Breeze does not derive accessible or compact labels from arbitrary React nodes.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Table.Header`}),`, `,(0,h.jsx)(t.code,{children:`Table.Body`}),`, and `,(0,h.jsx)(t.code,{children:`Table.Footer`}),` accept either authored children or generic `,(0,h.jsx)(t.code,{children:`items`}),` plus a renderer. Dynamic items must contain a stable `,(0,h.jsx)(t.code,{children:`id`}),`. `,(0,h.jsx)(t.code,{children:`id`}),` on each section is optional but recommended for stable measurement when sections can reorder or virtualization is enabled.`]}),`
`,(0,h.jsx)(t.h2,{id:`responsive-layouts-and-columns`,children:`Responsive layouts and columns`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`layout="responsive"`}),` is the default. It presents compact labelled records below the Breeze small breakpoint and native table columns at wider sizes. `,(0,h.jsx)(t.code,{children:`responsiveGrid`}),` keeps the same compact treatment but uses explicit equal grid tracks at wider sizes. `,(0,h.jsx)(t.code,{children:`grid`}),` keeps CSS grid structure at all sizes. Use `,(0,h.jsx)(t.code,{children:`responsiveGrid`}),` or `,(0,h.jsx)(t.code,{children:`grid`}),` only when equal tracks and aligned custom geometry fit the content.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Table.Column compactLabel`}),` defaults to `,(0,h.jsx)(t.code,{children:`true`}),`; a literal string heading becomes the compact label. When the heading contains formatting, icons, or other React nodes, provide explicit `,(0,h.jsx)(t.code,{children:`textValue`}),`. Set `,(0,h.jsx)(t.code,{children:`compactLabel`}),` to `,(0,h.jsx)(t.code,{children:`false`}),` for a disclosure or control column that should not label compact cells. `,(0,h.jsx)(t.code,{children:`align`}),` is `,(0,h.jsx)(t.code,{children:`start`}),`, `,(0,h.jsx)(t.code,{children:`center`}),`, or `,(0,h.jsx)(t.code,{children:`end`}),` and defaults to `,(0,h.jsx)(t.code,{children:`start`}),`. `,(0,h.jsx)(t.code,{children:`width`}),` is `,(0,h.jsx)(t.code,{children:`auto`}),`, `,(0,h.jsx)(t.code,{children:`control`}),`, or `,(0,h.jsx)(t.code,{children:`icon`}),` and defaults to `,(0,h.jsx)(t.code,{children:`auto`}),`. `,(0,h.jsx)(t.code,{children:`boundary="strong"`}),` adds a stronger lower edge; `,(0,h.jsx)(t.code,{children:`none`}),` is the default.`]}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`selection-sorting-and-actions`,children:`Selection, sorting, and actions`}),`
`,(0,h.jsxs)(t.p,{children:[`Selection is disabled until you supply selection state, a selection callback, or `,(0,h.jsx)(t.code,{children:`multiple`}),`. Uncontrolled selection uses `,(0,h.jsx)(t.code,{children:`defaultSelection`}),`; controlled selection requires `,(0,h.jsx)(t.code,{children:`selection`}),` and `,(0,h.jsx)(t.code,{children:`onSelectionChange`}),`; immutable selection requires `,(0,h.jsx)(t.code,{children:`selection`}),`, `,(0,h.jsx)(t.code,{children:`readOnly`}),`, and no selection callback. Values are `,(0,h.jsx)(t.code,{children:`Array<string | number>`}),` or `,(0,h.jsx)(t.code,{children:`'all'`}),`. `,(0,h.jsx)(t.code,{children:`multiple`}),` defaults to `,(0,h.jsx)(t.code,{children:`false`}),`, and `,(0,h.jsx)(t.code,{children:`onSelectionChange`}),` receives the complete next selection.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Sorting never sorts consumer data. Mark a column `,(0,h.jsx)(t.code,{children:`sortable`}),`, then either use `,(0,h.jsx)(t.code,{children:`defaultSort`}),` for retained uncontrolled sort metadata or pass controlled `,(0,h.jsx)(t.code,{children:`sort`}),` with `,(0,h.jsx)(t.code,{children:`onSortChange`}),`. A `,(0,h.jsx)(t.code,{children:`TableSort`}),` is `,(0,h.jsx)(t.code,{children:`{ column: string | number, direction: 'ascending' | 'descending' }`}),`. Reorder the supplied rows in response. `,(0,h.jsx)(t.code,{children:`onSortChange`}),` receives the next complete descriptor. Read-only mode suppresses sort changes as well as selection changes.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Table.Row onAction`}),` receives that row's stable key. Add `,(0,h.jsx)(t.code,{children:`Table.Disclosure column="actions"`}),` to an actionable row when a visual arrow is useful, and define a matching column with `,(0,h.jsx)(t.code,{children:`compactLabel={false}`}),` and `,(0,h.jsx)(t.code,{children:`width="icon"`}),`. `,(0,h.jsx)(t.code,{children:`position="overlay"`}),` is the disclosure default for compact records; `,(0,h.jsx)(t.code,{children:`flow`}),` keeps it in an explicit track. Buttons and links inside cells remain independent controls.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { useState } from 'react';
import {
  Table,
  type CollectionSelection,
  type TableSort,
} from '@motech-development/breeze-ui';

export function ControlledTable() {
  const [selection, setSelection] = useState<CollectionSelection>([]);
  const [sort, setSort] = useState<TableSort>({
    column: 'name',
    direction: 'ascending',
  });

  return (
    <Table.Root
      aria-label="Records"
      onSelectionChange={setSelection}
      onSortChange={setSort}
      selection={selection}
      sort={sort}
    >
      <Table.Header>
        <Table.Column id="name" rowHeader sortable>
          Name
        </Table.Column>
      </Table.Header>
      <Table.Body emptyContent="No records">
        <Table.Row id="alpha" textValue="Alpha">
          <Table.Cell column="name">Alpha</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
`})}),`
`,(0,h.jsx)(t.h2,{id:`row-presentation-and-states`,children:`Row presentation and states`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Table.Row presentation="data"`}),` and `,(0,h.jsx)(t.code,{children:`tone="default"`}),` are defaults. Use `,(0,h.jsx)(t.code,{children:`tone="muted"`}),` for domain-neutral de-emphasis, not disabled state. `,(0,h.jsx)(t.code,{children:`presentation="section"`}),` creates a grouped section row; it is structure inside an ordered body, not a substitute for column headings. `,(0,h.jsx)(t.code,{children:`disabled`}),` or `,(0,h.jsx)(t.code,{children:`disabledKeys`}),` prevent row focus, selection, and actions.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Table.Body emptyContent`}),` defaults to `,(0,h.jsx)(t.code,{children:`No rows`}),`; supply translated copy. `,(0,h.jsx)(t.code,{children:`Table.LoadMore onLoadMore`}),` requests more consumer-owned rows. Set `,(0,h.jsx)(t.code,{children:`loading`}),` for the duration of the request to show loading content and suppress duplicates; `,(0,h.jsx)(t.code,{children:`offset`}),` defaults to `,(0,h.jsx)(t.code,{children:`1`}),` viewport proportion. Table has no built-in error row: render application feedback and a real retry action without breaking the header/body structure.`]}),`
`,(0,h.jsx)(t.h2,{id:`virtualization`,children:`Virtualization`}),`
`,(0,h.jsxs)(t.p,{children:[`Pass `,(0,h.jsx)(t.code,{children:`virtualization`}),` only for a large collection. Both modes require `,(0,h.jsx)(t.code,{children:`viewportHeight`}),` in pixels.`]}),`
`,(0,h.jsxs)(t.table,{children:[(0,h.jsx)(t.thead,{children:(0,h.jsxs)(t.tr,{children:[(0,h.jsx)(t.th,{children:`Mode`}),(0,h.jsx)(t.th,{children:`Required`}),(0,h.jsx)(t.th,{children:`Optional defaults and behaviour`})]})}),(0,h.jsxs)(t.tbody,{children:[(0,h.jsxs)(t.tr,{children:[(0,h.jsx)(t.td,{children:(0,h.jsx)(t.code,{children:`{ mode: 'fixed' }`})}),(0,h.jsxs)(t.td,{children:[(0,h.jsx)(t.code,{children:`rowHeight`}),`, `,(0,h.jsx)(t.code,{children:`viewportHeight`})]}),(0,h.jsxs)(t.td,{children:[`One authoritative row height; `,(0,h.jsx)(t.code,{children:`gap`}),` defaults to `,(0,h.jsx)(t.code,{children:`0`}),`.`]})]}),(0,h.jsxs)(t.tr,{children:[(0,h.jsx)(t.td,{children:(0,h.jsx)(t.code,{children:`{ mode: 'variable' }`})}),(0,h.jsx)(t.td,{children:(0,h.jsx)(t.code,{children:`viewportHeight`})}),(0,h.jsxs)(t.td,{children:[(0,h.jsx)(t.code,{children:`estimatedRowHeight`}),` defaults to `,(0,h.jsx)(t.code,{children:`48`}),`; live row measurements override it.`]})]})]})]}),`
`,(0,h.jsxs)(t.p,{children:[`Both modes accept `,(0,h.jsx)(t.code,{children:`overscan`}),` (default `,(0,h.jsx)(t.code,{children:`0`}),` beyond the engine buffer), `,(0,h.jsx)(t.code,{children:`loadingRowHeight`}),` (default `,(0,h.jsx)(t.code,{children:`48`}),`), and `,(0,h.jsx)(t.code,{children:`estimatedSectionHeight`}),`. Keep section and row keys stable. Test responsive content at the configured height; clipping a variable-height row by using fixed mode is a data-loss bug.`]}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalization`,children:`Keyboard, accessibility, and internationalization`}),`
`,(0,h.jsxs)(t.p,{children:[`Every table needs an accessible name through visible context, `,(0,h.jsx)(t.code,{children:`aria-label`}),`, or `,(0,h.jsx)(t.code,{children:`aria-labelledby`}),`. Mark the primary identifying column `,(0,h.jsx)(t.code,{children:`rowHeader`}),` so assistive technology can announce records while navigating cells. Arrow keys move through the table, Home and End move within row/collection boundaries, and typeahead uses row `,(0,h.jsx)(t.code,{children:`textValue`}),`. Standard selection keys follow the current mode; Enter or equivalent activation invokes actionable rows. Sortable headings are keyboard activatable. Embedded controls remain in the Tab sequence.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Translate the table name, headings, empty/loading/error copy, and text values. Format dates and numbers before rendering cells. `,(0,h.jsx)(t.code,{children:`start`}),`/`,(0,h.jsx)(t.code,{children:`end`}),`, logical disclosure positioning, and inherited direction adapt to RTL; keep semantic column and row source order stable rather than manually reversing it.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Parts support relevant native table attributes, `,(0,h.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and typed refs. Click, value, children, alignment, role, and inline-style props owned by the compound API are intentionally excluded where applicable.`]}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{}),`
`,(0,h.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,h.jsxs)(t.ul,{children:[`
`,(0,h.jsxs)(t.li,{children:[`Do not mismatch cell `,(0,h.jsx)(t.code,{children:`column`}),` keys, heading order, or conditional visible columns.`]}),`
`,(0,h.jsxs)(t.li,{children:[`Do not assume `,(0,h.jsx)(t.code,{children:`onSortChange`}),` sorts rows for you.`]}),`
`,(0,h.jsxs)(t.li,{children:[`Do not use unstable row keys or omit `,(0,h.jsx)(t.code,{children:`textValue`}),`.`]}),`
`,(0,h.jsxs)(t.li,{children:[`Do not attach generic click handlers to rows; use `,(0,h.jsx)(t.code,{children:`onAction`}),` or cell controls.`]}),`
`,(0,h.jsx)(t.li,{children:`Do not use fixed virtualization for wrapping rows.`}),`
`,(0,h.jsxs)(t.li,{children:[`Do not hide meaningful headings with `,(0,h.jsx)(t.code,{children:`compactLabel={false}`}),`.`]}),`
`]}),`
`,(0,h.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.a,{href:`?path=/docs/collections-gridlist--docs`,children:`GridList`}),`, `,(0,h.jsx)(t.a,{href:`?path=/docs/data-display-descriptionlist--docs`,children:`DescriptionList`}),`, `,(0,h.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),`, and `,(0,h.jsx)(t.a,{href:`?path=/docs/patterns-navigation-pagination--docs`,children:`Pagination`}),`.`]})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};