const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./context-BA1lSQW8.js","./rolldown-runtime-DaJ6WEGw.js"])))=>i.map(i=>d[i]);
import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{n as r,t as i}from"./preload-helper-si3HNj2m.js";import{t as a}from"./react-DvlgmmzG.js";import{t as o}from"./jsx-runtime-cM__dR4X.js";import{n as s,t as c}from"./RowList-yOwKOUx7.js";var l=n({Activity:()=>w,Default:()=>S,Empty:()=>k,InitialLoading:()=>A,Loading:()=>j,Merging:()=>N,Money:()=>E,Phone:()=>O,RetainedLoading:()=>M,__namedExportsOrder:()=>P,default:()=>x});function u(e){return e}async function d(e){if(!(`__vitest_browser__`in globalThis))return;let t=await i(()=>import(`./context-BA1lSQW8.js`),__vite__mapDeps([0,1]),import.meta.url),n=e.ownerDocument,r=n.defaultView;if(!r)throw Error(`Missing RowList story window.`);let a={height:r.innerHeight,width:r.innerWidth},o=y(e);try{await t.page.viewport(1200,800),await g(r.innerWidth).toBe(1200);let e=o.getByRole(`grid`,{name:`Activity`}),i=y(e).getByRole(`row`,{name:`Coffee shop`}),a=y(e).getByRole(`row`,{name:`Market`}),s=y(i).getByText(`Coffee shop`),c=y(i).getByText(`14 Sept 2026`),l=y(i).getByText(`£4.75`),u=y(a).getByText(`Card purchase`),d=y(a).getByText(`Reviewed`),f=s.getBoundingClientRect(),p=c.getBoundingClientRect(),m=l.getBoundingClientRect(),h=u.getBoundingClientRect(),_=d.getBoundingClientRect(),v=i.querySelector(`[class~="breeze:col-start-2"]`),b=a.querySelector(`[class~="breeze:col-start-2"]`),x=i.querySelector(`[class~="breeze:-col-end-1"]`),S=a.querySelector(`[class~="breeze:-col-end-1"]`);if(!v||!b||!x||!S)throw Error(`Missing one of the RowList aligned regions.`);let C=v.getBoundingClientRect(),w=b.getBoundingClientRect(),T=x.getBoundingClientRect(),E=S.getBoundingClientRect(),D=y(i).getByText(/^Needs review/).getBoundingClientRect(),O=y(i).getByText(`Coffee shop near the station.`).getBoundingClientRect();await g(getComputedStyle(i).display).toBe(`grid`),await g(D.left).toBeGreaterThan(f.right),await g(D.top).toBeLessThan(f.bottom),await g(O.top).toBeGreaterThanOrEqual(f.bottom),await g(f.left).toBeLessThan(p.left),await g(p.left).toBeLessThan(m.left),await g(Math.abs(C.left-w.left)).toBeLessThan(1),await g(Math.abs(T.left-E.left)).toBeLessThan(1),await g(Math.abs(p.left-h.left)).toBeLessThan(1),await g(Math.abs(m.right-_.right)).toBeLessThan(1),await g(C.width).toBe(120),await g(T.width).toBe(104),await t.page.viewport(375,812),await g(r.innerWidth).toBe(375);let k=o.getByRole(`grid`,{name:`Activity`}),A=y(k).getByRole(`row`,{name:`Coffee shop`}),j=A.getBoundingClientRect(),M=y(A).getByText(`Coffee shop`).getBoundingClientRect(),N=y(A).getByText(`Coffee shop near the station.`).getBoundingClientRect(),P=y(A).getByText(/^Needs review/).getBoundingClientRect(),F=y(A).getByText(`£4.75`).getBoundingClientRect();await g(y(A).getByText(`14 Sept 2026`)).not.toBeVisible(),await g(P.left).toBeLessThan(M.right),await g(P.top).toBeGreaterThanOrEqual(N.bottom+4),await g(F.top).toBeLessThan(N.bottom),await g(F.left).toBeGreaterThan(N.right),await g(Math.abs(F.right-(j.right-16))).toBeLessThan(1),await g(k.scrollWidth).toBeLessThanOrEqual(k.clientWidth),await g(n.documentElement.scrollWidth).toBeLessThanOrEqual(r.innerWidth)}finally{await t.page.viewport(a.width,a.height)}}function f(e){let t=new Set(e.map(({id:e})=>e));return[...t.has(`october`)?[]:[{id:`october`,label:`October entry`,section:{id:`october`,label:`October`}}],...e,...t.has(`september-later`)?[]:[{id:`september-later`,label:`Later September entry`,section:{id:`september`,label:`September`}}]]}function p(){let[e,t]=(0,m.useState)(b),n=()=>t(e=>f(e));return(0,h.jsx)(c,{"aria-label":`Activity`,getItem:u,items:e,loadMore:{label:`Load more activity`,onAction:n},onAction:n})}var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F=t((()=>{m=e(a(),1),s(),h=o(),r(),{expect:g,fn:_,userEvent:v,within:y}=__STORYBOOK_MODULE_TEST__,b=[{badge:{children:`Needs review before the next monthly reconciliation is complete`,variant:`warning`},description:`Coffee shop near the station.`,icon:`document`,id:`coffee`,label:`Coffee shop`,metadata:{format:`date`,value:`2026-09-14`},section:{id:`september`,label:`September`},value:{currency:`GBP`,format:`currency`,value:4.75}},{id:`market`,label:`Market`,metadata:{format:`text`,value:`Card purchase`},section:{id:`september`,label:`September`},value:{format:`text`,value:`Reviewed`}},{id:`travel`,label:`Travel to work`,metadata:{format:`date`,value:`2026-09-12`},section:{id:`august`,label:`August`},value:{currency:`GBP`,format:`currency`,value:8.5}}],x={args:{"aria-label":`Activity`,getItem:u,items:b,loadMore:{label:`Load more activity`,onAction:_()},loading:!1,onAction:_()},component:c,title:`Collections/RowList`},S={play:async({canvasElement:e})=>{await d(e)}},C=[{description:`Website retainer · Sales`,direction:`in`,icon:`incoming`,id:`retainer`,label:`Bramble Studio`,value:{currency:`GBP`,format:`currency`,sign:`always`,tone:`positive`,value:2100}},{description:`Printer paper and toner · Office`,direction:`out`,icon:`outgoing`,id:`supplies`,label:`Northgate Supplies`,value:{currency:`GBP`,format:`currency`,sign:`always`,value:-184.6}},{description:`Return journey · Travel`,direction:`out`,icon:`outgoing`,id:`rail`,label:`Rail fare`,value:{currency:`GBP`,format:`currency`,sign:`always`,value:-42.3}}],w={args:{items:C,loadMore:void 0},play:async({canvasElement:e})=>{let t=y(e),n=t.getByText(`+£2,100.00`),r=t.getByText(`−£184.60`),i=n.closest(`[class~="breeze:-col-end-1"]`),a=t.getByRole(`row`,{name:`Bramble Studio`});if(!i)throw Error(`Missing the RowList value region.`);let o=a.getBoundingClientRect(),s=y(a).getByText(`Bramble Studio`).closest(`[class~="breeze:col-start-1"]`)?.getBoundingClientRect();await g(getComputedStyle(n).fontSize).toBe(`13px`),await g(getComputedStyle(n).fontWeight).toBe(`600`),await g(getComputedStyle(n).color).not.toBe(getComputedStyle(r).color),await g(n.scrollWidth).toBeLessThanOrEqual(i.clientWidth),await g(s?.width).toBe(o.width-32-12-104)}},T=[{description:`Website retainer, October`,direction:`in`,icon:`incoming`,id:`retainer-october`,label:`Bramble Studio`,metadata:{format:`text`,value:`Sales`},metadataAmount:{currency:`GBP`,format:`currency`,value:400},section:{id:`pending`,label:`Pending`,summary:{format:`text`,value:`Not in the balance yet`}},value:{currency:`GBP`,format:`currency`,sign:`always`,tone:`positive`,value:2400}},{badge:{children:`Publishes 8 Sep`,variant:`brand`},description:`Standing order, workshop rent`,direction:`out`,icon:`outgoing`,id:`rent`,label:`Northgate Supplies`,metadata:{format:`text`,value:`Premises`},metadataAmount:{currency:`GBP`,format:`currency`,value:53.07},section:{id:`pending`,label:`Pending`,summary:{format:`text`,value:`Not in the balance yet`}},value:{currency:`GBP`,format:`currency`,sign:`always`,value:-318.4}},{description:`Website retainer, September`,direction:`in`,icon:`incoming`,id:`retainer-september`,label:`Bramble Studio`,metadata:{format:`text`,value:`Sales`},metadataAmount:{currency:`GBP`,format:`currency`,value:350.07},section:{id:`2026-09-03`,label:`Thursday 3 September`,summary:{currency:`GBP`,format:`currency`,label:`Confirmed daily total`,sign:`always`,tone:`positive`,value:1776.4}},value:{currency:`GBP`,format:`currency`,sign:`always`,tone:`positive`,value:2100}},{badge:{children:`No receipt`,variant:`warning`},description:`Van service and MOT`,direction:`out`,icon:`outgoing`,id:`garage`,label:`Fen Lane Garage`,metadata:{format:`text`,value:`Vehicle`},metadataAmount:{currency:`GBP`,format:`currency`,value:23.17},section:{id:`2026-09-03`,label:`Thursday 3 September`,summary:{currency:`GBP`,format:`currency`,label:`Confirmed daily total`,sign:`always`,tone:`positive`,value:1776.4}},value:{currency:`GBP`,format:`currency`,sign:`always`,value:-139}},{description:`Mobile and broadband`,direction:`out`,icon:`outgoing`,id:`telecom`,label:`Meridian Telecom`,metadata:{format:`text`,value:`Utilities`},metadataAmount:{currency:`GBP`,format:`currency`,value:10.81},section:{id:`2026-09-02`,label:`Wednesday 2 September`,summary:{currency:`GBP`,format:`currency`,label:`Confirmed daily total`,sign:`always`,value:-64.85}},value:{currency:`GBP`,format:`currency`,sign:`always`,value:-64.85}}],E={args:{"aria-label":`Transactions`,items:T,loadMore:void 0},play:async({canvasElement:e})=>{let t=y(e),n=t.getByRole(`rowheader`,{name:/^Thursday 3 September/}),r=y(n).getByText(`+£1,776.40`),i=t.getByText(`Not in the balance yet`);await g(n).toHaveTextContent(`Thursday 3 SeptemberConfirmed daily total+£1,776.40`),await g(getComputedStyle(r).fontSize).toBe(`12px`),await g(getComputedStyle(r).fontWeight).toBe(`600`),await g(getComputedStyle(i).fontSize).toBe(`12px`),await g(getComputedStyle(i).color).not.toBe(getComputedStyle(t.getByText(`Pending`)).color);let a=t.getByRole(`row`,{name:`Fen Lane Garage`}),o=a.getBoundingClientRect(),s=y(a).getByText(`Vehicle`),c=s.getBoundingClientRect(),l=y(a).getByText(`£23.17`),u=l.getBoundingClientRect(),d=y(a).getByText(`−£139.00`).getBoundingClientRect(),f=e=>{let{color:t,fontSize:n,fontWeight:r,lineHeight:i}=getComputedStyle(e);return{color:t,fontSize:n,fontWeight:r,lineHeight:i}},p={color:getComputedStyle(i).color,fontSize:`12px`,fontWeight:`400`,lineHeight:`16px`};await g(f(s)).toEqual(p),await g(f(l)).toEqual(p),await g(d.right).toBe(o.right-16),await g(u.right).toBe(d.right-104-12),await g(u.width).toBe(80),await g(c.left).toBe(u.left-12-120)}},D={options:{rowListPhone:{name:`RowList phone`,styles:{height:`812px`,width:`375px`},type:`mobile`}}},O={args:E.args,globals:{viewport:{value:`rowListPhone`}},parameters:{chromatic:{viewports:[375]},viewport:D},play:async({canvasElement:e})=>{let t=y(e).getByRole(`row`,{name:`Fen Lane Garage`}),n=t.getBoundingClientRect(),r=y(t).getByText(`Van service and MOT`).getBoundingClientRect(),i=y(t).getByText(`No receipt`).getBoundingClientRect(),a=y(t).getByText(`−£139.00`).getBoundingClientRect();await g(e.ownerDocument.defaultView?.innerWidth).toBe(375),await g(y(t).getByText(`Vehicle`)).not.toBeVisible(),await g(i.top).toBeGreaterThanOrEqual(r.bottom+4),await g(Math.abs(a.right-(n.right-16))).toBeLessThan(1),await g(Math.abs(a.top+a.height/2-(n.top+n.height/2))).toBeLessThan(1)}},k={args:{items:[],loadMore:void 0,loading:!1}},A={args:{items:[],loadMore:void 0,loading:!0}},j={args:{items:[{...b[0],loading:!0},...b.slice(1)],loadMore:{label:`Load more activity`,loading:!0,onAction:_()}},play:async({canvasElement:e})=>{let t=y(e),n=t.getByRole(`button`,{name:/Load more activity/}),r=t.getByRole(`grid`,{name:`Activity`}),i=t.getByRole(`status`),a=y(r).getByRole(`row`,{name:`Coffee shop`});await g(n).toHaveAttribute(`aria-busy`,`true`),await g(n).toHaveAccessibleName(/Load more activity/),await g(r).not.toHaveAttribute(`aria-busy`),await g(i).toHaveTextContent(`Loading`),await g(r.closest(`[aria-live]`)).toBeNull(),await g(i.closest(`[aria-busy]`)).toBeNull(),await g(r).not.toContainElement(i),await g(a).toBeInTheDocument(),await g(y(a).getAllByRole(`progressbar`,{hidden:!0})).toHaveLength(2)}},M={args:{items:b,loadMore:void 0,loading:!0}},N={play:async({canvasElement:e})=>{let t=y(e).getByRole(`grid`,{name:`Activity`}),n=y(t).getByRole(`row`,{name:`Coffee shop`});t.focus(),await g(n).toHaveFocus(),await v.keyboard(`{Enter}`),await g(y(t).getByRole(`row`,{name:`October entry`})).toBeInTheDocument(),await g(y(t).getByRole(`row`,{name:`Later September entry`})).toBeInTheDocument(),await g(y(t).getByRole(`row`,{name:`Coffee shop`})).toBe(n),await g(n).toHaveFocus()},render:()=>(0,h.jsx)(p,{})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await verifyResponsiveGeometry(canvasElement);
  }
}`,...S.parameters?.docs?.source},description:{story:`Below Breeze's medium breakpoint the metadata hides and the badge moves under the description.`,...S.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    items: activity,
    loadMore: undefined
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const moneyIn = canvas.getByText('+£2,100.00');
    const moneyOut = canvas.getByText('−£184.60');
    const valueRegion = moneyIn.closest<HTMLElement>('[class~="breeze:-col-end-1"]');
    const row = canvas.getByRole('row', {
      name: 'Bramble Studio'
    });
    if (!valueRegion) throw new Error('Missing the RowList value region.');
    const rowRect = row.getBoundingClientRect();
    const leadingRect = within(row).getByText('Bramble Studio').closest('[class~="breeze:col-start-1"]')?.getBoundingClientRect();
    await expect(getComputedStyle(moneyIn).fontSize).toBe('13px');
    await expect(getComputedStyle(moneyIn).fontWeight).toBe('600');
    await expect(getComputedStyle(moneyIn).color).not.toBe(getComputedStyle(moneyOut).color);
    await expect(moneyIn.scrollWidth).toBeLessThanOrEqual(valueRegion.clientWidth);
    // Without metadata only the value column is reserved beside the leading region.
    await expect(leadingRect?.width).toBe(rowRect.width - 32 - 12 - 104);
  }
}`,...w.parameters?.docs?.source},description:{story:`Money in and out carry a direction tile, amount tone and explicit sign.`,...w.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Transactions',
    items: money,
    loadMore: undefined
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const confirmed = canvas.getByRole('rowheader', {
      name: /^Thursday 3 September/
    });
    const total = within(confirmed).getByText('+£1,776.40');
    const note = canvas.getByText('Not in the balance yet');
    await expect(confirmed).toHaveTextContent('Thursday 3 SeptemberConfirmed daily total+£1,776.40');
    await expect(getComputedStyle(total).fontSize).toBe('12px');
    await expect(getComputedStyle(total).fontWeight).toBe('600');
    await expect(getComputedStyle(note).fontSize).toBe('12px');
    await expect(getComputedStyle(note).color).not.toBe(getComputedStyle(canvas.getByText('Pending')).color);
    const row = canvas.getByRole('row', {
      name: 'Fen Lane Garage'
    });
    const rowRect = row.getBoundingClientRect();
    const category = within(row).getByText('Vehicle');
    const categoryRect = category.getBoundingClientRect();
    const vat = within(row).getByText('£23.17');
    const vatRect = vat.getBoundingClientRect();
    const amountRect = within(row).getByText('−£139.00').getBoundingClientRect();
    const textStyle = (element: HTMLElement) => {
      const {
        color,
        fontSize,
        fontWeight,
        lineHeight
      } = getComputedStyle(element);
      return {
        color,
        fontSize,
        fontWeight,
        lineHeight
      };
    };
    const mutedText = {
      color: getComputedStyle(note).color,
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '16px'
    };
    await expect(textStyle(category)).toEqual(mutedText);
    await expect(textStyle(vat)).toEqual(mutedText);
    // Category, VAT and amount columns are 120, 80 and 104px with 12px gaps.
    await expect(amountRect.right).toBe(rowRect.right - 16);
    await expect(vatRect.right).toBe(amountRect.right - 104 - 12);
    await expect(vatRect.width).toBe(80);
    await expect(categoryRect.left).toBe(vatRect.left - 12 - 120);
  }
}`,...E.parameters?.docs?.source},description:{story:`Category and VAT columns, with section headers ending in a daily total or a muted note.`,...E.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: Money.args,
  globals: {
    viewport: {
      value: 'rowListPhone'
    }
  },
  parameters: {
    chromatic: {
      viewports: [375]
    },
    viewport: phoneViewport
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('row', {
      name: 'Fen Lane Garage'
    });
    const rowRect = row.getBoundingClientRect();
    const description = within(row).getByText('Van service and MOT').getBoundingClientRect();
    const badge = within(row).getByText('No receipt').getBoundingClientRect();
    const amount = within(row).getByText('−£139.00').getBoundingClientRect();
    await expect(canvasElement.ownerDocument.defaultView?.innerWidth).toBe(375);
    await expect(within(row).getByText('Vehicle')).not.toBeVisible();
    await expect(badge.top).toBeGreaterThanOrEqual(description.bottom + 4);
    await expect(Math.abs(amount.right - (rowRect.right - 16))).toBeLessThan(1);
    await expect(Math.abs(amount.top + amount.height / 2 - (rowRect.top + rowRect.height / 2))).toBeLessThan(1);
  }
}`,...O.parameters?.docs?.source},description:{story:`At phone width amounts stay inline, badges move under the description and metadata hides.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    loadMore: undefined,
    loading: false
  }
}`,...k.parameters?.docs?.source},description:{story:`An empty result remains a named grid with a structural row and cell.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    loadMore: undefined,
    loading: true
  }
}`,...A.parameters?.docs?.source},description:{story:`Initial loading keeps a fixed skeleton shape inside the named grid.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      ...entries[0],
      loading: true
    }, ...entries.slice(1)],
    loadMore: {
      label: 'Load more activity',
      loading: true,
      onAction: fn()
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: /Load more activity/
    });
    const grid = canvas.getByRole('grid', {
      name: 'Activity'
    });
    const status = canvas.getByRole('status');
    const coffeeRow = within(grid).getByRole('row', {
      name: 'Coffee shop'
    });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAccessibleName(/Load more activity/);
    await expect(grid).not.toHaveAttribute('aria-busy');
    await expect(status).toHaveTextContent('Loading');
    await expect(grid.closest('[aria-live]')).toBeNull();
    await expect(status.closest('[aria-busy]')).toBeNull();
    await expect(grid).not.toContainElement(status);
    await expect(coffeeRow).toBeInTheDocument();
    await expect(within(coffeeRow).getAllByRole('progressbar', {
      hidden: true
    })).toHaveLength(2);
  }
}`,...j.parameters?.docs?.source},description:{story:`Per-row placeholders remain separate from the load-more action.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    items: entries,
    loadMore: undefined,
    loading: true
  }
}`,...M.parameters?.docs?.source},description:{story:`Top-level refresh loading retains ordinary rows and their focus.`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', {
      name: 'Activity'
    });
    const coffeeRow = within(grid).getByRole('row', {
      name: 'Coffee shop'
    });
    grid.focus();
    await expect(coffeeRow).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(within(grid).getByRole('row', {
      name: 'October entry'
    })).toBeInTheDocument();
    await expect(within(grid).getByRole('row', {
      name: 'Later September entry'
    })).toBeInTheDocument();
    await expect(within(grid).getByRole('row', {
      name: 'Coffee shop'
    })).toBe(coffeeRow);
    await expect(coffeeRow).toHaveFocus();
  },
  render: () => <MergingExample />
}`,...N.parameters?.docs?.source},description:{story:`Activating a row merges items while retaining its focused DOM row.`,...N.parameters?.docs?.description}}};try{S.displayName=`Default`,S.__docgenInfo={description:`Below Breeze's medium breakpoint the metadata hides and the badge moves under the description.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{w.displayName=`Activity`,w.__docgenInfo={description:`Money in and out carry a direction tile, amount tone and explicit sign.`,displayName:`Activity`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{E.displayName=`Money`,E.__docgenInfo={description:`Category and VAT columns, with section headers ending in a daily total or a muted note.`,displayName:`Money`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{O.displayName=`Phone`,O.__docgenInfo={description:`At phone width amounts stay inline, badges move under the description and metadata hides.`,displayName:`Phone`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`Empty`,k.__docgenInfo={description:`An empty result remains a named grid with a structural row and cell.`,displayName:`Empty`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{A.displayName=`InitialLoading`,A.__docgenInfo={description:`Initial loading keeps a fixed skeleton shape inside the named grid.`,displayName:`InitialLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{j.displayName=`Loading`,j.__docgenInfo={description:`Per-row placeholders remain separate from the load-more action.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{M.displayName=`RetainedLoading`,M.__docgenInfo={description:`Top-level refresh loading retains ordinary rows and their focus.`,displayName:`RetainedLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{N.displayName=`Merging`,N.__docgenInfo={description:`Activating a row merges items while retaining its focused DOM row.`,displayName:`Merging`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}P=[`Default`,`Activity`,`Money`,`Phone`,`Empty`,`InitialLoading`,`Loading`,`RetainedLoading`,`Merging`]}));F();export{w as Activity,S as Default,k as Empty,A as InitialLoading,j as Loading,N as Merging,E as Money,O as Phone,M as RetainedLoading,P as __namedExportsOrder,x as default,F as n,l as t};