import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BudqKi8b.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,n as l,t as u}from"./Dialog.stories-Bt-kTLXp.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Opens a modal surface for a focused task.`}),`
`,(0,p.jsx)(t.h1,{id:`dialog`,children:`Dialog`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Dialog`}),` for a focused task that needs a centred modal surface and temporarily takes priority over the surrounding page. It remains part of Breeze's public component inventory. Render it inside `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`trigger`}),` supplies the label for the button Breeze renders. `,(0,p.jsx)(t.code,{children:`title`}),` supplies the surface's visible heading and accessible name; `,(0,p.jsx)(t.code,{children:`children`}),` supplies its content. Breeze also renders a close button with a label from the provider's messages.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Dialog title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Dialog>
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`open-state`,children:`Open state`}),`
`,(0,p.jsxs)(t.p,{children:[`By default, the component manages its own open state. Set `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` to start open, and optionally use `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` to observe changes.`]}),`
`,(0,p.jsxs)(t.p,{children:[`To control the surface from application state, supply both `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` are mutually exclusive.`]}),`
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
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`dismissible`}),` defaults to `,(0,p.jsx)(t.code,{children:`true`}),`, allowing Escape and interaction outside the surface to dismiss it. Set it to `,(0,p.jsx)(t.code,{children:`false`}),` when those interactions should leave the surface open. The close button remains available.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-motion`,children:`Accessibility and motion`}),`
`,(0,p.jsx)(t.p,{children:`Breeze manages focus on opening and restores it on closing. Modal surfaces contain keyboard focus while open. The provider's portal host keeps the surface's locale, direction and scoped styles intact.`}),`
`,(0,p.jsx)(t.p,{children:`Enter and exit motion respects reduced-motion preferences. A closing surface immediately leaves the active stack while its exit animation completes.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};