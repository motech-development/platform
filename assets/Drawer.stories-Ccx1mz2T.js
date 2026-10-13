import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Button-C8wHUg7V.js";import{n as s,t as c}from"./Drawer-C1XHsqZ6.js";import{n as l,t as u}from"./Typography-CEt3x14j.js";import{n as d,t as f}from"./TextField-8qn-duBL.js";var p=n({Default:()=>C,EditTransaction:()=>E,RecordTransaction:()=>T,__namedExportsOrder:()=>D,default:()=>S});function m(){let[e,t]=(0,g.useState)(!0);return(0,_.jsx)(c,{footerActions:(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{onAction:()=>t(!1),variant:`secondary`,children:`Cancel`}),(0,_.jsx)(o,{onAction:()=>t(!1),children:`Save transaction`})]}),footerSummary:`Takes £139.00 off the balance now`,onOpenChange:t,open:e,title:`New transaction`,trigger:`Record transaction`,children:w.map(([e,t])=>(0,_.jsx)(f,{defaultValue:t,label:e},e))})}function h(e){let t=e.parentElement;for(;t&&t.scrollHeight<=t.clientHeight;)t=t.parentElement;if(!t)throw Error(`Missing scrolling drawer body.`);return t}var g,_,v,y,b,x,S,C,w,T,E,D,O=t((()=>{g=e(r(),1),a(),d(),l(),s(),_=i(),{expect:v,userEvent:y,waitFor:b,within:x}=__STORYBOOK_MODULE_TEST__,S={args:{children:(0,_.jsx)(u,{children:`Your delivery arrives on Monday.`}),defaultOpen:!0,title:`Delivery details`,trigger:`View delivery details`},component:c,title:`Overlays/Drawer`},C={play:async({canvasElement:e})=>{let t=x(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery details`});await y.click(x(n).getByRole(`button`,{name:`Close`})),await b(async()=>{await v(t.queryByRole(`dialog`,{name:`Delivery details`})).not.toBeInTheDocument()});let r=t.getByRole(`button`,{name:`View delivery details`});await y.click(r),await b(async()=>{await v(t.getByRole(`dialog`,{name:`Delivery details`})).toBeVisible()})}},w=[[`Name`,`Northwind Supplies`],[`Category`,`Office costs`],[`Amount`,`139.00`],[`VAT paid`,`23.17`],[`Date`,`3 September 2026`],[`Description`,`Printer toner and paper`],[`Reference`,`INV-20931`],[`Payment method`,`Business card`],[`Supplier email`,`accounts@northwind.example`],[`Supplier telephone`,`020 7946 0000`],[`Project`,`Office refit`],[`Cost centre`,`Operations`],[`Notes`,`Delivered to the studio`]],T={play:async({canvasElement:e})=>{let t=x(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`New transaction`}),r=x(n).getByRole(`button`,{name:`Close`}),i=x(n).getByRole(`button`,{name:`Save transaction`}),a=x(n).getByText(`Takes £139.00 off the balance now`),o=getComputedStyle(a);await v(o.fontSize).toBe(`12px`),await v(o.textOverflow).toBe(`ellipsis`);let s=a.getBoundingClientRect(),c=x(n).getByRole(`button`,{name:`Cancel`}).getBoundingClientRect();await v(s.right<=c.left||s.bottom<=c.top).toBe(!0);let l=h(x(n).getByLabelText(`Name`)),u=r.getBoundingClientRect().top,d=i.getBoundingClientRect().top;l.scrollTo({top:l.scrollHeight}),await b(async()=>{await v(l.scrollTop).toBeGreaterThan(0)}),await v(r.getBoundingClientRect().top).toBe(u),await v(i.getBoundingClientRect().top).toBe(d),await y.click(x(n).getByRole(`button`,{name:`Cancel`})),await b(async()=>{await v(t.queryByRole(`dialog`,{name:`New transaction`})).not.toBeInTheDocument()})},render:()=>(0,_.jsx)(m,{})},E={args:{children:(0,_.jsx)(f,{defaultValue:`Northwind Supplies`,label:`Name`}),footerActions:(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{variant:`secondary`,children:`Discard unsaved changes`}),(0,_.jsx)(o,{children:`Save changes and record another transaction`})]}),footerStart:(0,_.jsx)(o,{variant:`danger`,children:`Delete transaction`}),footerSummary:`Takes £139.00 off the balance now`,title:`Edit transaction`,trigger:`Edit transaction`},play:async({canvasElement:e})=>{let t=await x(e.ownerDocument.body).findByRole(`dialog`,{name:`Edit transaction`}),n=x(t).getByText(`Takes £139.00 off the balance now`).parentElement;if(!n)throw Error(`Missing drawer footer.`);let r=n.getBoundingClientRect(),i=getComputedStyle(n);await v(n.scrollWidth).toBeLessThanOrEqual(n.clientWidth),await v(x(t).getByRole(`button`,{name:`Delete transaction`}).getBoundingClientRect().left).toBeCloseTo(r.left+parseFloat(i.paddingInlineStart)),await v(x(t).getByRole(`button`,{name:`Save changes and record another transaction`}).getBoundingClientRect().right).toBeCloseTo(r.right-parseFloat(i.paddingInlineEnd))}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source},description:{story:`An open surface that can be closed and reopened from its trigger.`,...C.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source},description:{story:`A record form whose body scrolls between a fixed header and a pinned footer of summary and actions.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source},description:{story:`An edit form whose footer adds a start action and wraps its long actions to the end when they run out of room.`,...E.parameters?.docs?.description}}};try{S.displayName=`Drawer`,S.__docgenInfo={description:`Opens a labelled drawer with library-owned nesting and motion.`,displayName:`Drawer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Content rendered inside the labelled surface, including any loading UI.`,name:`children`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`ReactNode`}},dismissible:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Allows Escape and outside presses to close the surface. Defaults to true.`,name:`dismissible`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Visible and accessible surface title.`,name:`title`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Label for the library-owned trigger button.`,name:`trigger`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`defaultOpen`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`UncontrolledOverlayProps`}],description:``,name:`open`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`ControlledOverlayProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},footerActions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`}],description:`End-aligned actions pinned below the scrolling content, such as Cancel and Save.`,name:`footerActions`,required:!1,tags:{},type:{name:`ReactNode`}},footerStart:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`}],description:`Leading footer action placed before the summary, such as Delete.`,name:`footerStart`,required:!1,tags:{},type:{name:`ReactNode`}},footerSummary:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TypeLiteral`}],description:`Muted one-line footer summary that takes the free width and truncates.`,name:`footerSummary`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{summary:`A labelled drawer surface with a trigger and close action.`}}}catch{}try{C.displayName=`Default`,C.__docgenInfo={description:`An open surface that can be closed and reopened from its trigger.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{T.displayName=`RecordTransaction`,T.__docgenInfo={description:`A record form whose body scrolls between a fixed header and a pinned footer of summary and actions.`,displayName:`RecordTransaction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{E.displayName=`EditTransaction`,E.__docgenInfo={description:`An edit form whose footer adds a start action and wraps its long actions to the end when they run out of room.`,displayName:`EditTransaction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{}}}catch{}D=[`Default`,`RecordTransaction`,`EditTransaction`]}));O();export{C as Default,E as EditTransaction,T as RecordTransaction,D as __namedExportsOrder,S as default,O as n,p as t};