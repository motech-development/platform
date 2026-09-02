import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{I as a,N as o,f as s}from"./icons-frCuGJ60.js";import{n as c,t as l}from"./Button-BEpHfrRB.js";import{i as u,n as d}from"./Drawer-QRbpS9m6.js";import{a as f,n as p}from"./AlertDialog-DWmoiMbg.js";import{n as m,t as h}from"./IconTile-CG-auT1j.js";function g({cancelLabel:e,closeLabel:t,confirmLabel:n,defaultOpen:r,description:i,disabled:a=!1,nested:c=!1,onConfirm:l,onOpenChange:u,open:d,readOnly:f,title:m,trigger:g,triggerAppearance:v,triggerless:y=!1,variant:b=`danger`}){let x=(0,_.jsxs)(_.Fragment,{children:[y?null:(0,_.jsx)(p.Trigger,{appearance:v,variant:b,children:g}),(0,_.jsxs)(p.Content,{className:`breeze-confirmation-dialog max-h-[calc(100dvh-2rem)] w-full max-w-md border-0 border-b-2 border-b-[var(--breeze-border-strong)] p-0 shadow-[0_8px_0_rgb(6_12_24_/_22%)]`,nested:c,overlayClassName:`p-5`,children:[(0,_.jsxs)(`div`,{className:`flex items-center justify-between gap-4 border-b border-[var(--breeze-border)] p-4 sm:px-5`,children:[(0,_.jsxs)(`div`,{className:`flex min-w-0 items-center gap-3`,children:[(0,_.jsx)(h,{bordered:!1,"data-confirmation-icon":!0,size:`sm`,variant:b,children:(0,_.jsx)(o,{size:20})}),(0,_.jsx)(p.Title,{className:`mb-0 text-2xl leading-[1.2]`,children:m})]}),(0,_.jsx)(p.Close,{"aria-label":t,appearance:`ghost`,className:`size-11 min-h-11 border-0 p-0 text-[var(--breeze-ink)]`,variant:`secondary`,children:(0,_.jsx)(s,{size:20})})]}),(0,_.jsx)(p.Description,{className:`mb-0 p-4 text-base leading-relaxed sm:p-5`,children:i}),(0,_.jsxs)(p.Actions,{className:`px-4 pb-4 sm:px-5 sm:pb-5`,children:[(0,_.jsx)(p.Close,{appearance:`outline`,autoFocus:!0,className:`text-[var(--breeze-ink)]`,variant:`secondary`,children:e}),(0,_.jsx)(p.Close,{disabled:a,onAction:l,variant:b,children:n})]})]})]});if(y){if(d===void 0||u===void 0)throw Error(`Triggerless ConfirmationDialog requires controlled open state.`);return(0,_.jsx)(p.Root,{onOpenChange:u,open:d,triggerless:!0,children:x})}if(d===void 0)return(0,_.jsx)(p.Root,{defaultOpen:r,onOpenChange:u,children:x});if(f===!0)return(0,_.jsx)(p.Root,{open:d,readOnly:!0,children:x});if(u===void 0)throw Error(`Controlled ConfirmationDialog requires onOpenChange.`);return(0,_.jsx)(p.Root,{onOpenChange:u,open:d,children:x})}var _,v=t((()=>{a(),f(),m(),_=i();try{g.displayName=`ConfirmationDialog`,g.__docgenInfo={description:`Presents a focused explicit decision while retaining focus restoration.`,displayName:`ConfirmationDialog`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,methods:[],props:{cancelLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Visible label for the non-confirming close action.`,name:`cancelLabel`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},closeLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Accessible label for the icon-only header close action.`,name:`closeLabel`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`string`}},confirmLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Visible label for the confirming action.`,name:`confirmLabel`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Consequence or decision context announced by the dialog.`,name:`description`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:"Prevents the confirming action. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},nested:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:"Dims and centres within the nearest existing modal layer. Defaults to `false`.",name:`nested`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onConfirm:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Reports the explicit confirming decision.`,name:`onConfirm`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`() => void`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Dialog heading.`,name:`title`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},variant:{defaultValue:{value:`danger`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:"Semantic confirming action colour. Defaults to `danger`.",name:`variant`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!1,tags:{},type:{name:`"danger" | "primary" | "warning" | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:"Initial open state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:`Called with the next externally controlled open state.
Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:`Current externally controlled open state.
Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:`Marks controlled state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`}],description:`Semantic action content that opens the dialog.`,name:`trigger`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`ReactNode`}},triggerAppearance:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`}],description:"Visual treatment for the trigger. Defaults to `solid`.",name:`triggerAppearance`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`VisualAppearance | undefined`}},triggerless:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`}],description:`Omits the pattern trigger for state controlled by an external action.
Uses the pattern's semantic trigger to coordinate dialog state.`,name:`triggerless`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`consequential decision pattern with safe initial focus`}}}catch{}})),y=n({ControlledOpen:()=>I,Destructive:()=>F,DestructiveCompact:()=>Y,DestructiveOpen:()=>J,NestedAfterParentExit:()=>K,NestedAfterParentExitCompact:()=>q,NestedInDrawer:()=>R,NestedInDrawerCompact:()=>z,NestedOpenWithDrawer:()=>B,NestedOverActiveIndependentStack:()=>U,NestedOverNestedDrawer:()=>V,NestedOverNestedDrawerCompact:()=>H,NestedReplacementBackdrop:()=>W,NestedWithoutParent:()=>G,TriggerlessControlled:()=>L,__namedExportsOrder:()=>X,default:()=>P});function b(){let[e,t]=(0,D.useState)(!1);return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(l,{onAction:()=>t(!0),children:`Leave editor`}),(0,O.jsx)(g,{cancelLabel:`Keep editing`,closeLabel:`Close confirmation`,confirmLabel:`Discard changes`,description:`Your unsaved changes will be lost.`,onConfirm:()=>void 0,onOpenChange:t,open:e,title:`Discard changes?`,triggerless:!0,variant:`warning`})]})}function x({confirmation:e,initiallyOpen:t=!1}){let[n,r]=(0,D.useState)(t);return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(d.Root,{defaultOpen:!0,children:[(0,O.jsx)(d.Trigger,{children:`Open editor`}),(0,O.jsxs)(d.Content,{placement:{base:`bottom`,md:`end`},size:`wide`,children:[(0,O.jsx)(d.Description,{children:`Update the record details.`}),(0,O.jsx)(d.Title,{children:`Record editor`}),(0,O.jsx)(`p`,{children:`This parent task remains visible so the confirmation keeps its decision context.`}),(0,O.jsx)(l,{onAction:()=>r(!0),children:`Leave editor`})]})]}),(0,O.jsx)(g,{cancelLabel:e.cancelLabel,closeLabel:e.closeLabel,confirmLabel:e.confirmLabel,description:e.description,nested:!0,onConfirm:e.onConfirm,onOpenChange:r,open:n,title:e.title,triggerless:!0,variant:`warning`})]})}function S({confirmation:e}){let[t,n]=(0,D.useState)(!1),[r,i]=(0,D.useState)(!0);return(0,D.useEffect)(()=>{t&&i(!1)},[t]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(l,{onAction:()=>i(!0),children:`Open editor`}),(0,O.jsx)(d.Root,{onOpenChange:i,open:r,triggerless:!0,children:(0,O.jsxs)(d.Content,{placement:{base:`bottom`,md:`end`},size:`wide`,children:[(0,O.jsx)(d.Description,{children:`Update the record details.`}),(0,O.jsx)(d.Title,{children:`Record editor`}),(0,O.jsx)(l,{onAction:()=>n(!0),children:`Close editor and confirm`})]})}),(0,O.jsx)(g,{cancelLabel:e.cancelLabel,closeLabel:e.closeLabel,confirmLabel:e.confirmLabel,description:e.description,nested:!0,onConfirm:e.onConfirm,onOpenChange:n,open:t,title:e.title,triggerless:!0,variant:`warning`})]})}function C({confirmation:e}){let[t,n]=(0,D.useState)(!1);return(0,O.jsxs)(d.Root,{defaultOpen:!0,children:[(0,O.jsx)(d.Trigger,{children:`Open outer editor`}),(0,O.jsxs)(d.Content,{placement:{base:`bottom`,md:`end`},size:`wide`,children:[(0,O.jsx)(d.Description,{children:`Update the enclosing record.`}),(0,O.jsx)(d.Title,{children:`Outer editor`}),(0,O.jsxs)(d.Root,{defaultOpen:!0,children:[(0,O.jsx)(d.Trigger,{children:`Open inner editor`}),(0,O.jsxs)(d.Content,{placement:{base:`bottom`,md:`end`},size:`medium`,children:[(0,O.jsx)(d.Description,{children:`Update the active item.`}),(0,O.jsx)(d.Title,{children:`Inner editor`}),(0,O.jsx)(l,{onAction:()=>n(!0),children:`Leave inner editor`})]})]}),(0,O.jsx)(g,{cancelLabel:e.cancelLabel,closeLabel:e.closeLabel,confirmLabel:e.confirmLabel,description:e.description,nested:!0,onConfirm:e.onConfirm,onOpenChange:n,open:t,title:e.title,triggerless:!0,variant:`warning`})]})]})}function w({confirmation:e}){let[t,n]=(0,D.useState)(!1),[r,i]=(0,D.useState)(!1);return(0,D.useEffect)(()=>n(!0),[]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(d.Root,{defaultOpen:!0,children:[(0,O.jsx)(d.Trigger,{children:`Open earlier outer editor`}),(0,O.jsxs)(d.Content,{placement:`start`,size:`default`,children:[(0,O.jsx)(d.Description,{children:`Earlier independent task.`}),(0,O.jsx)(d.Title,{children:`Earlier outer editor`}),(0,O.jsxs)(d.Root,{defaultOpen:!0,children:[(0,O.jsx)(d.Trigger,{children:`Open earlier inner editor`}),(0,O.jsxs)(d.Content,{placement:`start`,size:`medium`,children:[(0,O.jsx)(d.Description,{children:`Deeper surface in the earlier task.`}),(0,O.jsx)(d.Title,{children:`Earlier inner editor`})]})]})]})]}),(0,O.jsx)(d.Root,{onOpenChange:n,open:t,triggerless:!0,children:(0,O.jsxs)(d.Content,{placement:`end`,size:`wide`,children:[(0,O.jsx)(d.Description,{children:`Currently active independent task.`}),(0,O.jsx)(d.Title,{children:`Active editor`}),(0,O.jsx)(l,{onAction:()=>i(!0),children:`Leave active editor`}),(0,O.jsx)(g,{cancelLabel:e.cancelLabel,closeLabel:e.closeLabel,confirmLabel:e.confirmLabel,description:e.description,nested:!0,onConfirm:e.onConfirm,onOpenChange:i,open:r,title:e.title,triggerless:!0,variant:`warning`})]})})]})}function T(){let[e,t]=(0,D.useState)(!1),[n,r]=(0,D.useState)(!1);return(0,O.jsxs)(d.Root,{defaultOpen:!0,children:[(0,O.jsx)(d.Trigger,{children:`Open replacement editor`}),(0,O.jsxs)(d.Content,{placement:{base:`bottom`,md:`end`},size:`wide`,children:[(0,O.jsx)(d.Description,{children:`Update the record details.`}),(0,O.jsx)(d.Title,{children:`Replacement editor`}),(0,O.jsx)(l,{onAction:()=>t(!0),children:`Review pending changes`}),(0,O.jsx)(g,{cancelLabel:`Keep editing`,closeLabel:`Close first confirmation`,confirmLabel:`Review next change`,description:`Review the next change before leaving.`,nested:!0,onConfirm:()=>{t(!1),r(!0)},onOpenChange:t,open:e,title:`Review this change?`,triggerless:!0,variant:`warning`}),(0,O.jsx)(g,{cancelLabel:`Keep editing`,closeLabel:`Close second confirmation`,confirmLabel:`Discard changes`,description:`Your unsaved changes will be lost.`,nested:!0,onConfirm:()=>void 0,onOpenChange:r,open:n,title:`Discard changes?`,triggerless:!0,variant:`warning`})]})]})}async function E(e,t=!0){let n=N(e.ownerDocument.body),r=n.getByRole(`dialog`,{name:`Record editor`});t&&await j.click(n.getByRole(`button`,{name:`Leave editor`}));let i=n.getByRole(`alertdialog`,{name:`Discard changes?`}),a=i.parentElement?.parentElement,o=r.parentElement?.parentElement,s=e.ownerDocument.defaultView;await M(()=>k(i).toBeVisible()),await M(async()=>{if(a==null||o==null||s===null)throw Error(`Expected the nested modal and parent drawer overlays.`);let e=r.getBoundingClientRect(),t=i.getBoundingClientRect(),n=s.getComputedStyle(a,`::before`);await k(s.getComputedStyle(a).backgroundColor).toBe(`rgba(0, 0, 0, 0)`),await k(n.backgroundColor).toBe(s.getComputedStyle(o).backgroundColor),await k(Number.parseFloat(n.left)).toBeCloseTo(e.left,1),await k(Number.parseFloat(n.top)).toBeCloseTo(e.top,1),await k(Number.parseFloat(n.width)).toBeCloseTo(e.width,1),await k(Number.parseFloat(n.height)).toBeCloseTo(e.height,1),await k(t.left+t.width/2).toBeCloseTo(e.left+e.width/2,1),await k(t.top+t.height/2).toBeCloseTo(e.top+e.height/2,1)}),await k(n.getByRole(`button`,{name:`Keep editing`})).toHaveFocus()}var D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z=t((()=>{D=e(r(),1),c(),u(),v(),O=i(),{expect:k,fn:A,userEvent:j,waitFor:M,within:N}=__STORYBOOK_MODULE_TEST__,P={component:g,title:`Patterns/Actions/ConfirmationDialog`},F={args:{cancelLabel:`Cancel`,closeLabel:`Close confirmation`,confirmLabel:`Delete item`,description:`The item and its linked files will be permanently removed.`,onConfirm:A(),title:`Delete this item?`,trigger:`Delete item`},play:async({args:e,canvasElement:t})=>{let n=N(t);await j.click(n.getByRole(`button`,{name:`Delete item`}));let r=N(document.body).getByRole(`alertdialog`);await M(()=>k(r).toBeVisible()),await j.click(N(r).getByRole(`button`,{name:`Delete item`})),await k(e.onConfirm).toHaveBeenCalledOnce()}},I={args:{cancelLabel:`Keep item`,closeLabel:`Close confirmation`,confirmLabel:`Archive item`,description:`The item can be restored later.`,onConfirm:A(),onOpenChange:A(),open:!0,title:`Archive this item?`,trigger:`Archive item`,variant:`warning`}},L={args:{cancelLabel:`Keep editing`,closeLabel:`Close confirmation`,confirmLabel:`Discard changes`,description:`Your unsaved changes will be lost.`,onConfirm:A(),onOpenChange:A(),open:!1,title:`Discard changes?`,triggerless:!0},play:async({canvasElement:e})=>{let t=N(e).getByRole(`button`,{name:`Leave editor`});await j.click(t);let n=N(e.ownerDocument.body),r=n.getByRole(`alertdialog`,{name:`Discard changes?`});await M(()=>k(r).toBeVisible()),await j.click(n.getByRole(`button`,{name:`Keep editing`})),await M(()=>k(t).toHaveFocus())},render:b},R={args:{cancelLabel:`Keep editing`,closeLabel:`Close confirmation`,confirmLabel:`Discard changes`,description:`Your unsaved changes will be lost.`,onConfirm:A(),title:`Discard changes?`,trigger:`Leave editor`},play:async({canvasElement:e})=>E(e),render:e=>(0,O.jsx)(x,{confirmation:e})},z={...R,globals:{viewport:{value:`mobile1`}}},B={...R,play:async({canvasElement:e})=>E(e,!1),render:e=>(0,O.jsx)(x,{confirmation:e,initiallyOpen:!0})},V={...R,play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body),n=t.getByRole(`dialog`,{name:`Inner editor`});await j.click(t.getByRole(`button`,{name:`Leave inner editor`}));let r=t.getByRole(`alertdialog`,{name:`Discard changes?`}),i=r.parentElement?.parentElement;await M(async()=>{if(i==null)throw Error(`Expected the nested confirmation overlay.`);let e=n.getBoundingClientRect(),t=r.getBoundingClientRect(),a=getComputedStyle(i,`::before`);await k(Number.parseFloat(a.left)).toBeCloseTo(e.left,1),await k(Number.parseFloat(a.top)).toBeCloseTo(e.top,1),await k(Number.parseFloat(a.width)).toBeCloseTo(e.width,1),await k(Number.parseFloat(a.height)).toBeCloseTo(e.height,1),await k(t.left+t.width/2).toBeCloseTo(e.left+e.width/2,1),await k(t.top+t.height/2).toBeCloseTo(e.top+e.height/2,1)})},render:e=>(0,O.jsx)(C,{confirmation:e})},H={...V,globals:{viewport:{value:`mobile1`}}},U={...R,play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body),n=t.getByRole(`dialog`,{name:`Active editor`});await j.click(t.getByRole(`button`,{name:`Leave active editor`}));let r=t.getByRole(`alertdialog`,{name:`Discard changes?`}).closest(`.breeze-modal-overlay`);if(r===null)throw Error(`Expected the nested confirmation overlay.`);await M(async()=>{let e=n.getBoundingClientRect(),t=getComputedStyle(r,`::before`);await k(Number.parseFloat(t.left)).toBeCloseTo(e.left,1),await k(Number.parseFloat(t.width)).toBeCloseTo(e.width,1)})},render:e=>(0,O.jsx)(w,{confirmation:e})},W={args:R.args,play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body);await j.click(t.getByRole(`button`,{name:`Review pending changes`}));let n=t.getByRole(`alertdialog`,{name:`Review this change?`}),r=n.closest(`.breeze-modal-overlay`);if(r===null)throw Error(`Expected the first nested confirmation overlay.`);await j.click(t.getByRole(`button`,{name:`Review next change`}));let i=t.getByRole(`alertdialog`,{name:`Discard changes?`}),a=i.closest(`.breeze-modal-overlay`);if(a===null)throw Error(`Expected the replacement confirmation overlay.`);await M(async()=>{await k(r).toHaveAttribute(`data-nested-backdrop-suppressed`),await k(getComputedStyle(r,`::before`).content).toBe(`none`),await k(getComputedStyle(n).visibility).toBe(`hidden`),await k(getComputedStyle(a,`::before`).content).not.toBe(`none`)}),await M(()=>k(n).not.toBeInTheDocument()),await k(i).toBeVisible()},render:T},G={args:{cancelLabel:`Keep editing`,closeLabel:`Close confirmation`,confirmLabel:`Discard changes`,description:`Your unsaved changes will be lost.`,nested:!0,onConfirm:A(),open:!0,readOnly:!0,title:`Discard changes?`,trigger:`Leave editor`,variant:`warning`},play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body),n=t.getByRole(`alertdialog`,{name:`Discard changes?`}),r=n.parentElement?.parentElement,i=e.ownerDocument.defaultView;if(r==null||i===null)throw Error(`Expected the viewport modal overlay.`);await M(async()=>{let e=r.getBoundingClientRect(),a=n.getBoundingClientRect();await k(i.getComputedStyle(r).backgroundColor).not.toBe(`rgba(0, 0, 0, 0)`),await k(e.left).toBe(0),await k(e.top).toBe(0),await k(e.width).toBe(i.innerWidth),await k(e.height).toBe(i.innerHeight),await k(a.left+a.width/2).toBeCloseTo(i.innerWidth/2,1),await k(a.top+a.height/2).toBeCloseTo(i.innerHeight/2,1),await k(t.getByRole(`button`,{name:`Keep editing`})).toHaveFocus()})}},K={...R,play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body),n=e.ownerDocument.defaultView,r=t.getByRole(`dialog`,{name:`Record editor`}),i=r.parentElement?.parentElement;await j.click(t.getByRole(`button`,{name:`Close editor and confirm`}));let a=t.getByRole(`alertdialog`,{name:`Discard changes?`}),o=a.parentElement?.parentElement;if(o==null||i==null||n===null)throw Error(`Expected the nested confirmation and drawer overlays.`);await M(async()=>{await k(r).toBeInTheDocument(),await k(r.closest(`[data-exiting]`)).not.toBeNull(),await k(n.getComputedStyle(i).backgroundColor).toBe(`rgba(0, 0, 0, 0)`),await k(n.getComputedStyle(o).backgroundColor).not.toBe(`rgba(0, 0, 0, 0)`)}),await M(async()=>{await k(t.queryByRole(`dialog`,{name:`Record editor`})).not.toBeInTheDocument();let e=o.getBoundingClientRect(),r=a.getBoundingClientRect();await k(o).not.toHaveAttribute(`data-nested-boundary`),await k(n.getComputedStyle(o).backgroundColor).not.toBe(`rgba(0, 0, 0, 0)`),await k(e.left).toBe(0),await k(e.top).toBe(0),await k(e.width).toBe(n.innerWidth),await k(e.height).toBe(n.innerHeight),await k(r.left+r.width/2).toBeCloseTo(n.innerWidth/2,1),await k(r.top+r.height/2).toBeCloseTo(n.innerHeight/2,1)}),await M(()=>k(t.getByRole(`button`,{name:`Keep editing`})).toHaveFocus())},render:e=>(0,O.jsx)(S,{confirmation:e})},q={...K,globals:{viewport:{value:`mobile1`}}},J={args:{cancelLabel:`Cancel`,closeLabel:`Close confirmation`,confirmLabel:`Delete configuration`,description:`The legacy configuration and its linked file will be permanently removed.`,onConfirm:A(),open:!0,readOnly:!0,title:`Delete configuration?`,trigger:`Delete configuration`},play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body),n=t.getByRole(`alertdialog`,{name:`Delete configuration?`}),r=t.getByRole(`heading`,{name:`Delete configuration?`}),i=r.parentElement?.parentElement,a=n.querySelector(`[data-confirmation-icon]`),o=t.getByText(`The legacy configuration and its linked file will be permanently removed.`),s=t.getByRole(`group`),c=t.getByRole(`button`,{name:`Cancel`}),l=t.getByRole(`button`,{name:`Close confirmation`}),u=a?.querySelector(`.lucide-triangle-alert`),d=e.ownerDocument.defaultView,f=d?.getComputedStyle(c),p=d?.getComputedStyle(n),m=d?.getComputedStyle(l),h=d?.getComputedStyle(r);await k(n.getBoundingClientRect().width).toBeLessThanOrEqual(e.getBoundingClientRect().width),await k(p?.borderTopWidth).toBe(`0px`),await k(p?.borderRightWidth).toBe(`0px`),await k(p?.borderBottomWidth).toBe(`2px`),await k(p?.borderLeftWidth).toBe(`0px`),await k(p?.padding).toBe(`0px`),await k(p?.boxShadow).toContain(`rgba(6, 12, 24, 0.22) 0px 8px 0px 0px`),await k(i?.getBoundingClientRect().height).toBeGreaterThan(0),await k(a?.getBoundingClientRect().width).toBe(a?.getBoundingClientRect().height),await k(d?.getComputedStyle(a).borderTopWidth).toBe(`0px`),await k(u).toBeInTheDocument(),await k(h?.fontFamily).toContain(`Cabin`),await k(h?.fontSize).toBe(`24px`),await k(Number.parseFloat(h?.lineHeight??`0`)).toBeCloseTo(28.8,4),await k(d?.getComputedStyle(o).fontSize).toBe(`16px`),await k(d?.getComputedStyle(s).gap).toBe(`10px`),await k(m?.borderTopWidth).toBe(`0px`),await k(m?.borderRightWidth).toBe(`0px`),await k(m?.borderBottomWidth).toBe(`0px`),await k(m?.borderLeftWidth).toBe(`0px`),await k(f?.color).toBe(`rgb(24, 32, 51)`),await k(f?.borderColor).toBe(`rgb(189, 197, 210)`),await k(c).toHaveFocus()}},Y={...J,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=N(e.ownerDocument.body),n=t.getByRole(`alertdialog`,{name:`Delete configuration?`}),r=t.getByRole(`heading`,{name:`Delete configuration?`}).parentElement?.parentElement,i=t.getByRole(`group`),a=N(i).getAllByRole(`button`),o=e.ownerDocument.defaultView;await k(n.getBoundingClientRect().width).toBeLessThanOrEqual(e.getBoundingClientRect().width),await k(r?.getBoundingClientRect().height).toBeGreaterThan(0),await k(o?.getComputedStyle(i).flexDirection).toBe(`column-reverse`),await k(a[1].getBoundingClientRect().top).toBeLessThan(a[0].getBoundingClientRect().top),await Promise.all(a.map(e=>k(e.getBoundingClientRect().width).toBeLessThanOrEqual(n.getBoundingClientRect().width))),await k(t.getByRole(`button`,{name:`Cancel`})).toHaveFocus()}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    cancelLabel: 'Cancel',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Delete item',
    description: 'The item and its linked files will be permanently removed.',
    onConfirm: fn(),
    title: 'Delete this item?',
    trigger: 'Delete item'
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Delete item'
    }));
    const dialog = within(document.body).getByRole('alertdialog');
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole('button', {
      name: 'Delete item'
    }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  }
}`,...F.parameters?.docs?.source},description:{story:`Opens an uncontrolled destructive confirmation, activates the explicit
confirming action, and verifies the application-owned callback is invoked
once.

