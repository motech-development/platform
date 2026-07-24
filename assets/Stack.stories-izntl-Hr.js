import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Surface-BNgcQ4ww.js";import{n as a,t as o}from"./Stack-0pHCj1U7.js";var s=t({Default:()=>f,ResponsiveGap:()=>p,__namedExportsOrder:()=>m,default:()=>d}),c,l,u,d,f,p,m,h=e((()=>{r(),a(),c=n(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d={argTypes:{align:{control:`inline-radio`,options:[`start`,`center`,`end`,`stretch`]},justify:{control:`inline-radio`,options:[`start`,`center`,`end`,`between`]}},args:{gap:`md`},component:o,render:e=>(0,c.jsxs)(o,{align:e.align,"aria-label":`Stack example`,gap:e.gap,justify:e.justify,children:[(0,c.jsx)(i,{padding:`md`,children:`First`}),(0,c.jsx)(i,{padding:`md`,children:`Second`}),(0,c.jsx)(i,{padding:`md`,children:`Third`})]}),title:`Layout/Stack`},f={play:async({canvasElement:e})=>{await l(u(e).getByLabelText(`Stack example`).children).toHaveLength(3)}},p={args:{gap:{base:`sm`,md:`xl`}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByLabelText('Stack example').children).toHaveLength(3);
  }
}`,...f.parameters?.docs?.source},description:{story:`Arranges three related surfaces in the canonical stretched vertical flow
and verifies that authored child order remains unchanged.

@summary default vertical stack with stable source order`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    gap: {
      base: 'sm',
      md: 'xl'
    }
  }
}`,...p.parameters?.docs?.source},description:{story:`Increases only the inter-item spacing at the medium breakpoint while the
content order, alignment, and semantics remain constant.

@summary breakpoint-responsive vertical spacing`,...p.parameters?.docs?.description}}};try{f.displayName=`Default`,f.__docgenInfo={description:`Arranges three related surfaces in the canonical stretched vertical flow
and verifies that authored child order remains unchanged.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Stack/Stack.stories.tsx`,methods:[],props:{},tags:{summary:`default vertical stack with stable source order`}}}catch{}try{p.displayName=`ResponsiveGap`,p.__docgenInfo={description:`Increases only the inter-item spacing at the medium breakpoint while the
content order, alignment, and semantics remain constant.`,displayName:`ResponsiveGap`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Stack/Stack.stories.tsx`,methods:[],props:{},tags:{summary:`breakpoint-responsive vertical spacing`}}}catch{}m=[`Default`,`ResponsiveGap`]}));h();export{f as Default,p as ResponsiveGap,m as __namedExportsOrder,d as default,h as n,s as t};