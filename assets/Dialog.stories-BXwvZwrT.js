import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{n as i,r as a}from"./BreezeContext-BIB7r8Lx.js";import{t as o}from"./jsx-runtime-cM__dR4X.js";import{n as s,t as c}from"./Typography-1Jx1YbNx.js";import{l}from"./Menu-CmNqYwh3.js";import{a as u,c as d,i as f,n as p,o as m,r as h,s as g}from"./OverlayParts-BWoTEbIH.js";import{i as _,n as v}from"./Drawer-QRbpS9m6.js";import{n as y,t as b}from"./ButtonGroup-CC9wEfP6.js";import{n as x,t as S}from"./Stack-0pHCj1U7.js";import{o as C,s as w}from"./TextField-DUkhVOns.js";function T({defaultOpen:e,onOpenChange:t,open:n,readOnly:r,...i}){return a(),(0,E.createElement)(l,{...i,defaultOpen:e,isOpen:n,onOpenChange:t})}var E,D,O=t((()=>{E=e(r(),1),d(),g(),i(),D={Close:h,Content:p,Description:f,Root:T,Title:u,Trigger:m};try{T.displayName=`Root`,T.__docgenInfo={description:`Coordinates dialog trigger, open state, focus, and restoration.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`}],description:`Trigger and content parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:"Initial open state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Marks controlled state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{D.displayName=`Dialog`,D.__docgenInfo={description:`Accessible compound modal dialog primitive.`,displayName:`Dialog`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.tsx`,methods:[],props:{},tags:{summary:`modal content with focus containment and restoration`}}}catch{}})),k=n({ControlledFocusAndDismissal:()=>V,ControlledFocusAndDismissalCompact:()=>H,LongExtremeContent:()=>G,NestedBackdropDismissal:()=>U,NestedBackdropDismissalCompact:()=>W,ReadOnlyOpen:()=>K,__namedExportsOrder:()=>q,default:()=>B});function A(){let[e,t]=(0,P.useState)(!1);return(0,F.jsxs)(D.Root,{onOpenChange:t,open:e,children:[(0,F.jsx)(D.Trigger,{children:`Open controlled dialog`}),(0,F.jsxs)(D.Content,{children:[(0,F.jsx)(D.Title,{children:`Controlled settings`}),(0,F.jsx)(D.Description,{children:`Focus is contained until this modal closes.`}),(0,F.jsxs)(S,{gap:`xl`,children:[(0,F.jsxs)(C.Root,{children:[(0,F.jsx)(C.Label,{children:`Display name`}),(0,F.jsx)(C.Input,{autoFocus:!0})]}),(0,F.jsx)(b,{align:`end`,orientation:{base:`vertical`,sm:`horizontal`},children:(0,F.jsx)(D.Close,{children:`Save and close`})})]})]})]})}function j(){return(0,F.jsxs)(v.Root,{defaultOpen:!0,children:[(0,F.jsx)(v.Trigger,{children:`Open editor`}),(0,F.jsxs)(v.Content,{placement:{base:`bottom`,md:`end`},size:`wide`,children:[(0,F.jsx)(v.Description,{children:`Update the record details.`}),(0,F.jsx)(v.Title,{children:`Record editor`}),(0,F.jsxs)(D.Root,{children:[(0,F.jsx)(D.Trigger,{children:`Open nested dialog`}),(0,F.jsxs)(D.Content,{nested:!0,children:[(0,F.jsx)(D.Title,{children:`Nested settings`}),(0,F.jsx)(D.Description,{children:`Dismiss this dialog from its scoped backdrop.`}),(0,F.jsx)(D.Close,{children:`Save and close`})]})]})]})]})}async function M(e){let t=z(e).getByRole(`button`,{name:`Open controlled dialog`});await L.click(t);let n=z(e.ownerDocument.body).getByRole(`dialog`,{name:`Controlled settings`});await R(()=>I(n).toBeVisible());let r=z(n).getByRole(`textbox`,{name:`Display name`}),i=z(n).getByText(`Display name`),a=z(n).getByRole(`group`),o=z(a).getByRole(`button`,{name:`Save and close`}),s=getComputedStyle(r),c=getComputedStyle(i);return await I(n).toHaveAccessibleDescription(`Focus is contained until this modal closes.`),await I(r).toHaveFocus(),await I(r.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await I(s.borderTopWidth).toBe(`1px`),await I(s.fontFamily).toContain(`Helvetica Neue`),await I(c.fontFamily).toContain(`Cabin`),await I(c.fontWeight).toBe(`700`),await I(r.getBoundingClientRect().width).toBe(r.parentElement.getBoundingClientRect().width),await I(a.getBoundingClientRect().top-r.getBoundingClientRect().bottom).toBe(24),await I(n.scrollWidth).toBeLessThanOrEqual(n.clientWidth),{actions:a,dialog:n,input:r,save:o,trigger:t}}async function N(e,t){await R(()=>I(z(e.ownerDocument.body).queryByRole(`dialog`)).not.toBeInTheDocument()),await I(t).toHaveFocus()}var P,F,I,L,R,z,B,V,H,U,W,G,K,q,J=t((()=>{P=e(r(),1),g(),y(),_(),x(),w(),s(),O(),F=o(),{expect:I,userEvent:L,waitFor:R,within:z}=__STORYBOOK_MODULE_TEST__,B={component:T,decorators:[e=>(Object.assign(D.Close,{displayName:`Dialog.Close`}),Object.assign(D.Content,{displayName:`Dialog.Content`}),Object.assign(D.Description,{displayName:`Dialog.Description`}),Object.assign(D.Root,{displayName:`Dialog.Root`}),Object.assign(D.Title,{displayName:`Dialog.Title`}),Object.assign(D.Trigger,{displayName:`Dialog.Trigger`}),Object.assign(C.Input,{displayName:`TextField.Input`}),Object.assign(C.Label,{displayName:`TextField.Label`}),Object.assign(C.Root,{displayName:`TextField.Root`}),(0,F.jsx)(e,{}))],subcomponents:{Close:h,Content:p,Description:f,Title:u,Trigger:m},title:`Primitives/Overlays/Dialog`},V={args:{children:null},play:async({canvasElement:e})=>{let{actions:t,save:n,trigger:r}=await M(e),i=getComputedStyle(t);await I(i.flexDirection).toBe(`row`),await I(i.justifyContent).toBe(`flex-end`),await I(n.getBoundingClientRect().width).toBeLessThan(t.getBoundingClientRect().width),await L.keyboard(`{Escape}`),await N(e,r);let a=await M(e);await L.click(a.save),await N(e,a.trigger)},render:A},H={...V,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let{actions:t,save:n,trigger:r}=await M(e),i=getComputedStyle(t);await I(i.flexDirection).toBe(`column`),await I(n.getBoundingClientRect().width).toBe(t.getBoundingClientRect().width),await L.keyboard(`{Escape}`),await N(e,r);let a=await M(e);await L.click(a.save),await N(e,a.trigger)}},U={args:{children:null},play:async({canvasElement:e})=>{let t=z(e.ownerDocument.body),n=t.getByRole(`button`,{name:`Open nested dialog`});await L.click(n);let r=t.getByRole(`dialog`,{name:`Nested settings`}),i=t.getByRole(`dialog`,{name:`Record editor`}),a=r.closest(`.breeze-modal-overlay`),o=r.closest(`.breeze-modal-nested`),s=e.ownerDocument.defaultView;if(a===null||o===null||s===null)throw Error(`Expected the nested dialog modal and overlay.`);await R(async()=>{await I(s.getComputedStyle(o).pointerEvents).toBe(`none`),await I(s.getComputedStyle(r).pointerEvents).toBe(`auto`)}),await R(()=>I(i.getBoundingClientRect().top).toBeCloseTo(0,1));let c=()=>{let t=i.getBoundingClientRect();return e.ownerDocument.elementFromPoint(t.left+8,t.top+8)};await R(()=>I(c()).toBe(a));let l=c();if(l!==a)throw Error(`Expected the scoped backdrop hit target.`);await L.click(l),await R(()=>I(r).not.toBeInTheDocument()),await I(i).toBeVisible(),await R(()=>I(n).toHaveFocus())},render:j},W={...U,globals:{viewport:{value:`mobile1`}}},G={args:{children:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(D.Trigger,{children:`Open long dialog`}),(0,F.jsxs)(D.Content,{children:[(0,F.jsx)(D.Title,{children:`A deliberately long accessible title that remains readable at narrow widths`}),(0,F.jsx)(D.Description,{children:`Long content scrolls inside the dialog while the page remains locked.`}),(0,F.jsx)(c,{children:`Scrollable paragraph 1`}),(0,F.jsx)(c,{children:`Scrollable paragraph 2`}),(0,F.jsx)(c,{children:`Scrollable paragraph 3`}),(0,F.jsx)(c,{children:`Scrollable paragraph 4`}),(0,F.jsx)(c,{children:`Scrollable paragraph 5`}),(0,F.jsx)(c,{children:`Scrollable paragraph 6`}),(0,F.jsx)(c,{children:`Scrollable paragraph 7`}),(0,F.jsx)(c,{children:`Scrollable paragraph 8`}),(0,F.jsx)(c,{children:`Scrollable paragraph 9`}),(0,F.jsx)(c,{children:`Scrollable paragraph 10`}),(0,F.jsx)(c,{children:`Scrollable paragraph 11`}),(0,F.jsx)(c,{children:`Scrollable paragraph 12`}),(0,F.jsx)(D.Close,{children:`Close`})]})]})}},K={args:{children:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(D.Trigger,{children:`Persistent`}),(0,F.jsxs)(D.Content,{children:[(0,F.jsx)(D.Title,{children:`Read-only state`}),(0,F.jsx)(D.Description,{children:`Escape requests dismissal, but application state remains open.`}),(0,F.jsx)(D.Close,{children:`Request close`})]})]}),open:!0,readOnly:!0}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const {
      actions,
      save,
      trigger
    } = await openControlledDialog(canvasElement);
    const actionsStyle = getComputedStyle(actions);
    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(save.getBoundingClientRect().width).toBeLessThan(actions.getBoundingClientRect().width);
    await userEvent.keyboard('{Escape}');
    await expectDismissalAndRestoration(canvasElement, trigger);
    const reopened = await openControlledDialog(canvasElement);
    await userEvent.click(reopened.save);
    await expectDismissalAndRestoration(canvasElement, reopened.trigger);
  },
  render: ControlledDialog
}`,...V.parameters?.docs?.source},description:{story:`Opens an application-controlled modal, moves focus into its form, verifies
accessible description and wide action layout, then tests Escape and
explicit close restoration.

