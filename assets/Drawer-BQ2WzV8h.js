import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,EditTransaction as l,FromApplicationState as u,RecordTransaction as d,n as f,t as p}from"./Drawer.stories-HOwVWyGE.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(o,{of:p,summary:`Opens a modal surface from the edge of the page.`}),`
`,(0,g.jsx)(t.h1,{id:`drawer`,children:`Drawer`}),`
`,(0,g.jsx)(t.p,{children:`A drawer is a modal panel that slides in from the edge of the page. Use it for a focused task, such as recording a transaction, or for supporting content that should not replace the current page.`}),`
`,(0,g.jsx)(t.h2,{id:`basic-drawer`,children:`Basic drawer`}),`
`,(0,g.jsxs)(t.p,{children:[`Pass `,(0,g.jsx)(t.code,{children:`trigger`}),` as the label of the button that opens the drawer, `,(0,g.jsx)(t.code,{children:`title`}),` as its heading and `,(0,g.jsx)(t.code,{children:`children`}),` as its content. The drawer includes a close button, labelled with the provider's messages.`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<Drawer title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Drawer>
`})}),`
`,(0,g.jsx)(a,{of:c}),`
`,(0,g.jsx)(t.h2,{id:`content-and-footer`,children:`Content and footer`}),`
`,(0,g.jsx)(t.p,{children:`The content scrolls independently between the heading and the footer. The footer stays pinned to the bottom and appears only when you pass at least one of these props:`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`footerStart`}),` places an action at the start, such as Delete on an edit form.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`footerSummary`}),` shows a short muted line that takes the free width and truncates.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`footerActions`}),` places the actions at the end, such as Cancel and Save.`]}),`
`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<Drawer
  footerActions={
    <>
      <Button onAction={close} variant="secondary">
        Cancel
      </Button>
      <Button onAction={save}>Save transaction</Button>
    </>
  }
  footerSummary="Takes £139.00 off the balance now"
  onOpenChange={setOpen}
  open={open}
  title="New transaction"
  trigger="Record transaction"
>
  <TextField label="Name" />
</Drawer>
`})}),`
`,(0,g.jsx)(a,{of:d}),`
`,(0,g.jsx)(t.p,{children:`When the footer runs out of room, the actions wrap onto their own line and stay at the end. Below 768px, the summary keeps its full text and the actions move to the next line; the summary truncates only when it is wider than the footer.`}),`
`,(0,g.jsx)(a,{of:l}),`
`,(0,g.jsxs)(t.p,{children:[`Below the `,(0,g.jsx)(t.code,{children:`md`}),` breakpoint, the drawer fills the screen and slides up from the bottom.`]}),`
`,(0,g.jsx)(t.h2,{id:`open-state`,children:`Open state`}),`
`,(0,g.jsxs)(t.p,{children:[`By default, the drawer manages its own open state. Set `,(0,g.jsx)(t.code,{children:`defaultOpen`}),` to start open, and use `,(0,g.jsx)(t.code,{children:`onOpenChange`}),` to respond to changes.`]}),`
`,(0,g.jsxs)(t.p,{children:[`To control the drawer from your own state, pass both `,(0,g.jsx)(t.code,{children:`open`}),` and `,(0,g.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,g.jsx)(t.code,{children:`open`}),` and `,(0,g.jsx)(t.code,{children:`defaultOpen`}),` cannot be combined.`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<Drawer
  onOpenChange={setOpen}
  open={open}
  title="Delivery details"
  trigger="View delivery details"
>
  <Typography>Your delivery details appear here.</Typography>
</Drawer>
`})}),`
`,(0,g.jsx)(t.h2,{id:`opening-from-your-own-control`,children:`Opening from your own control`}),`
`,(0,g.jsxs)(t.p,{children:[`To open the drawer from a control it does not own, such as a list row, a page-header button or a route, omit `,(0,g.jsx)(t.code,{children:`trigger`}),` and pass `,(0,g.jsx)(t.code,{children:`open`}),` and `,(0,g.jsx)(t.code,{children:`onOpenChange`}),`. The drawer then renders no button of its own. A drawer without a trigger must be controlled.`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<Button onAction={() => setOpen(true)}>Northwind Supplies</Button>
<Drawer onOpenChange={setOpen} open={open} title="Transaction">
  <Typography>Printer toner and paper, £139.00.</Typography>
</Drawer>
`})}),`
`,(0,g.jsx)(a,{of:u}),`
`,(0,g.jsxs)(t.p,{children:[`Escape, an outside press and the close button call `,(0,g.jsx)(t.code,{children:`onOpenChange(false)`}),`. The drawer stays open until you set `,(0,g.jsx)(t.code,{children:`open`}),` to `,(0,g.jsx)(t.code,{children:`false`}),`, so you can ask the person to confirm first, for example by opening a `,(0,g.jsx)(t.code,{children:`Dialog`}),` to discard unsaved changes.`]}),`
`,(0,g.jsx)(t.h2,{id:`dismissal`,children:`Dismissal`}),`
`,(0,g.jsxs)(t.p,{children:[`By default, pressing Escape or clicking outside the drawer closes it. Set `,(0,g.jsx)(t.code,{children:`dismissible={false}`}),` to keep it open in those cases, for example while a form has unsaved changes. The close button still works.`]}),`
`,(0,g.jsx)(t.h2,{id:`opening-other-overlays-from-a-drawer`,children:`Opening other overlays from a drawer`}),`
`,(0,g.jsxs)(t.p,{children:[`A `,(0,g.jsx)(t.code,{children:`Popover`}),` opened inside a drawer appears above it. The drawer stays interactive and keeps its dimmed backdrop, and Escape closes the popover before the drawer.`]}),`
`,(0,g.jsxs)(t.p,{children:[`A `,(0,g.jsx)(t.code,{children:`DocumentViewer`}),` opened inside a drawer covers it with a full-screen view. The drawer stays open underneath, keeping its state, and remains available to screen readers. Tab and Shift+Tab stay inside the full-screen view, and Escape closes it before the drawer, returning focus to the button that opened it.`]}),`
`,(0,g.jsxs)(t.p,{children:[`See the `,(0,g.jsx)(t.code,{children:`Foundations/Overlay stack`}),` stories for more combinations.`]}),`
`,(0,g.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,g.jsxs)(t.p,{children:[`Opening the drawer moves focus into it, and focus stays inside while it is open. Closing it returns focus to the control that opened it. If nothing was focused when it opened, for example after a deep link, or that control has since been removed, focus moves to the overlay it was opened in, if any, and otherwise to the page's `,(0,g.jsx)(t.code,{children:`main`}),` landmark if it can take focus, as the skip-link target in `,(0,g.jsx)(t.code,{children:`ApplicationShell`}),` can. The drawer's DOM is rendered in a portal, but it stays in your React tree and keeps the provider's locale and text direction.`]}),`
`,(0,g.jsx)(t.p,{children:`The open and close animations respect the user's reduced-motion setting. As soon as a drawer starts to close, the content beneath it becomes interactive again, without waiting for the animation to finish.`}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(i,{})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;e((()=>{g=t(),s(),r(),f()}))();export{h as default};