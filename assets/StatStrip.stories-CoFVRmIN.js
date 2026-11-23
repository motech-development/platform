import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,r as i}from"./BreezeContext-D8B-y9s5.js";import{n as a,t as o}from"./Skeleton-CNWzjCno.js";import{n as s,t as c}from"./Typography-CEt3x14j.js";import{n as l,t as u}from"./Badge-BOZ9Ncf_.js";import{n as d,t as f}from"./Card-BTAhI8Fz.js";function p({loadingLabel:e}){return(0,g.jsx)(`div`,{"aria-busy":`true`,className:_.base.loading,children:v.map(({figure:t,id:n,label:r},i)=>(0,g.jsxs)(`div`,{className:_.base.loadingCell,children:[(0,g.jsx)(o,{blockSize:12,inlineSize:`min(100%, ${r}px)`,label:i===0?e:void 0,shape:`rectangle`}),(0,g.jsx)(o,{blockSize:32,inlineSize:`min(100%, ${t}px)`,shape:`rectangle`})]},n))})}function m({descriptor:e,locale:t}){return e.format===`date`?(0,g.jsx)(c,{element:`span`,format:`date`,value:e.value,variant:`heading`}):e.format===`number`?(0,g.jsx)(c,{element:`span`,numeric:!0,variant:`heading`,children:new Intl.NumberFormat(t).format(e.value)}):e.format===`text`?(0,g.jsx)(c,{element:`span`,variant:`heading`,children:e.value}):(0,g.jsx)(c,{align:`start`,currency:e.currency,format:`currency`,value:e.value,variant:`money`})}function h(e){let{locale:t,messages:n}=i(),{"aria-label":r,getItem:a,items:o,loading:s}=e;return(0,g.jsx)(f,{"aria-label":r,padding:0,children:s?(0,g.jsx)(p,{loadingLabel:n.loading}):(0,g.jsx)(`dl`,{className:_.base.list,children:o.map(e=>a(e)).map((e,n)=>(0,g.jsxs)(`div`,{className:[_.base.cell,n>0&&_.state.divided].filter(Boolean).join(` `),children:[(0,g.jsxs)(`dt`,{className:_.base.label,children:[e.label,e.badge&&(0,g.jsxs)(g.Fragment,{children:[` `,(0,g.jsx)(u,{"aria-label":e.badge[`aria-label`],variant:e.badge.variant,children:e.badge.children})]})]}),(0,g.jsx)(`dd`,{className:_.base.figure,children:(0,g.jsx)(m,{descriptor:e,locale:t})})]},e.id))})})}var g,_,v,y=e((()=>{l(),d(),a(),s(),r(),g=n(),_={base:{cell:`breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-[6px] breeze:px-breeze-5 breeze:py-breeze-4`,figure:`breeze:m-0 breeze:min-inline-0`,label:`breeze:m-0 breeze:text-breeze-xs breeze:font-medium breeze:text-breeze-ink-3`,list:`breeze:m-0 breeze:grid breeze:auto-cols-[minmax(0,1fr)] breeze:grid-flow-col breeze:gap-breeze-3 breeze:max-breeze-md:grid-flow-row`,loading:`breeze:grid breeze:grid-cols-3 breeze:gap-breeze-5 breeze:px-breeze-5 breeze:py-breeze-4 breeze:max-breeze-md:grid-cols-1`,loadingCell:`breeze:flex breeze:min-inline-0 breeze:flex-col breeze:items-start breeze:gap-breeze-2`},compound:{},size:{},state:{divided:`breeze:border-s breeze:border-breeze-line breeze:max-breeze-md:border-s-0 breeze:max-breeze-md:border-bs`},variant:{}},v=[{figure:160,id:`first`,label:88},{figure:152,id:`second`,label:112},{figure:128,id:`third`,label:72}];try{h.displayName=`StatStrip`,h.__docgenInfo={description:`Presents a few headline figures side by side in one panel.`,displayName:`StatStrip`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`StatStripBaseProps`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`StatStripBaseProps`}],description:`Names the group of figures for assistive technology.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`StatStripBaseProps`},required:!0,tags:{},type:{name:`string`}},getItem:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`}],description:`Returns the closed display descriptor for an application value; optional while loading.
Returns the closed display descriptor for an application value.`,name:`getItem`,required:!1,tags:{},type:{name:`((item: T) => StatStripItemDescriptor) | ((item: T) => StatStripItemDescriptor) | undefined`}},items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`}],description:`Application values displayed as figures; optional while loading.
Application values displayed as figures, in order.`,name:`items`,required:!1,tags:{},type:{name:`T[] | undefined`}},loading:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`}],description:`Replaces the figures with a three-cell loading placeholder.
Displays the figures instead of a loading placeholder.`,name:`loading`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`A labelled strip of currency, date, number or text figures with an owned loading shape.`}}}catch{}})),b=t({Loading:()=>O,OtherFigures:()=>j,Overview:()=>D,Phone:()=>M,__namedExportsOrder:()=>N,default:()=>E});function x(e){return e}function S(e){let t=w(e).getByRole(`group`,{name:`Balance`});return Array.from(t.querySelectorAll(`dl > div`))}var C,w,T,E,D,O,k,A,j,M,N,P=e((()=>{y(),{expect:C,within:w}=__STORYBOOK_MODULE_TEST__,T=[{currency:`GBP`,id:`balance`,label:`Current balance`,value:24180.5},{currency:`GBP`,id:`balance-less-vat`,label:`Balance less VAT owed`,value:20060.5},{badge:{children:`Standard 20%`},currency:`GBP`,id:`vat-owed`,label:`VAT owed`,value:4120}],E={args:{"aria-label":`Balance`,getItem:x,items:T},component:h,title:`Patterns/StatStrip`},D={play:async({canvasElement:e})=>{let t=w(e),n=S(e),[r,i,a]=n.map(e=>e.getBoundingClientRect());await C(t.getByText(`£24,180.50`)).toBeVisible(),await C(t.getByText(`Standard 20%`)).toBeVisible(),await C(i.left-r.right).toBeCloseTo(12),await C(a.left-i.right).toBeCloseTo(12),await C(Math.abs(r.width-a.width)).toBeLessThan(1),await C(r.top).toBe(a.top),await C(getComputedStyle(n[1]).borderInlineStartWidth).toBe(`1px`),await C(getComputedStyle(n[0]).borderInlineStartWidth).toBe(`0px`)}},O={args:{loading:!0},play:async({canvasElement:e})=>{let t=w(e),n=t.getByRole(`group`,{name:`Balance`});await C(t.getByRole(`progressbar`)).toHaveAccessibleName(`Loading`),await C(n.querySelector(`[aria-busy="true"]`)).not.toBeNull(),await C(n.querySelector(`dl`)).toBeNull()}},k={options:{statStripPhone:{name:`StatStrip phone`,styles:{height:`812px`,width:`375px`},type:`mobile`}}},A=[{format:`date`,id:`year-end`,label:`Accounting year ends`,value:`2027-04-05`},{format:`number`,id:`days`,label:`Days remaining`,value:132},{format:`text`,id:`scheme`,label:`VAT scheme`,value:`Flat rate`}],j={args:{"aria-label":`Year end`,items:A},play:async({canvasElement:e})=>{let t=w(e),n=[`5 April 2027`,`132`,`Flat rate`].map(e=>getComputedStyle(t.getByText(e)).fontSize);await C(n).toEqual([`22px`,`22px`,`22px`]),await C(getComputedStyle(t.getByText(`132`)).fontVariantNumeric).toBe(`tabular-nums`)}},M={globals:{viewport:{value:`statStripPhone`}},parameters:{chromatic:{viewports:[375]},viewport:k},play:async({canvasElement:e})=>{let t=S(e),[n,r,i]=t.map(e=>e.getBoundingClientRect());await C(e.ownerDocument.defaultView?.innerWidth).toBe(375),await C(r.top-n.bottom).toBeCloseTo(12),await C(i.top-r.bottom).toBeCloseTo(12),await C(n.left).toBe(i.left),await C(getComputedStyle(t[1]).borderBlockStartWidth).toBe(`1px`),await C(getComputedStyle(t[1]).borderInlineStartWidth).toBe(`0px`)}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const cells = getCells(canvasElement);
    const [first, second, third] = cells.map(cell => cell.getBoundingClientRect());
    await expect(canvas.getByText('£24,180.50')).toBeVisible();
    await expect(canvas.getByText('Standard 20%')).toBeVisible();
    // Equal columns with a 12px gap before each 1px divider.
    await expect(second.left - first.right).toBeCloseTo(12);
    await expect(third.left - second.right).toBeCloseTo(12);
    await expect(Math.abs(first.width - third.width)).toBeLessThan(1);
    await expect(first.top).toBe(third.top);
    await expect(getComputedStyle(cells[1]).borderInlineStartWidth).toBe('1px');
    await expect(getComputedStyle(cells[0]).borderInlineStartWidth).toBe('0px');
  }
}`,...D.parameters?.docs?.source},description:{story:`Three balance figures, the last scoped by a badge, as on the overview.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', {
      name: 'Balance'
    });
    await expect(canvas.getByRole('progressbar')).toHaveAccessibleName('Loading');
    await expect(group.querySelector('[aria-busy="true"]')).not.toBeNull();
    await expect(group.querySelector('dl')).toBeNull();
  }
}`,...O.parameters?.docs?.source},description:{story:`The loading shape replaces the figures with three skeleton cells.`,...O.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Year end',
    items: yearEnd
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const sizes = ['5 April 2027', '132', 'Flat rate'].map(text => getComputedStyle(canvas.getByText(text)).fontSize);
    await expect(sizes).toEqual(['22px', '22px', '22px']);
    await expect(getComputedStyle(canvas.getByText('132')).fontVariantNumeric).toBe('tabular-nums');
  }
}`,...j.parameters?.docs?.source},description:{story:`A date, a count and a scheme name in the same divided strip, as on the year end page.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'statStripPhone'
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
    const cells = getCells(canvasElement);
    const [first, second, third] = cells.map(cell => cell.getBoundingClientRect());
    await expect(canvasElement.ownerDocument.defaultView?.innerWidth).toBe(375);
    await expect(second.top - first.bottom).toBeCloseTo(12);
    await expect(third.top - second.bottom).toBeCloseTo(12);
    await expect(first.left).toBe(third.left);
    await expect(getComputedStyle(cells[1]).borderBlockStartWidth).toBe('1px');
    await expect(getComputedStyle(cells[1]).borderInlineStartWidth).toBe('0px');
  }
}`,...M.parameters?.docs?.source},description:{story:`Below Breeze's medium breakpoint the figures stack with dividers between them.`,...M.parameters?.docs?.description}}};try{D.displayName=`Overview`,D.__docgenInfo={description:`Three balance figures, the last scoped by a badge, as on the overview.`,displayName:`Overview`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{O.displayName=`Loading`,O.__docgenInfo={description:`The loading shape replaces the figures with three skeleton cells.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{j.displayName=`OtherFigures`,j.__docgenInfo={description:`A date, a count and a scheme name in the same divided strip, as on the year end page.`,displayName:`OtherFigures`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{M.displayName=`Phone`,M.__docgenInfo={description:`Below Breeze's medium breakpoint the figures stack with dividers between them.`,displayName:`Phone`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}N=[`Overview`,`Loading`,`OtherFigures`,`Phone`]}));P();export{O as Loading,j as OtherFigures,D as Overview,M as Phone,N as __namedExportsOrder,E as default,P as n,b as t};