@summary uncontrolled destructive decision and confirmation`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    cancelLabel: 'Keep item',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Archive item',
    description: 'The item can be restored later.',
    onConfirm: fn(),
    onOpenChange: fn(),
    open: true,
    title: 'Archive this item?',
    trigger: 'Archive item',
    variant: 'warning'
  }
}`,...I.parameters?.docs?.source},description:{story:`Presents an application-controlled warning decision already open, with the
parent responsible for accepting every subsequent open-state request.

@summary controlled open warning confirmation`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    cancelLabel: 'Keep editing',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Discard changes',
    description: 'Your unsaved changes will be lost.',
    onConfirm: fn(),
    onOpenChange: fn(),
    open: false,
    title: 'Discard changes?',
    triggerless: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const externalTrigger = canvas.getByRole('button', {
      name: 'Leave editor'
    });
    await userEvent.click(externalTrigger);
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Discard changes?'
    });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(body.getByRole('button', {
      name: 'Keep editing'
    }));
    await waitFor(() => expect(externalTrigger).toHaveFocus());
  },
  render: TriggerlessConfirmationExample
}`,...L.parameters?.docs?.source},description:{story:`Opens a controlled warning confirmation from an application-owned action
outside the fixed pattern and restores focus there after cancellation.

@summary externally triggered controlled confirmation`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    cancelLabel: 'Keep editing',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Discard changes',
    description: 'Your unsaved changes will be lost.',
    onConfirm: fn(),
    title: 'Discard changes?',
    trigger: 'Leave editor'
  },
  play: async ({
    canvasElement
  }) => verifyNestedConfirmation(canvasElement),
  render: args => <NestedConfirmationExample confirmation={args} />
}`,...R.parameters?.docs?.source},description:{story:`Opens a warning confirmation inside a desktop drawer and limits the new
dimming layer and dialog centring to that parent task surface.

@summary drawer-scoped nested confirmation backdrop`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  ...NestedInDrawer,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  }
}`,...z.parameters?.docs?.source},description:{story:`Exercises the same nested decision in the compact full-screen drawer, where
the scoped dimming layer naturally fills the mobile task surface.

