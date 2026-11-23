import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Button-CVjiIIUE.js";import{n as s,t as c}from"./Drawer-CszXBTLv.js";import{n as l,t as u}from"./Dialog-CPZ57ivs.js";import{n as d,t as f}from"./Typography-CEt3x14j.js";import{n as p,t as m}from"./Stack-_A66K6E3.js";import{n as h,t as g}from"./TextField-BHSdRdgB.js";import{n as _,t as v}from"./Inline-COgaq7ET.js";var y=n({Default:()=>O,DiscardChanges:()=>k,__namedExportsOrder:()=>A,default:()=>D});function b(){let[e,t]=(0,x.useState)(!1),[n,r]=(0,x.useState)(!1);return(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(o,{onAction:()=>t(!0),children:`Edit transaction`}),(0,S.jsxs)(c,{onOpenChange:e=>r(!e),open:e,title:`Northwind Supplies`,children:[(0,S.jsx)(g,{defaultValue:`Printer toner`,label:`Description`}),(0,S.jsx)(u,{onOpenChange:r,open:n,title:`Discard changes?`,children:(0,S.jsxs)(m,{children:[(0,S.jsx)(f,{children:`Your changes to this transaction will be lost.`}),(0,S.jsxs)(v,{justify:`end`,children:[(0,S.jsx)(o,{onAction:()=>r(!1),variant:`secondary`,children:`Keep editing`}),(0,S.jsx)(o,{onAction:()=>{r(!1),t(!1)},variant:`danger`,children:`Discard`})]})]})})]})]})}var x,S,C,w,T,E,D,O,k,A,j=t((()=>{x=e(r(),1),a(),s(),_(),p(),h(),d(),l(),S=i(),{expect:C,userEvent:w,waitFor:T,within:E}=__STORYBOOK_MODULE_TEST__,D={args:{children:(0,S.jsx)(f,{children:`Your delivery arrives on Monday.`}),defaultOpen:!0,title:`Delivery details`,trigger:`View delivery details`},component:u,title:`Overlays/Dialog`},O={play:async({canvasElement:e})=>{let t=E(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery details`});await w.click(E(n).getByRole(`button`,{name:`Close`})),await T(async()=>{await C(t.queryByRole(`dialog`,{name:`Delivery details`})).not.toBeInTheDocument()});let r=t.getByRole(`button`,{name:`View delivery details`});await w.click(r),await T(async()=>{await C(t.getByRole(`dialog`,{name:`Delivery details`})).toBeVisible()})}},k={play:async({canvasElement:e})=>{let t=E(e.ownerDocument.body),n=E(e).getByRole(`button`,{name:`Edit transaction`});await w.click(n);let r=await t.findByRole(`dialog`,{name:`Northwind Supplies`});await T(async()=>{await C(r.contains(e.ownerDocument.activeElement)).toBe(!0)}),await w.keyboard(`{Escape}`);let i=await t.findByRole(`dialog`,{name:`Discard changes?`});await w.click(E(i).getByRole(`button`,{name:`Discard`})),await T(async()=>{await C(t.queryByRole(`dialog`)).not.toBeInTheDocument()}),await T(async()=>{await C(n).toHaveFocus()})},render:()=>(0,S.jsx)(b,{})},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const surface = await page.findByRole('dialog', {
      name: 'Delivery details'
    });
    await userEvent.click(within(surface).getByRole('button', {
      name: 'Close'
    }));
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Delivery details'
      })).not.toBeInTheDocument();
    });
    const trigger = page.getByRole('button', {
      name: 'View delivery details'
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(page.getByRole('dialog', {
        name: 'Delivery details'
      })).toBeVisible();
    });
  }
}`,...O.parameters?.docs?.source},description:{story:`An open surface that can be closed and reopened from its trigger.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const opener = within(canvasElement).getByRole('button', {
      name: 'Edit transaction'
    });
    await userEvent.click(opener);
    const sheet = await page.findByRole('dialog', {
      name: 'Northwind Supplies'
    });
    await waitFor(async () => {
      await expect(sheet.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    const confirmation = await page.findByRole('dialog', {
      name: 'Discard changes?'
    });
    await userEvent.click(within(confirmation).getByRole('button', {
      name: 'Discard'
    }));
    await waitFor(async () => {
      await expect(page.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(async () => {
      await expect(opener).toHaveFocus();
    });
  },
  render: () => <DiscardChangesDrawer />
}`,...k.parameters?.docs?.source},description:{story:`A confirmation opened from state when a drawer is dismissed; the drawer stays open until the person discards.`,...k.parameters?.docs?.description}}};try{D.displayName=`Dialog`,D.__docgenInfo={description:`Opens a labelled dialog with library-owned nesting and motion.`,displayName:`Dialog`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Content rendered inside the labelled surface, including any loading UI.`,name:`children`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`ReactNode`}},dismissible:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Allows Escape and outside presses to close the surface. Defaults to true.`,name:`dismissible`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Visible and accessible surface title.`,name:`title`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`defaultOpen`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`open`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`TriggerlessOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayTriggerProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayTriggerProps`}],description:"Omit, and control `open`, to open the surface from your own control or route.\nLabel for the library-owned trigger button.",name:`trigger`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`TriggerlessOverlayProps`},required:!1,tags:{},type:{name:`string | undefined`}}},tags:{summary:`A labelled dialog surface opened from its trigger or application state.`}}}catch{}try{O.displayName=`Default`,O.__docgenInfo={description:`An open surface that can be closed and reopened from its trigger.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`DiscardChanges`,k.__docgenInfo={description:`A confirmation opened from state when a drawer is dismissed; the drawer stays open until the person discards.`,displayName:`DiscardChanges`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Dialog/Dialog.stories.tsx`,methods:[],props:{},tags:{}}}catch{}A=[`Default`,`DiscardChanges`]}));j();export{O as Default,k as DiscardChanges,A as __namedExportsOrder,D as default,j as n,y as t};