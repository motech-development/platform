import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,l as a,r as o}from"./iframe-i3W5vvo3.js";import{n as s,t as c}from"./Typography-BglUVQpl.js";import{c as l}from"./Menu-fcaKauPN.js";import{a as u,c as d,i as f,n as p,o as m,r as h,s as g}from"./OverlayParts-BTxJYRAF.js";import{n as _,t as v}from"./ButtonGroup-Bu2pqT_H.js";import{n as y,t as b}from"./Stack-DA68Fogw.js";import{o as x,s as S}from"./TextField-hx04eKQC.js";function C({defaultOpen:e,onOpenChange:t,open:n,readOnly:r,...i}){return a(),(0,w.createElement)(l,{...i,defaultOpen:e,isOpen:n,onOpenChange:t})}var w,T,E=t((()=>{w=n(r(),1),d(),g(),i(),T={Close:h,Content:p,Description:f,Root:C,Title:u,Trigger:m};try{C.displayName=`Root`,C.__docgenInfo={description:`Coordinates dialog trigger, open state, focus, and restoration.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`}],description:`Trigger and content parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:"Initial open state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Marks controlled state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{T.displayName=`Dialog`,T.__docgenInfo={description:`Accessible compound modal dialog primitive.`,displayName:`Dialog`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.tsx`,methods:[],props:{},tags:{summary:`modal content with focus containment and restoration`}}}catch{}})),D=e({ControlledFocusAndDismissal:()=>R,ControlledFocusAndDismissalCompact:()=>z,LongExtremeContent:()=>B,ReadOnlyOpen:()=>V,__namedExportsOrder:()=>H,default:()=>L});function O(){let[e,t]=(0,j.useState)(!1);return(0,M.jsxs)(T.Root,{onOpenChange:t,open:e,children:[(0,M.jsx)(T.Trigger,{children:`Open controlled dialog`}),(0,M.jsxs)(T.Content,{children:[(0,M.jsx)(T.Title,{children:`Controlled settings`}),(0,M.jsx)(T.Description,{children:`Focus is contained until this modal closes.`}),(0,M.jsxs)(b,{gap:`xl`,children:[(0,M.jsxs)(x.Root,{children:[(0,M.jsx)(x.Label,{children:`Display name`}),(0,M.jsx)(x.Input,{autoFocus:!0})]}),(0,M.jsx)(v,{align:`end`,orientation:{base:`vertical`,sm:`horizontal`},children:(0,M.jsx)(T.Close,{children:`Save and close`})})]})]})]})}async function k(e){let t=I(e).getByRole(`button`,{name:`Open controlled dialog`});await P.click(t);let n=I(e.ownerDocument.body).getByRole(`dialog`,{name:`Controlled settings`});await F(()=>N(n).toBeVisible());let r=I(n).getByRole(`textbox`,{name:`Display name`}),i=I(n).getByText(`Display name`),a=I(n).getByRole(`group`),o=I(a).getByRole(`button`,{name:`Save and close`}),s=getComputedStyle(r),c=getComputedStyle(i);return await N(n).toHaveAccessibleDescription(`Focus is contained until this modal closes.`),await N(r).toHaveFocus(),await N(r.getBoundingClientRect().height).toBeGreaterThanOrEqual(44),await N(s.borderTopWidth).toBe(`1px`),await N(s.fontFamily).toContain(`Helvetica Neue`),await N(c.fontFamily).toContain(`Cabin`),await N(c.fontWeight).toBe(`700`),await N(r.getBoundingClientRect().width).toBe(r.parentElement.getBoundingClientRect().width),await N(a.getBoundingClientRect().top-r.getBoundingClientRect().bottom).toBe(24),await N(n.scrollWidth).toBeLessThanOrEqual(n.clientWidth),{actions:a,dialog:n,input:r,save:o,trigger:t}}async function A(e,t){await F(()=>N(I(e.ownerDocument.body).queryByRole(`dialog`)).not.toBeInTheDocument()),await N(t).toHaveFocus()}var j,M,N,P,F,I,L,R,z,B,V,H,U=t((()=>{j=n(r(),1),g(),_(),y(),S(),s(),E(),M=o(),{expect:N,userEvent:P,waitFor:F,within:I}=__STORYBOOK_MODULE_TEST__,L={component:C,decorators:[e=>(Object.assign(T.Close,{displayName:`Dialog.Close`}),Object.assign(T.Content,{displayName:`Dialog.Content`}),Object.assign(T.Description,{displayName:`Dialog.Description`}),Object.assign(T.Root,{displayName:`Dialog.Root`}),Object.assign(T.Title,{displayName:`Dialog.Title`}),Object.assign(T.Trigger,{displayName:`Dialog.Trigger`}),Object.assign(x.Input,{displayName:`TextField.Input`}),Object.assign(x.Label,{displayName:`TextField.Label`}),Object.assign(x.Root,{displayName:`TextField.Root`}),(0,M.jsx)(e,{}))],subcomponents:{Close:h,Content:p,Description:f,Title:u,Trigger:m},title:`Primitives/Overlays/Dialog`},R={args:{children:null},play:async({canvasElement:e})=>{let{actions:t,save:n,trigger:r}=await k(e),i=getComputedStyle(t);await N(i.flexDirection).toBe(`row`),await N(i.justifyContent).toBe(`flex-end`),await N(n.getBoundingClientRect().width).toBeLessThan(t.getBoundingClientRect().width),await P.keyboard(`{Escape}`),await A(e,r);let a=await k(e);await P.click(a.save),await A(e,a.trigger)},render:O},z={...R,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let{actions:t,save:n,trigger:r}=await k(e),i=getComputedStyle(t);await N(i.flexDirection).toBe(`column`),await N(n.getBoundingClientRect().width).toBe(t.getBoundingClientRect().width),await P.keyboard(`{Escape}`),await A(e,r);let a=await k(e);await P.click(a.save),await A(e,a.trigger)}},B={args:{children:(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(T.Trigger,{children:`Open long dialog`}),(0,M.jsxs)(T.Content,{children:[(0,M.jsx)(T.Title,{children:`A deliberately long accessible title that remains readable at narrow widths`}),(0,M.jsx)(T.Description,{children:`Long content scrolls inside the dialog while the page remains locked.`}),(0,M.jsx)(c,{children:`Scrollable paragraph 1`}),(0,M.jsx)(c,{children:`Scrollable paragraph 2`}),(0,M.jsx)(c,{children:`Scrollable paragraph 3`}),(0,M.jsx)(c,{children:`Scrollable paragraph 4`}),(0,M.jsx)(c,{children:`Scrollable paragraph 5`}),(0,M.jsx)(c,{children:`Scrollable paragraph 6`}),(0,M.jsx)(c,{children:`Scrollable paragraph 7`}),(0,M.jsx)(c,{children:`Scrollable paragraph 8`}),(0,M.jsx)(c,{children:`Scrollable paragraph 9`}),(0,M.jsx)(c,{children:`Scrollable paragraph 10`}),(0,M.jsx)(c,{children:`Scrollable paragraph 11`}),(0,M.jsx)(c,{children:`Scrollable paragraph 12`}),(0,M.jsx)(T.Close,{children:`Close`})]})]})}},V={args:{children:(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(T.Trigger,{children:`Persistent`}),(0,M.jsxs)(T.Content,{children:[(0,M.jsx)(T.Title,{children:`Read-only state`}),(0,M.jsx)(T.Description,{children:`Escape requests dismissal, but application state remains open.`}),(0,M.jsx)(T.Close,{children:`Request close`})]})]}),open:!0,readOnly:!0}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source},description:{story:`Opens an application-controlled modal, moves focus into its form, verifies
accessible description and wide action layout, then tests Escape and
explicit close restoration.

@summary controlled modal focus dismissal and restoration`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source},description:{story:`Repeats the controlled focus and dismissal workflow at the compact viewport,
where the action group stacks and its close action fills the available
width.

@summary compact controlled modal action layout`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source},description:{story:`Presents a long accessible title and enough body copy to exercise the modal
height boundary and internal scrolling without unlocking the underlying
page.

@summary scrollable modal with extreme content`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source},description:{story:`Keeps controlled dialog state intentionally immutable so dismissal actions
may be requested while the application-supplied open state remains visible.

@summary immutable controlled open dialog`,...V.parameters?.docs?.description}}};try{L.displayName=`Root`,L.__docgenInfo={description:`Coordinates dialog trigger, open state, focus, and restoration.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`}],description:`Trigger and content parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`DialogRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:"Initial open state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ReadOnlyDialogRootProps`},{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`UncontrolledDialogRootProps`}],description:`Marks controlled state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Dialog/Dialog.tsx`,name:`ControlledDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{R.displayName=`ControlledFocusAndDismissal`,R.__docgenInfo={description:`Opens an application-controlled modal, moves focus into its form, verifies
accessible description and wide action layout, then tests Escape and
explicit close restoration.`,displayName:`ControlledFocusAndDismissal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`controlled modal focus dismissal and restoration`}}}catch{}try{z.displayName=`ControlledFocusAndDismissalCompact`,z.__docgenInfo={description:`Repeats the controlled focus and dismissal workflow at the compact viewport,
where the action group stacks and its close action fills the available
width.`,displayName:`ControlledFocusAndDismissalCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`compact controlled modal action layout`}}}catch{}try{B.displayName=`LongExtremeContent`,B.__docgenInfo={description:`Presents a long accessible title and enough body copy to exercise the modal
height boundary and internal scrolling without unlocking the underlying
page.`,displayName:`LongExtremeContent`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`scrollable modal with extreme content`}}}catch{}try{V.displayName=`ReadOnlyOpen`,V.__docgenInfo={description:`Keeps controlled dialog state intentionally immutable so dismissal actions
may be requested while the application-supplied open state remains visible.`,displayName:`ReadOnlyOpen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{summary:`immutable controlled open dialog`}}}catch{}H=[`ControlledFocusAndDismissal`,`ControlledFocusAndDismissalCompact`,`LongExtremeContent`,`ReadOnlyOpen`]}));U();export{R as ControlledFocusAndDismissal,z as ControlledFocusAndDismissalCompact,B as LongExtremeContent,V as ReadOnlyOpen,H as __namedExportsOrder,L as default,U as n,D as t};