import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{i as r,r as i,t as a}from"./Toast-yFA-PJjP.js";import{n as o,t as s}from"./Button-CRUvQN2-.js";import{n as c,t as l}from"./Drawer-Apjm5eWk.js";import{n as u,t as d}from"./Dialog-DkrjCRgM.js";var f=t({Default:()=>N,DialogLayering:()=>z,DrawerLayering:()=>B,Enqueued:()=>P,Mobile:()=>F,ShortViewportClipped:()=>I,ShortViewportPromotion:()=>R,ShortViewportQueue:()=>L,__namedExportsOrder:()=>V,default:()=>w});function p(){let e=r();return(0,v.jsx)(s,{onAction:()=>e(`Changes saved`),children:`Save changes`})}function m(){let e=r();return C.map(t=>(0,v.jsx)(s,{onAction:()=>e(t),children:t},t))}function h({kind:e}){let t=(0,v.jsx)(p,{});return e===`dialog`?(0,v.jsx)(d,{defaultOpen:!0,title:`Confirm change`,trigger:`Open dialog`,children:t}):(0,v.jsx)(l,{defaultOpen:!0,title:`Confirm change`,trigger:`Open drawer`,children:t})}async function g(e,t){let n=e.ownerDocument,r=n.defaultView,i=S(n.body);if(!r)throw Error(`Missing story window.`);await y(r.innerWidth).toBe(t);let a=i.getByRole(`button`,{name:`Save changes`});a.focus(),await b.click(a);let o=await i.findByRole(`status`,{name:`Changes saved`}),s=Math.max(r.innerWidth<901?16:28,(r.innerWidth-1500)/2+28);await y(o).toHaveAttribute(`aria-live`,`polite`),await y(n.querySelectorAll(`[aria-live="polite"]`)).toHaveLength(1),await y(o).not.toHaveAttribute(`tabindex`),await y(a).toHaveFocus(),await x(async()=>{let e=o.getBoundingClientRect();await y(e.width).toBe(288),await y(Math.round(e.top)).toBe(76),await y(Math.round(r.innerWidth-e.right)).toBe(s)}),await b.keyboard(`{Escape}`),await y(o).toBeInTheDocument(),await y(a).toHaveFocus()}async function _(e){let t=e.ownerDocument,n=S(t.body),r=await n.findByRole(`dialog`,{name:`Confirm change`}),i=S(r).getByRole(`button`,{name:`Save changes`});await b.click(i);let a=await n.findByRole(`status`,{name:`Changes saved`}),o=a.closest(`[data-breeze-toast-region]`),s=r.closest(`[data-breeze-overlay]`),c=t.defaultView;if(!o||!s||!c)throw Error(`Missing Toast or overlay layer.`);await y(o).not.toHaveAttribute(`aria-live`),await y(o).toHaveAttribute(`data-live-announcer`),await y(o).toHaveAttribute(`data-react-aria-top-layer`),await y(o).not.toHaveAttribute(`aria-hidden`,`true`),await y(o.closest(`[aria-hidden="true"]`)).toBeNull(),await y(o.closest(`[inert]`)).toBeNull(),await y(Number(c.getComputedStyle(o).zIndex)).toBeGreaterThan(Number(c.getComputedStyle(s).zIndex)),await y(i).toHaveFocus(),await y(t.activeElement).not.toBe(a)}var v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H=e((()=>{o(),u(),c(),i(),v=n(),{expect:y,userEvent:b,waitFor:x,within:S}=__STORYBOOK_MODULE_TEST__,C=[`Changes saved successfully and your updates are ready to review.`,`Your profile details were updated successfully and are now visible across your account.`,`The invitation was sent successfully to the selected recipient and will expire soon.`],w={args:{children:`Changes saved`},component:a,title:`Feedback/Toast`},T={options:{toastDesktop:{name:`Toast desktop`,styles:{height:`720px`,width:`1280px`},type:`desktop`}}},E={viewport:{value:`toastDesktop`}},D={options:{toastMobile:{name:`Toast mobile`,styles:{height:`812px`,width:`375px`},type:`mobile`}}},O={viewport:{value:`toastMobile`}},k={options:{toastShortQueue:{name:`Toast short queue`,styles:{height:`240px`,width:`375px`},type:`mobile`}}},A={viewport:{value:`toastShortQueue`}},j={options:{toastShortClipped:{name:`Toast short clipped`,styles:{height:`120px`,width:`375px`},type:`mobile`}}},M={viewport:{value:`toastShortClipped`}},N={},P={globals:E,parameters:{viewport:T},play:async({canvasElement:e})=>{await g(e,1280)},render:()=>(0,v.jsx)(p,{})},F={globals:O,parameters:{chromatic:{viewports:[375]},viewport:D},play:async({canvasElement:e})=>{await g(e,375)},render:()=>(0,v.jsx)(p,{})},I={globals:M,parameters:{viewport:j},play:async({canvasElement:e})=>{let t=e.ownerDocument,n=t.defaultView,r=S(t.body);if(!n)throw Error(`Missing story window.`);await y(n.innerWidth).toBe(375),await y(n.innerHeight).toBe(120),await b.click(r.getByRole(`button`,{name:C[0]}));let i=await r.findByRole(`status`,{name:C[0]});await y(i.getBoundingClientRect().bottom).toBeGreaterThan(n.innerHeight),await new Promise(e=>{setTimeout(e,2700)}),await y(i).toBeInTheDocument()},render:()=>(0,v.jsx)(m,{})},L={globals:A,parameters:{viewport:k},play:async({canvasElement:e})=>{let t=e.ownerDocument,n=t.defaultView,r=S(t.body);if(!n)throw Error(`Missing story window.`);await y(n.innerWidth).toBe(375),await y(n.innerHeight).toBe(240),await C.reduce((e,t)=>e.then(()=>b.click(r.getByRole(`button`,{name:t}))),Promise.resolve()),await x(async()=>{await y(r.getAllByRole(`status`)).toHaveLength(3)});let i=r.getAllByRole(`status`).at(-1);if(!i)throw Error(`Missing queued Toast.`);await y(i.getBoundingClientRect().bottom).toBeGreaterThan(n.innerHeight),await new Promise(e=>{setTimeout(e,2700)});let a=await r.findByRole(`status`,{name:C[2]});await y(r.getAllByRole(`status`)).toHaveLength(1),await y(a.getBoundingClientRect().bottom).toBeLessThan(n.innerHeight),await new Promise(e=>{setTimeout(e,2e3)}),await y(a).toBeInTheDocument(),await new Promise(e=>{setTimeout(e,700)}),await y(r.queryByRole(`status`,{name:C[2]})).not.toBeInTheDocument()},render:()=>(0,v.jsx)(m,{})},R={globals:A,parameters:{toastLimit:1,viewport:k},play:async({canvasElement:e})=>{let t=e.ownerDocument,n=t.defaultView,r=S(t.body);if(!n)throw Error(`Missing story window.`);await y(n.innerWidth).toBe(375),await y(n.innerHeight).toBe(240),await b.click(r.getByRole(`button`,{name:C[0]}));let i=await r.findByRole(`status`,{name:C[0]});await b.click(r.getByRole(`button`,{name:C[1]})),await y(r.queryByRole(`status`,{name:C[1]})).not.toBeInTheDocument(),await y(i.getBoundingClientRect().bottom).toBeLessThanOrEqual(n.innerHeight),await new Promise(e=>{setTimeout(e,2700)}),await y(i).not.toBeInTheDocument();let a=await r.findByRole(`status`,{name:C[1]});await y(a).toBeInTheDocument()},render:()=>(0,v.jsx)(m,{})},z={play:async({canvasElement:e})=>{await _(e)},render:()=>(0,v.jsx)(h,{kind:`dialog`})},B={play:async({canvasElement:e})=>{await _(e)},render:()=>(0,v.jsx)(h,{kind:`drawer`})},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{}`,...N.parameters?.docs?.source},description:{story:`A positive status card with no action or dismissal control.`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  globals: desktopGlobals,
  parameters: {
    viewport: desktopViewport
  },
  play: async ({
    canvasElement
  }) => {
    await assertEnqueuedToast(canvasElement, 1280);
  },
  render: () => <EnqueueExample />
}`,...P.parameters?.docs?.source},description:{story:`Enqueues a confirmation and keeps focus on the action that caused it.`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  globals: mobileGlobals,
  parameters: {
    chromatic: {
      viewports: [375]
    },
    viewport: mobileViewport
  },
  play: async ({
    canvasElement
  }) => {
    await assertEnqueuedToast(canvasElement, 375);
  },
  render: () => <EnqueueExample />
}`,...F.parameters?.docs?.source},description:{story:`The same fixed-width confirmation at a phone viewport.`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  globals: shortClippedGlobals,
  parameters: {
    viewport: shortClippedViewport
  },
  play: async ({
    canvasElement
  }) => {
    const document = canvasElement.ownerDocument;
    const window = document.defaultView;
    const page = within(document.body);
    if (!window) throw new Error('Missing story window.');
    await expect(window.innerWidth).toBe(375);
    await expect(window.innerHeight).toBe(120);
    await userEvent.click(page.getByRole('button', {
      name: wrappedMessages[0]
    }));
    const toast = await page.findByRole('status', {
      name: wrappedMessages[0]
    });
    await expect(toast.getBoundingClientRect().bottom).toBeGreaterThan(window.innerHeight);
    await new Promise<void>(resolve => {
      setTimeout(resolve, 2700);
    });
    await expect(toast).toBeInTheDocument();
  },
  render: () => <WrappedToastContent />
}`,...I.parameters?.docs?.source},description:{story:`A clipped confirmation waits until the short viewport can show it fully.`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  globals: shortQueueGlobals,
  parameters: {
    viewport: shortQueueViewport
  },
  play: async ({
    canvasElement
  }) => {
    const document = canvasElement.ownerDocument;
    const window = document.defaultView;
    const page = within(document.body);
    if (!window) throw new Error('Missing story window.');
    await expect(window.innerWidth).toBe(375);
    await expect(window.innerHeight).toBe(240);
    await wrappedMessages.reduce((previous, message) => previous.then(() => userEvent.click(page.getByRole('button', {
      name: message
    }))), Promise.resolve());
    await waitFor(async () => {
      await expect(page.getAllByRole('status')).toHaveLength(3);
    });
    const toasts = page.getAllByRole('status');
    const lastToast = toasts.at(-1);
    if (!lastToast) throw new Error('Missing queued Toast.');
    await expect(lastToast.getBoundingClientRect().bottom).toBeGreaterThan(window.innerHeight);
    await new Promise<void>(resolve => {
      setTimeout(resolve, 2700);
    });
    const promotedToast = await page.findByRole('status', {
      name: wrappedMessages[2]
    });
    await expect(page.getAllByRole('status')).toHaveLength(1);
    await expect(promotedToast.getBoundingClientRect().bottom).toBeLessThan(window.innerHeight);
    await new Promise<void>(resolve => {
      setTimeout(resolve, 2000);
    });
    await expect(promotedToast).toBeInTheDocument();
    await new Promise<void>(resolve => {
      setTimeout(resolve, 700);
    });
    await expect(page.queryByRole('status', {
      name: wrappedMessages[2]
    })).not.toBeInTheDocument();
  },
  render: () => <WrappedToastContent />
}`,...L.parameters?.docs?.source},description:{story:`Queued cards wait for a visible slot and then receive their full lifetime.`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  globals: shortQueueGlobals,
  parameters: {
    toastLimit: 1,
    viewport: shortQueueViewport
  },
  play: async ({
    canvasElement
  }) => {
    const document = canvasElement.ownerDocument;
    const window = document.defaultView;
    const page = within(document.body);
    if (!window) throw new Error('Missing story window.');
    await expect(window.innerWidth).toBe(375);
    await expect(window.innerHeight).toBe(240);
    await userEvent.click(page.getByRole('button', {
      name: wrappedMessages[0]
    }));
    const firstToast = await page.findByRole('status', {
      name: wrappedMessages[0]
    });
    await userEvent.click(page.getByRole('button', {
      name: wrappedMessages[1]
    }));
    await expect(page.queryByRole('status', {
      name: wrappedMessages[1]
    })).not.toBeInTheDocument();
    await expect(firstToast.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
    await new Promise<void>(resolve => {
      setTimeout(resolve, 2700);
    });
    await expect(firstToast).not.toBeInTheDocument();
    const promotedToast = await page.findByRole('status', {
      name: wrappedMessages[1]
    });
    await expect(promotedToast).toBeInTheDocument();
  },
  render: () => <WrappedToastContent />
}`,...R.parameters?.docs?.source},description:{story:`A fully visible card expires before the queued card is promoted.`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await assertModalToast(canvasElement);
  },
  render: () => <ModalToastExample kind="dialog" />
}`,...z.parameters?.docs?.source},description:{story:`A dialog keeps the live status above its surface without taking focus.`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await assertModalToast(canvasElement);
  },
  render: () => <ModalToastExample kind="drawer" />
}`,...B.parameters?.docs?.source},description:{story:`A drawer keeps the live status above its surface without taking focus.`,...B.parameters?.docs?.description}}};try{w.displayName=`Toast`,w.__docgenInfo={description:`Displays a positive, non-interactive confirmation.`,displayName:`Toast`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Translated confirmation message.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!0,tags:{},type:{name:`string`}}},tags:{summary:`A transient confirmation status.`}}}catch{}try{N.displayName=`Default`,N.__docgenInfo={description:`A positive status card with no action or dismissal control.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{P.displayName=`Enqueued`,P.__docgenInfo={description:`Enqueues a confirmation and keeps focus on the action that caused it.`,displayName:`Enqueued`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{F.displayName=`Mobile`,F.__docgenInfo={description:`The same fixed-width confirmation at a phone viewport.`,displayName:`Mobile`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{I.displayName=`ShortViewportClipped`,I.__docgenInfo={description:`A clipped confirmation waits until the short viewport can show it fully.`,displayName:`ShortViewportClipped`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{L.displayName=`ShortViewportQueue`,L.__docgenInfo={description:`Queued cards wait for a visible slot and then receive their full lifetime.`,displayName:`ShortViewportQueue`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{R.displayName=`ShortViewportPromotion`,R.__docgenInfo={description:`A fully visible card expires before the queued card is promoted.`,displayName:`ShortViewportPromotion`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{z.displayName=`DialogLayering`,z.__docgenInfo={description:`A dialog keeps the live status above its surface without taking focus.`,displayName:`DialogLayering`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{B.displayName=`DrawerLayering`,B.__docgenInfo={description:`A drawer keeps the live status above its surface without taking focus.`,displayName:`DrawerLayering`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{}}}catch{}V=[`Default`,`Enqueued`,`Mobile`,`ShortViewportClipped`,`ShortViewportQueue`,`ShortViewportPromotion`,`DialogLayering`,`DrawerLayering`]}));H();export{N as Default,z as DialogLayering,B as DrawerLayering,P as Enqueued,F as Mobile,I as ShortViewportClipped,R as ShortViewportPromotion,L as ShortViewportQueue,V as __namedExportsOrder,w as default,H as n,f as t};