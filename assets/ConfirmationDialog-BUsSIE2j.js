import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Destructive as c,n as l,t as u}from"./ConfirmationDialog.stories-DbhNVgh8.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Opinionated alert-dialog pattern for a consequential decision, with safe cancel focus, protected outside dismissal, explicit confirmation and controlled, uncontrolled or read-only open state.`}),`
`,(0,p.jsx)(t.h1,{id:`confirmationdialog`,children:`ConfirmationDialog`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),` presents a focused, consequential decision with canonical warning anatomy and a safe initial focus target.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ConfirmationDialog } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),` before a destructive, risky or materially consequential action when the standard title, consequence, cancel and confirm structure is sufficient.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use compound `,(0,p.jsx)(t.code,{children:`AlertDialog`}),` when you need custom content, more than two decision actions, custom close labelling or direct styling. Use `,(0,p.jsx)(t.code,{children:`Dialog`}),` for routine modal tasks, `,(0,p.jsx)(t.code,{children:`Alert`}),` for inline feedback and `,(0,p.jsx)(t.code,{children:`Toast`}),` for non-blocking status. Do not ask for confirmation for harmless, easily reversible actions.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ConfirmationDialog } from '@motech-development/breeze-ui';

<ConfirmationDialog
  cancelLabel="Keep item"
  closeLabel="Close confirmation"
  confirmLabel="Delete item"
  description="The item and its attached files will be permanently removed."
  onConfirm={deleteItem}
  title="Delete this item?"
  trigger="Delete item"
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsx)(t.p,{children:`ConfirmationDialog is a fixed composition rather than a public compound namespace.`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Region`}),(0,p.jsx)(t.th,{children:`Responsibility`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Trigger`}),(0,p.jsx)(t.td,{children:`A semantic Breeze button that opens the alert dialog.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Header`}),(0,p.jsx)(t.td,{children:`Variant-coloured warning icon, required title and icon-only close action.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Description`}),(0,p.jsx)(t.td,{children:`Required consequence or decision context and the accessible description.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Actions`}),(0,p.jsx)(t.td,{children:`A cancel action focused on open and a confirming action.`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`The icon is supplementary; meaning must be present in the title, description and action labels. On compact screens the actions stack in a safe visual order. The complete structure is deliberately not replaceable through slots.`}),`
`,(0,p.jsx)(t.h2,{id:`variants-and-action-state`,children:`Variants and action state`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`variant`}),` accepts `,(0,p.jsx)(t.code,{children:`'danger'`}),`, `,(0,p.jsx)(t.code,{children:`'warning'`}),` or `,(0,p.jsx)(t.code,{children:`'primary'`}),` and defaults to `,(0,p.jsx)(t.code,{children:`'danger'`}),`. It colours the trigger, icon and confirming action. `,(0,p.jsx)(t.code,{children:`triggerAppearance`}),` accepts `,(0,p.jsx)(t.code,{children:`'solid'`}),`, `,(0,p.jsx)(t.code,{children:`'subtle'`}),`, `,(0,p.jsx)(t.code,{children:`'outline'`}),` or `,(0,p.jsx)(t.code,{children:`'ghost'`}),` and defaults to the trigger Button’s solid appearance.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` disables only the confirming action. Cancel, the header close action and Escape remain available. The pattern has no loading prop: keep asynchronous state application-owned, prevent duplicate confirmation through `,(0,p.jsx)(t.code,{children:`disabled`}),` when needed, and present progress or failure outside this fixed composition or use `,(0,p.jsx)(t.code,{children:`AlertDialog`}),` for a richer workflow.`]}),`
`,(0,p.jsx)(t.h2,{id:`open-state-and-callbacks`,children:`Open state and callbacks`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Uncontrolled:`}),` omit `,(0,p.jsx)(t.code,{children:`open`}),`; use optional `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` and `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Controlled:`}),` provide `,(0,p.jsx)(t.code,{children:`open`}),` and `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`. The callback receives the complete next Boolean after trigger activation, confirmation, cancellation, the close action or Escape.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Read-only:`}),` provide `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`. Requests cannot change the immutable state; this is useful for a fixed presentation, not a normal decision flow.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`onConfirm`}),` takes no event and runs once when the enabled confirming action is explicitly activated. That action also requests the dialog to close. The application owns the mutation, optimistic state, persistence, server errors and recovery. Do not combine `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` with `,(0,p.jsx)(t.code,{children:`open`}),`. Providing mutable `,(0,p.jsx)(t.code,{children:`open`}),` without `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` fails the TypeScript contract and throws at runtime.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-focus-and-accessibility`,children:`Keyboard, focus and accessibility`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Enter or Space activates the trigger and action buttons.`}),`
`,(0,p.jsx)(t.li,{children:`Opening moves focus to Cancel. Tab and Shift+Tab remain contained within the modal surface.`}),`
`,(0,p.jsx)(t.li,{children:`Escape requests closure. Outside pointer interaction does not dismiss the alert dialog.`}),`
`,(0,p.jsx)(t.li,{children:`Closing restores focus to the trigger when it remains mounted.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`title`}),` must name the decision. `,(0,p.jsx)(t.code,{children:`description`}),` must explain the consequence rather than repeat the title. Prefer specific labels such as “Delete item” and “Keep item” over “Yes” and “No”.`]}),`
`,(0,p.jsx)(t.li,{children:`Keep a usable non-confirming route. Never focus the destructive action initially or rely on colour to convey risk.`}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`All visible decision copy and the icon-only `,(0,p.jsx)(t.code,{children:`closeLabel`}),` are application-owned and should be translated together. Layout uses logical direction and permits wrapping.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not start the destructive operation from the trigger, use confirmation as an error message, hide the consequence in vague copy, disable every escape route, or treat `,(0,p.jsx)(t.code,{children:`variant`}),` as a severity value for business logic. Use `,(0,p.jsx)(t.code,{children:`AlertDialog`}),` for bespoke decisions, `,(0,p.jsx)(t.code,{children:`Dialog`}),` for non-consequential modal work, and `,(0,p.jsx)(t.code,{children:`FormActions`}),` to place the trigger in a form layout.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};