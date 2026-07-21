import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{SelectionOnly as c,n as l,t as u}from"./ComboBox.stories-DuqwLrMk.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Editable keyed option selection with explicit selection-only or free-form modes, separately controllable input and selection state, asynchronous status parts, and accessible popup behaviour.`}),`
`,(0,p.jsx)(t.h1,{id:`combobox`,children:`ComboBox`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ComboBox`}),` combines editable text with a popup option collection for filtering a known set or explicitly accepting free-form text.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ComboBox } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Selection-only mode is the default: the committed value must match an option. Set `,(0,p.jsx)(t.code,{children:`allowsCustomValue`}),` only when arbitrary text is a valid domain value.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Prefer `,(0,p.jsx)(t.code,{children:`Select`}),` when filtering is unnecessary, `,(0,p.jsx)(t.code,{children:`SearchField`}),` when text submits a query rather than selecting a value, and `,(0,p.jsx)(t.code,{children:`TextField`}),` when no suggestion collection exists.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-selection-only-example`,children:`Basic selection-only example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ComboBox } from '@motech-development/breeze-ui';

<ComboBox.Root name="location">
  <ComboBox.Label>Location</ComboBox.Label>
  <ComboBox.Group>
    <ComboBox.Input placeholder="Choose a location" />
    <ComboBox.Trigger />
  </ComboBox.Group>
  <ComboBox.Popover>
    <ComboBox.ListBox>
      <ComboBox.Item id="north" textValue="North">
        North
      </ComboBox.Item>
      <ComboBox.Item id="south" textValue="South">
        South
      </ComboBox.Item>
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Root`})}),(0,p.jsx)(t.td,{children:`Owns input text, selected key, mode, validation, and form integration.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Label`})}),(0,p.jsx)(t.td,{children:`Persistently names the editable input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Group`})}),(0,p.jsx)(t.td,{children:`Visually joins input and trigger and synchronises size.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Input`})}),(0,p.jsx)(t.td,{children:`Displays editable filter or free-form text.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Trigger`})}),(0,p.jsx)(t.td,{children:`Opens and closes the option popup; defaults to a chevron.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Popover`})}),(0,p.jsx)(t.td,{children:`Positions popup content relative to the control.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.ListBox`})}),(0,p.jsx)(t.td,{children:`Renders static or typed generic options and empty content.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Item`})}),(0,p.jsxs)(t.td,{children:[`One option with a stable string or number key and `,(0,p.jsx)(t.code,{children:`textValue`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Loading`})}),(0,p.jsx)(t.td,{children:`Polite status for application-owned asynchronous option loading.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.OptionsError`})}),(0,p.jsx)(t.td,{children:`Assertive alert for application-owned option loading failure.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Description`})}),(0,p.jsx)(t.td,{children:`Supporting input guidance.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ComboBox.Error`})}),(0,p.jsx)(t.td,{children:`Field validation feedback while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep `,(0,p.jsx)(t.code,{children:`Input`}),` and `,(0,p.jsx)(t.code,{children:`Trigger`}),` inside `,(0,p.jsx)(t.code,{children:`Group`}),`, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` inside `,(0,p.jsx)(t.code,{children:`Popover`}),`. `,(0,p.jsx)(t.code,{children:`Loading`}),` and `,(0,p.jsx)(t.code,{children:`OptionsError`}),` describe option retrieval; `,(0,p.jsx)(t.code,{children:`Error`}),` describes invalid field value.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-input-and-free-form-commits`,children:`Selection, input, and free-form commits`}),`
`,(0,p.jsxs)(t.p,{children:[`Selection and displayed text are separate state channels. `,(0,p.jsx)(t.code,{children:`selection`}),` is a `,(0,p.jsx)(t.code,{children:`string | number | null`}),`; `,(0,p.jsx)(t.code,{children:`inputValue`}),` is a string. Each may be uncontrolled with `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` or `,(0,p.jsx)(t.code,{children:`defaultInputValue`}),`, or controlled with its matching callback.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<ComboBox.Root
  allowsCustomValue
  inputValue={query}
  onInputChange={setQuery}
  selection={selectedKey}
  onSelectionChange={setSelectedKey}
  onCommit={(value) => saveFreeFormValue(value)}
>
  {/* compound parts */}
</ComboBox.Root>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`In free-form mode, `,(0,p.jsx)(t.code,{children:`onCommit`}),` receives the current input string when Enter is pressed without a highlighted option. Selecting an option still calls `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),`. Do not infer the selected record from `,(0,p.jsx)(t.code,{children:`inputValue`}),`; use the stable selection key. Read-only state requires controlled input text and selection as appropriate and forbids change callbacks.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Static and dynamic collections follow the Breeze collection contract: dynamic items require stable `,(0,p.jsx)(t.code,{children:`id`}),` keys and a child renderer. `,(0,p.jsx)(t.code,{children:`emptyContent`}),` defaults to `,(0,p.jsx)(t.code,{children:`'No options'`}),`; set it to `,(0,p.jsx)(t.code,{children:`null`}),` only when another explicit status part communicates the state. The component does not fetch, debounce, cancel, or cache data.`]}),`
`,(0,p.jsx)(t.h2,{id:`states-and-size`,children:`States and size`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents input, focus, and selection. `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves immutable controlled text/selection. `,(0,p.jsx)(t.code,{children:`invalid`}),`, `,(0,p.jsx)(t.code,{children:`required`}),`, `,(0,p.jsx)(t.code,{children:`Description`}),`, and `,(0,p.jsx)(t.code,{children:`Error`}),` provide field validation. Use `,(0,p.jsx)(t.code,{children:`Loading`}),` while options are pending and `,(0,p.jsx)(t.code,{children:`OptionsError`}),` when loading fails; keep stale options only if product behaviour makes that explicit.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Group`}),` applies `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),` (default), or `,(0,p.jsx)(t.code,{children:`lg`}),` to the input and trigger. Standalone `,(0,p.jsx)(t.code,{children:`Input`}),` and `,(0,p.jsx)(t.code,{children:`Trigger`}),` also accept size, but the containing group takes precedence.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab focuses the input, then the trigger. Arrow Down opens the popup and moves through options; Escape closes it.`}),`
`,(0,p.jsxs)(t.li,{children:[`Enter selects the highlighted option. In free-form mode only, Enter with no active option invokes `,(0,p.jsx)(t.code,{children:`onCommit`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Typeahead/filtering uses option `,(0,p.jsx)(t.code,{children:`textValue`}),`; provide literal plain text for visual or complex option content.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Always provide `,(0,p.jsx)(t.code,{children:`Label`}),`. Loading is announced politely; loading failure is announced assertively. Avoid duplicating those messages in another live region.`]}),`
`,(0,p.jsx)(t.li,{children:`The popup follows surrounding direction. Keep keys locale-independent; translate visible text, empty content, and status messages.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not enable custom values merely to permit temporary filter text, conflate `,(0,p.jsx)(t.code,{children:`inputValue`}),` with the selected key, use unstable item IDs, fetch data inside render, or show `,(0,p.jsx)(t.code,{children:`OptionsError`}),` for ordinary field validation. Use `,(0,p.jsx)(t.code,{children:`Select`}),` for compact known options, `,(0,p.jsx)(t.code,{children:`SearchField`}),` for search results, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for persistent collection selection.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};