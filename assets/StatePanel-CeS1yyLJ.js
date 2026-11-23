import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{CustomIcon as c,Empty as l,EmptyWithAction as u,Error as d,ErrorWithRecovery as f,n as p,t as m}from"./StatePanel.stories-N2mm6eX0.js";function h(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:m,summary:`Presents an empty or error state as a labelled section with one optional action.`}),`
`,(0,_.jsx)(t.h1,{id:`statepanel`,children:`StatePanel`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`StatePanel`}),` explains why there is no content to show, either because there is nothing yet or because loading it failed. Pass a `,(0,_.jsx)(t.code,{children:`title`}),`, a `,(0,_.jsx)(t.code,{children:`description`}),` and a `,(0,_.jsx)(t.code,{children:`variant`}),` of `,(0,_.jsx)(t.code,{children:`empty`}),` or `,(0,_.jsx)(t.code,{children:`error`}),`, with an optional action.`]}),`
`,(0,_.jsx)(t.h2,{id:`empty-states`,children:`Empty states`}),`
`,(0,_.jsxs)(t.p,{children:[`Use `,(0,_.jsx)(t.code,{children:`variant="empty"`}),` when there is no content yet. Add an `,(0,_.jsx)(t.code,{children:`action`}),`, such as creating the first item, when there is an obvious next step.`]}),`
`,(0,_.jsx)(a,{of:l}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(t.p,{children:`If the panel shows the page's primary action, leave that action out of the page header so it does not appear twice.`}),`
`,(0,_.jsx)(t.h2,{id:`error-states`,children:`Error states`}),`
`,(0,_.jsxs)(t.p,{children:[`Use `,(0,_.jsx)(t.code,{children:`variant="error"`}),` when content could not be loaded. To let people retry, pass an `,(0,_.jsx)(t.code,{children:`action`}),` whose `,(0,_.jsx)(t.code,{children:`onAction`}),` performs the recovery.`]}),`
`,(0,_.jsx)(a,{of:d}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(t.h2,{id:`icon`,children:`Icon`}),`
`,(0,_.jsxs)(t.p,{children:[`Empty states show a document icon in the brand colour, and error states a warning icon in the danger colour. Set `,(0,_.jsx)(t.code,{children:`icon`}),` to another Breeze icon when it better describes the content.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,_.jsx)(t.p,{children:`The panel is a section labelled by its title. It is not a live region, so when it replaces content dynamically, announce the change yourself if people need to hear it.`}),`
`,(0,_.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,_.jsx)(i,{of:l})]})}function g(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(h,{...e})}):h(e)}var _;e((()=>{_=t(),s(),r(),p()}))();export{g as default};