@summary controlled modal focus dismissal and restoration`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  ...ControlledFocusAndDismissal,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const {
      actions,
      save,
      trigger
    } = await openControlledDialog(canvasElement);
    const actionsStyle = getComputedStyle(actions);
    await expect(actionsStyle.flexDirection).toBe('column');
    await expect(save.getBoundingClientRect().width).toBe(actions.getBoundingClientRect().width);
    await userEvent.keyboard('{Escape}');
    await expectDismissalAndRestoration(canvasElement, trigger);
    const reopened = await openControlledDialog(canvasElement);
    await userEvent.click(reopened.save);
    await expectDismissalAndRestoration(canvasElement, reopened.trigger);
  }
}`,...H.parameters?.docs?.source},description:{story:`Repeats the controlled focus and dismissal workflow at the compact viewport,
where the action group stacks and its close action fills the available
width.

@summary compact controlled modal action layout`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = body.getByRole('button', {
      name: 'Open nested dialog'
    });
    await userEvent.click(trigger);
    const dialog = body.getByRole('dialog', {
      name: 'Nested settings'
    });
    const drawer = body.getByRole('dialog', {
      name: 'Record editor'
    });
    const overlay = dialog.closest<HTMLElement>('.breeze-modal-overlay');
    const modal = dialog.closest<HTMLElement>('.breeze-modal-nested');
    const view = canvasElement.ownerDocument.defaultView;
    if (overlay === null || modal === null || view === null) {
      throw new Error('Expected the nested dialog modal and overlay.');
    }
    await waitFor(async () => {
      await expect(view.getComputedStyle(modal).pointerEvents).toBe('none');
      await expect(view.getComputedStyle(dialog).pointerEvents).toBe('auto');
    });
    await waitFor(() => expect(drawer.getBoundingClientRect().top).toBeCloseTo(0, 1));
    const getBackdropTarget = () => {
      const drawerBounds = drawer.getBoundingClientRect();
      return canvasElement.ownerDocument.elementFromPoint(drawerBounds.left + 8, drawerBounds.top + 8);
    };
    await waitFor(() => expect(getBackdropTarget()).toBe(overlay));
    const backdropTarget = getBackdropTarget();
    if (backdropTarget !== overlay) {
      throw new Error('Expected the scoped backdrop hit target.');
    }
    await userEvent.click(backdropTarget);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(drawer).toBeVisible();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
  render: NestedDismissibleDialog
}`,...U.parameters?.docs?.source},description:{story:`Verifies that the visibly dimmed area around a nested, dismissible dialog
remains outside its modal interaction boundary at both responsive layouts.

