import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,EditTransaction as l,RecordTransaction as u,n as d,t as f}from"./Drawer.stories-Ccx1mz2T.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Opens a modal surface from the edge of the page.`}),`
`,(0,h.jsx)(t.h1,{id:`drawer`,children:`Drawer`}),`
`,(0,h.jsxs)(t.p,{children:[`Use `,(0,h.jsx)(t.code,{children:`Drawer`}),` for a task or supporting content that needs a modal surface at the edge of the page. Render it inside `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,h.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`trigger`}),` supplies the label for the button Breeze renders. `,(0,h.jsx)(t.code,{children:`title`}),` supplies the surface's visible heading and accessible name; `,(0,h.jsx)(t.code,{children:`children`}),` supplies its content. Breeze also renders an icon close button whose accessible name comes from the provider's messages.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`<Drawer title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Drawer>
`})}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`content-and-footer`,children:`Content and footer`}),`
`,(0,h.jsx)(t.p,{children:`The content scrolls on its own between the heading bar and the footer. Three props fill a footer pinned below it, which renders only when at least one is given:`}),`
`,(0,h.jsxs)(t.ul,{children:[`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`footerStart`}),` places an action at the start, such as Delete on an edit form.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`footerSummary`}),` shows a short muted line that takes the free width and truncates.`]}),`
`,(0,h.jsxs)(t.li,{children:[(0,h.jsx)(t.code,{children:`footerActions`}),` places the actions at the end, such as Cancel and Save.`]}),`
`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`<Drawer
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
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.p,{children:`When the footer runs out of room, its actions wrap onto their own line and stay at the end. Below 768px the summary keeps its full text and moves the actions to the next line, truncating only when it is wider than the footer.`}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.p,{children:`Below the medium breakpoint the drawer fills the screen and rises from the bottom.`}),`
`,(0,h.jsx)(t.h2,{id:`open-state`,children:`Open state`}),`
`,(0,h.jsxs)(t.p,{children:[`By default, the component manages its own open state. Set `,(0,h.jsx)(t.code,{children:`defaultOpen`}),` to start open, and optionally use `,(0,h.jsx)(t.code,{children:`onOpenChange`}),` to observe changes.`]}),`
`,(0,h.jsxs)(t.p,{children:[`To control the surface from application state, supply both `,(0,h.jsx)(t.code,{children:`open`}),` and `,(0,h.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,h.jsx)(t.code,{children:`open`}),` and `,(0,h.jsx)(t.code,{children:`defaultOpen`}),` are mutually exclusive.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`<Drawer
  onOpenChange={setOpen}
  open={open}
  title="Delivery details"
  trigger="View delivery details"
>
  <Typography>Your delivery details appear here.</Typography>
</Drawer>
`})}),`
`,(0,h.jsx)(t.h2,{id:`dismissal`,children:`Dismissal`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`dismissible`}),` defaults to `,(0,h.jsx)(t.code,{children:`true`}),`, allowing Escape and interaction outside the surface to dismiss it. Set it to `,(0,h.jsx)(t.code,{children:`false`}),` when those interactions should leave the surface open. The close button remains available.`]}),`
`,(0,h.jsx)(t.h2,{id:`surfaces-above-a-sheet`,children:`Surfaces above a sheet`}),`
`,(0,h.jsxs)(t.p,{children:[`A `,(0,h.jsx)(t.code,{children:`Popover`}),` can open above the drawer without blocking interaction with the sheet or hiding its content from assistive technology. The drawer keeps its scrim, and Escape dismisses the popover before the sheet.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`DocumentViewer`}),` opens a non-modal full-screen surface above the drawer. It covers the sheet while keeping it mounted and preserving its scrim. Because the surface is not modal, the covered sheet stays available to assistive technology, while Tab and Shift+Tab stay inside the full-screen surface. Escape closes the full-screen surface before the sheet and restores focus to its opener in the sheet.`]}),`
`,(0,h.jsxs)(t.p,{children:[`The `,(0,h.jsx)(t.code,{children:`Foundations/Overlay stack`}),` stories cover sheet/popover and sheet/full-screen compositions, including closing the outer sheet first and starting with nested surfaces open.`]}),`
`,(0,h.jsx)(t.h2,{id:`accessibility-and-motion`,children:`Accessibility and motion`}),`
`,(0,h.jsx)(t.p,{children:`Breeze manages focus on opening and restores it on closing. Modal surfaces contain keyboard focus while open. The provider's portal host keeps the surface's locale, direction and scoped styles intact.`}),`
`,(0,h.jsx)(t.p,{children:`Enter and exit motion respects reduced-motion preferences. A closing surface immediately leaves the active stack while its exit animation completes.`}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};