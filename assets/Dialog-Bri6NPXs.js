import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,n as l,t as u}from"./Dialog.stories-Bd8EPn9l.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Opens a modal surface for a focused task.`}),`
`,(0,p.jsx)(t.h1,{id:`dialog`,children:`Dialog`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Dialog`}),` opens a centred modal window for a focused task that takes priority over the rest of the page. Render it inside `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-dialog`,children:`Basic dialog`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`trigger`}),` sets the label of the button that opens the dialog. `,(0,p.jsx)(t.code,{children:`title`}),` sets the dialog's visible heading and accessible name, and `,(0,p.jsx)(t.code,{children:`children`}),` its content. The dialog also includes a close button.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Dialog title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Dialog>
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,p.jsxs)(t.p,{children:[`By default, the dialog manages its own open state. Set `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` to start it open, and use `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` to respond to changes.`]}),`
`,(0,p.jsxs)(t.p,{children:[`To control the dialog from your application state, pass both `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` cannot be combined.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Dialog
  onOpenChange={setOpen}
  open={open}
  title="Delivery details"
  trigger="View delivery details"
>
  <Typography>Your delivery details appear here.</Typography>
</Dialog>
`})}),`
`,(0,p.jsx)(t.h2,{id:`dismissal`,children:`Dismissal`}),`
`,(0,p.jsxs)(t.p,{children:[`By default, pressing Escape or clicking outside the dialog closes it. Set `,(0,p.jsx)(t.code,{children:`dismissible={false}`}),` to keep it open in those cases; the close button still works.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Focus moves into the dialog when it opens, stays inside it while open, and is restored when it closes.`}),`
`,(0,p.jsx)(t.li,{children:`The close button's accessible name comes from the provider's messages.`}),`
`,(0,p.jsx)(t.li,{children:`The dialog keeps the provider's locale and text direction.`}),`
`,(0,p.jsx)(t.li,{children:`Opening and closing animations respect the reduced-motion preference.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};