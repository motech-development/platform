import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,d as a,f as o,l as s,p as c,r as l,u}from"./iframe-CQHtwZcQ.js";import{n as d,t as f}from"./FormattedNumber-BFWKtK81.js";import{n as p,t as m}from"./Skeleton-B1-oo4q9.js";function h({className:e,density:t=`regular`,description:n,label:r,ref:i,tone:o=`default`,value:c,...l}){s();let u=(0,g.useId)(),d=v({density:t,tone:o});return(0,g.createElement)(`article`,{...l,"aria-labelledby":u,className:d.root({class:e}),ref:a(i)},(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(`div`,{className:d.label(),id:u,children:r}),(0,_.jsx)(`div`,{className:d.value(),children:c}),n==null?null:(0,_.jsx)(`div`,{className:d.description(),children:n})]}))}var g,_,v,y=t((()=>{g=n(r(),1),o(),u(),i(),_=l(),v=c({defaultVariants:{density:`regular`,tone:`default`},slots:{description:`text-base`,label:`font-[family-name:var(--breeze-font-display)] text-base leading-5`,root:`grid min-w-0 content-center border-b-2 p-5 sm:p-7`,value:`font-[family-name:var(--breeze-font-display)] text-[2rem] font-bold leading-[1.2] tabular-nums`},variants:{density:{regular:{root:`gap-2`},spacious:{root:`gap-3`}},tone:{default:{description:`text-[var(--breeze-ink-soft)]`,label:`font-bold`,root:`border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]`},inverse:{description:`text-[var(--breeze-ink-inverse-muted)]`,label:`font-normal text-[var(--breeze-ink-inverse-muted)]`,root:`border-[var(--breeze-shell-border)] bg-[var(--breeze-shell-soft)] text-[var(--breeze-ink-inverse)]`},subtle:{description:`text-[var(--breeze-ink-soft)]`,label:`font-bold`,root:`border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink)]`}}}});try{h.displayName=`MetricCard`,h.__docgenInfo={description:`Presents one prominent application-formatted metric without domain
calculation.`,displayName:`MetricCard`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,methods:[],props:{density:{defaultValue:{value:`regular`},declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:"Internal content rhythm. Defaults to `regular`.",name:`density`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`MetricCardDensity | undefined`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Optional supporting explanation or comparison.`,name:`description`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`ReactNode`}},label:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Persistent metric label.`,name:`label`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Ref to the rendered article.`,name:`ref`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},tone:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:"Semantic surface tone. Defaults to `default`.",name:`tone`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`MetricCardTone | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Prominent application-formatted value.`,name:`value`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!0,tags:{},type:{name:`ReactNode`}}},tags:{summary:`prominent labelled metric with optional supporting context`}}}catch{}})),b=e({Inverse:()=>T,InverseCompact:()=>E,InverseLoading:()=>D,Subtle:()=>O,__namedExportsOrder:()=>k,default:()=>w}),x,S,C,w,T,E,D,O,k,A=t((()=>{d(),p(),y(),x=l(),{expect:S,within:C}=__STORYBOOK_MODULE_TEST__,w={component:h,title:`Patterns/Data/MetricCard`,parameters:{docs:{description:{component:`Presents one prominent application-formatted value without owning
calculations, refresh state, or domain meaning.

@summary prominent labelled metric with optional supporting context`}}}},T={args:{description:`Updated recently`,label:`Project progress`,tone:`inverse`,value:(0,x.jsx)(f,{options:{style:`percent`},value:.72})},play:async({canvasElement:e})=>{let t=C(e).getByRole(`article`,{name:`Project progress`}),n=C(t).getByText(`Project progress`),r=C(t).getByText(`72%`),i=getComputedStyle(t),a=getComputedStyle(n),o=getComputedStyle(r);await S(i.backgroundColor).toBe(`rgb(34, 44, 64)`),await S(i.borderBottomColor).toBe(`rgb(14, 21, 36)`),await S(i.borderBottomWidth).toBe(`2px`),await S(i.borderTopWidth).toBe(`0px`),await S(i.columnGap).toBe(`8px`),await S(i.paddingTop).toBe(i.paddingRight),await S(i.paddingBottom).toBe(i.paddingTop),await S(i.paddingLeft).toBe(i.paddingRight),await S(a.color).toBe(`rgb(202, 208, 220)`),await S(a.fontFamily).toContain(`Cabin`),await S(a.fontSize).toBe(`16px`),await S(a.fontWeight).toBe(`400`),await S(o.fontFamily).toContain(`Cabin`),await S(o.fontSize).toBe(`32px`),await S(o.fontWeight).toBe(`700`),await S(Number.parseFloat(o.lineHeight)).toBeCloseTo(38.4,3)}},E={...T,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{let t=C(e).getByRole(`article`,{name:`Project progress`}),n=getComputedStyle(t);await S(n.paddingTop).toBe(n.paddingRight),await S(n.paddingBottom).toBe(n.paddingTop),await S(n.paddingLeft).toBe(n.paddingRight)}},D={args:{"aria-hidden":!0,density:`spacious`,label:(0,x.jsx)(m,{className:`h-5 w-32`,tone:`inverse`}),tone:`inverse`,value:(0,x.jsx)(m,{className:`h-9 w-48`,tone:`inverse`})},play:async({canvasElement:e})=>{let t=e.querySelector(`article`),n=t?.querySelectorAll(`[data-shape]`);await S(t).not.toBeNull(),await S(t).toHaveAttribute(`aria-hidden`,`true`),await S(n).toHaveLength(2),await S(getComputedStyle(n?.[0]).backgroundColor).toBe(`rgb(86, 97, 116)`)}},O={args:{label:`Open items`,tone:`subtle`,value:(0,x.jsx)(f,{value:12})}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    description: 'Updated recently',
    label: 'Project progress',
    tone: 'inverse',
    value: <FormattedNumber options={{
      style: 'percent'
    }} value={0.72} />
  },
  play: async ({
    canvasElement
  }) => {
    const card = within(canvasElement).getByRole('article', {
      name: 'Project progress'
    });
    const label = within(card).getByText('Project progress');
    const value = within(card).getByText('72%');
    const cardStyle = getComputedStyle(card);
    const labelStyle = getComputedStyle(label);
    const valueStyle = getComputedStyle(value);
    await expect(cardStyle.backgroundColor).toBe('rgb(34, 44, 64)');
    await expect(cardStyle.borderBottomColor).toBe('rgb(14, 21, 36)');
    await expect(cardStyle.borderBottomWidth).toBe('2px');
    await expect(cardStyle.borderTopWidth).toBe('0px');
    await expect(cardStyle.columnGap).toBe('8px');
    await expect(cardStyle.paddingTop).toBe(cardStyle.paddingRight);
    await expect(cardStyle.paddingBottom).toBe(cardStyle.paddingTop);
    await expect(cardStyle.paddingLeft).toBe(cardStyle.paddingRight);
    await expect(labelStyle.color).toBe('rgb(202, 208, 220)');
    await expect(labelStyle.fontFamily).toContain('Cabin');
    await expect(labelStyle.fontSize).toBe('16px');
    await expect(labelStyle.fontWeight).toBe('400');
    await expect(valueStyle.fontFamily).toContain('Cabin');
    await expect(valueStyle.fontSize).toBe('32px');
    await expect(valueStyle.fontWeight).toBe('700');
    await expect(Number.parseFloat(valueStyle.lineHeight)).toBeCloseTo(38.4, 3);
  }
}`,...T.parameters?.docs?.source},description:{story:`Uses the inverse shell-compatible surface for a locale-formatted value and
short recency description while preserving the metric's labelled article.

@summary inverse metric with formatted value and supporting context`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...Inverse,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const card = within(canvasElement).getByRole('article', {
      name: 'Project progress'
    });
    const cardStyle = getComputedStyle(card);
    await expect(cardStyle.paddingTop).toBe(cardStyle.paddingRight);
    await expect(cardStyle.paddingBottom).toBe(cardStyle.paddingTop);
    await expect(cardStyle.paddingLeft).toBe(cardStyle.paddingRight);
  }
}`,...E.parameters?.docs?.source},description:{story:`Places the inverse metric at the canonical compact viewport to demonstrate
its equal inset spacing and readable value treatment at narrow widths.

@summary compact inverse metric with balanced responsive spacing`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-hidden': true,
    density: 'spacious',
    label: <Skeleton className="h-5 w-32" tone="inverse" />,
    tone: 'inverse',
    value: <Skeleton className="h-9 w-48" tone="inverse" />
  },
  play: async ({
    canvasElement
  }) => {
    const card = canvasElement.querySelector('article');
    const skeletons = card?.querySelectorAll<HTMLElement>('[data-shape]');
    await expect(card).not.toBeNull();
    await expect(card).toHaveAttribute('aria-hidden', 'true');
    await expect(skeletons).toHaveLength(2);
    await expect(getComputedStyle(skeletons?.[0] as HTMLElement).backgroundColor).toBe('rgb(86, 97, 116)');
  }
}`,...D.parameters?.docs?.source},description:{story:`Replaces unavailable label and value content with inverse-tone skeletons and
hides the placeholder article so assistive technology does not announce it.

@summary non-announced inverse loading placeholder for a metric`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Open items',
    tone: 'subtle',
    value: <FormattedNumber value={12} />
  }
}`,...O.parameters?.docs?.source},description:{story:`Uses the subtle surface when a metric belongs inside a light content region
and does not need the visual weight of an inverse shell treatment.

@summary subtle metric surface for supporting page information`,...O.parameters?.docs?.description}}};try{w.displayName=`MetricCard`,w.__docgenInfo={description:`Presents one prominent application-formatted metric without domain
calculation.`,displayName:`MetricCard`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/MetricCard/MetricCard.stories.tsx`,methods:[],props:{density:{defaultValue:{value:`regular`},declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:"Internal content rhythm. Defaults to `regular`.",name:`density`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`MetricCardDensity | undefined`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Optional supporting explanation or comparison.`,name:`description`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`ReactNode`}},label:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Persistent metric label.`,name:`label`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Ref to the rendered article.`,name:`ref`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},tone:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:"Semantic surface tone. Defaults to `default`.",name:`tone`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!1,tags:{},type:{name:`MetricCardTone | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`}],description:`Prominent application-formatted value.`,name:`value`,parent:{fileName:`breeze-ui/src/patterns/MetricCard/MetricCard.tsx`,name:`MetricCardProps`},required:!0,tags:{},type:{name:`ReactNode`}}},tags:{summary:`prominent labelled metric with optional supporting context`}}}catch{}try{T.displayName=`Inverse`,T.__docgenInfo={description:`Uses the inverse shell-compatible surface for a locale-formatted value and
short recency description while preserving the metric's labelled article.`,displayName:`Inverse`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/MetricCard/MetricCard.stories.tsx`,methods:[],props:{},tags:{summary:`inverse metric with formatted value and supporting context`}}}catch{}try{E.displayName=`InverseCompact`,E.__docgenInfo={description:`Places the inverse metric at the canonical compact viewport to demonstrate
its equal inset spacing and readable value treatment at narrow widths.`,displayName:`InverseCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/MetricCard/MetricCard.stories.tsx`,methods:[],props:{},tags:{summary:`compact inverse metric with balanced responsive spacing`}}}catch{}try{D.displayName=`InverseLoading`,D.__docgenInfo={description:`Replaces unavailable label and value content with inverse-tone skeletons and
hides the placeholder article so assistive technology does not announce it.`,displayName:`InverseLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/MetricCard/MetricCard.stories.tsx`,methods:[],props:{},tags:{summary:`non-announced inverse loading placeholder for a metric`}}}catch{}try{O.displayName=`Subtle`,O.__docgenInfo={description:`Uses the subtle surface when a metric belongs inside a light content region
and does not need the visual weight of an inverse shell treatment.`,displayName:`Subtle`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/MetricCard/MetricCard.stories.tsx`,methods:[],props:{},tags:{summary:`subtle metric surface for supporting page information`}}}catch{}k=[`Inverse`,`InverseCompact`,`InverseLoading`,`Subtle`]}));A();export{T as Inverse,E as InverseCompact,D as InverseLoading,O as Subtle,k as __namedExportsOrder,w as default,A as n,b as t};