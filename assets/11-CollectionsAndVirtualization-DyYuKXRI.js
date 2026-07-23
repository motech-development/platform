import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,s as i}from"./blocks-COZjwJ0c.js";import{t as a}from"./mdx-react-shim-CpkRhXci.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/11 Collections and virtualization`,summary:`Choose a Breeze collection, supply stable keys, model selection and configure optional fixed or variable virtualization.`}),`
`,(0,c.jsx)(t.h1,{id:`collections-and-virtualization`,children:`Collections and virtualization`}),`
`,(0,c.jsxs)(t.p,{children:[`Breeze collection primitives share stable string-or-number keys, static compound children and typed `,(0,c.jsx)(t.code,{children:`items`}),` render functions. Applications own fetching, cursors, caching, sorting, filtering, grouping decisions and page merging.`]}),`
`,(0,c.jsx)(t.h2,{id:`choose-a-collection`,children:`Choose a collection`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Need`}),(0,c.jsx)(t.th,{children:`Component`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Plain semantic content without selection`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`List`}),` or `,(0,c.jsx)(t.code,{children:`DescriptionList`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Visible selectable options`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ListBox`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Selectable rows that may contain controls`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`GridList`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Structured rows and columns with headings`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Table`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Compact popup choice`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Select`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Searchable or custom-value choice`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ComboBox`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Commands and nested actions`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Menu`})})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Use `,(0,c.jsx)(t.code,{children:`TagGroup`}),` for a compact editable set of tags, not as a replacement for a general collection.`]}),`
`,(0,c.jsx)(t.h2,{id:`static-and-data-driven-content`,children:`Static and data-driven content`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { ListBox } from '@motech-development/breeze-ui';

<ListBox.Root aria-label="Priority" defaultSelection={['normal']}>
  <ListBox.Item id="low" textValue="Low">
    Low
  </ListBox.Item>
  <ListBox.Item id="normal" textValue="Normal">
    Normal
  </ListBox.Item>
  <ListBox.Item id="high" textValue="High">
    High
  </ListBox.Item>
</ListBox.Root>;
`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`const priorities = [
  { id: 'low', label: 'Low' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
];

<ListBox.Root aria-label="Priority" items={priorities}>
  {(item) => (
    <ListBox.Item id={item.id} textValue={item.label}>
      {item.label}
    </ListBox.Item>
  )}
</ListBox.Root>;
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Every item needs a stable `,(0,c.jsx)(t.code,{children:`id`}),`. `,(0,c.jsx)(t.code,{children:`textValue`}),` supplies typeahead and accessible text when the rendered content is not plain text. Selection is `,(0,c.jsx)(t.code,{children:`CollectionKey[] | 'all'`}),`; use `,(0,c.jsx)(t.code,{children:`selection`}),` plus `,(0,c.jsx)(t.code,{children:`onSelectionChange`}),` for controlled state, `,(0,c.jsx)(t.code,{children:`defaultSelection`}),` for uncontrolled state, and `,(0,c.jsx)(t.code,{children:`readOnly`}),` for an intentionally immutable controlled selection.`]}),`
`,(0,c.jsx)(t.h2,{id:`virtualization`,children:`Virtualization`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`Table`}),`, `,(0,c.jsx)(t.code,{children:`GridList`}),` and `,(0,c.jsx)(t.code,{children:`ListBox`}),` accept a Breeze-owned `,(0,c.jsx)(t.code,{children:`virtualization`}),` configuration. No `,(0,c.jsx)(t.code,{children:`Virtualizer`}),`, `,(0,c.jsx)(t.code,{children:`DataTable`}),` or `,(0,c.jsx)(t.code,{children:`VirtualizedTable`}),` component is exported.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`<ListBox.Root
  aria-label="Items"
  items={items}
  virtualization={{
    mode: 'fixed',
    rowHeight: 44,
    viewportHeight: 320,
    overscan: 88,
  }}
>
  {(item) => (
    <ListBox.Item id={item.id} textValue={item.label}>
      {item.label}
    </ListBox.Item>
  )}
</ListBox.Root>
`})}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Option`}),(0,c.jsx)(t.th,{children:`Required`}),(0,c.jsx)(t.th,{children:`Default`}),(0,c.jsx)(t.th,{children:`Meaning`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`mode`})}),(0,c.jsx)(t.td,{children:`Yes`}),(0,c.jsx)(t.td,{children:`—`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`'fixed'`}),` or `,(0,c.jsx)(t.code,{children:`'variable'`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`viewportHeight`})}),(0,c.jsx)(t.td,{children:`Yes`}),(0,c.jsx)(t.td,{children:`—`}),(0,c.jsx)(t.td,{children:`Fixed scroll viewport height in pixels`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`rowHeight`})}),(0,c.jsx)(t.td,{children:`Fixed mode`}),(0,c.jsx)(t.td,{children:`—`}),(0,c.jsx)(t.td,{children:`Authoritative uniform row height in pixels`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`estimatedRowHeight`})}),(0,c.jsx)(t.td,{children:`No, variable mode only`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`48`})}),(0,c.jsx)(t.td,{children:`Initial estimate replaced by live measurements`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`gap`})}),(0,c.jsx)(t.td,{children:`No`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`0`})}),(0,c.jsx)(t.td,{children:`Pixel gap between measured rows`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`overscan`})}),(0,c.jsx)(t.td,{children:`No`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`0`}),` beyond the engine buffer`]}),(0,c.jsx)(t.td,{children:`Additional retained pixels around the viewport`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`loadingRowHeight`})}),(0,c.jsx)(t.td,{children:`No`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`48`})}),(0,c.jsx)(t.td,{children:`Initial loading-row height`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`estimatedSectionHeight`})}),(0,c.jsx)(t.td,{children:`No`}),(0,c.jsx)(t.td,{children:`Component estimate`}),(0,c.jsx)(t.td,{children:`Initial section header/footer estimate`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Grid-list virtualization additionally accepts `,(0,c.jsx)(t.code,{children:`minimumItemWidth`}),` (default `,(0,c.jsx)(t.code,{children:`224`}),`) and `,(0,c.jsx)(t.code,{children:`maximumColumns`}),`. Keep item height consistent with fixed mode; choose variable mode when content can wrap or expand.`]}),`
`,(0,c.jsx)(t.h2,{id:`loading-and-empty-states`,children:`Loading and empty states`}),`
`,(0,c.jsxs)(t.p,{children:[`Use `,(0,c.jsx)(t.code,{children:`emptyContent`}),` for a genuine empty result and the component's `,(0,c.jsx)(t.code,{children:`LoadMore`}),` part for incremental loading. `,(0,c.jsx)(t.code,{children:`onLoadMore`}),` requests more application-owned items; `,(0,c.jsx)(t.code,{children:`loading`}),` suppresses duplicate requests. Do not place fetching, cursor or cache state inside a render function. Keep focusable keys stable while pages are merged so keyboard focus and selection survive window changes.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};