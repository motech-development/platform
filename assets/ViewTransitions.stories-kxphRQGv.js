import{a as e,n as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./react-DvlgmmzG.js";import{a as r,i,o as a}from"./OverlayProvider-D7VNEgVu.js";import{t as o}from"./jsx-runtime-cM__dR4X.js";import{t as s}from"./react-dom-ua_76iqd.js";import{n as c,r as l}from"./BreezeContext-D8B-y9s5.js";import{n as u,t as d}from"./iframe-B3J02-mj.js";import{n as f,t as p}from"./Button-ChqF1UMJ.js";import{n as m,t as h}from"./Drawer-BPeSk3zJ.js";import{n as g,t as _}from"./Link-_ZVC9Cys.js";function v(e){let t=[...new Set(e)];if(t.some(e=>!T.has(e)))throw TypeError(`Breeze view transition types must be nav, mode, list, item or expand.`);return t}function y(e,t){let n=e.defaultView,r=n?.ViewTransition,i=n?.CSS?.supports;return t.length>0&&typeof e.startViewTransition==`function`&&typeof r==`function`&&`types`in r.prototype&&typeof i==`function`&&t.every(e=>i.call(n?.CSS,`selector(:active-view-transition-type(${e}))`))}function b(e){return e.defaultView?.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1}function x(e,t){let n=v(t),{document:r}=globalThis;if(r===void 0||n.length===0||!y(r,n)||b(r))try{return Promise.resolve(e())}catch(e){return Promise.reject(e instanceof Error?e:Error(String(e)))}k.get(r)?.skipTransition();let i=r.startViewTransition({types:n,update:async()=>{await e()}});k.set(r,i),i.ready.catch(()=>void 0);let a=()=>{k.get(r)===i&&k.delete(r)};return i.finished.then(a,a),i.updateCallbackDone}function S(e){let t=[],n=r=>{if(t.includes(r))return;let i=e.find(e=>e.id===r.parent);i&&n(i),t.push(r)};e.forEach(n);let r=t=>{let n=e.find(e=>e.id===t.parent);return t.visual&&(!n||r(n))};return t.filter(r)}function C(e){l();let t=(0,w.useContext)(i),n=(0,w.useContext)(r);if(t===null)throw Error(`Breeze components must be rendered within BreezeProvider.`);let a=S((0,w.useSyncExternalStore)(t.subscribe,t.getSnapshot,t.getSnapshot)),o=n?a.at(-1)?.id===n.id:a.length===0,s=`role`in e?O[e.role]:void 0,c=s?.name??e.name,u=v(s?.types??e.types);if(!E.test(c)||s===void 0&&D.has(c.toLowerCase()))throw TypeError(`Breeze transition participant names must be CSS custom identifiers and cannot use a name reserved by the browser or Breeze.`);if(u.length===0)throw RangeError(`Breeze transition participants require at least one transition type.`);let d=u.join(` `);return(0,w.useCallback)(e=>{if(e===null)return;let{dataset:t}=e,n=t.breezeTransitionName,r=t.breezeTransitionTypes,i=t.breezeTransitionEnabled,a=e.style.getPropertyValue(`--breeze-transition-name`),s=e.style.getPropertyPriority(`--breeze-transition-name`);return t.breezeTransitionName=c,t.breezeTransitionTypes=d,t.breezeTransitionEnabled=String(o),e.style.setProperty(`--breeze-transition-name`,c),()=>{n===void 0?delete t.breezeTransitionName:t.breezeTransitionName=n,r===void 0?delete t.breezeTransitionTypes:t.breezeTransitionTypes=r,i===void 0?delete t.breezeTransitionEnabled:t.breezeTransitionEnabled=i,a===``?e.style.removeProperty(`--breeze-transition-name`):e.style.setProperty(`--breeze-transition-name`,a,s)}},[o,c,d])}var w,T,E,D,O,k,A=t((()=>{w=e(n(),1),a(),c(),T=new Set([`nav`,`mode`,`list`,`item`,`expand`]),E=/^[a-zA-Z_][a-zA-Z0-9_-]*$/,D=new Set([`auto`,`default`,`inherit`,`initial`,`none`,`revert`,`revert-layer`,`unset`,`root`,`breeze-botnav`,`breeze-navmark`,`breeze-topbar`,`breeze-topnav`,`match-element`]),O={botnav:{name:`breeze-botnav`,types:[`nav`,`mode`]},navmark:{name:`breeze-navmark`,types:[`nav`]},topbar:{name:`breeze-topbar`,types:[`nav`,`mode`]},topnav:{name:`breeze-topnav`,types:[`nav`,`mode`]}},k=new WeakMap}));function j({children:e,hidden:t=!1,name:n,participantRole:r,types:i}){return(0,F.jsx)(`div`,{hidden:t,ref:C(r?{role:r}:{name:n??`accounts-page`,types:i??[`nav`]}),children:e})}function M(){let[e,t]=(0,N.useState)(`/accounts`),[n,r]=(0,N.useState)(!1),i=(0,N.useMemo)(()=>({navigate:(e,n)=>x(()=>{(0,P.flushSync)(()=>t(e))},n.transitionTypes).then(()=>r(!0))}),[]),a=e.endsWith(`/activity`)?`Activity`:`Overview`;return(0,F.jsx)(d,{locale:`en-GB`,router:i,children:(0,F.jsxs)(`div`,{className:`breeze-story-stack`,children:[(0,F.jsx)(j,{participantRole:`topbar`,children:`Accounts`}),(0,F.jsx)(j,{participantRole:`topnav`,children:(0,F.jsxs)(`nav`,{"aria-label":`Account pages`,children:[(0,F.jsx)(_,{href:`/accounts`,target:`_self`,transitionTypes:[`nav`],children:`Overview`}),` · `,(0,F.jsx)(_,{href:`/accounts/activity`,target:`_self`,transitionTypes:[`nav`,`expand`],children:`Activity`}),(0,F.jsx)(j,{participantRole:`navmark`,children:`Current tab`})]})}),(0,F.jsx)(j,{name:`accounts-page`,types:[`nav`,`mode`],children:(0,F.jsxs)(`main`,{"data-testid":`page`,children:[(0,F.jsx)(`h1`,{"data-testid":`page-title`,children:a}),n&&(0,F.jsx)(`output`,{children:`DOM commit ready`}),(0,F.jsx)(j,{name:`activity-shared`,types:[`expand`],children:`Current account range`})]})}),(0,F.jsx)(j,{hidden:!0,name:`accounts-page`,types:[`nav`,`mode`],children:`Responsive copy hidden at this viewport`}),(0,F.jsx)(j,{participantRole:`botnav`,children:`Bottom navigation`}),(0,F.jsxs)(h,{title:`Details`,trigger:`Open details`,children:[(0,F.jsx)(j,{name:`overlay-item`,types:[`item`],children:`Details content`}),(0,F.jsx)(p,{children:`Keep open`})]})]})})}var N,P,F,I,L,R,z,B,V,H;t((()=>{N=e(n(),1),P=e(s(),1),f(),m(),g(),u(),A(),F=o(),{expect:I,userEvent:L,waitFor:R,within:z}=__STORYBOOK_MODULE_TEST__,B={component:M,title:`Foundation/View transitions`},V={play:async({canvasElement:e})=>{let t=e.ownerDocument,n=t.defaultView;if(!n)throw Error(`Missing browser window`);let r=z(e),i=z(t.body),a=r.getByTestId(`page`).parentElement;if(!a)throw Error(`Missing page transition participant`);await I(typeof t.startViewTransition).toBe(`function`),await I(typeof n.ViewTransition).toBe(`function`),await I(`types`in n.ViewTransition.prototype).toBe(!0),await I(n.CSS.supports(`selector(:active-view-transition-type(nav))`)).toBe(!0),await I(a.style.viewTransitionName).toBe(``),await I(t.documentElement.hasAttribute(`data-vt`)).toBe(!1),await L.click(r.getByRole(`button`,{name:`Open details`}));let o=await i.findByRole(`dialog`,{name:`Details`}),s=o.closest(`[data-breeze-overlay]`);await I(a).toHaveAttribute(`data-breeze-transition-enabled`,`false`),await I(i.getByText(`Details content`)).toHaveAttribute(`data-breeze-transition-enabled`,`true`),await I(n.getComputedStyle(s).viewTransitionName).toBe(`none`),await L.click(z(o).getByRole(`button`,{name:`Close`})),await R(async()=>{await I(i.queryByRole(`dialog`,{name:`Details`})).toBeNull(),await I(a).toHaveAttribute(`data-breeze-transition-enabled`,`true`)});let c=Object.getOwnPropertyDescriptor(t,`startViewTransition`),l=t.startViewTransition.bind(t),u=[];Object.defineProperty(t,"startViewTransition",{configurable:!0,value:e=>{let t={committed:!1,name:``,transition:void 0,types:e.types??[]},i=l({...e,update:async()=>{await e.update?.(),t.committed=r.getByTestId(`page-title`).textContent===`Activity`,t.name=n.getComputedStyle(a).viewTransitionName}});return t.transition=i,u.push(t),i}});try{await L.click(r.getByRole(`link`,{name:`Activity`})),await I(u).toHaveLength(1),await R(async()=>{await I(r.getByTestId(`page-title`)).toHaveTextContent(`Activity`),await I(r.getByRole(`status`)).toHaveTextContent(`DOM commit ready`),await I(u).toHaveLength(1),await I(u[0]?.committed).toBe(!0)}),await I(u[0]?.types).toEqual([`nav`,`expand`]),await I(u[0]?.name).toBe(`accounts-page`),await I(u[0]?.transition.ready).resolves.toBeUndefined();let e=n.getComputedStyle(t.documentElement,`::view-transition-old(root)`),i=n.getComputedStyle(t.documentElement,`::view-transition-new(root)`),a=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(root)`),o=n.getComputedStyle(t.documentElement,`::view-transition-group(breeze-navmark)`),s=n.getComputedStyle(t.documentElement,`::view-transition-old(breeze-navmark)`),c=n.getComputedStyle(t.documentElement,`::view-transition-old(breeze-topbar)`),l=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(breeze-topbar)`),d=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(breeze-navmark)`),f=n.getComputedStyle(t.documentElement,`::view-transition-old(activity-shared)`),p=n.getComputedStyle(t.documentElement,`::view-transition-image-pair(activity-shared)`);await I(e.animationName).toBe(`breeze-transition-fade-out`),await I(i.animationName).toBe(`breeze-transition-rise`),await I(a.animationName).toBe(`none`),await I(o.animationDuration).toBe(`0.3s`),await I(s.animationName).toBe(`none`),await I(c.animationName).toBe(`none`),await I(l.animationName).toBe(`none`),await I(d.animationName).toBe(`none`),await I(f.animationName).toBe(`breeze-transition-fade-out`),await I(p.animationName).toBe(`breeze-transition-blur`);let m=Object.getOwnPropertyDescriptor(n,`matchMedia`),h=n.matchMedia;Object.defineProperty(n,"matchMedia",{configurable:!0,value:e=>e===`(prefers-reduced-motion: reduce)`?{addEventListener:()=>void 0,matches:!0,media:e,removeEventListener:()=>void 0}:h.call(n,e)});try{await L.click(r.getByRole(`link`,{name:`Overview`})),await I(r.getByTestId(`page-title`)).toHaveTextContent(`Overview`),await I(u).toHaveLength(1)}finally{m?Object.defineProperty(n,"matchMedia",m):Reflect.deleteProperty(n,`matchMedia`)}}finally{c?Object.defineProperty(t,"startViewTransition",c):Reflect.deleteProperty(t,`startViewTransition`)}},render:()=>(0,F.jsx)(M,{})},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source},description:{story:`Typed names exist only during their declared transition.`,...V.parameters?.docs?.description}}};try{V.displayName=`TypedParticipants`,V.__docgenInfo={description:`Typed names exist only during their declared transition.`,displayName:`TypedParticipants`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/motion/ViewTransitions.stories.tsx`,methods:[],props:{},tags:{}}}catch{}H=[`TypedParticipants`]}))();export{V as TypedParticipants,H as __namedExportsOrder,B as default};