@summary compact full-screen nested confirmation backdrop`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  ...NestedInDrawer,
  play: async ({
    canvasElement
  }) => verifyNestedConfirmation(canvasElement, false),
  render: args => <NestedConfirmationExample confirmation={args} initiallyOpen />
}`,...B.parameters?.docs?.source},description:{story:`Opens the sibling drawer and confirmation in the same render and verifies
the next-frame boundary reconciliation scopes the decision to the drawer.

@summary simultaneous sibling drawer and confirmation mounting`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  ...NestedInDrawer,
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const innerDrawer = body.getByRole('dialog', {
      name: 'Inner editor'
    });
    await userEvent.click(body.getByRole('button', {
      name: 'Leave inner editor'
    }));
    const dialog = body.getByRole('alertdialog', {
      name: 'Discard changes?'
    });
    const overlay = dialog.parentElement?.parentElement;
    await waitFor(async () => {
      if (overlay === null || overlay === undefined) {
        throw new Error('Expected the nested confirmation overlay.');
      }
      const innerBounds = innerDrawer.getBoundingClientRect();
      const dialogBounds = dialog.getBoundingClientRect();
      const backdropStyle = getComputedStyle(overlay, '::before');
      await expect(Number.parseFloat(backdropStyle.left)).toBeCloseTo(innerBounds.left, 1);
      await expect(Number.parseFloat(backdropStyle.top)).toBeCloseTo(innerBounds.top, 1);
      await expect(Number.parseFloat(backdropStyle.width)).toBeCloseTo(innerBounds.width, 1);
      await expect(Number.parseFloat(backdropStyle.height)).toBeCloseTo(innerBounds.height, 1);
      await expect(dialogBounds.left + dialogBounds.width / 2).toBeCloseTo(innerBounds.left + innerBounds.width / 2, 1);
      await expect(dialogBounds.top + dialogBounds.height / 2).toBeCloseTo(innerBounds.top + innerBounds.height / 2, 1);
    });
  },
  render: args => <NestedDrawerConfirmationExample confirmation={args} />
}`,...V.parameters?.docs?.source},description:{story:`Opens a confirmation logically owned by an outer drawer while an inner
drawer is the active topmost task, and scopes the decision to that task.

