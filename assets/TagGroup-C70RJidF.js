import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{StaticKeyboard as c,n as l,t as u}from"./TagGroup.stories-Bx9-Q1_s.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Labelled static or typed tag collection with optional multiple selection, disabled keys, controlled, uncontrolled and read-only state, application-owned removal, and an explicit empty state.`}),`
`,(0,p.jsx)(t.h1,{id:`taggroup`,children:`TagGroup`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`TagGroup`}),` coordinates a labelled collection of keyed `,(0,p.jsx)(t.code,{children:`Tag`}),` items with optional multiple selection and application-owned removal.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Tag, TagGroup } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for compact chosen filters, categories, recipients, or similar items where selection or removal is meaningful. Prefer `,(0,p.jsx)(t.code,{children:`Badge`}),` plus a layout primitive for passive metadata, `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for form choices with persistent checkbox affordances, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for a larger selectable collection. Do not use tags as a substitute for navigation links.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Tag, TagGroup } from '@motech-development/breeze-ui';

<TagGroup.Root onRemove={(keys) => removeTopics(keys)}>
  <TagGroup.Label>Topics</TagGroup.Label>
  <TagGroup.List>
    <Tag id="design" textValue="Design">
      Design
    </Tag>
    <Tag id="research" textValue="Research">
      Research
    </Tag>
  </TagGroup.List>
  <TagGroup.Description>Delete removes the focused topic.</TagGroup.Description>
</TagGroup.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TagGroup.Root`})}),(0,p.jsx)(t.td,{children:`Owns collection focus, optional multiple selection, disabled keys, read-only state, and removal callback.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TagGroup.Label`})}),(0,p.jsx)(t.td,{children:`Persistent accessible name for the tag collection.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TagGroup.List`})}),(0,p.jsx)(t.td,{children:`Renders static or typed generic tags and the empty state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Tag`})}),(0,p.jsx)(t.td,{children:`One keyed item with plain-text representation, disabled state, and optional action.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TagGroup.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the collection.`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`There is no group error part or invalid/required API. Validate the application concept in surrounding form composition if necessary.`}),`
`,(0,p.jsx)(t.h2,{id:`collections-selection-and-removal`,children:`Collections, selection, and removal`}),`
`,(0,p.jsxs)(t.p,{children:[`Static lists contain authored `,(0,p.jsx)(t.code,{children:`Tag`}),` children. Dynamic lists accept `,(0,p.jsx)(t.code,{children:`items`}),`, each with stable `,(0,p.jsx)(t.code,{children:`id: string | number`}),`, and a child renderer.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<TagGroup.List items={topics}>
  {(topic) => (
    <Tag id={topic.id} textValue={topic.name}>
      {topic.name}
    </Tag>
  )}
</TagGroup.List>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Selection is opt-in. Supplying `,(0,p.jsx)(t.code,{children:`defaultSelection`}),`, `,(0,p.jsx)(t.code,{children:`selection`}),`, or `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` enables multiple selection. Values use `,(0,p.jsx)(t.code,{children:`CollectionKey[] | 'all'`}),`. Use `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. The callback receives the complete next selection.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`onRemove`}),` receives all stable keys removed through keyboard interaction. It does not mutate consumer data; remove the matching items in application state. It is unavailable in read-only mode. `,(0,p.jsx)(t.code,{children:`disabledKeys`}),` prevents matching tags from focus, selection, action, and removal. `,(0,p.jsx)(t.code,{children:`emptyContent`}),` defaults to `,(0,p.jsx)(t.code,{children:`'No tags'`}),`. Loading and loading errors are application-owned.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab enters and leaves the tag collection; arrow keys move between enabled tags.`}),`
`,(0,p.jsxs)(t.li,{children:[`Selection keys follow tag-group conventions when selection is enabled. Delete or Backspace requests removal when `,(0,p.jsx)(t.code,{children:`onRemove`}),` is supplied.`]}),`
`,(0,p.jsx)(t.li,{children:`Disabled tags are skipped. Read-only mode prevents selection changes and removal.`}),`
`,(0,p.jsxs)(t.li,{children:[`Provide `,(0,p.jsx)(t.code,{children:`Label`}),`, an accurate `,(0,p.jsx)(t.code,{children:`textValue`}),` for every Tag, and `,(0,p.jsx)(t.code,{children:`Description`}),` when removal or selection is not obvious.`]}),`
`,(0,p.jsx)(t.li,{children:`Keep keys locale-independent. Translated labels, descriptions, and empty content may change without changing selection.`}),`
`,(0,p.jsx)(t.li,{children:`Wrapping and arrow interpretation follow surrounding direction.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not assume `,(0,p.jsx)(t.code,{children:`onRemove`}),` changes the items, enable selection accidentally with an unused callback, use translated labels as keys, omit `,(0,p.jsx)(t.code,{children:`textValue`}),`, or put buttons inside tags. Use `,(0,p.jsx)(t.code,{children:`Badge`}),` for passive metadata, `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for form choices, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for a larger or virtualised collection.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};