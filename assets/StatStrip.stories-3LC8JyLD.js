import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,r as i}from"./BreezeContext-D8B-y9s5.js";import{n as a,t as o}from"./Skeleton-CNWzjCno.js";import{n as s,t as c}from"./Typography-CEt3x14j.js";import{n as l,t as u}from"./Badge-BOZ9Ncf_.js";import{n as d,t as f}from"./Card-DssyqaHD.js";function p({loadingLabel:e}){return(0,h.jsx)(`div`,{"aria-busy":`true`,className:g.base.loading,children:_.map(({figure:t,id:n,label:r},i)=>(0,h.jsxs)(`div`,{className:g.base.loadingCell,children:[(0,h.jsx)(o,{blockSize:12,inlineSize:`min(100%, ${r}px)`,label:i===0?e:void 0,shape:`rectangle`}),(0,h.jsx)(o,{blockSize:32,inlineSize:`min(100%, ${t}px)`,shape:`rectangle`})]},n))})}function m(e){let{messages:t}=i(),{"aria-label":n,getItem:r,items:a,loading:o}=e;return(0,h.jsx)(f,{"aria-label":n,padding:0,children:o?(0,h.jsx)(p,{loadingLabel:t.loading}):(0,h.jsx)(`dl`,{className:g.base.list,children:a.map(e=>r(e)).map((e,t)=>(0,h.jsxs)(`div`,{className:[g.base.cell,t>0&&g.state.divided].filter(Boolean).join(` `),children:[(0,h.jsxs)(`dt`,{className:g.base.label,children:[e.label,e.badge&&(0,h.jsxs)(h.Fragment,{children:[` `,(0,h.jsx)(u,{"aria-label":e.badge[`aria-label`],variant:e.badge.variant,children:e.badge.children})]})]}),(0,h.jsx)(`dd`,{className:g.base.figure,children:(0,h.jsx)(c,{align:`start`,currency:e.currency,format:`currency`,value:e.value,variant:`money`})})]},e.id))})})}var h,g,_,v=e((()=>{l(),d(),a(),s(),r(),h=n(),g={base:{cell:`breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-[6px] breeze:px-breeze-5 breeze:py-breeze-4`,figure:`breeze:m-0 breeze:min-inline-0`,label:`breeze:m-0 breeze:text-breeze-xs breeze:font-medium breeze:text-breeze-ink-3`,list:`breeze:m-0 breeze:grid breeze:auto-cols-[minmax(0,1fr)] breeze:grid-flow-col breeze:gap-breeze-3 breeze:max-breeze-md:grid-flow-row`,loading:`breeze:grid breeze:grid-cols-3 breeze:gap-breeze-5 breeze:px-breeze-5 breeze:py-breeze-4 breeze:max-breeze-md:grid-cols-1`,loadingCell:`breeze:flex breeze:min-inline-0 breeze:flex-col breeze:items-start breeze:gap-breeze-2`},compound:{},size:{},state:{divided:`breeze:border-s breeze:border-breeze-line breeze:max-breeze-md:border-s-0 breeze:max-breeze-md:border-bs`},variant:{}},_=[{figure:160,id:`first`,label:88},{figure:152,id:`second`,label:112},{figure:128,id:`third`,label:72}];try{m.displayName=`StatStrip`,m.__docgenInfo={description:`Presents a few headline currency figures side by side in one panel.`,displayName:`StatStrip`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`StatStripBaseProps`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`StatStripBaseProps`}],description:`Names the group of figures for assistive technology.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`StatStripBaseProps`},required:!0,tags:{},type:{name:`string`}},getItem:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`}],description:`Returns the closed display descriptor for an application value; optional while loading.
Returns the closed display descriptor for an application value.`,name:`getItem`,required:!1,tags:{},type:{name:`((item: T) => StatStripItemDescriptor) | ((item: T) => StatStripItemDescriptor) | undefined`}},items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`}],description:`Application values displayed as figures; optional while loading.
Application values displayed as figures, in order.`,name:`items`,required:!1,tags:{},type:{name:`T[] | undefined`}},loading:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/StatStrip/StatStrip.tsx`,name:`TypeLiteral`}],description:`Replaces the figures with a three-cell loading placeholder.
Displays the figures instead of a loading placeholder.`,name:`loading`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`A labelled strip of currency figures with an owned loading shape.`}}}catch{}})),y=t({Loading:()=>D,Overview:()=>E,Phone:()=>k,__namedExportsOrder:()=>A,default:()=>T});function b(e){return e}function x(e){let t=C(e).getByRole(`group`,{name:`Balance`});return Array.from(t.querySelectorAll(`dl > div`))}var S,C,w,T,E,D,O,k,A,j=e((()=>{v(),{expect:S,within:C}=__STORYBOOK_MODULE_TEST__,w=[{currency:`GBP`,id:`balance`,label:`Current balance`,value:24180.5},{currency:`GBP`,id:`balance-less-vat`,label:`Balance less VAT owed`,value:20060.5},{badge:{children:`Standard 20%`},currency:`GBP`,id:`vat-owed`,label:`VAT owed`,value:4120}],T={args:{"aria-label":`Balance`,getItem:b,items:w},component:m,title:`Patterns/StatStrip`},E={play:async({canvasElement:e})=>{let t=C(e),n=x(e),[r,i,a]=n.map(e=>e.getBoundingClientRect());await S(t.getByText(`£24,180.50`)).toBeVisible(),await S(t.getByText(`Standard 20%`)).toBeVisible(),await S(i.left-r.right).toBeCloseTo(12),await S(a.left-i.right).toBeCloseTo(12),await S(Math.abs(r.width-a.width)).toBeLessThan(1),await S(r.top).toBe(a.top),await S(getComputedStyle(n[1]).borderInlineStartWidth).toBe(`1px`),await S(getComputedStyle(n[0]).borderInlineStartWidth).toBe(`0px`)}},D={args:{loading:!0},play:async({canvasElement:e})=>{let t=C(e),n=t.getByRole(`group`,{name:`Balance`});await S(t.getByRole(`progressbar`)).toHaveAccessibleName(`Loading`),await S(n.querySelector(`[aria-busy="true"]`)).not.toBeNull(),await S(n.querySelector(`dl`)).toBeNull()}},O={options:{statStripPhone:{name:`StatStrip phone`,styles:{height:`812px`,width:`375px`},type:`mobile`}}},k={globals:{viewport:{value:`statStripPhone`}},parameters:{chromatic:{viewports:[375]},viewport:O},play:async({canvasElement:e})=>{let t=x(e),[n,r,i]=t.map(e=>e.getBoundingClientRect());await S(e.ownerDocument.defaultView?.innerWidth).toBe(375),await S(r.top-n.bottom).toBeCloseTo(12),await S(i.top-r.bottom).toBeCloseTo(12),await S(n.left).toBe(i.left),await S(getComputedStyle(t[1]).borderBlockStartWidth).toBe(`1px`),await S(getComputedStyle(t[1]).borderInlineStartWidth).toBe(`0px`)}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source},description:{story:`Three balance figures, the last scoped by a badge, as on the overview.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source},description:{story:`The loading shape replaces the figures with three skeleton cells.`,...D.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source},description:{story:`Below Breeze's medium breakpoint the figures stack with dividers between them.`,...k.parameters?.docs?.description}}};try{E.displayName=`Overview`,E.__docgenInfo={description:`Three balance figures, the last scoped by a badge, as on the overview.`,displayName:`Overview`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{D.displayName=`Loading`,D.__docgenInfo={description:`The loading shape replaces the figures with three skeleton cells.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`Phone`,k.__docgenInfo={description:`Below Breeze's medium breakpoint the figures stack with dividers between them.`,displayName:`Phone`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/StatStrip/StatStrip.stories.tsx`,methods:[],props:{},tags:{}}}catch{}A=[`Overview`,`Loading`,`Phone`]}));j();export{D as Loading,E as Overview,k as Phone,A as __namedExportsOrder,T as default,j as n,y as t};