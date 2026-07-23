import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{a as r,i,o as a,r as o,s}from"./OverlayParts-CyAurcr-.js";import{a as c,i as l,n as u,r as d,t as f}from"./AlertDialog-CqdZkZiY.js";var p=e({ExplicitDecision:()=>S,ExplicitDecisionCompact:()=>C,KeyboardDismissDisabled:()=>w,KeyboardDismissDisabledCompact:()=>T,__namedExportsOrder:()=>E,default:()=>x});async function m(e){let t=b(e).getByRole(`button`,{name:`Delete saved view`});await v.click(t);let n=b(e.ownerDocument.body).getByRole(`alertdialog`,{name:`Delete this saved view?`});await y(()=>_(n).toBeVisible());let r=b(n).getByRole(`group`),i=b(r).getByRole(`button`,{name:`Cancel`}),a=b(r).getByRole(`button`,{name:`Delete permanently`});return await _(n).toHaveAccessibleDescription(`This action permanently removes the saved view and cannot be undone.`),await _(getComputedStyle(r).gap).toBe(`10px`),await _(i).toHaveFocus(),{actions:r,cancel:i,destructive:a,dialog:n,trigger:t}}async function h(e,t,n){await v.click(t),await y(()=>_(b(e.ownerDocument.body).queryByRole(`alertdialog`)).not.toBeInTheDocument()),await _(n).toHaveFocus()}var g,_,v,y,b,x,S,C,w,T,E,D=t((()=>{s(),c(),g=n(),{expect:_,userEvent:v,waitFor:y,within:b}=__STORYBOOK_MODULE_TEST__,x={component:l,decorators:[e=>(Object.assign(u.Actions,{displayName:`AlertDialog.Actions`}),Object.assign(u.Close,{displayName:`AlertDialog.Close`}),Object.assign(u.Content,{displayName:`AlertDialog.Content`}),Object.assign(u.Description,{displayName:`AlertDialog.Description`}),Object.assign(u.Root,{displayName:`AlertDialog.Root`}),Object.assign(u.Title,{displayName:`AlertDialog.Title`}),Object.assign(u.Trigger,{displayName:`AlertDialog.Trigger`}),(0,g.jsx)(e,{}))],subcomponents:{Actions:f,Close:o,Content:d,Description:i,Title:r,Trigger:a},title:`Primitives/Overlays/AlertDialog`},S={args:{children:(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(u.Trigger,{variant:`danger`,children:`Delete saved view`}),(0,g.jsxs)(u.Content,{children:[(0,g.jsx)(u.Title,{children:`Delete this saved view?`}),(0,g.jsx)(u.Description,{children:`This action permanently removes the saved view and cannot be undone.`}),(0,g.jsxs)(u.Actions,{children:[(0,g.jsx)(u.Close,{appearance:`outline`,autoFocus:!0,children:`Cancel`}),(0,g.jsx)(u.Close,{variant:`danger`,children:`Delete permanently`})]})]})]})},play:async({canvasElement:e})=>{let{actions:t,cancel:n,destructive:r,trigger:i}=await m(e),a=getComputedStyle(t);await _(a.flexDirection).toBe(`row`),await _(a.justifyContent).toBe(`flex-end`),await _(n.getBoundingClientRect().left).toBeLessThan(r.getBoundingClientRect().left),await _(n.getBoundingClientRect().width).toBeLessThan(t.getBoundingClientRect().width),await _(r.getBoundingClientRect().width).toBeLessThan(t.getBoundingClientRect().width),await h(e,n,i)}},C={...S,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let{actions:t,cancel:n,destructive:r,trigger:i}=await m(e),a=getComputedStyle(t);await _(a.flexDirection).toBe(`column-reverse`),await _(r.getBoundingClientRect().top).toBeLessThan(n.getBoundingClientRect().top),await _(n.getBoundingClientRect().width).toBe(t.getBoundingClientRect().width),await _(r.getBoundingClientRect().width).toBe(t.getBoundingClientRect().width),await h(e,n,i)}},w={args:{children:(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(u.Trigger,{children:`Open protected alert`}),(0,g.jsxs)(u.Content,{keyboardDismissDisabled:!0,children:[(0,g.jsx)(u.Title,{children:`Resolve the interruption`}),(0,g.jsx)(u.Description,{children:`Escape is disabled; choose the explicit action.`}),(0,g.jsx)(u.Actions,{children:(0,g.jsx)(u.Close,{autoFocus:!0,children:`Continue`})})]})]})},play:async({canvasElement:e})=>{let t=b(e).getByRole(`button`,{name:`Open protected alert`});await v.click(t);let n=b(e.ownerDocument.body).getByRole(`alertdialog`,{name:`Resolve the interruption`}),r=b(n).getByRole(`group`),i=b(r).getByRole(`button`,{name:`Continue`}),a=getComputedStyle(r);await _(i).toHaveFocus(),await _(a.gap).toBe(`10px`),await _(a.flexDirection).toBe(`row`),await _(a.justifyContent).toBe(`flex-end`),await _(i.getBoundingClientRect().width).toBeLessThan(r.getBoundingClientRect().width),await v.click(i),await y(()=>_(n).not.toBeInTheDocument()),await _(t).toHaveFocus()}},T={...w,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=b(e).getByRole(`button`,{name:`Open protected alert`});await v.click(t);let n=b(e.ownerDocument.body).getByRole(`alertdialog`,{name:`Resolve the interruption`}),r=b(n).getByRole(`group`),i=b(r).getByRole(`button`,{name:`Continue`}),a=getComputedStyle(r);await _(a.flexDirection).toBe(`column-reverse`),await _(a.gap).toBe(`10px`),await _(i.getBoundingClientRect().width).toBe(r.getBoundingClientRect().width),await _(i).toHaveFocus(),await v.click(i),await y(()=>_(n).not.toBeInTheDocument()),await _(t).toHaveFocus()}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <AlertDialog.Trigger variant="danger">
          Delete saved view
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete this saved view?</AlertDialog.Title>
          <AlertDialog.Description>
            This action permanently removes the saved view and cannot be undone.
          </AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close appearance="outline" autoFocus>
              Cancel
            </AlertDialog.Close>
            <AlertDialog.Close variant="danger">
              Delete permanently
            </AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Content>
      </>
  },
  play: async ({
    canvasElement
  }) => {
    const {
      actions,
      cancel,
      destructive,
      trigger
    } = await openExplicitDecision(canvasElement);
    const actionsStyle = getComputedStyle(actions);
    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(cancel.getBoundingClientRect().left).toBeLessThan(destructive.getBoundingClientRect().left);
    await expect(cancel.getBoundingClientRect().width).toBeLessThan(actions.getBoundingClientRect().width);
    await expect(destructive.getBoundingClientRect().width).toBeLessThan(actions.getBoundingClientRect().width);
    await expectCancelDismissal(canvasElement, cancel, trigger);
  }
}`,...S.parameters?.docs?.source},description:{story:`Composes the required title, consequence description, grouped cancel and
destructive close actions, then verifies initial focus, wide-screen end
alignment, dismissal, and trigger focus restoration.

