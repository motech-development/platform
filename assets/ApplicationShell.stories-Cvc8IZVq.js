const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./context-BA1lSQW8.js","./rolldown-runtime-DaJ6WEGw.js"])))=>i.map(i=>d[i]);
import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{n as r,t as i}from"./preload-helper-si3HNj2m.js";import{t as a}from"./react-DvlgmmzG.js";import{t as o}from"./jsx-runtime-cM__dR4X.js";import{n as s,r as c}from"./BreezeContext-D8B-y9s5.js";import{n as l,t as u}from"./Icon-BTJwTxF9.js";import{n as d,t as f}from"./iframe-Dtd3g5vT.js";import{n as p,t as m}from"./link-routing-DQab0MRT.js";import{i as h,t as g}from"./view-transitions-3V_Ia5E2.js";import{n as _,t as v}from"./PageHeader-Cth7RdPs.js";import{n as y,t as b}from"./IconButton-CwHxQ25g.js";import{n as x,t as S}from"./SkipLink-DGP3jEtl.js";function C({current:e,item:t,placement:n,router:r}){let i=h({role:`navmark`});return(0,E.jsxs)(`a`,{"aria-current":e?`page`:void 0,className:n===`top`?D.base.topNavLink:D.base.bottomNavLink,href:t.href,onClick:e=>p(e,r,[`nav`]),children:[t.icon?(0,E.jsx)(u,{name:t.icon,size:n===`top`?`sm`:`xl`}):null,(0,E.jsx)(`span`,{className:D.base.navLabel,children:t.label}),e&&n===`top`?(0,E.jsx)(`span`,{"aria-hidden":`true`,className:D.base.navMark,ref:i}):null]})}function w({account:e,action:t,brand:n,children:r,context:i,currentItem:a,getItem:o,items:s,notifications:l}){let{getMessageLocale:u,messages:d,router:f}=c(),p=`breeze-main-${(0,T.useId)()}`,m=s.map(o),g=Math.ceil(m.length/2),_=m.slice(0,g),v=m.slice(g),y=h({role:`topbar`}),x=h({role:`topnav`}),w=h({role:`botnav`});return(0,E.jsxs)(`div`,{className:`breeze:[min-block-size:100dvh] breeze:bg-breeze-canvas breeze:text-breeze-ink`,children:[(0,E.jsx)(S,{targetId:p}),(0,E.jsxs)(`header`,{className:D.base.topbar,ref:y,children:[(0,E.jsx)(`div`,{className:D.base.brand,children:n}),(0,E.jsx)(`span`,{"aria-hidden":`true`,className:D.base.divider}),(0,E.jsx)(`div`,{className:D.base.context,children:i}),(0,E.jsxs)(`div`,{className:D.base.topbarSlots,children:[l,e]})]}),(0,E.jsx)(`nav`,{"aria-label":d.primaryNavigation,className:D.base.topNav,lang:u(`primaryNavigation`),ref:x,children:(0,E.jsx)(`div`,{className:D.base.topNavLinks,children:m.map(e=>(0,E.jsx)(C,{current:e.id===a,item:e,placement:`top`,router:f},e.id))})}),(0,E.jsx)(`main`,{className:D.base.main,id:p,tabIndex:-1,children:r}),(0,E.jsxs)(`nav`,{"aria-label":d.primaryNavigation,className:D.base.bottomNav,lang:u(`primaryNavigation`),ref:w,children:[(0,E.jsx)(`div`,{className:D.base.bottomNavSide,children:_.map(e=>(0,E.jsx)(C,{current:e.id===a,item:e,placement:`bottom`,router:f},e.id))}),(0,E.jsx)(`span`,{className:D.base.actionSlot,children:(0,E.jsx)(`span`,{className:D.base.action,children:(0,E.jsx)(b,{label:t.label,name:t.icon,onAction:t.onAction,shape:`circle`,size:`lg`,variant:`primary`})})}),(0,E.jsx)(`div`,{className:D.base.bottomNavSide,children:v.map(e=>(0,E.jsx)(C,{current:e.id===a,item:e,placement:`bottom`,router:f},e.id))})]})]})}var T,E,D,O=t((()=>{T=e(a(),1),g(),l(),y(),m(),x(),s(),E=o(),D={base:{action:`breeze:absolute breeze:start-1/2 breeze:-ms-breeze-7 breeze:-inset-bs-breeze-6 breeze:grid breeze:block-[56px] breeze:inline-[56px] breeze:rounded-breeze-full breeze:border-4 breeze:border-solid breeze:border-breeze-canvas breeze:[box-shadow:0_2px_6px_-2px_rgb(22_22_22/30%)] breeze:[&>button]:block-full breeze:[&>button]:inline-full breeze:[&>button]:min-block-0 breeze:[&>button]:min-inline-0`,actionSlot:`breeze:shrink-0 breeze:basis-[68px]`,bottomNav:`breeze:fixed breeze:[inset-block-end:0] breeze:[inset-inline:0] breeze:z-30 breeze:flex breeze:block-[calc(72px_+_env(safe-area-inset-bottom))] breeze:items-center breeze:border-bs-[length:var(--breeze-spacing-breeze-px)] breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:pbs-[6px] breeze:pbe-[env(safe-area-inset-bottom)] breeze:px-[2px] breeze:breeze-md:hidden`,bottomNavLink:`breeze:flex breeze:min-block-breeze-lg breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:items-center breeze:justify-center breeze:gap-[2px] breeze:rounded-breeze-sm breeze:font-breeze-sans breeze:text-breeze-2xs breeze:font-medium breeze:text-breeze-ink-3 breeze:no-underline breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:aria-[current=page]:font-semibold breeze:aria-[current=page]:text-breeze-brand-text`,bottomNavSide:`breeze:flex breeze:min-inline-0 breeze:flex-1`,brand:`breeze:flex breeze:min-inline-0 breeze:shrink-0 breeze:items-center`,context:`breeze:min-inline-0 breeze:truncate`,divider:`breeze:hidden breeze:block-breeze-5 breeze:inline-breeze-px breeze:shrink-0 breeze:bg-breeze-line breeze:breeze-md:block`,main:`breeze:mx-auto breeze:flex breeze:inline-full breeze:min-inline-0 breeze:max-inline-breeze-page breeze:flex-col breeze:gap-breeze-4 breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:pbs-breeze-4 breeze:pbe-[calc(168px_+_env(safe-area-inset-bottom))] breeze:breeze-md:ps-breeze-7 breeze:breeze-md:pe-breeze-7 breeze:breeze-md:pbs-breeze-5 breeze:breeze-md:pbe-[84px]`,navLabel:`breeze:min-inline-0 breeze:truncate`,navMark:`breeze:absolute breeze:[inset-inline:var(--breeze-spacing-breeze-1)] breeze:[inset-block-end:0] breeze:[block-size:2px] breeze:bg-breeze-brand`,topNav:`breeze:hidden breeze:min-block-breeze-tap breeze:border-be breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:ps-breeze-5 breeze:pe-breeze-5 breeze:breeze-md:flex`,topNavLink:`breeze:relative breeze:flex breeze:block-breeze-tap breeze:min-inline-0 breeze:shrink-0 breeze:items-center breeze:gap-breeze-2 breeze:mx-breeze-1 breeze:px-breeze-1 breeze:rounded-breeze-sm breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-medium breeze:text-breeze-ink-3 breeze:no-underline breeze:transition-colors breeze:hover:text-breeze-ink breeze:focus-visible:outline-2 breeze:focus-visible:outline-offset-[-2px] breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:aria-[current=page]:font-semibold breeze:aria-[current=page]:text-breeze-ink`,topNavLinks:`breeze:flex breeze:min-inline-0 breeze:flex-1 breeze:items-center breeze:overflow-x-auto breeze:-mbe-breeze-px`,topbar:`breeze:sticky breeze:[inset-block-start:0] breeze:z-30 breeze:flex breeze:block-[56px] breeze:items-center breeze:gap-[10px] breeze:border-be breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:breeze-md:gap-breeze-4 breeze:breeze-md:ps-breeze-5 breeze:breeze-md:pe-breeze-5`,topbarSlots:`breeze:ms-auto breeze:flex breeze:min-inline-0 breeze:shrink-0 breeze:items-center breeze:gap-breeze-3`},compound:{},size:{},state:{},variant:{}};try{w.displayName=`ApplicationShell`,w.__docgenInfo={description:`Provides shared app chrome, navigation, a fixed mobile action and main content.`,displayName:`ApplicationShell`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,methods:[],props:{account:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Application-owned account control.`,name:`account`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`ReactNode`}},action:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Required mobile action that remains in a fixed centre slot.`,name:`action`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`ApplicationShellAction`}},brand:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Application-owned brand content.`,name:`brand`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`ReactNode`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Application-owned route content rendered in the shell's main landmark.`,name:`children`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`ReactNode`}},context:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Application-owned company, tenant, or other context content.`,name:`context`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`ReactNode`}},currentItem:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:"Id returned by `getItem` for the current destination.",name:`currentItem`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`string`}},getItem:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Returns the supported navigation fields for an application value.`,name:`getItem`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`(item: T) => ApplicationShellNavigationItem`}},items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Application-owned navigation values.`,name:`items`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`T[]`}},notifications:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`}],description:`Application-owned notification control.`,name:`notifications`,parent:{fileName:`breeze-ui/src/patterns/ApplicationShell/ApplicationShell.tsx`,name:`ApplicationShellProps`},required:!0,tags:{},type:{name:`ReactNode`}}},tags:{summary:`A responsive application shell with semantic application slots.`}}}catch{}})),k=n({Default:()=>H,OverflowingNavigation:()=>U,__namedExportsOrder:()=>W,default:()=>V});function A({items:e=z}){let[t,n]=(0,P.useState)(`/overview`),[r,i]=(0,P.useState)(`none`),[a,o]=(0,P.useState)(0),s=e.find(({href:e})=>e===t),c=(0,P.useMemo)(()=>({navigate:(e,t)=>{n(e),i(t.transitionTypes.join(`, `)||`none`)}}),[]);if((0,P.useEffect)(()=>{let e=document.querySelector(`base[target]`),t=e?.getAttribute(`target`);return e?.setAttribute(`target`,`_self`),()=>{e&&(t===null?e.removeAttribute(`target`):t!==void 0&&e.setAttribute(`target`,t))}},[]),!s)throw Error(`Missing section for route "${t}".`);return(0,F.jsx)(f,{locale:`en-GB`,router:c,children:(0,F.jsxs)(w,{account:(0,F.jsx)(`button`,{type:`button`,children:`Jordan Lee`}),action:{icon:`add`,label:`Create item`,onAction:()=>o(e=>e+1)},brand:(0,F.jsx)(`strong`,{children:`Northstar`}),context:(0,F.jsx)(`span`,{children:`Sample workspace`}),currentItem:s.id,getItem:e=>({href:e.href,icon:e.icon,id:e.id,label:e.label}),items:e,notifications:(0,F.jsx)(`button`,{type:`button`,children:`Notifications`}),children:[(0,F.jsx)(v,{description:`Shared navigation around application-owned page content.`,title:s.label}),(0,F.jsx)(`p`,{role:`status`,"data-testid":`route-status`,children:`${t} · ${r}`}),(0,F.jsxs)(`p`,{children:[`Created items: `,a]}),(0,F.jsxs)(`section`,{"aria-label":`Recent updates`,style:{minHeight:`48rem`},children:[(0,F.jsx)(`h2`,{children:`Recent updates`}),(0,F.jsxs)(`ul`,{children:[(0,F.jsx)(`li`,{children:`Planning notes were updated this morning.`}),(0,F.jsx)(`li`,{children:`A shared draft is ready for review.`}),(0,F.jsx)(`li`,{children:`The next project milestone is approaching.`})]})]}),(0,F.jsx)(`p`,{"data-testid":`last-content`,children:`End of the page content.`})]})})}function j(e){let t=R(e).getAllByRole(`navigation`,{name:`Primary navigation`});if(t.length!==1)throw Error(`Expected one visible ApplicationShell navigation.`);return t[0]}async function M(e){let t=e.querySelectorAll(`[data-breeze-transition-name="breeze-navmark"]`),n=e.querySelectorAll(`a[aria-current="page"]`);await I(t).toHaveLength(1),await I(n).toHaveLength(1);let r=n[0]?.querySelector(`[data-breeze-transition-name="breeze-navmark"]`);if(!r)throw Error(`Missing the current section navigation marker.`);let i=r.getBoundingClientRect();await I(r).toHaveAttribute(`data-breeze-transition-types`,`nav`),await I(i.width).toBeGreaterThan(0),await I(i.height).toBe(2)}function N(e){let t=e.querySelectorAll(`:scope > div`);if(t.length!==2)throw Error(`Expected two side regions around the mobile action.`);return{leading:t[0],trailing:t[1]}}var P,F,I,L,R,z,B,V,H,U,W,G=t((()=>{P=e(a(),1),d(),_(),O(),F=o(),r(),{expect:I,userEvent:L,within:R}=__STORYBOOK_MODULE_TEST__,z=[{href:`/overview`,icon:`overview`,id:`overview`,label:`Overview`},{href:`/projects`,icon:`building`,id:`projects`,label:`Projects`},{href:`/activity`,icon:`clock`,id:`activity`,label:`Activity`},{href:`/settings`,icon:`settings`,id:`settings`,label:`Settings`}],B=[...z,{href:`/people`,icon:`people`,id:`people`,label:`People`},{href:`/calendar`,icon:`calendar`,id:`calendar`,label:`Calendar`},{href:`/documents`,icon:`document`,id:`documents`,label:`Documents`},{href:`/uploads`,icon:`upload`,id:`uploads`,label:`Uploads`},{href:`/downloads`,icon:`download`,id:`downloads`,label:`Downloads`},{href:`/incoming`,icon:`incoming`,id:`incoming`,label:`Incoming`},{href:`/outgoing`,icon:`outgoing`,id:`outgoing`,label:`Outgoing`},{href:`/security`,icon:`lock`,id:`security`,label:`Security`}],V={component:w,parameters:{layout:`fullscreen`},title:`Patterns/ApplicationShell`},H={play:async({canvasElement:e})=>{if(!(`__vitest_browser__`in globalThis))return;let t=await i(()=>import(`./context-BA1lSQW8.js`),__vite__mapDeps([0,1]),import.meta.url),n=e.ownerDocument,r=n.defaultView;if(!r)throw Error(`Missing ApplicationShell story window.`);let a={height:r.innerHeight,width:r.innerWidth},o=R(e);try{await L.keyboard(`{Tab}`);let i=o.getByRole(`link`,{name:`Skip to main content`});await I(i).toHaveFocus(),await I(i).toBeVisible(),await I(i.getBoundingClientRect().width).toBeGreaterThan(1),await I(i.getBoundingClientRect().height).toBeGreaterThan(1),await L.keyboard(`{Enter}`),await I(o.getByRole(`main`)).toHaveFocus();let a=async(i,a)=>{await t.page.viewport(i,a),await I(r.innerWidth).toBe(i);let s=j(e),c=R(s).getByRole(`link`,{current:`page`}),l=R(s).getByRole(`link`,{name:`Projects`});if(await I(r.getComputedStyle(s).position).toBe(i<901?`fixed`:`static`),await I(r.getComputedStyle(c).fontWeight).toBe(`600`),await I(r.getComputedStyle(l).fontWeight).toBe(`500`),await I(r.getComputedStyle(c).color).not.toBe(r.getComputedStyle(l).color),await I(l.querySelector(`svg`)?.getBoundingClientRect().width).toBe(i<901?21:16),i<901)await I(s.getBoundingClientRect().bottom).toBe(a),await I(s.getBoundingClientRect().height).toBe(72),await I(s.querySelectorAll(`[data-breeze-transition-name="breeze-navmark"]`)).toHaveLength(0);else{await M(s);let t=e.querySelector(`[data-breeze-transition-name="breeze-topbar"]`);if(!t)throw Error(`Missing ApplicationShell top bar.`);await I(t.getBoundingClientRect().height).toBe(56);let n=o.getByRole(`heading`,{level:1}).closest(`header`);if(!n)throw Error(`Missing PageHeader landmark.`);await I(o.getByTestId(`route-status`).getBoundingClientRect().top-n.getBoundingClientRect().bottom).toBe(16),await I(s.getBoundingClientRect().height).toBe(44)}if(await I(n.documentElement.scrollWidth).toBeLessThanOrEqual(i),i===390){let t=o.getByRole(`button`,{name:`Create item`}),a=t.getBoundingClientRect(),c=N(s),l=a.left-c.leading.getBoundingClientRect().right,u=c.trailing.getBoundingClientRect().left-a.right;await I(Math.abs(a.left+a.width/2-i/2)).toBeLessThanOrEqual(1),await I(a.width).toBe(a.height),await I(a.top).toBeLessThan(s.getBoundingClientRect().top),await I(a.bottom).toBeGreaterThan(s.getBoundingClientRect().top),await I(l).toBeCloseTo(u,1),await L.click(R(s).getByRole(`link`,{name:`Activity`})),await I(o.getByTestId(`route-status`)).toHaveTextContent(`/activity · nav`);let d=j(e);await I(R(d).getByRole(`link`,{current:`page`,name:`Activity`})).toBeInTheDocument();let f=t.getBoundingClientRect(),p=N(d),m=f.left-p.leading.getBoundingClientRect().right,h=p.trailing.getBoundingClientRect().left-f.right;await I(f.left).toBe(a.left),await I(f.top).toBe(a.top),await I(f.width).toBe(a.width),await I(f.height).toBe(a.height),await I(m).toBe(l),await I(h).toBe(u),await L.click(t),await I(o.getByText(`Created items: 1`)).toBeInTheDocument(),await I(Number.parseFloat(r.getComputedStyle(o.getByRole(`main`)).paddingBlockEnd)).toBe(168),r.scrollTo(0,n.documentElement.scrollHeight);let g=o.getByTestId(`last-content`);await I(g.getBoundingClientRect().bottom).toBeLessThanOrEqual(t.getBoundingClientRect().top),await I(n.documentElement.scrollWidth).toBeLessThanOrEqual(i)}};await a(1440,900),await a(901,900),await a(900,900),await a(390,844)}finally{await t.page.viewport(a.width,a.height)}},render:()=>(0,F.jsx)(A,{})},U={play:async({canvasElement:e})=>{if(!(`__vitest_browser__`in globalThis))return;let t=await i(()=>import(`./context-BA1lSQW8.js`),__vite__mapDeps([0,1]),import.meta.url),n=e.ownerDocument,r=n.defaultView;if(!r)throw Error(`Missing ApplicationShell story window.`);let a={height:r.innerHeight,width:r.innerWidth};try{await t.page.viewport(901,900);let r=j(e),i=R(r).getByRole(`link`,{name:`Security`}),a=i.parentElement;if(!a)throw Error(`Missing the top navigation links.`);await I(r.getBoundingClientRect().height).toBe(44),await I(n.documentElement.scrollWidth).toBeLessThanOrEqual(901),await I(a.scrollWidth).toBeGreaterThan(a.clientWidth),R(r).getByRole(`link`,{name:`Outgoing`}).focus(),await L.keyboard(`{Tab}`),await I(i).toHaveFocus();let o=a.getBoundingClientRect();await I(i.getBoundingClientRect().right).toBeLessThanOrEqual(o.right),await L.click(i),await I(i).toHaveAttribute(`aria-current`,`page`),await M(r);let s=i.querySelector(`[data-breeze-transition-name="breeze-navmark"]`)?.getBoundingClientRect();await I(s?.bottom).toBe(r.getBoundingClientRect().bottom),await I(s?.bottom).toBeLessThanOrEqual(o.bottom)}finally{await t.page.viewport(a.width,a.height)}},render:()=>(0,F.jsx)(A,{items:B})},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    if (!('__vitest_browser__' in globalThis)) return;
    const browserContext = await import('vitest/browser');
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;
    if (!view) throw new Error('Missing ApplicationShell story window.');
    const originalViewport = {
      height: view.innerHeight,
      width: view.innerWidth
    };
    const canvas = within(canvasElement);
    try {
      await userEvent.keyboard('{Tab}');
      const skipLink = canvas.getByRole('link', {
        name: 'Skip to main content'
      });
      await expect(skipLink).toHaveFocus();
      await expect(skipLink).toBeVisible();
      await expect(skipLink.getBoundingClientRect().width).toBeGreaterThan(1);
      await expect(skipLink.getBoundingClientRect().height).toBeGreaterThan(1);
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getByRole('main')).toHaveFocus();
      const verifyViewport = async (width: number, height: number) => {
        await browserContext.page.viewport(width, height);
        await expect(view.innerWidth).toBe(width);
        const navigation = getVisibleNavigation(canvasElement);
        const current = within(navigation).getByRole('link', {
          current: 'page'
        });
        const other = within(navigation).getByRole('link', {
          name: 'Projects'
        });
        await expect(view.getComputedStyle(navigation).position).toBe(width < 901 ? 'fixed' : 'static');
        await expect(view.getComputedStyle(current).fontWeight).toBe('600');
        await expect(view.getComputedStyle(other).fontWeight).toBe('500');
        await expect(view.getComputedStyle(current).color).not.toBe(view.getComputedStyle(other).color);
        await expect(other.querySelector('svg')?.getBoundingClientRect().width).toBe(width < 901 ? 21 : 16);
        if (width < 901) {
          await expect(navigation.getBoundingClientRect().bottom).toBe(height);
          await expect(navigation.getBoundingClientRect().height).toBe(72);
          await expect(navigation.querySelectorAll('[data-breeze-transition-name="breeze-navmark"]')).toHaveLength(0);
        } else {
          await expectCurrentMarker(navigation);
          const topbar = canvasElement.querySelector('[data-breeze-transition-name="breeze-topbar"]');
          if (!topbar) throw new Error('Missing ApplicationShell top bar.');
          await expect(topbar.getBoundingClientRect().height).toBe(56);
          const pageHeader = canvas.getByRole('heading', {
            level: 1
          }).closest('header');
          if (!pageHeader) throw new Error('Missing PageHeader landmark.');
          await expect(canvas.getByTestId('route-status').getBoundingClientRect().top - pageHeader.getBoundingClientRect().bottom).toBe(16);
          await expect(navigation.getBoundingClientRect().height).toBe(44);
        }
        await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
        if (width === 390) {
          const action = canvas.getByRole('button', {
            name: 'Create item'
          });
          const beforeAction = action.getBoundingClientRect();
          const beforeSides = getBottomNavigationSides(navigation);
          const beforeLeadingGap = beforeAction.left - beforeSides.leading.getBoundingClientRect().right;
          const beforeTrailingGap = beforeSides.trailing.getBoundingClientRect().left - beforeAction.right;
          await expect(Math.abs(beforeAction.left + beforeAction.width / 2 - width / 2)).toBeLessThanOrEqual(1);
          await expect(beforeAction.width).toBe(beforeAction.height);
          // The action is raised so it straddles the bar's top edge.
          await expect(beforeAction.top).toBeLessThan(navigation.getBoundingClientRect().top);
          await expect(beforeAction.bottom).toBeGreaterThan(navigation.getBoundingClientRect().top);
          await expect(beforeLeadingGap).toBeCloseTo(beforeTrailingGap, 1);
          await userEvent.click(within(navigation).getByRole('link', {
            name: 'Activity'
          }));
          await expect(canvas.getByTestId('route-status')).toHaveTextContent('/activity · nav');
          const updatedNavigation = getVisibleNavigation(canvasElement);
          await expect(within(updatedNavigation).getByRole('link', {
            current: 'page',
            name: 'Activity'
          })).toBeInTheDocument();
          const afterAction = action.getBoundingClientRect();
          const afterSides = getBottomNavigationSides(updatedNavigation);
          const afterLeadingGap = afterAction.left - afterSides.leading.getBoundingClientRect().right;
          const afterTrailingGap = afterSides.trailing.getBoundingClientRect().left - afterAction.right;
          await expect(afterAction.left).toBe(beforeAction.left);
          await expect(afterAction.top).toBe(beforeAction.top);
          await expect(afterAction.width).toBe(beforeAction.width);
          await expect(afterAction.height).toBe(beforeAction.height);
          await expect(afterLeadingGap).toBe(beforeLeadingGap);
          await expect(afterTrailingGap).toBe(beforeTrailingGap);
          await userEvent.click(action);
          await expect(canvas.getByText('Created items: 1')).toBeInTheDocument();
          await expect(Number.parseFloat(view.getComputedStyle(canvas.getByRole('main')).paddingBlockEnd)).toBe(168);
          view.scrollTo(0, document.documentElement.scrollHeight);
          const lastContent = canvas.getByTestId('last-content');
          await expect(lastContent.getBoundingClientRect().bottom).toBeLessThanOrEqual(action.getBoundingClientRect().top);
          await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
        }
      };
      await verifyViewport(1440, 900);
      await verifyViewport(901, 900);
      await verifyViewport(900, 900);
      await verifyViewport(390, 844);
    } finally {
      await browserContext.page.viewport(originalViewport.width, originalViewport.height);
    }
  },
  render: () => <ShellExample />
}`,...H.parameters?.docs?.source},description:{story:`Application-owned topbar slots, section navigation and fixed mobile action.`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    if (!('__vitest_browser__' in globalThis)) return;
    const browserContext = await import('vitest/browser');
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;
    if (!view) throw new Error('Missing ApplicationShell story window.');
    const originalViewport = {
      height: view.innerHeight,
      width: view.innerWidth
    };
    try {
      await browserContext.page.viewport(901, 900);
      const navigation = getVisibleNavigation(canvasElement);
      const lastLink = within(navigation).getByRole('link', {
        name: 'Security'
      });
      const links = lastLink.parentElement;
      if (!links) throw new Error('Missing the top navigation links.');
      await expect(navigation.getBoundingClientRect().height).toBe(44);
      await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(901);
      await expect(links.scrollWidth).toBeGreaterThan(links.clientWidth);
      within(navigation).getByRole('link', {
        name: 'Outgoing'
      }).focus();
      await userEvent.keyboard('{Tab}');
      await expect(lastLink).toHaveFocus();
      const linksRect = links.getBoundingClientRect();
      await expect(lastLink.getBoundingClientRect().right).toBeLessThanOrEqual(linksRect.right);
      await userEvent.click(lastLink);
      await expect(lastLink).toHaveAttribute('aria-current', 'page');
      await expectCurrentMarker(navigation);
      const markerRect = lastLink.querySelector('[data-breeze-transition-name="breeze-navmark"]')?.getBoundingClientRect();

      // The mark stays unclipped on the navigation's bottom border.
      await expect(markerRect?.bottom).toBe(navigation.getBoundingClientRect().bottom);
      await expect(markerRect?.bottom).toBeLessThanOrEqual(linksRect.bottom);
    } finally {
      await browserContext.page.viewport(originalViewport.width, originalViewport.height);
    }
  },
  render: () => <ShellExample items={manySections} />
}`,...U.parameters?.docs?.source},description:{story:`Section links that do not fit scroll within the top navigation.`,...U.parameters?.docs?.description}}};try{H.displayName=`Default`,H.__docgenInfo={description:`Application-owned topbar slots, section navigation and fixed mobile action.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ApplicationShell/ApplicationShell.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{U.displayName=`OverflowingNavigation`,U.__docgenInfo={description:`Section links that do not fit scroll within the top navigation.`,displayName:`OverflowingNavigation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ApplicationShell/ApplicationShell.stories.tsx`,methods:[],props:{},tags:{}}}catch{}W=[`Default`,`OverflowingNavigation`]}));G();export{H as Default,U as OverflowingNavigation,W as __namedExportsOrder,V as default,G as n,k as t};