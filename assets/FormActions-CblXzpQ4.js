import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{CompleteSet as c,n as l,t as u}from"./FormActions.stories-bp-dtXyg.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Canonical responsive form-action region that keeps primary, back, cancel, secondary and destructive responsibilities in a consistent compact and wide visual order.`}),`
`,(0,p.jsx)(t.h1,{id:`formactions`,children:`FormActions`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FormActions`}),` places primary and supporting form actions in a consistent responsive priority order.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, FormActions } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormActions`}),` at the end of a form or form-like task when primary, cancel, back, secondary or destructive actions need the canonical compact and wide arrangement.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` for a general related action set whose order you control directly. Use `,(0,p.jsx)(t.code,{children:`Toolbar`}),` for a command collection with arrow-key navigation. FormActions does not submit, reset, navigate, confirm destructive work or manage form state; the supplied actions own those behaviours.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, FormActions } from '@motech-development/breeze-ui';

<form onSubmit={saveItem}>
  {/* Labelled form fields */}
  <FormActions
    aria-label="Form actions"
    cancel={
      <Button appearance="outline" onAction={cancelEditing}>
        Cancel
      </Button>
    }
    danger={
      <Button variant="danger" onAction={requestRemoval}>
        Delete item
      </Button>
    }
    primary={<Button type="submit">Save changes</Button>}
  />
</form>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-ordering`,children:`Anatomy and ordering`}),`
`,(0,p.jsx)(t.p,{children:`FormActions exposes named action slots rather than public compound parts.`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Slot`}),(0,p.jsx)(t.th,{children:`Purpose`}),(0,p.jsx)(t.th,{children:`Compact visual position`}),(0,p.jsx)(t.th,{children:`Wide position`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`primary`})}),(0,p.jsx)(t.td,{children:`Required submit or continuation action`}),(0,p.jsx)(t.td,{children:`First`}),(0,p.jsx)(t.td,{children:`Trailing edge`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`back`})}),(0,p.jsx)(t.td,{children:`Move to the preceding step`}),(0,p.jsx)(t.td,{children:`After primary`}),(0,p.jsx)(t.td,{children:`Leading edge`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`cancel`})}),(0,p.jsx)(t.td,{children:`Abandon or leave the task`}),(0,p.jsx)(t.td,{children:`After back`}),(0,p.jsx)(t.td,{children:`Start of trailing group`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`secondary`})}),(0,p.jsx)(t.td,{children:`Additional non-primary action`}),(0,p.jsx)(t.td,{children:`After cancel`}),(0,p.jsx)(t.td,{children:`Before primary in the trailing group`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`danger`})}),(0,p.jsx)(t.td,{children:`Destructive action`}),(0,p.jsx)(t.td,{children:`Last`}),(0,p.jsx)(t.td,{children:`Leading edge`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`Source order remains danger, back, cancel, secondary, primary; compact CSS changes only the visual order. Tab navigation and assistive technology follow source order, so labels and task context must make priority clear without relying on position alone. Omit unused slots rather than rendering empty wrappers.`}),`
`,(0,p.jsx)(t.h2,{id:`layout-state-and-callbacks`,children:`Layout, state and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`divided`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`. Set it to add the canonical top separator and larger spacing when the action region needs a clear boundary from the preceding fields. The root uses an automatic block-start margin, so it can anchor to the bottom of a parent column that has available height.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Action slots accept `,(0,p.jsx)(t.code,{children:`ReactNode`}),`, normally public `,(0,p.jsx)(t.code,{children:`Button`}),` or `,(0,p.jsx)(t.code,{children:`LinkButton`}),` components. Configure `,(0,p.jsx)(t.code,{children:`type="submit"`}),`, `,(0,p.jsx)(t.code,{children:`onAction`}),`, `,(0,p.jsx)(t.code,{children:`href`}),`, `,(0,p.jsx)(t.code,{children:`disabled`}),`, `,(0,p.jsx)(t.code,{children:`loading`}),`, confirmation and accessible names on those controls. FormActions has no controlled, uncontrolled, read-only, loading, invalid, empty or error state of its own. Form submission, pending state, validation, server errors and navigation remain application-owned.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-internationalisation-and-routing`,children:`Accessibility, keyboard, internationalisation and routing`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Passing `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),` gives the root `,(0,p.jsx)(t.code,{children:`role="group"`}),`. Without an accessible name the root remains a layout `,(0,p.jsx)(t.code,{children:`div`}),` with no group role.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use one clear primary action. Give destructive actions precise labels and route consequential operations through `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),` when confirmation is warranted.`]}),`
`,(0,p.jsxs)(t.li,{children:[`FormActions adds no keyboard model. Tab follows DOM order; Enter and Space behaviour belongs to each button. Native form submission belongs to a child `,(0,p.jsx)(t.code,{children:`Button type="submit"`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Labels are application-owned, translated copy. The wide layout uses logical leading and trailing edges and inherits provider direction.`}),`
`,(0,p.jsxs)(t.li,{children:[`Link actions own their `,(0,p.jsx)(t.code,{children:`href`}),` and provider router behaviour. FormActions neither selects a route nor intercepts navigation.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not manually rearrange slots at breakpoints, make two actions look primary, assume visual and Tab order match, attach submission to the root, or pass plain click handlers when a child supports semantic `,(0,p.jsx)(t.code,{children:`onAction`}),`. Use `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` for freer layout, `,(0,p.jsx)(t.code,{children:`FormSection`}),` for titled field regions, and `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),` for consequential action confirmation.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};