@summary topmost nested drawer confirmation boundary`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  ...NestedOverNestedDrawer,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  }
}`,...H.parameters?.docs?.source},description:{story:`Exercises the topmost nested drawer boundary when every modal layer fills a
compact viewport.

@summary compact topmost nested drawer confirmation boundary`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  ...NestedInDrawer,
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const activeDrawer = body.getByRole('dialog', {
      name: 'Active editor'
    });
    await userEvent.click(body.getByRole('button', {
      name: 'Leave active editor'
    }));
    const dialog = body.getByRole('alertdialog', {
      name: 'Discard changes?'
    });
    const overlay = dialog.closest<HTMLElement>('.breeze-modal-overlay');
    if (overlay === null) {
      throw new Error('Expected the nested confirmation overlay.');
    }
    await waitFor(async () => {
      const activeBounds = activeDrawer.getBoundingClientRect();
      const backdropStyle = getComputedStyle(overlay, '::before');
      await expect(Number.parseFloat(backdropStyle.left)).toBeCloseTo(activeBounds.left, 1);
      await expect(Number.parseFloat(backdropStyle.width)).toBeCloseTo(activeBounds.width, 1);
    });
  },
  render: args => <IndependentModalStacksConfirmationExample confirmation={args} />
}`,...U.parameters?.docs?.source},description:{story:`Keeps a deeper modal tree mounted behind a later root task and verifies that
portal stacking selects the active root before considering nested depth.

