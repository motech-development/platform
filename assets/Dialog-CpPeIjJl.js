import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{ControlledFocusAndDismissal as c,n as l,t as u}from"./Dialog.stories-B9NrCdQE.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A modal task surface with required accessible title and description, contained focus, explicit close actions, and controlled or uncontrolled open state.`}),`
`,(0,p.jsx)(t.h1,{id:`dialog`,children:`Dialog`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Dialog`}),` interrupts the current page with a focused modal task or decision that must be completed or dismissed.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Dialog } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsx)(t.p,{children:`Use it for a short self-contained task that needs the user's immediate attention.`}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`AlertDialog`}),` for a consequential decision, `,(0,p.jsx)(t.code,{children:`Drawer`}),` for a longer edge-mounted task, `,(0,p.jsx)(t.code,{children:`Popover`}),` for lightweight contextual controls, and inline content when interruption is unnecessary.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Dialog, TextField } from '@motech-development/breeze-ui';

<Dialog.Root>
  <Dialog.Trigger>Edit details</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Edit details</Dialog.Title>
    <Dialog.Description>
      Review the information before closing.
    </Dialog.Description>
    <TextField.Root>
      <TextField.Label>Name</TextField.Label>
      <TextField.Input autoFocus />
    </TextField.Root>
    <Dialog.Close>Close</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Dialog.Root`})}),(0,p.jsx)(t.td,{children:`Coordinates open state, trigger focus, dismissal, and restoration.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Dialog.Trigger`})}),(0,p.jsx)(t.td,{children:`Semantic button that opens the dialog.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Dialog.Content`})}),(0,p.jsx)(t.td,{children:`Backdrop, modal focus scope, scroll boundary, and dialog surface.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Dialog.Title`})}),(0,p.jsx)(t.td,{children:`Required heading used as the accessible name.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Dialog.Description`})}),(0,p.jsx)(t.td,{children:`Required explanatory text used as the accessible description.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Dialog.Close`})}),(0,p.jsx)(t.td,{children:`Semantic action that closes and restores trigger focus.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep `,(0,p.jsx)(t.code,{children:`Title`}),` and `,(0,p.jsx)(t.code,{children:`Description`}),` inside `,(0,p.jsx)(t.code,{children:`Content`}),`. Put the most appropriate first focus target on an interactive descendant with `,(0,p.jsx)(t.code,{children:`autoFocus`}),`; otherwise React Aria chooses a safe target.`]}),`
`,(0,p.jsx)(t.h2,{id:`open-state-dismissal-and-feedback`,children:`Open state, dismissal, and feedback`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for intentionally immutable state. `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` receives the complete next Boolean for trigger activation, outside dismissal, Escape, and close actions. In read-only mode those interactions request no state change because no callback exists.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`dismissible`}),` defaults to `,(0,p.jsx)(t.code,{children:`true`}),` and allows outside pointer dismissal. `,(0,p.jsx)(t.code,{children:`keyboardDismissDisabled`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`; set it only when Escape would be unsafe and provide an obvious close action. Loading, disabled, invalid, empty, and error states belong to the controls or feedback inside the dialog. Do not disable every dismissal path during an indefinite load.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-callback-semantics`,children:`Native attributes and callback semantics`}),`
`,(0,p.jsxs)(t.p,{children:[`Trigger and Close follow the public Button interaction vocabulary: use `,(0,p.jsx)(t.code,{children:`onAction`}),`, not `,(0,p.jsx)(t.code,{children:`onClick`}),`. Content accepts relevant dialog HTML and ARIA attributes. Breeze owns overlay role, focus containment, inline styling, and dismissal semantics.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility, and internationalisation`}),`
`,(0,p.jsx)(t.p,{children:`Activating Trigger opens the modal and moves focus inside. Tab and Shift+Tab remain within it. Escape dismisses unless disabled, Close dismisses explicitly, and focus returns to the trigger. Give every dialog a concise Title and meaningful Description; visible content elsewhere does not replace these parts. Long translated text and narrow viewports scroll inside the bounded surface. The provider propagates locale and direction into the portal.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not nest unrelated dialogs, omit a dismissal action, put primary page navigation in a dialog, or use it for passive notifications. Related components: `,(0,p.jsx)(t.code,{children:`AlertDialog`}),`, `,(0,p.jsx)(t.code,{children:`Drawer`}),`, `,(0,p.jsx)(t.code,{children:`Popover`}),`, `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),`, and `,(0,p.jsx)(t.code,{children:`Toast`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};