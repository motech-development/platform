import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{StaticKeyboard as c,n as l,t as u}from"./ListBox.stories-CHrvcYd5.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Persistent selectable collection with static or typed items, single or multiple selection, disabled keys, actions, empty state, incremental loading, and fixed or variable virtualization.`}),`
`,(0,p.jsx)(t.h1,{id:`listbox`,children:`ListBox`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ListBox`}),` presents a persistent collection of options with keyboard focus, typeahead, and optional single or multiple selection.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ListBox } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when options should remain visible, when multiple selection is needed, or when a large collection benefits from virtualisation or incremental loading. Prefer `,(0,p.jsx)(t.code,{children:`Select`}),` for compact single selection, `,(0,p.jsx)(t.code,{children:`ComboBox`}),` for editable filtering, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for a short visible one-of-many choice, and `,(0,p.jsx)(t.code,{children:`List`}),` for non-interactive content. Do not use listbox options as navigation links or a collection of unrelated buttons.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ListBox } from '@motech-development/breeze-ui';

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
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ListBox.Root`})}),(0,p.jsx)(t.td,{children:`Owns collection rendering, focus, typeahead, selection, empty state, orientation, and optional virtualisation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ListBox.Item`})}),(0,p.jsx)(t.td,{children:`One selectable option with a stable key, plain-text representation, disabled state, and optional semantic action.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ListBox.LoadMore`})}),(0,p.jsx)(t.td,{children:`Loading row and deduplicated intersection sentinel for application-owned incremental loading.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Root`}),` must have an accessible name through `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),`. Use `,(0,p.jsx)(t.code,{children:`onAction`}),` for an option’s semantic action only when that action is consistent with listbox interaction; it receives the item key.`]}),`
`,(0,p.jsx)(t.h2,{id:`static-and-dynamic-collections`,children:`Static and dynamic collections`}),`
`,(0,p.jsxs)(t.p,{children:[`Static collections use authored `,(0,p.jsx)(t.code,{children:`Item`}),` children. Dynamic collections require items with stable `,(0,p.jsx)(t.code,{children:`id: string | number`}),` and a renderer.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<ListBox.Root items={people} aria-label="Assignees" multiple>
  {(person) => (
    <ListBox.Item id={person.id} textValue={person.name}>
      {person.name}
    </ListBox.Item>
  )}
</ListBox.Root>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Never mix static children with `,(0,p.jsx)(t.code,{children:`items`}),`. `,(0,p.jsx)(t.code,{children:`textValue`}),` is required for typeahead and accessibility, especially when visible content contains markup. `,(0,p.jsx)(t.code,{children:`disabledKeys`}),` disables matching keys without changing the data. Item-level `,(0,p.jsx)(t.code,{children:`disabled`}),` is useful for static collections.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-and-state`,children:`Selection and state`}),`
`,(0,p.jsxs)(t.p,{children:[`Selections use `,(0,p.jsx)(t.code,{children:`CollectionKey[] | 'all'`}),`, where each key is a string or number. Use `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` receives the complete next selection. `,(0,p.jsx)(t.code,{children:`multiple`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`; even single selection is represented as an array.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`required`}),` adds required semantics; `,(0,p.jsx)(t.code,{children:`invalid`}),` adds invalid semantics and styling, but validation messages belong in surrounding form composition. `,(0,p.jsx)(t.code,{children:`readOnly`}),` exposes immutable semantics and prevents application state changes. An empty collection displays `,(0,p.jsx)(t.code,{children:`emptyContent`}),`, defaulting to `,(0,p.jsx)(t.code,{children:`'No options'`}),`. The component has no root loading prop; use `,(0,p.jsx)(t.code,{children:`LoadMore`}),` or application-owned status content.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`orientation`}),` defaults to `,(0,p.jsx)(t.code,{children:`vertical`}),`; horizontal listboxes should contain a small, naturally horizontal set.`]}),`
`,(0,p.jsx)(t.h2,{id:`virtualisation-and-loading`,children:`Virtualisation and loading`}),`
`,(0,p.jsxs)(t.p,{children:[`Pass `,(0,p.jsx)(t.code,{children:`virtualization`}),` only for collections large enough to justify windowing. Fixed mode requires an authoritative `,(0,p.jsx)(t.code,{children:`rowHeight`}),`; variable mode measures live rows and uses `,(0,p.jsx)(t.code,{children:`estimatedRowHeight`}),` only initially.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<ListBox.Root
  items={items}
  aria-label="Results"
  virtualization={{ mode: 'fixed', viewportHeight: 320, rowHeight: 48, gap: 4 }}
>
  {(item) => (
    <ListBox.Item id={item.id} textValue={item.name}>
      {item.name}
    </ListBox.Item>
  )}
</ListBox.Root>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Common virtualisation options are `,(0,p.jsx)(t.code,{children:`viewportHeight`}),` (required pixels), `,(0,p.jsx)(t.code,{children:`gap`}),` (`,(0,p.jsx)(t.code,{children:`0`}),`), `,(0,p.jsx)(t.code,{children:`overscan`}),` (`,(0,p.jsx)(t.code,{children:`0`}),` beyond the engine buffer), `,(0,p.jsx)(t.code,{children:`loadingRowHeight`}),` (`,(0,p.jsx)(t.code,{children:`48`}),`), and `,(0,p.jsx)(t.code,{children:`estimatedSectionHeight`}),`. Variable mode’s `,(0,p.jsx)(t.code,{children:`estimatedRowHeight`}),` defaults to `,(0,p.jsx)(t.code,{children:`48`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`LoadMore`}),` calls `,(0,p.jsx)(t.code,{children:`onLoadMore`}),` once when its offset threshold is reached and suppresses duplicate calls while `,(0,p.jsx)(t.code,{children:`loading`}),` is true. `,(0,p.jsx)(t.code,{children:`offset`}),` defaults to `,(0,p.jsx)(t.code,{children:`1`}),` viewport proportion. The application owns fetching, errors, retries, end-of-list state, and stable item accumulation.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab focuses the listbox; arrow keys move the active option along its orientation.`}),`
`,(0,p.jsxs)(t.li,{children:[`Typeahead matches `,(0,p.jsx)(t.code,{children:`textValue`}),`. Enter or Space selects according to selection mode; selection behaviour follows accessible listbox conventions.`]}),`
`,(0,p.jsx)(t.li,{children:`Disabled options cannot receive focus, selection, or actions.`}),`
`,(0,p.jsx)(t.li,{children:`Give the root a persistent accessible name. Do not place interactive descendants inside an option.`}),`
`,(0,p.jsx)(t.li,{children:`Right-to-left horizontal navigation follows platform direction; keys remain stable while labels and empty/loading content may be translated.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use array indexes as keys, omit the accessible root name, mix links or buttons into options, enable virtualisation without a fixed viewport height, or forget to set `,(0,p.jsx)(t.code,{children:`loading`}),` while a load-more request is pending. Use `,(0,p.jsx)(t.code,{children:`Select`}),`, `,(0,p.jsx)(t.code,{children:`ComboBox`}),`, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),`, or non-interactive `,(0,p.jsx)(t.code,{children:`List`}),` when their semantics fit better.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};