@summary Wide alert-dialog decision anatomy and focus lifecycle.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  ...ExplicitDecision,
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
      cancel,
      destructive,
      trigger
    } = await openExplicitDecision(canvasElement);
    const actionsStyle = getComputedStyle(actions);
    await expect(actionsStyle.flexDirection).toBe('column-reverse');
    await expect(destructive.getBoundingClientRect().top).toBeLessThan(cancel.getBoundingClientRect().top);
    await expect(cancel.getBoundingClientRect().width).toBe(actions.getBoundingClientRect().width);
    await expect(destructive.getBoundingClientRect().width).toBe(actions.getBoundingClientRect().width);
    await expectCancelDismissal(canvasElement, cancel, trigger);
  }
}`,...C.parameters?.docs?.source},description:{story:`Reuses the explicit destructive decision at the compact viewport, proving
both actions become full width while visual order keeps the destructive
choice above cancel and keyboard order remains logical.

@summary Compact full-width alert-dialog action ordering.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <AlertDialog.Trigger>Open protected alert</AlertDialog.Trigger>
        <AlertDialog.Content keyboardDismissDisabled>
          <AlertDialog.Title>Resolve the interruption</AlertDialog.Title>
          <AlertDialog.Description>
            Escape is disabled; choose the explicit action.
          </AlertDialog.Description>
          <AlertDialog.Actions>
            <AlertDialog.Close autoFocus>Continue</AlertDialog.Close>
          </AlertDialog.Actions>
        </AlertDialog.Content>
      </>
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Open protected alert'
    });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Resolve the interruption'
    });
    const actions = within(dialog).getByRole('group');
    const action = within(actions).getByRole('button', {
      name: 'Continue'
    });
    const actionsStyle = getComputedStyle(actions);
    await expect(action).toHaveFocus();
    await expect(actionsStyle.gap).toBe('10px');
    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(action.getBoundingClientRect().width).toBeLessThan(actions.getBoundingClientRect().width);
    await userEvent.click(action);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
}`,...w.parameters?.docs?.source},description:{story:`Sets \`keyboardDismissDisabled\` on Content for a protected interruption that
can close only through its explicit Continue action, while verifying focus
starts on that action and returns to the trigger.

@summary Explicit-only dismissal with Escape disabled.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  ...KeyboardDismissDisabled,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Open protected alert'
    });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Resolve the interruption'
    });
    const actions = within(dialog).getByRole('group');
    const action = within(actions).getByRole('button', {
      name: 'Continue'
    });
    const actionsStyle = getComputedStyle(actions);
    await expect(actionsStyle.flexDirection).toBe('column-reverse');
    await expect(actionsStyle.gap).toBe('10px');
    await expect(action.getBoundingClientRect().width).toBe(actions.getBoundingClientRect().width);
    await expect(action).toHaveFocus();
    await userEvent.click(action);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
}`,...T.parameters?.docs?.source},description:{story:`Exercises the Escape-disabled protected interruption at compact width,
confirming its single explicit action expands to the available width without
weakening focus restoration.

@summary Compact explicit-only alert-dialog dismissal.`,...T.parameters?.docs?.description}}};try{x.displayName=`Root`,x.__docgenInfo={description:`Coordinates an accessible modal decision that requires acknowledgement.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/AlertDialog/AlertDialog.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`AlertDialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`AlertDialogRootSharedProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`AlertDialogRootSharedProps`}],description:`Trigger and alert content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`AlertDialogRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ReadOnlyAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`UncontrolledAlertDialogRootProps`}],description:`Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ReadOnlyAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`UncontrolledAlertDialogRootProps`}],description:`Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ReadOnlyAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`UncontrolledAlertDialogRootProps`}],description:`Initial open state.`,name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ReadOnlyAlertDialogRootProps`},{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`UncontrolledAlertDialogRootProps`}],description:`Marks controlled state immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/AlertDialog/AlertDialog.tsx`,name:`ControlledAlertDialogRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{S.displayName=`ExplicitDecision`,S.__docgenInfo={description:`Composes the required title, consequence description, grouped cancel and
destructive close actions, then verifies initial focus, wide-screen end
alignment, dismissal, and trigger focus restoration.`,displayName:`ExplicitDecision`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/AlertDialog/AlertDialog.stories.tsx`,methods:[],props:{},tags:{summary:`Wide alert-dialog decision anatomy and focus lifecycle.`}}}catch{}try{C.displayName=`ExplicitDecisionCompact`,C.__docgenInfo={description:`Reuses the explicit destructive decision at the compact viewport, proving
both actions become full width while visual order keeps the destructive
choice above cancel and keyboard order remains logical.`,displayName:`ExplicitDecisionCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/AlertDialog/AlertDialog.stories.tsx`,methods:[],props:{},tags:{summary:`Compact full-width alert-dialog action ordering.`}}}catch{}try{w.displayName=`KeyboardDismissDisabled`,w.__docgenInfo={description:`Sets \`keyboardDismissDisabled\` on Content for a protected interruption that
can close only through its explicit Continue action, while verifying focus
starts on that action and returns to the trigger.`,displayName:`KeyboardDismissDisabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/AlertDialog/AlertDialog.stories.tsx`,methods:[],props:{},tags:{summary:`Explicit-only dismissal with Escape disabled.`}}}catch{}try{T.displayName=`KeyboardDismissDisabledCompact`,T.__docgenInfo={description:`Exercises the Escape-disabled protected interruption at compact width,
confirming its single explicit action expands to the available width without
weakening focus restoration.`,displayName:`KeyboardDismissDisabledCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/AlertDialog/AlertDialog.stories.tsx`,methods:[],props:{},tags:{summary:`Compact explicit-only alert-dialog dismissal.`}}}catch{}E=[`ExplicitDecision`,`ExplicitDecisionCompact`,`KeyboardDismissDisabled`,`KeyboardDismissDisabledCompact`]}));D();export{S as ExplicitDecision,C as ExplicitDecisionCompact,w as KeyboardDismissDisabled,T as KeyboardDismissDisabledCompact,E as __namedExportsOrder,x as default,D as n,p as t};