@summary active independent modal stack boundary`,...U.parameters?.docs?.description}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: NestedInDrawer.args,
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(body.getByRole('button', {
      name: 'Review pending changes'
    }));
    const firstDialog = body.getByRole('alertdialog', {
      name: 'Review this change?'
    });
    const firstOverlay = firstDialog.closest<HTMLElement>('.breeze-modal-overlay');
    if (firstOverlay === null) {
      throw new Error('Expected the first nested confirmation overlay.');
    }
    await userEvent.click(body.getByRole('button', {
      name: 'Review next change'
    }));
    const secondDialog = body.getByRole('alertdialog', {
      name: 'Discard changes?'
    });
    const secondOverlay = secondDialog.closest<HTMLElement>('.breeze-modal-overlay');
    if (secondOverlay === null) {
      throw new Error('Expected the replacement confirmation overlay.');
    }
    await waitFor(async () => {
      await expect(firstOverlay).toHaveAttribute('data-nested-backdrop-suppressed');
      await expect(getComputedStyle(firstOverlay, '::before').content).toBe('none');
      await expect(getComputedStyle(firstDialog).visibility).toBe('hidden');
      await expect(getComputedStyle(secondOverlay, '::before').content).not.toBe('none');
    });
    await waitFor(() => expect(firstDialog).not.toBeInTheDocument());
    await expect(secondDialog).toBeVisible();
  },
  render: ReplacingNestedConfirmationExample
}`,...W.parameters?.docs?.source},description:{story:`Replaces a scoped confirmation during its exit and verifies that the old
pseudo-backdrop no longer contributes a second dimming layer.

@summary single backdrop while replacing nested confirmations`,...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    cancelLabel: 'Keep editing',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Discard changes',
    description: 'Your unsaved changes will be lost.',
    nested: true,
    onConfirm: fn(),
    open: true,
    readOnly: true,
    title: 'Discard changes?',
    trigger: 'Leave editor',
    variant: 'warning'
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Discard changes?'
    });
    const overlay = dialog.parentElement?.parentElement;
    const view = canvasElement.ownerDocument.defaultView;
    if (overlay === null || overlay === undefined || view === null) {
      throw new Error('Expected the viewport modal overlay.');
    }
    await waitFor(async () => {
      const overlayBounds = overlay.getBoundingClientRect();
      const dialogBounds = dialog.getBoundingClientRect();
      await expect(view.getComputedStyle(overlay).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      await expect(overlayBounds.left).toBe(0);
      await expect(overlayBounds.top).toBe(0);
      await expect(overlayBounds.width).toBe(view.innerWidth);
      await expect(overlayBounds.height).toBe(view.innerHeight);
      await expect(dialogBounds.left + dialogBounds.width / 2).toBeCloseTo(view.innerWidth / 2, 1);
      await expect(dialogBounds.top + dialogBounds.height / 2).toBeCloseTo(view.innerHeight / 2, 1);
      await expect(body.getByRole('button', {
        name: 'Keep editing'
      })).toHaveFocus();
    });
  }
}`,...G.parameters?.docs?.source},description:{story:`Opens a nested-capable confirmation without a parent modal and verifies it
safely falls back to the viewport backdrop and centring behavior.

