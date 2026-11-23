const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./context-BA1lSQW8.js","./rolldown-runtime-DaJ6WEGw.js"])))=>i.map(i=>d[i]);
import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{n as r,t as i}from"./preload-helper-si3HNj2m.js";import{t as a}from"./react-DvlgmmzG.js";import{t as o}from"./jsx-runtime-cM__dR4X.js";import{n as s,t as c}from"./RowList-HrPj7f74.js";var l=n({Activity:()=>T,Default:()=>C,Empty:()=>z,InitialLoading:()=>B,Initials:()=>F,Loading:()=>V,Merging:()=>U,Money:()=>D,Phone:()=>k,RetainedLoading:()=>H,StaticRows:()=>j,TextColumns:()=>L,TextColumnsPhone:()=>R,Unread:()=>N,__namedExportsOrder:()=>W,default:()=>S});function u(e){return e}function d(e,t){return Array.from(e.querySelector(`[role="gridcell"]`)?.children??[]).at(t)}async function f(e){if(!(`__vitest_browser__`in globalThis))return;let t=await i(()=>import(`./context-BA1lSQW8.js`),__vite__mapDeps([0,1]),import.meta.url),n=e.ownerDocument,r=n.defaultView;if(!r)throw Error(`Missing RowList story window.`);let a={height:r.innerHeight,width:r.innerWidth},o=b(e);try{await t.page.viewport(1200,800),await _(r.innerWidth).toBe(1200);let e=o.getByRole(`grid`,{name:`Activity`}),i=b(e).getByRole(`row`,{name:`Coffee shop`}),a=b(e).getByRole(`row`,{name:`Market`}),s=b(i).getByText(`Coffee shop`),c=b(i).getByText(`14 Sept 2026`),l=b(i).getByText(`£4.75`),u=b(a).getByText(`Card purchase`),f=b(a).getByText(`Reviewed`),p=s.getBoundingClientRect(),m=c.getBoundingClientRect(),h=l.getBoundingClientRect(),g=u.getBoundingClientRect(),v=f.getBoundingClientRect(),y=d(i,1),x=d(a,1),S=d(i,-1),C=d(a,-1);if(!y||!x||!S||!C)throw Error(`Missing one of the RowList aligned regions.`);let w=y.getBoundingClientRect(),T=x.getBoundingClientRect(),E=S.getBoundingClientRect(),D=C.getBoundingClientRect(),O=b(i).getByText(/^Needs review/).getBoundingClientRect(),k=b(i).getByText(`Coffee shop near the station.`).getBoundingClientRect();await _(getComputedStyle(i).display).toBe(`grid`),await _(O.left).toBeGreaterThan(p.right),await _(O.top).toBeLessThan(p.bottom),await _(k.top).toBeGreaterThanOrEqual(p.bottom),await _(p.left).toBeLessThan(m.left),await _(m.left).toBeLessThan(h.left),await _(Math.abs(w.left-T.left)).toBeLessThan(1),await _(Math.abs(E.left-D.left)).toBeLessThan(1),await _(Math.abs(m.left-g.left)).toBeLessThan(1),await _(Math.abs(h.right-v.right)).toBeLessThan(1),await _(w.width).toBe(120),await _(E.width).toBe(104);let A=o.getByText(`Showing 3 entries`).getBoundingClientRect(),j=o.getByRole(`button`,{name:`Load more activity`}).getBoundingClientRect();await _(A.left).toBe(i.getBoundingClientRect().left+16),await _(A.right).toBeLessThan(j.left),await _(Math.abs(A.top+A.height/2-(j.top+j.height/2))).toBeLessThan(1),await t.page.viewport(375,812),await _(r.innerWidth).toBe(375);let M=o.getByRole(`grid`,{name:`Activity`}),N=b(M).getByRole(`row`,{name:`Coffee shop`}),P=N.getBoundingClientRect(),F=b(N).getByText(`Coffee shop`).getBoundingClientRect(),I=b(N).getByText(`Coffee shop near the station.`).getBoundingClientRect(),L=b(N).getByText(/^Needs review/).getBoundingClientRect(),R=b(N).getByText(`£4.75`).getBoundingClientRect();await _(b(N).getByText(`14 Sept 2026`)).not.toBeVisible(),await _(L.left).toBeLessThan(F.right),await _(L.top).toBeGreaterThanOrEqual(I.bottom+4),await _(R.top).toBeLessThan(I.bottom),await _(R.left).toBeGreaterThan(I.right),await _(Math.abs(R.right-(P.right-16))).toBeLessThan(1),await _(M.scrollWidth).toBeLessThanOrEqual(M.clientWidth),await _(n.documentElement.scrollWidth).toBeLessThanOrEqual(r.innerWidth)}finally{await t.page.viewport(a.width,a.height)}}function p(e){let t=new Set(e.map(({id:e})=>e));return[...t.has(`october`)?[]:[{id:`october`,label:`October entry`,section:{id:`october`,label:`October`}}],...e,...t.has(`september-later`)?[]:[{id:`september-later`,label:`Later September entry`,section:{id:`september`,label:`September`}}]]}function m(){let[e,t]=(0,h.useState)(x),n=()=>t(e=>p(e));return(0,g.jsx)(c,{"aria-label":`Activity`,getItem:u,items:e,loadMore:{label:`Load more activity`,onAction:n},onAction:n})}var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G=t((()=>{h=e(a(),1),s(),g=o(),r(),{expect:_,fn:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x=[{badge:{children:`Needs review before the next monthly reconciliation is complete`,variant:`warning`},description:`Coffee shop near the station.`,icon:`document`,id:`coffee`,label:`Coffee shop`,metadata:{format:`date`,value:`2026-09-14`},section:{id:`september`,label:`September`},value:{currency:`GBP`,format:`currency`,value:4.75}},{id:`market`,label:`Market`,metadata:{format:`text`,value:`Card purchase`},section:{id:`september`,label:`September`},value:{format:`text`,value:`Reviewed`}},{id:`travel`,label:`Travel to work`,metadata:{format:`date`,value:`2026-09-12`},section:{id:`august`,label:`August`},value:{currency:`GBP`,format:`currency`,value:8.5}}],S={args:{"aria-label":`Activity`,getItem:u,items:x,loadMore:{label:`Load more activity`,onAction:v(),status:`Showing 3 entries`},loading:!1,onAction:v()},component:c,title:`Collections/RowList`},C={play:async({canvasElement:e})=>{await f(e)}},w=[{description:`Website retainer · Sales`,direction:`in`,icon:`incoming`,id:`retainer`,label:`Bramble Studio`,value:{currency:`GBP`,format:`currency`,sign:`always`,tone:`positive`,value:2100}},{description:`Printer paper and toner · Office`,direction:`out`,icon:`outgoing`,id:`supplies`,label:`Northgate Supplies`,value:{currency:`GBP`,format:`currency`,sign:`always`,value:-184.6}},{description:`Return journey · Travel`,direction:`out`,icon:`outgoing`,id:`rail`,label:`Rail fare`,value:{currency:`GBP`,format:`currency`,sign:`always`,value:-42.3}}],T={args:{items:w,loadMore:void 0},play:async({canvasElement:e})=>{let t=b(e),n=t.getByText(`+£2,100.00`),r=t.getByText(`−£184.60`),i=t.getByRole(`row`,{name:`Bramble Studio`}),a=d(i,-1);if(!a)throw Error(`Missing the RowList value region.`);let o=i.getBoundingClientRect(),s=d(i,0)?.getBoundingClientRect();await _(getComputedStyle(n).fontSize).toBe(`13px`),await _(getComputedStyle(n).fontWeight).toBe(`600`),await _(getComputedStyle(n).color).not.toBe(getComputedStyle(r).color),await _(n.scrollWidth).toBeLessThanOrEqual(a.clientWidth),await _(s?.width).toBe(o.width-32-12-104)}},E=[{description:`Website retainer, October`,direction:`in`,icon:`incoming`,id:`retainer-october`,label:`Bramble Studio`,metadata:{format:`text`,value:`Sales`},metadataAmount:{currency:`GBP`,format:`currency`,value:400},section:{id:`pending`,label:`Pending`,summary:{format:`text`,value:`Not in the balance yet`}},value:{currency:`GBP`,format:`currency`,sign:`always`,tone:`positive`,value:2400}},{badge:[{children:`No receipt`,variant:`warning`},{children:`Publishes 8 Sep`,variant:`brand`}],description:`Standing order, workshop rent`,direction:`out`,icon:`outgoing`,id:`rent`,label:`Northgate Supplies`,metadata:{format:`text`,value:`Premises`},metadataAmount:{currency:`GBP`,format:`currency`,value:53.07},section:{id:`pending`,label:`Pending`,summary:{format:`text`,value:`Not in the balance yet`}},value:{currency:`GBP`,format:`currency`,sign:`always`,value:-318.4}},{description:`Website retainer, September`,direction:`in`,icon:`incoming`,id:`retainer-september`,label:`Bramble Studio`,metadata:{format:`text`,value:`Sales`},metadataAmount:{currency:`GBP`,format:`currency`,value:350.07},section:{id:`2026-09-03`,label:`Thursday 3 September`,summary:{currency:`GBP`,format:`currency`,label:`Confirmed daily total`,sign:`always`,tone:`positive`,value:1776.4}},value:{currency:`GBP`,format:`currency`,sign:`always`,tone:`positive`,value:2100}},{badge:{children:`No receipt`,variant:`warning`},description:`Van service and MOT`,direction:`out`,icon:`outgoing`,id:`garage`,label:`Fen Lane Garage`,metadata:{format:`text`,value:`Vehicle`},metadataAmount:{currency:`GBP`,format:`currency`,value:23.17},section:{id:`2026-09-03`,label:`Thursday 3 September`,summary:{currency:`GBP`,format:`currency`,label:`Confirmed daily total`,sign:`always`,tone:`positive`,value:1776.4}},value:{currency:`GBP`,format:`currency`,sign:`always`,value:-139}},{description:`Mobile and broadband`,direction:`out`,icon:`outgoing`,id:`telecom`,label:`Meridian Telecom`,metadata:{format:`text`,value:`Utilities`},metadataAmount:{currency:`GBP`,format:`currency`,value:10.81},section:{id:`2026-09-02`,label:`Wednesday 2 September`,summary:{currency:`GBP`,format:`currency`,label:`Confirmed daily total`,sign:`always`,value:-64.85}},value:{currency:`GBP`,format:`currency`,sign:`always`,value:-64.85}}],D={args:{"aria-label":`Transactions`,headings:{label:`Transaction`,metadata:`Category`,metadataAmount:`VAT`,value:`Amount`},items:E,loadMore:void 0},play:async({canvasElement:e})=>{let t=b(e),n=t.getByRole(`rowheader`,{name:/^Thursday 3 September/}),r=b(n).getByText(`+£1,776.40`),i=t.getByText(`Not in the balance yet`);await _(n).toHaveTextContent(`Thursday 3 SeptemberConfirmed daily total+£1,776.40`),await _(getComputedStyle(r).fontSize).toBe(`12px`),await _(getComputedStyle(r).fontWeight).toBe(`600`),await _(getComputedStyle(i).fontSize).toBe(`12px`),await _(getComputedStyle(i).color).not.toBe(getComputedStyle(t.getByText(`Pending`)).color);let a=t.getByRole(`row`,{name:`Fen Lane Garage`}),o=a.getBoundingClientRect(),s=b(a).getByText(`Vehicle`),c=s.getBoundingClientRect(),l=b(a).getByText(`£23.17`),u=l.getBoundingClientRect(),d=b(a).getByText(`−£139.00`).getBoundingClientRect(),f=e=>{let{color:t,fontSize:n,fontWeight:r,lineHeight:i}=getComputedStyle(e);return{color:t,fontSize:n,fontWeight:r,lineHeight:i}},p={color:getComputedStyle(i).color,fontSize:`12px`,fontWeight:`400`,lineHeight:`16px`};await _(f(s)).toEqual(p),await _(f(l)).toEqual(p),await _(d.right).toBe(o.right-16),await _(u.right).toBe(d.right-104-12),await _(u.width).toBe(80),await _(c.left).toBe(u.left-12-120);let m=e=>t.getByText(e).getBoundingClientRect();await _(m(`Transaction`).left).toBe(o.left+16),await _(m(`Category`).left).toBe(c.left),await _(m(`VAT`).right).toBe(u.right),await _(m(`Amount`).right).toBe(d.right);let h=t.getByRole(`row`,{name:`Northgate Supplies`}),g=b(h).getByText(`Northgate Supplies`).getBoundingClientRect(),v=b(h).getByText(`No receipt`).getBoundingClientRect(),y=b(h).getByText(`Publishes 8 Sep`).getBoundingClientRect();await _(v.left).toBeGreaterThan(g.right),await _(y.left).toBeGreaterThan(v.right),await _(y.top).toBe(v.top)}},O={options:{rowListPhone:{name:`RowList phone`,styles:{height:`812px`,width:`375px`},type:`mobile`}}},k={args:D.args,globals:{viewport:{value:`rowListPhone`}},parameters:{chromatic:{viewports:[375]},viewport:O},play:async({canvasElement:e})=>{let t=b(e),n=t.getByRole(`row`,{name:`Fen Lane Garage`}),r=n.getBoundingClientRect(),i=b(n).getByText(`Van service and MOT`).getBoundingClientRect(),a=b(n).getByText(`No receipt`).getBoundingClientRect(),o=b(n).getByText(`−£139.00`).getBoundingClientRect();await _(e.ownerDocument.defaultView?.innerWidth).toBe(375),await _(b(n).getByText(`Vehicle`)).not.toBeVisible(),await _(t.getByText(`Category`)).not.toBeVisible(),await _(t.getByText(`VAT`)).not.toBeVisible(),await _(t.getByText(`Amount`).getBoundingClientRect().right).toBe(o.right),await _(a.top).toBeGreaterThanOrEqual(i.bottom+4);let s=t.getByRole(`row`,{name:`Northgate Supplies`}),c=b(s).getByText(`Standing order, workshop rent`).getBoundingClientRect(),l=b(s).getByText(`No receipt`).getBoundingClientRect(),u=b(s).getByText(`Publishes 8 Sep`).getBoundingClientRect();await _(l.top).toBeGreaterThanOrEqual(c.bottom+4),await _(u.top).toBe(l.top),await _(u.left-l.right).toBe(18),await _(Math.abs(o.right-(r.right-16))).toBeLessThan(1),await _(Math.abs(o.top+o.height/2-(r.top+r.height/2))).toBeLessThan(1)}},A=[{action:{download:!0,href:`/reports/2026-10-03.zip`,label:`Download`},icon:`document`,id:`report-october`,label:`3 Oct 2026, 09:12`,metadata:{format:`text`,value:`4 Oct 2026, 09:12`}},{action:{download:!0,href:`/reports/2026-10-02.zip`,label:`Download`},icon:`document`,id:`report-september`,label:`2 Oct 2026, 17:40`,metadata:{format:`text`,value:`3 Oct 2026, 17:40`}}],j={args:{"aria-label":`Reports`,headings:{action:`Actions`,label:`Requested`,metadata:`Expires`},items:A,loadMore:void 0,onAction:void 0},play:async({canvasElement:e})=>{let t=b(e),n=t.getByRole(`grid`,{name:`Reports`}),r=b(n).getByRole(`row`,{name:`3 Oct 2026, 09:12`}),i=b(r).getByRole(`link`,{name:`Download`}),a=r.getBoundingClientRect(),o=i.getBoundingClientRect();await _(i).toHaveAttribute(`download`,``),await _(Math.abs(o.right-(a.right-16))).toBeLessThan(1),await _(t.getByText(`Actions`).getBoundingClientRect().right).toBe(o.right),n.focus(),await _(r).toHaveFocus(),await y.keyboard(`{ArrowRight}`),await _(i).toHaveFocus()}},M=[{action:{download:!0,href:`/reports/2026-10-03.zip`,label:`Download`},description:`Today, 14:32`,id:`report-ready`,label:`Your report is ready to download`,unread:!0},{description:`Yesterday, 06:00`,id:`published`,label:`A scheduled transaction has been published`,unread:!0},{description:`30 July 2026`,id:`virus`,label:`A file you have uploaded is infected with a virus and it has been removed`,unread:!1}],N={args:{"aria-label":`Notifications`,items:M,loadMore:void 0,onAction:void 0},play:async({canvasElement:e})=>{let t=b(e),n=t.getByText(`Your report is ready to download`),r=t.getByText(/^A file you have uploaded/);await _(getComputedStyle(n).fontWeight).toBe(`600`),await _(getComputedStyle(r).fontWeight).not.toBe(`600`),await _(t.getAllByText(`Unread`)).toHaveLength(2),await _(n.getBoundingClientRect().left-r.getBoundingClientRect().left).toBe(0)}},P=[{action:{href:`/companies/bramble`,label:`Details`},badge:{children:`Selected`,variant:`brand`},id:`bramble`,initials:`BS`,label:`Bramble Studio Ltd`,metadata:{format:`text`,value:`09876543`}},{action:{href:`/companies/northgate`,label:`Details`},id:`northgate`,initials:`NC`,label:`Northgate Consulting Ltd`,metadata:{format:`text`,value:`12345678`}}],F={args:{"aria-label":`Companies`,headings:{action:`Action`,label:`Company`,metadata:`Company number`},items:P,loadMore:void 0,onAction:void 0},play:async({canvasElement:e})=>{let t=b(e),n=t.getByText(`BS`),r=n.getBoundingClientRect(),i=t.getByText(`Bramble Studio Ltd`).getBoundingClientRect();await _(r.width).toBe(24),await _(r.height).toBe(24),await _(getComputedStyle(n).fontSize).toBe(`11px`),await _(i.left).toBe(r.right+12)}},I={"aria-label":`Clients`,headings:{label:`Client`,metadata:[`Email`,`Town or city`]},items:[{id:`bramble`,initials:`BS`,label:`Bramble Studio`,metadata:[{format:`text`,value:`accounts@bramble.studio`,width:`lg`},{format:`text`,value:`Bristol`}],narrowDescription:`accounts@bramble.studio · Bristol`},{id:`fen-lane`,initials:`FL`,label:`Fen Lane Garage`,metadata:[{format:`text`,value:`hello@fenlane.co.uk`,width:`lg`},{format:`text`,value:`Cambridge`}],narrowDescription:`hello@fenlane.co.uk · Cambridge`}],loadMore:void 0},L={args:I,play:async({canvasElement:e})=>{let t=b(e),n=t.getByRole(`row`,{name:`Bramble Studio`}),r=d(n,1)?.getBoundingClientRect(),i=d(n,2)?.getBoundingClientRect();await _(r?.width).toBe(240),await _(i?.width).toBe(120),await _(i?.right).toBe(n.getBoundingClientRect().right-16),await _(t.getByText(`Email`).getBoundingClientRect().left).toBe(r?.left),await _(t.getByText(`Town or city`).getBoundingClientRect().left).toBe(i?.left),await _(b(n).getByText(`accounts@bramble.studio · Bristol`)).not.toBeVisible()}},R={args:I,globals:{viewport:{value:`rowListPhone`}},parameters:{chromatic:{viewports:[375]},viewport:O},play:async({canvasElement:e})=>{let t=b(e),n=t.getByRole(`row`,{name:`Bramble Studio`});await _(e.ownerDocument.defaultView?.innerWidth).toBe(375),await _(b(n).getByText(`Bristol`)).not.toBeVisible(),await _(t.getByText(`Email`)).not.toBeVisible(),await _(b(n).getByText(`accounts@bramble.studio · Bristol`)).toBeVisible()}},z={args:{items:[],loadMore:void 0,loading:!1}},B={args:{items:[],loadMore:void 0,loading:!0}},V={args:{items:[{...x[0],loading:!0},...x.slice(1)],loadMore:{label:`Load more activity`,loading:!0,onAction:v()}},play:async({canvasElement:e})=>{let t=b(e),n=t.getByRole(`button`,{name:/Load more activity/}),r=t.getByRole(`grid`,{name:`Activity`}),i=t.getByRole(`status`),a=b(r).getByRole(`row`,{name:`Coffee shop`});await _(n).toHaveAttribute(`aria-busy`,`true`),await _(n).toHaveAccessibleName(/Load more activity/),await _(r).not.toHaveAttribute(`aria-busy`),await _(i).toHaveTextContent(`Loading`),await _(r.closest(`[aria-live]`)).toBeNull(),await _(i.closest(`[aria-busy]`)).toBeNull(),await _(r).not.toContainElement(i),await _(a).toBeInTheDocument(),await _(b(a).getAllByRole(`progressbar`,{hidden:!0})).toHaveLength(2)}},H={args:{items:x,loadMore:void 0,loading:!0}},U={play:async({canvasElement:e})=>{let t=b(e).getByRole(`grid`,{name:`Activity`}),n=b(t).getByRole(`row`,{name:`Coffee shop`});t.focus(),await _(n).toHaveFocus(),await y.keyboard(`{Enter}`),await _(b(t).getByRole(`row`,{name:`October entry`})).toBeInTheDocument(),await _(b(t).getByRole(`row`,{name:`Later September entry`})).toBeInTheDocument(),await _(b(t).getByRole(`row`,{name:`Coffee shop`})).toBe(n),await _(n).toHaveFocus()},render:()=>(0,g.jsx)(m,{})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await verifyResponsiveGeometry(canvasElement);
  }
}`,...C.parameters?.docs?.source},description:{story:`Below Breeze's medium breakpoint the metadata hides and the badge moves under the description.`,...C.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
    const row = canvas.getByRole('row', {
      name: 'Bramble Studio'
    });
    const valueRegion = regionOf(row, -1);
    if (!valueRegion) throw new Error('Missing the RowList value region.');
    const rowRect = row.getBoundingClientRect();
    const leadingRect = regionOf(row, 0)?.getBoundingClientRect();
    await expect(getComputedStyle(moneyIn).fontSize).toBe('13px');
    await expect(getComputedStyle(moneyIn).fontWeight).toBe('600');
    await expect(getComputedStyle(moneyIn).color).not.toBe(getComputedStyle(moneyOut).color);
    await expect(moneyIn.scrollWidth).toBeLessThanOrEqual(valueRegion.clientWidth);
    // Without metadata only the value column is reserved beside the leading region.
    await expect(leadingRect?.width).toBe(rowRect.width - 32 - 12 - 104);
  }
}`,...T.parameters?.docs?.source},description:{story:`Money in and out carry a direction tile, amount tone and explicit sign.`,...T.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Transactions',
    headings: {
      label: 'Transaction',
      metadata: 'Category',
      metadataAmount: 'VAT',
      value: 'Amount'
    },
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
    const headingRect = (text: string) => canvas.getByText(text).getBoundingClientRect();
    await expect(headingRect('Transaction').left).toBe(rowRect.left + 16);
    await expect(headingRect('Category').left).toBe(categoryRect.left);
    await expect(headingRect('VAT').right).toBe(vatRect.right);
    await expect(headingRect('Amount').right).toBe(amountRect.right);
    const rent = canvas.getByRole('row', {
      name: 'Northgate Supplies'
    });
    const rentLabel = within(rent).getByText('Northgate Supplies').getBoundingClientRect();
    const noReceipt = within(rent).getByText('No receipt').getBoundingClientRect();
    const publishes = within(rent).getByText('Publishes 8 Sep').getBoundingClientRect();
    await expect(noReceipt.left).toBeGreaterThan(rentLabel.right);
    await expect(publishes.left).toBeGreaterThan(noReceipt.right);
    await expect(publishes.top).toBe(noReceipt.top);
  }
}`,...D.parameters?.docs?.source},description:{story:`Column headings over category and VAT columns, a row with two badges, and section headers ending in a daily total or a muted note.`,...D.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText('Category')).not.toBeVisible();
    await expect(canvas.getByText('VAT')).not.toBeVisible();
    await expect(canvas.getByText('Amount').getBoundingClientRect().right).toBe(amount.right);
    await expect(badge.top).toBeGreaterThanOrEqual(description.bottom + 4);
    const rent = canvas.getByRole('row', {
      name: 'Northgate Supplies'
    });
    const rentDescription = within(rent).getByText('Standing order, workshop rent').getBoundingClientRect();
    const noReceipt = within(rent).getByText('No receipt').getBoundingClientRect();
    const publishes = within(rent).getByText('Publishes 8 Sep').getBoundingClientRect();
    await expect(noReceipt.top).toBeGreaterThanOrEqual(rentDescription.bottom + 4);
    await expect(publishes.top).toBe(noReceipt.top);
    // 6px between the badges, measured inside each badge's 6px inline padding.
    await expect(publishes.left - noReceipt.right).toBe(6 + 6 + 6);
    await expect(Math.abs(amount.right - (rowRect.right - 16))).toBeLessThan(1);
    await expect(Math.abs(amount.top + amount.height / 2 - (rowRect.top + rowRect.height / 2))).toBeLessThan(1);
  }
}`,...k.parameters?.docs?.source},description:{story:`At phone width amounts stay inline, badges move under the description and metadata hides.`,...k.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Reports',
    headings: {
      action: 'Actions',
      label: 'Requested',
      metadata: 'Expires'
    },
    items: reports,
    loadMore: undefined,
    onAction: undefined
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', {
      name: 'Reports'
    });
    const row = within(grid).getByRole('row', {
      name: '3 Oct 2026, 09:12'
    });
    const download = within(row).getByRole('link', {
      name: 'Download'
    });
    const rowRect = row.getBoundingClientRect();
    const downloadRect = download.getBoundingClientRect();
    await expect(download).toHaveAttribute('download', '');
    await expect(Math.abs(downloadRect.right - (rowRect.right - 16))).toBeLessThan(1);
    await expect(canvas.getByText('Actions').getBoundingClientRect().right).toBe(downloadRect.right);
    grid.focus();
    await expect(row).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(download).toHaveFocus();
  }
}`,...j.parameters?.docs?.source},description:{story:`Static rows that are not actions themselves, each ending in its own Download link.`,...j.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Notifications',
    items: notifications,
    loadMore: undefined,
    onAction: undefined
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const unread = canvas.getByText('Your report is ready to download');
    const read = canvas.getByText(/^A file you have uploaded/);
    await expect(getComputedStyle(unread).fontWeight).toBe('600');
    await expect(getComputedStyle(read).fontWeight).not.toBe('600');
    await expect(canvas.getAllByText('Unread')).toHaveLength(2);
    await expect(unread.getBoundingClientRect().left - read.getBoundingClientRect().left).toBe(0);
  }
}`,...N.parameters?.docs?.source},description:{story:`Unread rows carry a dot, a heavier label and hidden “Unread” text; only one row has an action.`,...N.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Companies',
    headings: {
      action: 'Action',
      label: 'Company',
      metadata: 'Company number'
    },
    items: companies,
    loadMore: undefined,
    onAction: undefined
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const initials = canvas.getByText('BS');
    const tile = initials.getBoundingClientRect();
    const label = canvas.getByText('Bramble Studio Ltd').getBoundingClientRect();
    await expect(tile.width).toBe(24);
    await expect(tile.height).toBe(24);
    await expect(getComputedStyle(initials).fontSize).toBe('11px');
    await expect(label.left).toBe(tile.right + 12);
  }
}`,...F.parameters?.docs?.source},description:{story:`Rows that lead with initials in a brand tile in place of an icon.`,...F.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: peopleArgs,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('row', {
      name: 'Bramble Studio'
    });
    const email = regionOf(row, 1)?.getBoundingClientRect();
    const town = regionOf(row, 2)?.getBoundingClientRect();
    await expect(email?.width).toBe(240);
    await expect(town?.width).toBe(120);
    await expect(town?.right).toBe(row.getBoundingClientRect().right - 16);
    await expect(canvas.getByText('Email').getBoundingClientRect().left).toBe(email?.left);
    await expect(canvas.getByText('Town or city').getBoundingClientRect().left).toBe(town?.left);
    await expect(within(row).getByText('accounts@bramble.studio · Bristol')).not.toBeVisible();
  }
}`,...L.parameters?.docs?.source},description:{story:`Several text columns of different widths; on phones a narrow description keeps their content.`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: peopleArgs,
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
      name: 'Bramble Studio'
    });
    await expect(canvasElement.ownerDocument.defaultView?.innerWidth).toBe(375);
    await expect(within(row).getByText('Bristol')).not.toBeVisible();
    await expect(canvas.getByText('Email')).not.toBeVisible();
    await expect(within(row).getByText('accounts@bramble.studio · Bristol')).toBeVisible();
  }
}`,...R.parameters?.docs?.source},description:{story:`At phone width the text columns hide and the narrow description takes the detail line.`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    loadMore: undefined,
    loading: false
  }
}`,...z.parameters?.docs?.source},description:{story:`An empty result remains a named grid with a structural row and cell.`,...z.parameters?.docs?.description}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    loadMore: undefined,
    loading: true
  }
}`,...B.parameters?.docs?.source},description:{story:`Initial loading keeps a fixed skeleton shape inside the named grid.`,...B.parameters?.docs?.description}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source},description:{story:`Per-row placeholders remain separate from the load-more action.`,...V.parameters?.docs?.description}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    items: entries,
    loadMore: undefined,
    loading: true
  }
}`,...H.parameters?.docs?.source},description:{story:`Top-level refresh loading retains ordinary rows and their focus.`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source},description:{story:`Activating a row merges items while retaining its focused DOM row.`,...U.parameters?.docs?.description}}};try{C.displayName=`Default`,C.__docgenInfo={description:`Below Breeze's medium breakpoint the metadata hides and the badge moves under the description.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{T.displayName=`Activity`,T.__docgenInfo={description:`Money in and out carry a direction tile, amount tone and explicit sign.`,displayName:`Activity`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{D.displayName=`Money`,D.__docgenInfo={description:`Column headings over category and VAT columns, a row with two badges, and section headers ending in a daily total or a muted note.`,displayName:`Money`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`Phone`,k.__docgenInfo={description:`At phone width amounts stay inline, badges move under the description and metadata hides.`,displayName:`Phone`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{j.displayName=`StaticRows`,j.__docgenInfo={description:`Static rows that are not actions themselves, each ending in its own Download link.`,displayName:`StaticRows`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{N.displayName=`Unread`,N.__docgenInfo={description:`Unread rows carry a dot, a heavier label and hidden “Unread” text; only one row has an action.`,displayName:`Unread`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{F.displayName=`Initials`,F.__docgenInfo={description:`Rows that lead with initials in a brand tile in place of an icon.`,displayName:`Initials`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{L.displayName=`TextColumns`,L.__docgenInfo={description:`Several text columns of different widths; on phones a narrow description keeps their content.`,displayName:`TextColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{R.displayName=`TextColumnsPhone`,R.__docgenInfo={description:`At phone width the text columns hide and the narrow description takes the detail line.`,displayName:`TextColumnsPhone`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{z.displayName=`Empty`,z.__docgenInfo={description:`An empty result remains a named grid with a structural row and cell.`,displayName:`Empty`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{B.displayName=`InitialLoading`,B.__docgenInfo={description:`Initial loading keeps a fixed skeleton shape inside the named grid.`,displayName:`InitialLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{V.displayName=`Loading`,V.__docgenInfo={description:`Per-row placeholders remain separate from the load-more action.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{H.displayName=`RetainedLoading`,H.__docgenInfo={description:`Top-level refresh loading retains ordinary rows and their focus.`,displayName:`RetainedLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{U.displayName=`Merging`,U.__docgenInfo={description:`Activating a row merges items while retaining its focused DOM row.`,displayName:`Merging`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/RowList/RowList.stories.tsx`,methods:[],props:{},tags:{}}}catch{}W=[`Default`,`Activity`,`Money`,`Phone`,`StaticRows`,`Unread`,`Initials`,`TextColumns`,`TextColumnsPhone`,`Empty`,`InitialLoading`,`Loading`,`RetainedLoading`,`Merging`]}));G();export{T as Activity,C as Default,z as Empty,B as InitialLoading,F as Initials,V as Loading,U as Merging,D as Money,k as Phone,H as RetainedLoading,j as StaticRows,L as TextColumns,R as TextColumnsPhone,N as Unread,W as __namedExportsOrder,S as default,G as n,l as t};