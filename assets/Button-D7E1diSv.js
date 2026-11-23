import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Activation as c,Danger as l,Disabled as u,Loading as d,LongLabel as f,Primary as p,Quiet as m,RowAction as h,Secondary as g,TreatmentsAndSizes as _,WithIcon as v,n as y,t as b}from"./Button.stories-KbgqvfPU.js";function x(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(o,{of:b,summary:`Performs an action or submits a form.`}),`
`,(0,C.jsx)(t.h1,{id:`button`,children:`Button`}),`
`,(0,C.jsx)(t.p,{children:`Buttons let people perform an action, such as saving a record or submitting a form.`}),`
`,(0,C.jsx)(t.h2,{id:`basic-button`,children:`Basic button`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`Button`}),` has four variants: `,(0,C.jsx)(t.code,{children:`primary`}),` (default), `,(0,C.jsx)(t.code,{children:`secondary`}),`, `,(0,C.jsx)(t.code,{children:`quiet`}),` and `,(0,C.jsx)(t.code,{children:`danger`}),`. `,(0,C.jsx)(t.code,{children:`children`}),` sets the visible label.`]}),`
`,(0,C.jsx)(a,{of:p}),`
`,(0,C.jsx)(t.h2,{id:`secondary-button`,children:`Secondary button`}),`
`,(0,C.jsx)(t.p,{children:`Secondary buttons are neutral alternatives to the primary action, such as cancelling.`}),`
`,(0,C.jsx)(a,{of:g}),`
`,(0,C.jsx)(t.h2,{id:`quiet-button`,children:`Quiet button`}),`
`,(0,C.jsxs)(t.p,{children:[`Quiet buttons are text-only actions with no border or fill, for actions that sit alongside content, such as `,(0,C.jsx)(t.strong,{children:`Mark all as read`}),` in a panel header or `,(0,C.jsx)(t.strong,{children:`Download`}),` on a row. They come in one size and do not accept `,(0,C.jsx)(t.code,{children:`size`}),`. Use a `,(0,C.jsx)(t.code,{children:`Link`}),` instead when the action navigates.`]}),`
`,(0,C.jsx)(a,{of:m}),`
`,(0,C.jsx)(a,{of:h}),`
`,(0,C.jsx)(t.h2,{id:`danger-button`,children:`Danger button`}),`
`,(0,C.jsx)(t.p,{children:`Danger buttons are destructive actions. Use a label that states what will be removed.`}),`
`,(0,C.jsx)(a,{of:l}),`
`,(0,C.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`size`}),` accepts `,(0,C.jsx)(t.code,{children:`sm`}),`, `,(0,C.jsx)(t.code,{children:`md`}),` (default) and `,(0,C.jsx)(t.code,{children:`lg`}),`, with minimum heights of 32, 36 and 52px. Small labels are 12px and the others 13px, all semibold. Sizes apply to the `,(0,C.jsx)(t.code,{children:`primary`}),`, `,(0,C.jsx)(t.code,{children:`secondary`}),` and `,(0,C.jsx)(t.code,{children:`danger`}),` variants.`]}),`
`,(0,C.jsx)(a,{of:_}),`
`,(0,C.jsx)(t.p,{children:`Labels wrap and increase the height of the button:`}),`
`,(0,C.jsx)(a,{of:f}),`
`,(0,C.jsx)(t.h2,{id:`icon`,children:`Icon`}),`
`,(0,C.jsxs)(t.p,{children:[`Set `,(0,C.jsx)(t.code,{children:`icon`}),` to show a Breeze icon before the label. It works with every variant and size, and is 15px at `,(0,C.jsx)(t.code,{children:`size="sm"`}),` and 16px at `,(0,C.jsx)(t.code,{children:`md`}),` and `,(0,C.jsx)(t.code,{children:`lg`}),`. While loading, the icon is hidden along with the label.`]}),`
`,(0,C.jsx)(a,{of:v}),`
`,(0,C.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,C.jsxs)(t.p,{children:[`Set `,(0,C.jsx)(t.code,{children:`loading`}),` while the action is in progress. A placeholder replaces the label, and the button cannot be activated again until loading ends.`]}),`
`,(0,C.jsx)(a,{of:d}),`
`,(0,C.jsx)(t.h2,{id:`disabled`,children:`Disabled`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`disabled`}),` prevents activation and removes the button from the tab order.`]}),`
`,(0,C.jsx)(a,{of:u}),`
`,(0,C.jsx)(t.h2,{id:`handling-actions`,children:`Handling actions`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`onAction`}),` is called with no arguments when the button is activated by pointer, touch or keyboard.`]}),`
`,(0,C.jsx)(a,{of:c}),`
`,(0,C.jsx)(t.h2,{id:`form-submission`,children:`Form submission`}),`
`,(0,C.jsxs)(t.p,{children:[`Buttons default to `,(0,C.jsx)(t.code,{children:`type="button"`}),`. Set `,(0,C.jsx)(t.code,{children:`type="submit"`}),` to submit the surrounding form, and handle submission on the form. `,(0,C.jsx)(t.code,{children:`form`}),`, `,(0,C.jsx)(t.code,{children:`name`}),` and `,(0,C.jsx)(t.code,{children:`value`}),` are also supported.`]}),`
`,(0,C.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,C.jsxs)(t.ul,{children:[`
`,(0,C.jsx)(t.li,{children:`The label is the button's accessible name, including while it is loading. Icons are decorative.`}),`
`,(0,C.jsx)(t.li,{children:`On touch devices, buttons have a minimum 44px target. Quiet buttons have a minimum 44px height on touch devices and below 901px.`}),`
`,(0,C.jsxs)(t.li,{children:[(0,C.jsx)(t.code,{children:`aria-label`}),`, `,(0,C.jsx)(t.code,{children:`aria-labelledby`}),`, `,(0,C.jsx)(t.code,{children:`aria-describedby`}),`, `,(0,C.jsx)(t.code,{children:`aria-controls`}),`, `,(0,C.jsx)(t.code,{children:`aria-expanded`}),` and `,(0,C.jsx)(t.code,{children:`aria-haspopup`}),` are supported.`]}),`
`]}),`
`,(0,C.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,C.jsx)(i,{})]})}function S(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,C.jsx)(t,{...e,children:(0,C.jsx)(x,{...e})}):x(e)}var C;e((()=>{C=t(),s(),r(),y()}))();export{S as default};