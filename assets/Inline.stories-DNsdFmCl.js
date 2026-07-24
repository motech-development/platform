import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Inline-B4SGPSRg.js";import{n as a,t as o}from"./Surface-BNgcQ4ww.js";var s=t({Distributed:()=>p,Wrapping:()=>f,__namedExportsOrder:()=>m,default:()=>d}),c,l,u,d,f,p,m,h=e((()=>{a(),r(),c=n(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d={argTypes:{align:{control:`select`,options:[`start`,`center`,`end`,`stretch`,`baseline`]},justify:{control:`select`,options:[`start`,`center`,`end`,`between`,`around`,`evenly`]}},args:{align:`center`,gap:`md`,justify:`start`,wrap:!0},component:i,render:e=>(0,c.jsxs)(i,{align:e.align,"aria-label":`Inline example`,gap:e.gap,justify:e.justify,wrap:e.wrap,children:[(0,c.jsx)(o,{padding:`md`,children:`Alpha`}),(0,c.jsx)(o,{padding:`md`,children:`Bravo`}),(0,c.jsx)(o,{padding:`md`,children:`Charlie`}),(0,c.jsx)(o,{padding:`md`,children:`Delta`})]}),title:`Layout/Inline`},f={play:async({canvasElement:e})=>{await l(u(e).getByLabelText(`Inline example`)).toHaveTextContent(`AlphaBravoCharlieDelta`)}},p={args:{justify:`between`,wrap:!1}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByLabelText('Inline example')).toHaveTextContent('AlphaBravoCharlieDelta');
  }
}`,...f.parameters?.docs?.source},description:{story:`Arranges four related surfaces in a wrapping horizontal flow with controlled
alignment, distribution, and responsive spacing props.

@summary wrapping inline layout for related content`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    justify: 'between',
    wrap: false
  }
}`,...p.parameters?.docs?.source},description:{story:`Distributes safely bounded content across the available inline axis and
disables wrapping when the host width is known to be sufficient.

@summary non-wrapping space-between distribution`,...p.parameters?.docs?.description}}};try{f.displayName=`Wrapping`,f.__docgenInfo={description:`Arranges four related surfaces in a wrapping horizontal flow with controlled
alignment, distribution, and responsive spacing props.`,displayName:`Wrapping`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Inline/Inline.stories.tsx`,methods:[],props:{},tags:{summary:`wrapping inline layout for related content`}}}catch{}try{p.displayName=`Distributed`,p.__docgenInfo={description:`Distributes safely bounded content across the available inline axis and
disables wrapping when the host width is known to be sufficient.`,displayName:`Distributed`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Inline/Inline.stories.tsx`,methods:[],props:{},tags:{summary:`non-wrapping space-between distribution`}}}catch{}m=[`Wrapping`,`Distributed`]}));h();export{p as Distributed,f as Wrapping,m as __namedExportsOrder,d as default,h as n,s as t};