@summary nested dialog scoped-backdrop dismissal`,...U.parameters?.docs?.description}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  ...NestedBackdropDismissal,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  }
}`,...W.parameters?.docs?.source},description:{story:`Exercises scoped-backdrop dismissal in the compact full-screen drawer.`,...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Dialog.Trigger>Open long dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>
            A deliberately long accessible title that remains readable at narrow
            widths
          </Dialog.Title>
          <Dialog.Description>
            Long content scrolls inside the dialog while the page remains
            locked.
          </Dialog.Description>
          <Typography>Scrollable paragraph 1</Typography>
          <Typography>Scrollable paragraph 2</Typography>
          <Typography>Scrollable paragraph 3</Typography>
          <Typography>Scrollable paragraph 4</Typography>
          <Typography>Scrollable paragraph 5</Typography>
          <Typography>Scrollable paragraph 6</Typography>
          <Typography>Scrollable paragraph 7</Typography>
          <Typography>Scrollable paragraph 8</Typography>
          <Typography>Scrollable paragraph 9</Typography>
          <Typography>Scrollable paragraph 10</Typography>
          <Typography>Scrollable paragraph 11</Typography>
          <Typography>Scrollable paragraph 12</Typography>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </>
  }
}`,...G.parameters?.docs?.source},description:{story:`Presents a long accessible title and enough body copy to exercise the modal
height boundary and internal scrolling without unlocking the underlying
page.

