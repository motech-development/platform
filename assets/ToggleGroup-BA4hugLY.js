import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-YQyNu8lI.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,DisabledOption as u,Loading as d,Sizes as f,n as p,t as m}from"./ToggleGroup.stories-Bl2A0OW8.js";function h(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:m,summary:`A single-choice segmented control with accessible pressed options.`}),`
`,(0,_.jsx)(t.h1,{id:`togglegroup`,children:`ToggleGroup`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`ToggleGroup`}),` presents a single choice as connected segments. Each option is a
button with an accessible pressed state. Press the selected option again to
clear the selection.`]}),`
`,(0,_.jsx)(a,{of:l}),`
`,(0,_.jsx)(t.h2,{id:`options`,children:`Options`}),`
`,(0,_.jsxs)(t.p,{children:[`Provide `,(0,_.jsx)(t.code,{children:`items`}),` and a `,(0,_.jsx)(t.code,{children:`getItem`}),` function that describes each option. Return a
unique `,(0,_.jsx)(t.code,{children:`id`}),` and visible `,(0,_.jsx)(t.code,{children:`label`}),`. You can also provide a `,(0,_.jsx)(t.code,{children:`description`}),`, `,(0,_.jsx)(t.code,{children:`icon`}),`,
`,(0,_.jsx)(t.code,{children:`badge`}),` or `,(0,_.jsx)(t.code,{children:`disabled`}),` flag. Disabled options cannot be selected.`]}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(t.h2,{id:`controlled-selection`,children:`Controlled selection`}),`
`,(0,_.jsxs)(t.p,{children:[`Use `,(0,_.jsx)(t.code,{children:`defaultSelected`}),` with an optional `,(0,_.jsx)(t.code,{children:`onChange`}),` for uncontrolled use. Provide
`,(0,_.jsx)(t.code,{children:`selected`}),` and `,(0,_.jsx)(t.code,{children:`onChange`}),` when the application owns state. The callback receives
the selected item, or `,(0,_.jsx)(t.code,{children:`null`}),` when the choice is cleared. Choose one of these
state approaches for each group.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,_.jsxs)(t.p,{children:[`Set `,(0,_.jsx)(t.code,{children:`loading`}),` while saving a selection. A slim loading bar replaces each
option's content while its size and selected appearance stay in place. Changes
resume when loading clears.`]}),`
`,(0,_.jsx)(a,{of:d}),`
`,(0,_.jsx)(t.h2,{id:`sizes-and-accessibility`,children:`Sizes and accessibility`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`size`}),` accepts `,(0,_.jsx)(t.code,{children:`sm`}),`, `,(0,_.jsx)(t.code,{children:`md`}),` (default) or `,(0,_.jsx)(t.code,{children:`lg`}),`, with minimum heights of 34, 38 and
52px. Touch targets are at least 44px. Give each group an
`,(0,_.jsx)(t.code,{children:`aria-label`}),`; each option exposes whether it is pressed and supports keyboard
interaction.`]}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,_.jsx)(i,{})]})}function g(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(h,{...e})}):h(e)}var _;e((()=>{_=t(),s(),r(),p()}))();export{g as default};