@summary viewport fallback for a nested-capable confirmation`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  ...NestedInDrawer,
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const view = canvasElement.ownerDocument.defaultView;
    const drawer = body.getByRole('dialog', {
      name: 'Record editor'
    });
    const drawerOverlay = drawer.parentElement?.parentElement;
    await userEvent.click(body.getByRole('button', {
      name: 'Close editor and confirm'
    }));
    const dialog = body.getByRole('alertdialog', {
      name: 'Discard changes?'
    });
    const overlay = dialog.parentElement?.parentElement;
    if (overlay === null || overlay === undefined || drawerOverlay === null || drawerOverlay === undefined || view === null) {
      throw new Error('Expected the nested confirmation and drawer overlays.');
    }
    await waitFor(async () => {
      await expect(drawer).toBeInTheDocument();
      await expect(drawer.closest('[data-exiting]')).not.toBeNull();
      await expect(view.getComputedStyle(drawerOverlay).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      await expect(view.getComputedStyle(overlay).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });
    await waitFor(async () => {
      await expect(body.queryByRole('dialog', {
        name: 'Record editor'
      })).not.toBeInTheDocument();
      const overlayBounds = overlay.getBoundingClientRect();
      const dialogBounds = dialog.getBoundingClientRect();
      await expect(overlay).not.toHaveAttribute('data-nested-boundary');
      await expect(view.getComputedStyle(overlay).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      await expect(overlayBounds.left).toBe(0);
      await expect(overlayBounds.top).toBe(0);
      await expect(overlayBounds.width).toBe(view.innerWidth);
      await expect(overlayBounds.height).toBe(view.innerHeight);
      await expect(dialogBounds.left + dialogBounds.width / 2).toBeCloseTo(view.innerWidth / 2, 1);
      await expect(dialogBounds.top + dialogBounds.height / 2).toBeCloseTo(view.innerHeight / 2, 1);
    });
    await waitFor(() => expect(body.getByRole('button', {
      name: 'Keep editing'
    })).toHaveFocus());
  },
  render: args => <ExitingParentConfirmationExample confirmation={args} />
}`,...K.parameters?.docs?.source},description:{story:`Closes the owning drawer while its sibling confirmation remains open and
verifies that the decision rebinds from the exiting surface to the viewport.

@summary viewport fallback after the parent drawer exits`,...K.parameters?.docs?.description}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  ...NestedAfterParentExit,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  }
}`,...q.parameters?.docs?.source},description:{story:`Exercises parent-exit fallback in the compact full-screen drawer.`,...q.parameters?.docs?.description}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    cancelLabel: 'Cancel',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Delete configuration',
    description: 'The legacy configuration and its linked file will be permanently removed.',
    onConfirm: fn(),
    open: true,
    readOnly: true,
    title: 'Delete configuration?',
    trigger: 'Delete configuration'
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Delete configuration?'
    });
    const heading = body.getByRole('heading', {
      name: 'Delete configuration?'
    });
    const header = heading.parentElement?.parentElement;
    const icon = dialog.querySelector<HTMLElement>('[data-confirmation-icon]');
    const description = body.getByText('The legacy configuration and its linked file will be permanently removed.');
    const actions = body.getByRole('group');
    const cancel = body.getByRole('button', {
      name: 'Cancel'
    });
    const close = body.getByRole('button', {
      name: 'Close confirmation'
    });
    const warningIcon = icon?.querySelector('.lucide-triangle-alert');
    const view = canvasElement.ownerDocument.defaultView;
    const cancelStyle = view?.getComputedStyle(cancel);
    const dialogStyle = view?.getComputedStyle(dialog);
    const closeStyle = view?.getComputedStyle(close);
    const titleStyle = view?.getComputedStyle(heading);
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(canvasElement.getBoundingClientRect().width);
    await expect(dialogStyle?.borderTopWidth).toBe('0px');
    await expect(dialogStyle?.borderRightWidth).toBe('0px');
    await expect(dialogStyle?.borderBottomWidth).toBe('2px');
    await expect(dialogStyle?.borderLeftWidth).toBe('0px');
    await expect(dialogStyle?.padding).toBe('0px');
    await expect(dialogStyle?.boxShadow).toContain('rgba(6, 12, 24, 0.22) 0px 8px 0px 0px');
    await expect(header?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(icon?.getBoundingClientRect().width).toBe(icon?.getBoundingClientRect().height);
    await expect(view?.getComputedStyle(icon as HTMLElement).borderTopWidth).toBe('0px');
    await expect(warningIcon).toBeInTheDocument();
    await expect(titleStyle?.fontFamily).toContain('Cabin');
    await expect(titleStyle?.fontSize).toBe('24px');
    await expect(Number.parseFloat(titleStyle?.lineHeight ?? '0')).toBeCloseTo(28.8, 4);
    await expect(view?.getComputedStyle(description).fontSize).toBe('16px');
    await expect(view?.getComputedStyle(actions).gap).toBe('10px');
    await expect(closeStyle?.borderTopWidth).toBe('0px');
    await expect(closeStyle?.borderRightWidth).toBe('0px');
    await expect(closeStyle?.borderBottomWidth).toBe('0px');
    await expect(closeStyle?.borderLeftWidth).toBe('0px');
    await expect(cancelStyle?.color).toBe('rgb(24, 32, 51)');
    await expect(cancelStyle?.borderColor).toBe('rgb(189, 197, 210)');
    await expect(cancel).toHaveFocus();
  }
}`,...J.parameters?.docs?.source},description:{story:`Keeps a destructive confirmation immutably open to document its complete
alert-dialog anatomy, initial cancel focus, typography, icon, and action
styling.

@summary read-only open destructive confirmation anatomy`,...J.parameters?.docs?.description}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  ...DestructiveOpen,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Delete configuration?'
    });
    const heading = body.getByRole('heading', {
      name: 'Delete configuration?'
    });
    const header = heading.parentElement?.parentElement;
    const actions = body.getByRole('group');
    const actionButtons = within(actions).getAllByRole('button');
    const view = canvasElement.ownerDocument.defaultView;
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(canvasElement.getBoundingClientRect().width);
    await expect(header?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(view?.getComputedStyle(actions).flexDirection).toBe('column-reverse');
    await expect(actionButtons[1].getBoundingClientRect().top).toBeLessThan(actionButtons[0].getBoundingClientRect().top);
    await Promise.all(actionButtons.map(button => expect(button.getBoundingClientRect().width).toBeLessThanOrEqual(dialog.getBoundingClientRect().width)));
    await expect(body.getByRole('button', {
      name: 'Cancel'
    })).toHaveFocus();
  }
}`,...Y.parameters?.docs?.source},description:{story:`Exercises the destructive confirmation at the canonical compact viewport,
where actions stack in a safe visual order and remain within the modal
surface.

