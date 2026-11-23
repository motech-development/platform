import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Button-CVjiIIUE.js";import{n as s,t as c}from"./Drawer-CszXBTLv.js";import{n as l,t as u}from"./Typography-CEt3x14j.js";import{n as d,t as f}from"./TextField-BHSdRdgB.js";var p=n({Default:()=>w,EditTransaction:()=>D,FromApplicationState:()=>O,RecordTransaction:()=>E,__namedExportsOrder:()=>k,default:()=>C});function m(){let[e,t]=(0,_.useState)(!0);return(0,v.jsx)(c,{footerActions:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{onAction:()=>t(!1),variant:`secondary`,children:`Cancel`}),(0,v.jsx)(o,{onAction:()=>t(!1),children:`Save transaction`})]}),footerSummary:`Takes £139.00 off the balance now`,onOpenChange:t,open:e,title:`New transaction`,trigger:`Record transaction`,children:T.map(([e,t])=>(0,v.jsx)(f,{defaultValue:t,label:e},e))})}function h(e){let t=e.parentElement;for(;t&&t.scrollHeight<=t.clientHeight;)t=t.parentElement;if(!t)throw Error(`Missing scrolling drawer body.`);return t}function g(){let[e,t]=(0,_.useState)(!1);return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{onAction:()=>t(!0),children:`Northwind Supplies`}),(0,v.jsx)(c,{onOpenChange:t,open:e,title:`Transaction`,children:(0,v.jsx)(u,{children:`Printer toner and paper, £139.00.`})})]})}var _,v,y,b,x,S,C,w,T,E,D,O,k,A=t((()=>{_=e(r(),1),a(),d(),l(),s(),v=i(),{expect:y,userEvent:b,waitFor:x,within:S}=__STORYBOOK_MODULE_TEST__,C={args:{children:(0,v.jsx)(u,{children:`Your delivery arrives on Monday.`}),defaultOpen:!0,title:`Delivery details`,trigger:`View delivery details`},component:c,title:`Overlays/Drawer`},w={play:async({canvasElement:e})=>{let t=S(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery details`});await b.click(S(n).getByRole(`button`,{name:`Close`})),await x(async()=>{await y(t.queryByRole(`dialog`,{name:`Delivery details`})).not.toBeInTheDocument()});let r=t.getByRole(`button`,{name:`View delivery details`});await b.click(r),await x(async()=>{await y(t.getByRole(`dialog`,{name:`Delivery details`})).toBeVisible()})}},T=[[`Name`,`Northwind Supplies`],[`Category`,`Office costs`],[`Amount`,`139.00`],[`VAT paid`,`23.17`],[`Date`,`3 September 2026`],[`Description`,`Printer toner and paper`],[`Reference`,`INV-20931`],[`Payment method`,`Business card`],[`Supplier email`,`accounts@northwind.example`],[`Supplier telephone`,`020 7946 0000`],[`Project`,`Office refit`],[`Cost centre`,`Operations`],[`Notes`,`Delivered to the studio`]],E={play:async({canvasElement:e})=>{let t=S(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`New transaction`}),r=S(n).getByRole(`button`,{name:`Close`}),i=S(n).getByRole(`button`,{name:`Save transaction`}),a=S(n).getByText(`Takes £139.00 off the balance now`),o=getComputedStyle(a);await y(o.fontSize).toBe(`12px`),await y(o.textOverflow).toBe(`ellipsis`);let s=a.getBoundingClientRect(),c=S(n).getByRole(`button`,{name:`Cancel`}).getBoundingClientRect();await y(s.right<=c.left||s.bottom<=c.top).toBe(!0);let l=h(S(n).getByLabelText(`Name`)),u=r.getBoundingClientRect().top,d=i.getBoundingClientRect().top;l.scrollTo({top:l.scrollHeight}),await x(async()=>{await y(l.scrollTop).toBeGreaterThan(0)}),await y(r.getBoundingClientRect().top).toBe(u),await y(i.getBoundingClientRect().top).toBe(d),await b.click(S(n).getByRole(`button`,{name:`Cancel`})),await x(async()=>{await y(t.queryByRole(`dialog`,{name:`New transaction`})).not.toBeInTheDocument()})},render:()=>(0,v.jsx)(m,{})},D={args:{children:(0,v.jsx)(f,{defaultValue:`Northwind Supplies`,label:`Name`}),footerActions:(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{variant:`secondary`,children:`Discard unsaved changes`}),(0,v.jsx)(o,{children:`Save changes and record another transaction`})]}),footerStart:(0,v.jsx)(o,{variant:`danger`,children:`Delete transaction`}),footerSummary:`Takes £139.00 off the balance now`,title:`Edit transaction`,trigger:`Edit transaction`},play:async({canvasElement:e})=>{let t=await S(e.ownerDocument.body).findByRole(`dialog`,{name:`Edit transaction`}),n=S(t).getByText(`Takes £139.00 off the balance now`).parentElement;if(!n)throw Error(`Missing drawer footer.`);let r=n.getBoundingClientRect(),i=getComputedStyle(n);await y(n.scrollWidth).toBeLessThanOrEqual(n.clientWidth),await y(S(t).getByRole(`button`,{name:`Delete transaction`}).getBoundingClientRect().left).toBeCloseTo(r.left+parseFloat(i.paddingInlineStart)),await y(S(t).getByRole(`button`,{name:`Save changes and record another transaction`}).getBoundingClientRect().right).toBeCloseTo(r.right-parseFloat(i.paddingInlineEnd))}},O={play:async({canvasElement:e})=>{let t=S(e.ownerDocument.body),n=S(e),r=n.getByRole(`button`,{name:`Northwind Supplies`});await y(n.getAllByRole(`button`)).toEqual([r]),await b.click(r);let i=await t.findByRole(`dialog`,{name:`Transaction`});await x(async()=>{await y(i.contains(e.ownerDocument.activeElement)).toBe(!0)}),await b.keyboard(`{Escape}`),await x(async()=>{await y(t.queryByRole(`dialog`,{name:`Transaction`})).not.toBeInTheDocument()}),await x(async()=>{await y(r).toHaveFocus()})},render:()=>(0,v.jsx)(g,{})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source},description:{story:`An open surface that can be closed and reopened from its trigger.`,...w.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const surface = await page.findByRole('dialog', {
      name: 'New transaction'
    });
    const close = within(surface).getByRole('button', {
      name: 'Close'
    });
    const save = within(surface).getByRole('button', {
      name: 'Save transaction'
    });
    const summary = within(surface).getByText('Takes £139.00 off the balance now');
    const summaryStyle = getComputedStyle(summary);
    await expect(summaryStyle.fontSize).toBe('12px');
    await expect(summaryStyle.textOverflow).toBe('ellipsis');
    const summaryBox = summary.getBoundingClientRect();
    const cancelBox = within(surface).getByRole('button', {
      name: 'Cancel'
    }).getBoundingClientRect();
    // Beside the actions on wide drawers, above them on narrow sheets.
    await expect(summaryBox.right <= cancelBox.left || summaryBox.bottom <= cancelBox.top).toBe(true);
    const body = scrollParent(within(surface).getByLabelText('Name'));
    const closeTop = close.getBoundingClientRect().top;
    const saveTop = save.getBoundingClientRect().top;
    body.scrollTo({
      top: body.scrollHeight
    });
    await waitFor(async () => {
      await expect(body.scrollTop).toBeGreaterThan(0);
    });
    await expect(close.getBoundingClientRect().top).toBe(closeTop);
    await expect(save.getBoundingClientRect().top).toBe(saveTop);
    await userEvent.click(within(surface).getByRole('button', {
      name: 'Cancel'
    }));
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'New transaction'
      })).not.toBeInTheDocument();
    });
  },
  render: () => <RecordTransactionDrawer />
}`,...E.parameters?.docs?.source},description:{story:`A record form whose body scrolls between a fixed header and a pinned footer of summary and actions.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: <TextField defaultValue="Northwind Supplies" label="Name" />,
    footerActions: <>
        <Button variant="secondary">Discard unsaved changes</Button>
        <Button>Save changes and record another transaction</Button>
      </>,
    footerStart: <Button variant="danger">Delete transaction</Button>,
    footerSummary: 'Takes £139.00 off the balance now',
    title: 'Edit transaction',
    trigger: 'Edit transaction'
  },
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const surface = await page.findByRole('dialog', {
      name: 'Edit transaction'
    });
    const footer = within(surface).getByText('Takes £139.00 off the balance now').parentElement;
    if (!footer) throw new Error('Missing drawer footer.');
    const footerBox = footer.getBoundingClientRect();
    const footerStyle = getComputedStyle(footer);
    await expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth);
    await expect(within(surface).getByRole('button', {
      name: 'Delete transaction'
    }).getBoundingClientRect().left).toBeCloseTo(footerBox.left + parseFloat(footerStyle.paddingInlineStart));
    await expect(within(surface).getByRole('button', {
      name: 'Save changes and record another transaction'
    }).getBoundingClientRect().right).toBeCloseTo(footerBox.right - parseFloat(footerStyle.paddingInlineEnd));
  }
}`,...D.parameters?.docs?.source},description:{story:`An edit form whose footer adds a start action and wraps its long actions to the end when they run out of room.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);
    const opener = canvas.getByRole('button', {
      name: 'Northwind Supplies'
    });
    await expect(canvas.getAllByRole('button')).toEqual([opener]);
    await userEvent.click(opener);
    const surface = await page.findByRole('dialog', {
      name: 'Transaction'
    });
    await waitFor(async () => {
      await expect(surface.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Transaction'
      })).not.toBeInTheDocument();
    });
    await waitFor(async () => {
      await expect(opener).toHaveFocus();
    });
  },
  render: () => <StateOpenedDrawer />
}`,...O.parameters?.docs?.source},description:{story:`A drawer opened from the application's own control, with no trigger of its own, that returns focus to that control.`,...O.parameters?.docs?.description}}};try{C.displayName=`Drawer`,C.__docgenInfo={description:`Opens a labelled drawer with library-owned nesting and motion.`,displayName:`Drawer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Content rendered inside the labelled surface, including any loading UI.`,name:`children`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`ReactNode`}},dismissible:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Allows Escape and outside presses to close the surface. Defaults to true.`,name:`dismissible`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Visible and accessible surface title.`,name:`title`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`defaultOpen`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`open`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`TriggerlessOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayTriggerProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayTriggerProps`}],description:"Omit, and control `open`, to open the surface from your own control or route.\nLabel for the library-owned trigger button.",name:`trigger`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`TriggerlessOverlayProps`},required:!1,tags:{},type:{name:`string | undefined`}},footerActions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`}],description:`End-aligned actions pinned below the scrolling content, such as Cancel and Save.`,name:`footerActions`,required:!1,tags:{},type:{name:`ReactNode`}},footerStart:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`}],description:`Leading footer action placed before the summary, such as Delete.`,name:`footerStart`,required:!1,tags:{},type:{name:`ReactNode`}},footerSummary:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`}],description:`Muted one-line footer summary that takes the free width and truncates.`,name:`footerSummary`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{summary:`A labelled drawer surface opened from its trigger or application state.`}}}catch{}try{w.displayName=`Default`,w.__docgenInfo={description:`An open surface that can be closed and reopened from its trigger.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{E.displayName=`RecordTransaction`,E.__docgenInfo={description:`A record form whose body scrolls between a fixed header and a pinned footer of summary and actions.`,displayName:`RecordTransaction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{D.displayName=`EditTransaction`,D.__docgenInfo={description:`An edit form whose footer adds a start action and wraps its long actions to the end when they run out of room.`,displayName:`EditTransaction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{O.displayName=`FromApplicationState`,O.__docgenInfo={description:`A drawer opened from the application's own control, with no trigger of its own, that returns focus to that control.`,displayName:`FromApplicationState`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}k=[`Default`,`RecordTransaction`,`EditTransaction`,`FromApplicationState`]}));A();export{w as Default,D as EditTransaction,O as FromApplicationState,E as RecordTransaction,k as __namedExportsOrder,C as default,A as n,p as t};