import{a as e,n as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./react-DvlgmmzG.js";import{t as r}from"./jsx-runtime-cM__dR4X.js";import{t as i}from"./react-dom-ua_76iqd.js";import{n as a,t as o}from"./iframe-BvVjwL8u.js";import{n as s,t as c}from"./Button-ChqF1UMJ.js";import{n as l,t as u}from"./Drawer-BPeSk3zJ.js";import{n as d,t as f}from"./Link-DlWhe-Zh.js";import{n as p,r as m,t as h}from"./view-transitions-CkydYQ89.js";function g({children:e,hidden:t=!1,name:n,participantRole:r,types:i}){return(0,b.jsx)(`div`,{hidden:t,ref:m(r?{role:r}:{name:n??`accounts-page`,types:i??[`nav`]}),children:e})}function _(){let[e,t]=(0,v.useState)(`/accounts`),[n,r]=(0,v.useState)(!1),i=(0,v.useMemo)(()=>({navigate:(e,n)=>p(()=>{(0,y.flushSync)(()=>t(e))},n.transitionTypes).then(()=>r(!0))}),[]),a=e.endsWith(`/activity`)?`Activity`:`Overview`;return(0,b.jsx)(o,{locale:`en-GB`,router:i,children:(0,b.jsxs)(`div`,{className:`breeze-story-stack`,children:[(0,b.jsx)(g,{participantRole:`topbar`,children:`Accounts`}),(0,b.jsx)(g,{participantRole:`topnav`,children:(0,b.jsxs)(`nav`,{"aria-label":`Account pages`,children:[(0,b.jsx)(f,{href:`/accounts`,target:`_self`,transitionTypes:[`nav`],children:`Overview`}),` · `,(0,b.jsx)(f,{href:`/accounts/activity`,target:`_self`,transitionTypes:[`nav`,`expand`],children:`Activity`}),(0,b.jsx)(g,{participantRole:`navmark`,children:`Current tab`})]})}),(0,b.jsx)(g,{name:`accounts-page`,types:[`nav`,`mode`],children:(0,b.jsxs)(`main`,{"data-testid":`page`,children:[(0,b.jsx)(`h1`,{"data-testid":`page-title`,children:a}),n&&(0,b.jsx)(`output`,{children:`DOM commit ready`}),(0,b.jsx)(g,{name:`activity-shared`,types:[`expand`],children:`Current account range`})]})}),(0,b.jsx)(g,{hidden:!0,name:`accounts-page`,types:[`nav`,`mode`],children:`Responsive copy hidden at this viewport`}),(0,b.jsx)(g,{participantRole:`botnav`,children:`Bottom navigation`}),(0,b.jsxs)(u,{title:`Details`,trigger:`Open details`,children:[(0,b.jsx)(g,{name:`overlay-item`,types:[`item`],children:`Details content`}),(0,b.jsx)(c,{children:`Keep open`})]})]})})}var v,y,b,x,S,C,w,T,E,D;t((()=>{v=e(n(),1),y=e(i(),1),s(),l(),d(),a(),h(),b=r(),{expect:x,userEvent:S,waitFor:C,within:w}=__STORYBOOK_MODULE_TEST__,T={component:_,title:`Foundation/View transitions`},E={play:async({canvasElement:e})=>{let t=e.ownerDocument,n=t.defaultView;if(!n)throw Error(`Missing browser window`);let r=w(e),i=w(t.body),a=r.getByTestId(`page`).parentElement;if(!a)throw Error(`Missing page transition participant`);await x(typeof t.startViewTransition).toBe(`function`),await x(typeof n.ViewTransition).toBe(`function`),await x(`types`in n.ViewTransition.prototype).toBe(!0),await x(n.CSS.supports(`selector(:active-view-transition-type(nav))`)).toBe(!0),await x(a.style.viewTransitionName).toBe(``),await x(t.documentElement.hasAttribute(`data-vt`)).toBe(!1),await S.click(r.getByRole(`button`,{name:`Open details`}));let o=await i.findByRole(`dialog`,{name:`Details`}),s=o.closest(`[data-breeze-overlay]`);await x(a).toHaveAttribute(`data-breeze-transition-enabled`,`false`),await x(i.getByText(`Details content`)).toHaveAttribute(`data-breeze-transition-enabled`,`true`),await x(n.getComputedStyle(s).viewTransitionName).toBe(`none`),await S.click(w(o).getByRole(`button`,{name:`Close`})),await C(async()=>{await x(i.queryByRole(`dialog`,{name:`Details`})).toBeNull(),await x(a).toHaveAttribute(`data-breeze-transition-enabled`,`true`)});let c=Object.getOwnPropertyDescriptor(t,`startViewTransition`),l=t.startViewTransition.bind(t),u=[];Object.defineProperty(t,"startViewTransition",{configurable:!0,value:e=>{let t={committed:!1,name:``,transition:void 0,types:e.types??[]},i=l({...e,update:async()=>{await e.update?.(),t.committed=r.getByTestId(`page-title`).textContent===`Activity`,t.name=n.getComputedStyle(a).viewTransitionName}});return t.transition=i,u.push(t),i}});try{await S.click(r.getByRole(`link`,{name:`Activity`})),await x(u).toHaveLength(1),await C(async()=>{await x(r.getByTestId(`page-title`)).toHaveTextContent(`Activity`),await x(r.getByRole(`status`)).toHaveTextContent(`DOM commit ready`),await x(u).toHaveLength(1),await x(u[0]?.committed).toBe(!0)}),await x(u[0]?.types).toEqual([`nav`,`expand`]),await x(u[0]?.name).toBe(`accounts-page`),await x(u[0]?.transition.ready).resolves.toBeUndefined();let e=n.getComputedStyle(t.documentElement,`::view-transition-old(root)`),i=n.getComputedStyle(t.documentElement,`::view-transition-new(root)`),a=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(root)`),o=n.getComputedStyle(t.documentElement,`::view-transition-group(breeze-navmark)`),s=n.getComputedStyle(t.documentElement,`::view-transition-old(breeze-navmark)`),c=n.getComputedStyle(t.documentElement,`::view-transition-old(breeze-topbar)`),l=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(breeze-topbar)`),d=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(breeze-navmark)`),f=n.getComputedStyle(t.documentElement,`::view-transition-old(activity-shared)`),p=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(activity-shared)`);await x(e.animationName).toBe(`breeze-transition-fade-out`),await x(i.animationName).toBe(`breeze-transition-rise`),await x(a.animationName).toBe(`none`),await x(o.animationDuration).toBe(`0.3s`),await x(s.animationName).toBe(`none`),await x(c.animationName).toBe(`none`),await x(l.animationName).toBe(`none`),await x(d.animationName).toBe(`none`),await x(f.animationName).toBe(`breeze-transition-fade-out`),await x(p.animationName).toBe(`breeze-transition-blur`);let m=Object.getOwnPropertyDescriptor(n,`matchMedia`),h=n.matchMedia;Object.defineProperty(n,"matchMedia",{configurable:!0,value:e=>e===`(prefers-reduced-motion: reduce)`?{addEventListener:()=>void 0,matches:!0,media:e,removeEventListener:()=>void 0}:h.call(n,e)});try{await S.click(r.getByRole(`link`,{name:`Overview`})),await x(r.getByTestId(`page-title`)).toHaveTextContent(`Overview`),await x(u).toHaveLength(1)}finally{m?Object.defineProperty(n,"matchMedia",m):Reflect.deleteProperty(n,`matchMedia`)}}finally{c?Object.defineProperty(t,"startViewTransition",c):Reflect.deleteProperty(t,`startViewTransition`)}},render:()=>(0,b.jsx)(_,{})},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;
    if (!view) throw new Error('Missing browser window');
    const page = within(canvasElement);
    const body = within(document.body);
    const pageParticipant = page.getByTestId('page').parentElement;
    if (!pageParticipant) throw new Error('Missing page transition participant');
    await expect(typeof document.startViewTransition).toBe('function');
    await expect(typeof view.ViewTransition).toBe('function');
    await expect('types' in view.ViewTransition.prototype).toBe(true);
    await expect(view.CSS.supports('selector(:active-view-transition-type(nav))')).toBe(true);
    await expect(pageParticipant.style.viewTransitionName).toBe('');
    await expect(document.documentElement.hasAttribute('data-vt')).toBe(false);
    await userEvent.click(page.getByRole('button', {
      name: 'Open details'
    }));
    const dialog = await body.findByRole('dialog', {
      name: 'Details'
    });
    const overlayLayer = dialog.closest('[data-breeze-overlay]');
    await expect(pageParticipant).toHaveAttribute('data-breeze-transition-enabled', 'false');
    await expect(body.getByText('Details content')).toHaveAttribute('data-breeze-transition-enabled', 'true');
    await expect(view.getComputedStyle(overlayLayer!).viewTransitionName).toBe('none');
    await userEvent.click(within(dialog).getByRole('button', {
      name: 'Close'
    }));
    await waitFor(async () => {
      await expect(body.queryByRole('dialog', {
        name: 'Details'
      })).toBeNull();
      await expect(pageParticipant).toHaveAttribute('data-breeze-transition-enabled', 'true');
    });
    const originalStartDescriptor = Object.getOwnPropertyDescriptor(document, 'startViewTransition');
    const originalStart = document.startViewTransition.bind(document);
    const calls: Array<{
      committed: boolean;
      name: string;
      transition: ViewTransition;
      types: readonly string[];
    }> = [];
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (options: StartViewTransitionOptions) => {
        const call = {
          committed: false,
          name: '',
          transition: undefined as unknown as ViewTransition,
          types: options.types ?? []
        };
        const transition = originalStart({
          ...options,
          update: async () => {
            await options.update?.();
            call.committed = page.getByTestId('page-title').textContent === 'Activity';
            call.name = view.getComputedStyle(pageParticipant).viewTransitionName;
          }
        });
        call.transition = transition;
        calls.push(call);
        return transition;
      }
    });
    try {
      await userEvent.click(page.getByRole('link', {
        name: 'Activity'
      }));
      await expect(calls).toHaveLength(1);
      await waitFor(async () => {
        await expect(page.getByTestId('page-title')).toHaveTextContent('Activity');
        await expect(page.getByRole('status')).toHaveTextContent('DOM commit ready');
        await expect(calls).toHaveLength(1);
        await expect(calls[0]?.committed).toBe(true);
      });
      await expect(calls[0]?.types).toEqual(['nav', 'expand']);
      await expect(calls[0]?.name).toBe('accounts-page');
      await expect(calls[0]?.transition.ready).resolves.toBeUndefined();
      const oldRoot = view.getComputedStyle(document.documentElement, '::view-transition-old(root)');
      const newRoot = view.getComputedStyle(document.documentElement, '::view-transition-new(root)');
      const rootImagePair = view.getComputedStyle(document.documentElement, '::view-transition-image-pair(root)');
      const navmarkGroup = view.getComputedStyle(document.documentElement, '::view-transition-group(breeze-navmark)');
      const navmarkOld = view.getComputedStyle(document.documentElement, '::view-transition-old(breeze-navmark)');
      const topbarOld = view.getComputedStyle(document.documentElement, '::view-transition-old(breeze-topbar)');
      const topbarImagePair = view.getComputedStyle(document.documentElement, '::view-transition-image-pair(breeze-topbar)');
      const navmarkImagePair = view.getComputedStyle(document.documentElement, '::view-transition-image-pair(breeze-navmark)');
      const sharedOld = view.getComputedStyle(document.documentElement, '::view-transition-old(activity-shared)');
      const sharedImagePair = view.getComputedStyle(document.documentElement, '::view-transition-image-pair(activity-shared)');
      await expect(oldRoot.animationName).toBe('breeze-transition-fade-out');
      await expect(newRoot.animationName).toBe('breeze-transition-rise');
      await expect(rootImagePair.animationName).toBe('none');
      await expect(navmarkGroup.animationDuration).toBe('0.3s');
      await expect(navmarkOld.animationName).toBe('none');
      await expect(topbarOld.animationName).toBe('none');
      await expect(topbarImagePair.animationName).toBe('none');
      await expect(navmarkImagePair.animationName).toBe('none');
      await expect(sharedOld.animationName).toBe('breeze-transition-fade-out');
      await expect(sharedImagePair.animationName).toBe('breeze-transition-blur');
      const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(view, 'matchMedia');
      const originalMatchMedia = view.matchMedia;
      Object.defineProperty(view, 'matchMedia', {
        configurable: true,
        value: (query: string) => query === '(prefers-reduced-motion: reduce)' ? {
          addEventListener: () => undefined,
          matches: true,
          media: query,
          removeEventListener: () => undefined
        } : originalMatchMedia.call(view, query)
      });
      try {
        await userEvent.click(page.getByRole('link', {
          name: 'Overview'
        }));
        await expect(page.getByTestId('page-title')).toHaveTextContent('Overview');
        await expect(calls).toHaveLength(1);
      } finally {
        if (originalMatchMediaDescriptor) {
          Object.defineProperty(view, 'matchMedia', originalMatchMediaDescriptor);
        } else {
          Reflect.deleteProperty(view, 'matchMedia');
        }
      }
    } finally {
      if (originalStartDescriptor) {
        Object.defineProperty(document, 'startViewTransition', originalStartDescriptor);
      } else {
        Reflect.deleteProperty(document, 'startViewTransition');
      }
    }
  },
  render: () => <TransitionExample />
}`,...E.parameters?.docs?.source},description:{story:`Typed names exist only during their declared transition.`,...E.parameters?.docs?.description}}};try{E.displayName=`TypedParticipants`,E.__docgenInfo={description:`Typed names exist only during their declared transition.`,displayName:`TypedParticipants`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/motion/ViewTransitions.stories.tsx`,methods:[],props:{},tags:{}}}catch{}D=[`TypedParticipants`]}))();export{E as TypedParticipants,D as __namedExportsOrder,T as default};