@summary compact stacked destructive confirmation actions`,...Y.parameters?.docs?.description}}};try{P.displayName=`ConfirmationDialog`,P.__docgenInfo={description:`Presents a focused explicit decision while retaining focus restoration.`,displayName:`ConfirmationDialog`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{cancelLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Visible label for the non-confirming close action.`,name:`cancelLabel`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},closeLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Accessible label for the icon-only header close action.`,name:`closeLabel`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`string`}},confirmLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Visible label for the confirming action.`,name:`confirmLabel`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Consequence or decision context announced by the dialog.`,name:`description`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:"Prevents the confirming action. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},nested:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:"Dims and centres within the nearest existing modal layer. Defaults to `false`.",name:`nested`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onConfirm:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Reports the explicit confirming decision.`,name:`onConfirm`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`() => void`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:`Dialog heading.`,name:`title`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},variant:{defaultValue:{value:`danger`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`}],description:"Semantic confirming action colour. Defaults to `danger`.",name:`variant`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ConfirmationDialogSharedProps`},required:!1,tags:{},type:{name:`"danger" | "primary" | "warning" | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:"Initial open state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:`Called with the next externally controlled open state.
Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:`Current externally controlled open state.
Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ControlledConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`ReadOnlyConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`UncontrolledConfirmationDialogProps`}],description:`Marks controlled state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`}],description:`Semantic action content that opens the dialog.`,name:`trigger`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`ReactNode`}},triggerAppearance:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`}],description:"Visual treatment for the trigger. Defaults to `solid`.",name:`triggerAppearance`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`VisualAppearance | undefined`}},triggerless:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`},{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggeredConfirmationDialogProps`}],description:`Omits the pattern trigger for state controlled by an external action.
Uses the pattern's semantic trigger to coordinate dialog state.`,name:`triggerless`,parent:{fileName:`breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.tsx`,name:`TriggerlessConfirmationDialogProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`consequential decision pattern with safe initial focus`}}}catch{}try{F.displayName=`Destructive`,F.__docgenInfo={description:`Opens an uncontrolled destructive confirmation, activates the explicit
confirming action, and verifies the application-owned callback is invoked
once.`,displayName:`Destructive`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`uncontrolled destructive decision and confirmation`}}}catch{}try{I.displayName=`ControlledOpen`,I.__docgenInfo={description:`Presents an application-controlled warning decision already open, with the
parent responsible for accepting every subsequent open-state request.`,displayName:`ControlledOpen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`controlled open warning confirmation`}}}catch{}try{L.displayName=`TriggerlessControlled`,L.__docgenInfo={description:`Opens a controlled warning confirmation from an application-owned action
outside the fixed pattern and restores focus there after cancellation.`,displayName:`TriggerlessControlled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`externally triggered controlled confirmation`}}}catch{}try{R.displayName=`NestedInDrawer`,R.__docgenInfo={description:`Opens a warning confirmation inside a desktop drawer and limits the new
dimming layer and dialog centring to that parent task surface.`,displayName:`NestedInDrawer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`drawer-scoped nested confirmation backdrop`}}}catch{}try{z.displayName=`NestedInDrawerCompact`,z.__docgenInfo={description:`Exercises the same nested decision in the compact full-screen drawer, where
the scoped dimming layer naturally fills the mobile task surface.`,displayName:`NestedInDrawerCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`compact full-screen nested confirmation backdrop`}}}catch{}try{B.displayName=`NestedOpenWithDrawer`,B.__docgenInfo={description:`Opens the sibling drawer and confirmation in the same render and verifies
the next-frame boundary reconciliation scopes the decision to the drawer.`,displayName:`NestedOpenWithDrawer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`simultaneous sibling drawer and confirmation mounting`}}}catch{}try{V.displayName=`NestedOverNestedDrawer`,V.__docgenInfo={description:`Opens a confirmation logically owned by an outer drawer while an inner
drawer is the active topmost task, and scopes the decision to that task.`,displayName:`NestedOverNestedDrawer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`topmost nested drawer confirmation boundary`}}}catch{}try{H.displayName=`NestedOverNestedDrawerCompact`,H.__docgenInfo={description:`Exercises the topmost nested drawer boundary when every modal layer fills a
compact viewport.`,displayName:`NestedOverNestedDrawerCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`compact topmost nested drawer confirmation boundary`}}}catch{}try{U.displayName=`NestedOverActiveIndependentStack`,U.__docgenInfo={description:`Keeps a deeper modal tree mounted behind a later root task and verifies that
portal stacking selects the active root before considering nested depth.`,displayName:`NestedOverActiveIndependentStack`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`active independent modal stack boundary`}}}catch{}try{W.displayName=`NestedReplacementBackdrop`,W.__docgenInfo={description:`Replaces a scoped confirmation during its exit and verifies that the old
pseudo-backdrop no longer contributes a second dimming layer.`,displayName:`NestedReplacementBackdrop`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`single backdrop while replacing nested confirmations`}}}catch{}try{G.displayName=`NestedWithoutParent`,G.__docgenInfo={description:`Opens a nested-capable confirmation without a parent modal and verifies it
safely falls back to the viewport backdrop and centring behavior.`,displayName:`NestedWithoutParent`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`viewport fallback for a nested-capable confirmation`}}}catch{}try{K.displayName=`NestedAfterParentExit`,K.__docgenInfo={description:`Closes the owning drawer while its sibling confirmation remains open and
verifies that the decision rebinds from the exiting surface to the viewport.`,displayName:`NestedAfterParentExit`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`viewport fallback after the parent drawer exits`}}}catch{}try{q.displayName=`NestedAfterParentExitCompact`,q.__docgenInfo={description:`Exercises parent-exit fallback in the compact full-screen drawer.`,displayName:`NestedAfterParentExitCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{J.displayName=`DestructiveOpen`,J.__docgenInfo={description:`Keeps a destructive confirmation immutably open to document its complete
alert-dialog anatomy, initial cancel focus, typography, icon, and action
styling.`,displayName:`DestructiveOpen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`read-only open destructive confirmation anatomy`}}}catch{}try{Y.displayName=`DestructiveCompact`,Y.__docgenInfo={description:`Exercises the destructive confirmation at the canonical compact viewport,
where actions stack in a safe visual order and remain within the modal
surface.`,displayName:`DestructiveCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ConfirmationDialog/ConfirmationDialog.stories.tsx`,methods:[],props:{},tags:{summary:`compact stacked destructive confirmation actions`}}}catch{}X=[`Destructive`,`ControlledOpen`,`TriggerlessControlled`,`NestedInDrawer`,`NestedInDrawerCompact`,`NestedOpenWithDrawer`,`NestedOverNestedDrawer`,`NestedOverNestedDrawerCompact`,`NestedOverActiveIndependentStack`,`NestedReplacementBackdrop`,`NestedWithoutParent`,`NestedAfterParentExit`,`NestedAfterParentExitCompact`,`DestructiveOpen`,`DestructiveCompact`]}));Z();export{I as ControlledOpen,F as Destructive,Y as DestructiveCompact,J as DestructiveOpen,K as NestedAfterParentExit,q as NestedAfterParentExitCompact,R as NestedInDrawer,z as NestedInDrawerCompact,B as NestedOpenWithDrawer,U as NestedOverActiveIndependentStack,V as NestedOverNestedDrawer,H as NestedOverNestedDrawerCompact,W as NestedReplacementBackdrop,G as NestedWithoutParent,L as TriggerlessControlled,X as __namedExportsOrder,P as default,Z as n,y as t};