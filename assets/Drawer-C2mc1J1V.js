import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-C5xEMl4c.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,n as l,t as u}from"./Drawer.stories-DgXTdABu.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Opens a modal surface from the edge of the page.`}),`
`,(0,p.jsx)(t.h1,{id:`drawer`,children:`Drawer`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Drawer`}),` for a task or supporting content that needs a modal surface at the edge of the page. Render it inside `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`trigger`}),` supplies the label for the button Breeze renders. `,(0,p.jsx)(t.code,{children:`title`}),` supplies the surface's visible heading and accessible name; `,(0,p.jsx)(t.code,{children:`children`}),` supplies its content. Breeze also renders a close button with a label from the provider's messages.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Drawer title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Drawer>
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`open-state`,children:`Open state`}),`
`,(0,p.jsxs)(t.p,{children:[`By default, the component manages its own open state. Set `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` to start open, and optionally use `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` to observe changes.`]}),`
`,(0,p.jsxs)(t.p,{children:[`To control the surface from application state, supply both `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` are mutually exclusive.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Drawer
  onOpenChange={setOpen}
  open={open}
  title="Delivery details"
  trigger="View delivery details"
>
  <Typography>Your delivery details appear here.</Typography>
</Drawer>
`})}),`
`,(0,p.jsx)(t.h2,{id:`dismissal`,children:`Dismissal`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`dismissible`}),` defaults to `,(0,p.jsx)(t.code,{children:`true`}),`, allowing Escape and interaction outside the surface to dismiss it. Set it to `,(0,p.jsx)(t.code,{children:`false`}),` when those interactions should leave the surface open. The close button remains available.`]}),`
`,(0,p.jsx)(t.h2,{id:`surfaces-above-a-sheet`,children:`Surfaces above a sheet`}),`
`,(0,p.jsxs)(t.p,{children:[`A `,(0,p.jsx)(t.code,{children:`Popover`}),` can open above the drawer without blocking interaction with the sheet or hiding its content from assistive technology. The drawer keeps its scrim, and Escape dismisses the popover before the sheet.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The internal overlay foundation also supports a full-screen surface for a future `,(0,p.jsx)(t.code,{children:`DocumentViewer`}),`. It covers the sheet while keeping it mounted and preserving its scrim. Escape closes the full-screen surface and restores focus to its trigger in the sheet. This foundation is not an additional public component.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The `,(0,p.jsx)(t.code,{children:`Foundations/Overlay stack`}),` stories cover sheet/popover and sheet/full-screen compositions, including closing the outer sheet first and starting with nested surfaces open.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-motion`,children:`Accessibility and motion`}),`
`,(0,p.jsx)(t.p,{children:`Breeze manages focus on opening and restores it on closing. Modal surfaces contain keyboard focus while open. The provider's portal host keeps the surface's locale, direction and scoped styles intact.`}),`
`,(0,p.jsx)(t.p,{children:`Enter and exit motion respects reduced-motion preferences. A closing surface immediately leaves the active stack while its exit animation completes.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};