import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,DiscardChanges as l,n as u,t as d}from"./Dialog.stories-DXzsMY-H.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Opens a modal surface for a focused task.`}),`
`,(0,m.jsx)(t.h1,{id:`dialog`,children:`Dialog`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Dialog`}),` opens a centred modal window for a focused task that takes priority over the rest of the page. Render it inside `,(0,m.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-dialog`,children:`Basic dialog`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`trigger`}),` sets the label of the button that opens the dialog. `,(0,m.jsx)(t.code,{children:`title`}),` sets the dialog's visible heading and accessible name, and `,(0,m.jsx)(t.code,{children:`children`}),` its content. The dialog also includes a close button.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Dialog title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Dialog>
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,m.jsxs)(t.p,{children:[`By default, the dialog manages its own open state. Set `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` to start it open, and use `,(0,m.jsx)(t.code,{children:`onOpenChange`}),` to respond to changes.`]}),`
`,(0,m.jsxs)(t.p,{children:[`To control the dialog from your application state, pass both `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` cannot be combined.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Dialog
  onOpenChange={setOpen}
  open={open}
  title="Delivery details"
  trigger="View delivery details"
>
  <Typography>Your delivery details appear here.</Typography>
</Dialog>
`})}),`
`,(0,m.jsx)(t.h2,{id:`opening-from-your-own-control`,children:`Opening from your own control`}),`
`,(0,m.jsxs)(t.p,{children:[`To open the dialog from application state, omit `,(0,m.jsx)(t.code,{children:`trigger`}),` and pass `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`onOpenChange`}),`. The dialog then renders no button of its own. A dialog without a trigger must be controlled.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Use this to confirm before a drawer closes. Keep the drawer's `,(0,m.jsx)(t.code,{children:`open`}),` state `,(0,m.jsx)(t.code,{children:`true`}),` when it reports `,(0,m.jsx)(t.code,{children:`onOpenChange(false)`}),`, open a dialog inside it instead, and close both only when the person confirms.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Drawer
  onOpenChange={(open) => setConfirming(!open)}
  open={sheetOpen}
  title="Northwind Supplies"
>
  <TextField label="Description" />
  <Dialog
    onOpenChange={setConfirming}
    open={confirming}
    title="Discard changes?"
  >
    <Button onAction={() => setConfirming(false)} variant="secondary">
      Keep editing
    </Button>
    <Button onAction={discard} variant="danger">
      Discard
    </Button>
  </Dialog>
</Drawer>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`dismissal`,children:`Dismissal`}),`
`,(0,m.jsxs)(t.p,{children:[`By default, pressing Escape or clicking outside the dialog closes it. Set `,(0,m.jsx)(t.code,{children:`dismissible={false}`}),` to keep it open in those cases; the close button still works.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[`Focus moves into the dialog when it opens, stays inside it while open, and returns to the control that opened it when it closes. If nothing was focused when it opened, or that control has since been removed, focus moves to the overlay it was opened in, if any, and otherwise to the page's `,(0,m.jsx)(t.code,{children:`main`}),` landmark if it can take focus, as the skip-link target in `,(0,m.jsx)(t.code,{children:`ApplicationShell`}),` can.`]}),`
`,(0,m.jsx)(t.li,{children:`The close button's accessible name comes from the provider's messages.`}),`
`,(0,m.jsx)(t.li,{children:`The dialog keeps the provider's locale and text direction.`}),`
`,(0,m.jsx)(t.li,{children:`Opening and closing animations respect the reduced-motion preference.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};