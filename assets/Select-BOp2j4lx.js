import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{StaticKeyboard as c,n as l,t as u}from"./Select.stories-DuX_siEc.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Compact single selection from static or typed keyed options with a trigger, popover listbox, controlled, uncontrolled, read-only, validation, empty, and native form states.`}),`
`,(0,p.jsx)(t.h1,{id:`select`,children:`Select`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Select`}),` provides compact single selection from a known collection of keyed options.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Select } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when users must choose one known value and keeping every option visible would consume too much space. Prefer `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for a short comparison-sensitive set, `,(0,p.jsx)(t.code,{children:`ComboBox`}),` when users need filtering or free-form entry, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for persistent or multiple selection. Do not use Select for navigation; use links, menus, or a navigation component.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Select } from '@motech-development/breeze-ui';

<Select.Root name="region" placeholder="Choose a region">
  <Select.Label>Region</Select.Label>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Popover>
    <Select.ListBox>
      <Select.Item id="north" textValue="North">
        North
      </Select.Item>
      <Select.Item id="south" textValue="South">
        South
      </Select.Item>
    </Select.ListBox>
  </Select.Popover>
</Select.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Root`})}),(0,p.jsx)(t.td,{children:`Owns selected key, validation, placeholder, and native form value.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Label`})}),(0,p.jsx)(t.td,{children:`Persistently names the select.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Trigger`})}),(0,p.jsx)(t.td,{children:`Opens and closes the popup and contains the displayed value.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Value`})}),(0,p.jsx)(t.td,{children:`Displays the selected option text or root placeholder.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Popover`})}),(0,p.jsx)(t.td,{children:`Positions option content relative to the trigger.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.ListBox`})}),(0,p.jsx)(t.td,{children:`Renders static or typed generic options and the empty state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Item`})}),(0,p.jsxs)(t.td,{children:[`One option with a stable string or number key and `,(0,p.jsx)(t.code,{children:`textValue`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the select.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Select.Error`})}),(0,p.jsx)(t.td,{children:`Validation feedback while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep `,(0,p.jsx)(t.code,{children:`Value`}),` inside `,(0,p.jsx)(t.code,{children:`Trigger`}),`, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` inside `,(0,p.jsx)(t.code,{children:`Popover`}),`. A `,(0,p.jsx)(t.code,{children:`ListBox`}),` item’s `,(0,p.jsx)(t.code,{children:`id`}),` is its public value; visible content can be localised independently.`]}),`
`,(0,p.jsx)(t.h2,{id:`collections-and-selection`,children:`Collections and selection`}),`
`,(0,p.jsxs)(t.p,{children:[`Static collections contain authored `,(0,p.jsx)(t.code,{children:`Select.Item`}),` children. Dynamic collections pass `,(0,p.jsx)(t.code,{children:`items`}),`, where each item has a stable `,(0,p.jsx)(t.code,{children:`id: string | number`}),`, and a child renderer.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Select.ListBox items={regions}>
  {(region) => (
    <Select.Item id={region.id} textValue={region.name}>
      {region.name}
    </Select.Item>
  )}
</Select.ListBox>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled selection, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled selection, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable selection. The value is `,(0,p.jsx)(t.code,{children:`string | number | null`}),`; `,(0,p.jsx)(t.code,{children:`null`}),` means no option. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the next key or `,(0,p.jsx)(t.code,{children:`null`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and selection. `,(0,p.jsx)(t.code,{children:`readOnly`}),` is implemented as non-interactive while retaining the controlled value. `,(0,p.jsx)(t.code,{children:`required`}),` and `,(0,p.jsx)(t.code,{children:`invalid`}),` expose validation semantics. `,(0,p.jsx)(t.code,{children:`emptyContent`}),` defaults to `,(0,p.jsx)(t.code,{children:`'No options'`}),`. Loading options is application-owned; do not replace the collection without preserving stable keys and a clear status.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility, and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab focuses the trigger. Enter, Space, or Arrow Down opens the listbox; Escape closes it.`}),`
`,(0,p.jsxs)(t.li,{children:[`Arrow keys move the active option, typeahead matches each item’s `,(0,p.jsx)(t.code,{children:`textValue`}),`, and Enter or Space selects according to platform behaviour.`]}),`
`,(0,p.jsx)(t.li,{children:`The popup returns focus to the trigger when dismissed.`}),`
`,(0,p.jsxs)(t.li,{children:[`Always provide `,(0,p.jsx)(t.code,{children:`Label`}),`; provide accurate `,(0,p.jsx)(t.code,{children:`textValue`}),` when option content is not plain text.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Trigger`}),` supports `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),` (default), and `,(0,p.jsx)(t.code,{children:`lg`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Layout follows surrounding `,(0,p.jsx)(t.code,{children:`dir`}),`; keys remain stable while labels and empty content may be translated.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use array indexes as keys, omit `,(0,p.jsx)(t.code,{children:`textValue`}),` for visual option content, place links or buttons inside options, or use a Select to navigate. Use `,(0,p.jsx)(t.code,{children:`ComboBox`}),` for filtering, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for visible comparison, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for persistent or multiple selection.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};