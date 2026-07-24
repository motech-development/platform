import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Grid-B1O46UoR.js";import{n as a,t as o}from"./StoryConstraint-DtKI6sgB.js";import{n as s,t as c}from"./Surface-BNgcQ4ww.js";var l=t({CanonicalFormColumns:()=>h,ResponsiveColumns:()=>m,__namedExportsOrder:()=>g,default:()=>p}),u,d,f,p,m,h,g,_=e((()=>{a(),s(),r(),u=n(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p={component:i,parameters:{chromatic:{viewports:[360,800,1280]}},render:e=>(0,u.jsxs)(i,{align:e.align,"aria-label":`Grid example`,columns:e.columns,gap:e.gap,children:[(0,u.jsx)(c,{padding:`md`,children:`One`}),(0,u.jsx)(c,{padding:`md`,children:`Two`}),(0,u.jsx)(c,{padding:`md`,children:`Three`}),(0,u.jsx)(c,{padding:`md`,children:`Four`}),(0,u.jsx)(c,{padding:`md`,children:`Five`}),(0,u.jsx)(c,{padding:`md`,children:`Six`})]}),title:`Layout/Grid`},m={args:{columns:{base:1,lg:6,md:3},gap:{base:`sm`,md:`md`}},play:async({canvasElement:e})=>{await d(f(e).getByLabelText(`Grid example`).children).toHaveLength(6)}},h={args:{columns:{base:1,sm:2}},play:async({canvasElement:e})=>{let t=f(e).getByLabelText(`Grid example`),[n,r,i]=Array.from(t.children);await d(getComputedStyle(t).gap).toBe(`20px`),await d(n.getBoundingClientRect().width).toBeCloseTo(r.getBoundingClientRect().width,1),await d(i.getBoundingClientRect().top).toBeGreaterThan(n.getBoundingClientRect().top)},render:e=>(0,u.jsx)(o,{size:`bounded-layout`,children:(0,u.jsxs)(i,{"aria-label":`Grid example`,columns:e.columns,gap:e.gap,children:[(0,u.jsx)(c,{padding:`md`,children:`One`}),(0,u.jsx)(c,{padding:`md`,children:`Two`}),(0,u.jsx)(c,{padding:`md`,children:`Three`})]})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    columns: {
      base: 1,
      lg: 6,
      md: 3
    },
    gap: {
      base: 'sm',
      md: 'md'
    }
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByLabelText('Grid example').children).toHaveLength(6);
  }
}`,...m.parameters?.docs?.source},description:{story:`Progressively increases the column count and spacing across Breeze
breakpoints while leaving all six items in one stable source order.

@summary responsive column counts and gaps`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    columns: {
      base: 1,
      sm: 2
    }
  },
  play: async ({
    canvasElement
  }) => {
    const grid = within(canvasElement).getByLabelText('Grid example');
    const [first, second, third] = Array.from(grid.children);
    await expect(getComputedStyle(grid).gap).toBe('20px');
    await expect(first.getBoundingClientRect().width).toBeCloseTo(second.getBoundingClientRect().width, 1);
    await expect(third.getBoundingClientRect().top).toBeGreaterThan(first.getBoundingClientRect().top);
  },
  render: args => <StoryConstraint size="bounded-layout">
      <Grid aria-label="Grid example" columns={args.columns} gap={args.gap}>
        <Surface padding="md">One</Surface>
        <Surface padding="md">Two</Surface>
        <Surface padding="md">Three</Surface>
      </Grid>
    </StoryConstraint>
}`,...h.parameters?.docs?.source},description:{story:`Uses a two-column form-style layout above the small breakpoint and verifies
equal tracks plus natural wrapping for the remaining item.

@summary equal form columns with natural row wrapping`,...h.parameters?.docs?.description}}};try{m.displayName=`ResponsiveColumns`,m.__docgenInfo={description:`Progressively increases the column count and spacing across Breeze
breakpoints while leaving all six items in one stable source order.`,displayName:`ResponsiveColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Grid/Grid.stories.tsx`,methods:[],props:{},tags:{summary:`responsive column counts and gaps`}}}catch{}try{h.displayName=`CanonicalFormColumns`,h.__docgenInfo={description:`Uses a two-column form-style layout above the small breakpoint and verifies
equal tracks plus natural wrapping for the remaining item.`,displayName:`CanonicalFormColumns`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Grid/Grid.stories.tsx`,methods:[],props:{},tags:{summary:`equal form columns with natural row wrapping`}}}catch{}g=[`ResponsiveColumns`,`CanonicalFormColumns`]}));_();export{h as CanonicalFormColumns,m as ResponsiveColumns,g as __namedExportsOrder,p as default,_ as n,l as t};