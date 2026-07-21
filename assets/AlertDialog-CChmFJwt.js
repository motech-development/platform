import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{ExplicitDecision as c,n as l,t as u}from"./AlertDialog.stories-Bq4jSH8P.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A modal alert requiring an explicit, clearly labelled decision with protected outside dismissal, contained focus, and responsive action placement.`}),`
`,(0,p.jsx)(t.h1,{id:`alertdialog`,children:`AlertDialog`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`AlertDialog`}),` interrupts the user with a consequential decision that requires an explicit response.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { AlertDialog } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it before an irreversible or materially risky action, or when an interruption cannot be ignored. Use `,(0,p.jsx)(t.code,{children:`Dialog`}),` for ordinary modal tasks, `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),` for the standard composed confirmation pattern, `,(0,p.jsx)(t.code,{children:`Alert`}),` for inline feedback, and `,(0,p.jsx)(t.code,{children:`Toast`}),` for non-blocking status.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { AlertDialog } from '@motech-development/breeze-ui';

<AlertDialog.Root>
  <AlertDialog.Trigger variant="danger">Delete item</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Delete this item?</AlertDialog.Title>
    <AlertDialog.Description>
      This action cannot be undone.
    </AlertDialog.Description>
    <AlertDialog.Actions>
      <AlertDialog.Close appearance="outline" autoFocus>
        Cancel
      </AlertDialog.Close>
      <AlertDialog.Close variant="danger" onAction={deleteItem}>
        Delete permanently
      </AlertDialog.Close>
    </AlertDialog.Actions>
  </AlertDialog.Content>
</AlertDialog.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Root`})}),(0,p.jsx)(t.td,{children:`Coordinates open state and trigger focus.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Trigger`})}),(0,p.jsx)(t.td,{children:`Opens the alert dialog.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Content`})}),(0,p.jsxs)(t.td,{children:[`Non-outside-dismissible `,(0,p.jsx)(t.code,{children:`alertdialog`}),` surface and focus scope.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Title`})}),(0,p.jsx)(t.td,{children:`Required concise decision heading and accessible name.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Description`})}),(0,p.jsx)(t.td,{children:`Required consequence explanation and accessible description.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Actions`})}),(0,p.jsx)(t.td,{children:`Responsive group for explicit choices.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AlertDialog.Close`})}),(0,p.jsx)(t.td,{children:`Runs an optional action and closes the alert dialog.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Put every decision in `,(0,p.jsx)(t.code,{children:`Actions`}),`. On compact layouts actions fill the width and visual order places the destructive choice above cancel while DOM and keyboard order remain logical. Put the safest initial focus on Cancel with `,(0,p.jsx)(t.code,{children:`autoFocus`}),`; do not automatically focus a destructive action.`]}),`
`,(0,p.jsx)(t.h2,{id:`state-and-dismissal`,children:`State and dismissal`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultOpen`}),`, controlled `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`, or immutable `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`. `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` receives the complete next Boolean. Outside pointer interaction never dismisses AlertDialog. Escape dismisses by default; `,(0,p.jsx)(t.code,{children:`keyboardDismissDisabled`}),` removes that path, so an enabled explicit action is mandatory.`]}),`
`,(0,p.jsx)(t.p,{children:`Loading, disabled, invalid, empty, and error behaviour belongs to the decision actions or content. A loading destructive action should remain clearly labelled and must not leave the dialog with no usable cancellation path.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-callback-semantics`,children:`Native attributes and callback semantics`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`onAction`}),`, not a DOM click callback. `,(0,p.jsx)(t.code,{children:`Actions`}),` supports relevant `,(0,p.jsx)(t.code,{children:`div`}),` attributes; title, description, and button parts support their relevant native attributes. Breeze owns the alert-dialog role, focus scope, and inline styling.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-mistakes`,children:`Keyboard, accessibility, and mistakes`}),`
`,(0,p.jsx)(t.p,{children:`Trigger activation opens the alert and focus stays contained with Tab and Shift+Tab. Escape closes unless explicitly disabled; an explicit Close restores trigger focus. State the action and consequence in plain language, use specific action labels rather than “Yes” and “No”, and never rely on danger colour alone. Translate all decision copy together and allow wrapping.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use AlertDialog for success messages, routine acknowledgements, or long forms; do not make outside click the only cancellation path; do not omit Title or Description. Related components: `,(0,p.jsx)(t.code,{children:`Dialog`}),`, `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),`, `,(0,p.jsx)(t.code,{children:`Alert`}),`, and `,(0,p.jsx)(t.code,{children:`Toast`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};