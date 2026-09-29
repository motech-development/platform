import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-Dpx6kCAy.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,Disabled as u,Error as d,Loading as f,n as p,t as m}from"./DatePicker.stories-BzFH4nFP.js";function h(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:m,summary:`A required date field with an ISO value and localized trigger.`}),`
`,(0,_.jsx)(t.h1,{id:`datepicker`,children:`DatePicker`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`DatePicker`}),` opens a calendar from a button showing the selected date in the
provider locale's long form. The calendar glyph stays at the far edge of the
trigger. The value and callback use ISO `,(0,_.jsx)(t.code,{children:`YYYY-MM-DD`}),` strings.`]}),`
`,(0,_.jsxs)(t.p,{children:[`When the field is empty, `,(0,_.jsx)(t.code,{children:`placeholder`}),` overrides the provider's `,(0,_.jsx)(t.code,{children:`selectDate`}),`
message. Without either override, the English fallback is marked `,(0,_.jsx)(t.code,{children:`en-GB`}),` for
assistive technology. `,(0,_.jsx)(t.code,{children:`loading`}),` replaces the label, trigger and supporting text
with shape-preserving skeletons, announces the provider loading message, and
disables interaction and form submission until loading clears. The selected
value is retained.`]}),`
`,(0,_.jsx)(a,{of:l}),`
`,(0,_.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,_.jsxs)(t.p,{children:[`Use `,(0,_.jsx)(t.code,{children:`error`}),` to display validation feedback and `,(0,_.jsx)(t.code,{children:`disabled`}),` to prevent interaction.
Use `,(0,_.jsx)(t.code,{children:`loading`}),` while the field's date is unavailable; errors are hidden and an
open calendar closes while loading. The field is required by default and does
not provide a clear control.`]}),`
`,(0,_.jsx)(a,{of:d}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,_.jsxs)(t.p,{children:[`Provide both `,(0,_.jsx)(t.code,{children:`value`}),` and `,(0,_.jsx)(t.code,{children:`onChange`}),` for controlled usage. Set `,(0,_.jsx)(t.code,{children:`value`}),` to `,(0,_.jsx)(t.code,{children:`null`}),`
for an empty controlled selection. Use `,(0,_.jsx)(t.code,{children:`defaultValue`}),` and an optional `,(0,_.jsx)(t.code,{children:`onChange`}),`
for uncontrolled usage; the two forms cannot be mixed. An uncontrolled date
returns to `,(0,_.jsx)(t.code,{children:`defaultValue`}),` when its owning form resets. With a `,(0,_.jsx)(t.code,{children:`name`}),`, the
selected ISO date is included in form submission; an empty value submits an
empty string. Override the provider's `,(0,_.jsx)(t.code,{children:`required`}),` message to localize the
required announcement.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,_.jsx)(t.p,{children:`The visible label names the trigger, which exposes required and invalid state.
The calendar supports keyboard navigation and localized date names. Coarse-pointer
targets have a minimum 44px width and height.`}),`
`,(0,_.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,_.jsx)(i,{})]})}function g(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(h,{...e})}):h(e)}var _;e((()=>{_=t(),s(),r(),p()}))();export{g as default};