@summary scrollable modal with extreme content`,...G.parameters?.docs?.description}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Dialog.Trigger>Persistent</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Read-only state</Dialog.Title>
          <Dialog.Description>
            Escape requests dismissal, but application state remains open.
          </Dialog.Description>
          <Dialog.Close>Request close</Dialog.Close>
        </Dialog.Content>
      </>,
    open: true,
    readOnly: true
  }
}`,...K.parameters?.docs?.source},description:{story:`Keeps controlled dialog state intentionally immutable so dismissal actions
may be requested while the application-supplied open state remains visible.

@summary immutable controlled open dialog`,...K.parameters?.docs?.description}}};try{B.displayName=`Root`,B.__docgenInfo={description:`Coordinates dialog trigger, open state, focus, and restoration.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`}],description:`Trigger and content parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:"Initial open state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Marks controlled state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{V.displayName=`ControlledFocusAndDismissal`,V.__docgenInfo={description:`Opens an application-controlled modal, moves focus into its form, verifies
accessible description and wide action layout, then tests Escape and
explicit close restoration.`,displayName:`ControlledFocusAndDismissal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`controlled modal focus dismissal and restoration`}}}catch{}try{H.displayName=`ControlledFocusAndDismissalCompact`,H.__docgenInfo={description:`Repeats the controlled focus and dismissal workflow at the compact viewport,
where the action group stacks and its close action fills the available
width.`,displayName:`ControlledFocusAndDismissalCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`compact controlled modal action layout`}}}catch{}try{U.displayName=`NestedBackdropDismissal`,U.__docgenInfo={description:`Verifies that the visibly dimmed area around a nested, dismissible dialog
remains outside its modal interaction boundary at both responsive layouts.`,displayName:`NestedBackdropDismissal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`nested dialog scoped-backdrop dismissal`}}}catch{}try{W.displayName=`NestedBackdropDismissalCompact`,W.__docgenInfo={description:`Exercises scoped-backdrop dismissal in the compact full-screen drawer.`,displayName:`NestedBackdropDismissalCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{G.displayName=`LongExtremeContent`,G.__docgenInfo={description:`Presents a long accessible title and enough body copy to exercise the modal
height boundary and internal scrolling without unlocking the underlying
page.`,displayName:`LongExtremeContent`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`scrollable modal with extreme content`}}}catch{}try{K.displayName=`ReadOnlyOpen`,K.__docgenInfo={description:`Keeps controlled dialog state intentionally immutable so dismissal actions
may be requested while the application-supplied open state remains visible.`,displayName:`ReadOnlyOpen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`immutable controlled open dialog`}}}catch{}q=[`ControlledFocusAndDismissal`,`ControlledFocusAndDismissalCompact`,`NestedBackdropDismissal`,`NestedBackdropDismissalCompact`,`LongExtremeContent`,`ReadOnlyOpen`]}));J();export{V as ControlledFocusAndDismissal,H as ControlledFocusAndDismissalCompact,G as LongExtremeContent,U as NestedBackdropDismissal,W as NestedBackdropDismissalCompact,K as ReadOnlyOpen,q as __namedExportsOrder,B as default,J as n,k as t};