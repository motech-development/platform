import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,DisabledOption as u,FullWidth as d,Loading as f,Sizes as p,n as m,t as h}from"./ToggleGroup.stories-BPbnyxXK.js";function g(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{of:h,summary:`A single-choice segmented control with accessible pressed options.`}),`
`,(0,v.jsx)(t.h1,{id:`togglegroup`,children:`ToggleGroup`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`ToggleGroup`}),` is a segmented control: a row of connected buttons from which
people choose one option, such as a time period. Pressing the selected option
again clears the selection.`]}),`
`,(0,v.jsx)(a,{of:l}),`
`,(0,v.jsx)(t.h2,{id:`options`,children:`Options`}),`
`,(0,v.jsxs)(t.p,{children:[`Pass your data as `,(0,v.jsx)(t.code,{children:`items`}),` and a `,(0,v.jsx)(t.code,{children:`getItem`}),` function that describes each option.
Return a unique `,(0,v.jsx)(t.code,{children:`id`}),` and a visible `,(0,v.jsx)(t.code,{children:`label`}),`, and optionally a `,(0,v.jsx)(t.code,{children:`description`}),`,
`,(0,v.jsx)(t.code,{children:`icon`}),`, `,(0,v.jsx)(t.code,{children:`badge`}),` or `,(0,v.jsx)(t.code,{children:`disabled`}),` flag. Disabled options cannot be selected.`]}),`
`,(0,v.jsx)(a,{of:u}),`
`,(0,v.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,v.jsxs)(t.p,{children:[`For an uncontrolled group, pass `,(0,v.jsx)(t.code,{children:`defaultSelected`}),` and optionally `,(0,v.jsx)(t.code,{children:`onChange`}),`. To
control the selection from your own state, pass both `,(0,v.jsx)(t.code,{children:`selected`}),` and
`,(0,v.jsx)(t.code,{children:`onChange`}),`. `,(0,v.jsx)(t.code,{children:`onChange`}),` receives the selected item from `,(0,v.jsx)(t.code,{children:`items`}),`, or `,(0,v.jsx)(t.code,{children:`null`}),` when
the choice is cleared. Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,v.jsx)(a,{of:c}),`
`,(0,v.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,v.jsxs)(t.p,{children:[`Set `,(0,v.jsx)(t.code,{children:`loading`}),` while saving a selection. A slim loading bar replaces each
option's content, while the options keep their size and the selected option
stays highlighted. The selection cannot be changed until loading ends.`]}),`
`,(0,v.jsx)(a,{of:f}),`
`,(0,v.jsx)(t.h2,{id:`full-width`,children:`Full width`}),`
`,(0,v.jsxs)(t.p,{children:[`Set `,(0,v.jsx)(t.code,{children:`fullWidth`}),` to stretch the group across its container, sharing the width
equally between options, for example in a form.`]}),`
`,(0,v.jsx)(a,{of:d}),`
`,(0,v.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`size`}),` accepts `,(0,v.jsx)(t.code,{children:`sm`}),` (default), `,(0,v.jsx)(t.code,{children:`md`}),` or `,(0,v.jsx)(t.code,{children:`lg`}),`, giving the group a minimum height
of 34, 38 or 52px to line up with other controls of the same size. On touch
devices, every option is at least 44px tall, so `,(0,v.jsx)(t.code,{children:`sm`}),` and `,(0,v.jsx)(t.code,{children:`md`}),` groups grow to
50px.`]}),`
`,(0,v.jsx)(a,{of:p}),`
`,(0,v.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,v.jsxs)(t.p,{children:[`Give each group an `,(0,v.jsx)(t.code,{children:`aria-label`}),` that describes the choice. Screen readers
announce whether each option is pressed, and options can be chosen with the
keyboard.`]}),`
`,(0,v.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,v.jsx)(i,{})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;e((()=>{v=t(),s(),r(),m()}))();export{_ as default};