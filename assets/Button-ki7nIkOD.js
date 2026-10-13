import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Activation as c,Danger as l,Disabled as u,Loading as d,LongLabel as f,Primary as p,Quiet as m,RowAction as h,Secondary as g,TreatmentsAndSizes as _,WithIcon as v,n as y,t as b}from"./Button.stories-DCvbbvo6.js";function x(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(o,{of:b,summary:`Performs an action or submits a form.`}),`
`,(0,C.jsx)(t.h1,{id:`button`,children:`Button`}),`
`,(0,C.jsx)(t.p,{children:`Buttons let users perform an action, such as saving a record or submitting a form.`}),`
`,(0,C.jsx)(t.h2,{id:`basic-button`,children:`Basic button`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`Button`}),` comes with four variants: `,(0,C.jsx)(t.code,{children:`primary`}),` (default), `,(0,C.jsx)(t.code,{children:`secondary`}),`, `,(0,C.jsx)(t.code,{children:`quiet`}),` and `,(0,C.jsx)(t.code,{children:`danger`}),`. The `,(0,C.jsx)(t.code,{children:`children`}),` prop sets the visible label.`]}),`
`,(0,C.jsx)(a,{of:p}),`
`,(0,C.jsx)(t.h2,{id:`secondary-button`,children:`Secondary button`}),`
`,(0,C.jsx)(t.p,{children:`Secondary buttons are neutral alternatives to the primary action, such as cancelling.`}),`
`,(0,C.jsx)(a,{of:g}),`
`,(0,C.jsx)(t.h2,{id:`quiet-button`,children:`Quiet button`}),`
`,(0,C.jsxs)(t.p,{children:[`Quiet buttons are 13px text actions with no border, fill or control height, for actions that sit alongside content, such as Mark all as read in a panel header or Download on a row. They have one size and do not accept `,(0,C.jsx)(t.code,{children:`size`}),`. Use a `,(0,C.jsx)(t.code,{children:`Link`}),` when the action navigates.`]}),`
`,(0,C.jsx)(a,{of:m}),`
`,(0,C.jsx)(a,{of:h}),`
`,(0,C.jsx)(t.h2,{id:`danger-button`,children:`Danger button`}),`
`,(0,C.jsx)(t.p,{children:`Danger buttons are destructive actions. Use a label that states what will be removed.`}),`
`,(0,C.jsx)(a,{of:l}),`
`,(0,C.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`size`}),` accepts `,(0,C.jsx)(t.code,{children:`sm`}),`, `,(0,C.jsx)(t.code,{children:`md`}),` (default) and `,(0,C.jsx)(t.code,{children:`lg`}),`, with minimum heights of 32, 36 and 52px. Small labels are 12px and the others 13px, all semibold. Sizes apply to the `,(0,C.jsx)(t.code,{children:`primary`}),`, `,(0,C.jsx)(t.code,{children:`secondary`}),` and `,(0,C.jsx)(t.code,{children:`danger`}),` treatments.`]}),`
`,(0,C.jsx)(a,{of:_}),`
`,(0,C.jsx)(t.p,{children:`Labels wrap and increase the height of the button:`}),`
`,(0,C.jsx)(a,{of:f}),`
`,(0,C.jsx)(t.h2,{id:`icon`,children:`Icon`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`icon`}),` places a Breeze icon 8px before the label, in every variant and size: 15px at `,(0,C.jsx)(t.code,{children:`size="sm"`}),`, and 16px at `,(0,C.jsx)(t.code,{children:`md`}),` and `,(0,C.jsx)(t.code,{children:`lg`}),`. The icon is decorative, so the label remains the accessible name. While loading, the icon is hidden with the label.`]}),`
`,(0,C.jsx)(a,{of:v}),`
`,(0,C.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,C.jsxs)(t.p,{children:[`Set `,(0,C.jsx)(t.code,{children:`loading`}),` while the action is in progress. The label is replaced by a skeleton, and the button cannot be activated again.`]}),`
`,(0,C.jsx)(a,{of:d}),`
`,(0,C.jsx)(t.h2,{id:`disabled`,children:`Disabled`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`disabled`}),` prevents activation and removes the button from the tab order.`]}),`
`,(0,C.jsx)(a,{of:u}),`
`,(0,C.jsx)(t.h2,{id:`handling-actions`,children:`Handling actions`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`onAction`}),` is called when the button is activated, and takes no arguments.`]}),`
`,(0,C.jsx)(a,{of:c}),`
`,(0,C.jsx)(t.h2,{id:`form-submission`,children:`Form submission`}),`
`,(0,C.jsxs)(t.p,{children:[`Use `,(0,C.jsx)(t.code,{children:`type="submit"`}),` to submit the containing form, and handle submission on the form. The default is `,(0,C.jsx)(t.code,{children:`type="button"`}),`. The `,(0,C.jsx)(t.code,{children:`form`}),`, `,(0,C.jsx)(t.code,{children:`name`}),` and `,(0,C.jsx)(t.code,{children:`value`}),` props are available for form association.`]}),`
`,(0,C.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,C.jsxs)(t.p,{children:[`The label provides the accessible name and is retained while the button is loading. Buttons receive a 44px minimum target on touch devices. Quiet buttons receive a 44px minimum height instead, on touch devices and below the `,(0,C.jsx)(t.code,{children:`md`}),` breakpoint. `,(0,C.jsx)(t.code,{children:`aria-label`}),`, `,(0,C.jsx)(t.code,{children:`aria-labelledby`}),`, `,(0,C.jsx)(t.code,{children:`aria-describedby`}),`, `,(0,C.jsx)(t.code,{children:`aria-controls`}),`, `,(0,C.jsx)(t.code,{children:`aria-expanded`}),` and `,(0,C.jsx)(t.code,{children:`aria-haspopup`}),` are supported.`]}),`
`,(0,C.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,C.jsx)(i,{})]})}function S(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,C.jsx)(t,{...e,children:(0,C.jsx)(x,{...e})}):x(e)}var C;e((()=>{C=t(),s(),r(),y()}))();export{S as default};