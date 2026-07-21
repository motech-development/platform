import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-i3W5vvo3.js";import{n as r,t as i}from"./Grid-Bt6yrNdm.js";import{n as a,t as o}from"./Surface-DAbnRYpo.js";var s=e({Playground:()=>f,SemanticSection:()=>m,TonesAndBorders:()=>p,__namedExportsOrder:()=>h,default:()=>d}),c,l,u,d,f,p,m,h,g=t((()=>{r(),a(),c=n(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d={argTypes:{as:{control:`inline-radio`,options:[`div`,`section`,`article`]},border:{control:`inline-radio`,options:[`none`,`default`,`strong`]},tone:{control:`inline-radio`,options:[`default`,`subtle`,`canvas`,`inverse`]}},args:{border:`default`,padding:`lg`,tone:`default`},component:o,title:`Layout/Surface`},f={args:{children:`Surface content`},play:async({canvasElement:e})=>{await l(u(e).getByText(`Surface content`)).toBeVisible()}},p={render:()=>(0,c.jsxs)(i,{columns:{base:1,md:2},children:[(0,c.jsx)(o,{tone:`default`,children:`Default tone`}),(0,c.jsx)(o,{tone:`subtle`,children:`Subtle tone`}),(0,c.jsx)(o,{tone:`canvas`,children:`Canvas tone`}),(0,c.jsx)(o,{tone:`inverse`,children:`Inverse tone`}),(0,c.jsx)(o,{border:`none`,children:`No border`}),(0,c.jsx)(o,{border:`strong`,children:`Strong border`})]})},m={args:{"aria-label":`Project summary`,as:`section`,children:`Summary content`}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Surface content'
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByText('Surface content')).toBeVisible();
  }
}`,...f.parameters?.docs?.source},description:{story:`Shows the canonical default background, border, and inset spacing with
controls for the deliberately bounded surface presentation props.

@summary default canonical surface treatment`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Grid columns={{
    base: 1,
    md: 2
  }}>
      <Surface tone="default">Default tone</Surface>
      <Surface tone="subtle">Subtle tone</Surface>
      <Surface tone="canvas">Canvas tone</Surface>
      <Surface tone="inverse">Inverse tone</Surface>
      <Surface border="none">No border</Surface>
      <Surface border="strong">Strong border</Surface>
    </Grid>
}`,...p.parameters?.docs?.source},description:{story:`Compares all background tones and the borderless and strong-boundary
treatments so surrounding contrast can guide the semantic choice.

@summary complete surface tone and border comparison`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Project summary',
    as: 'section',
    children: 'Summary content'
  }
}`,...m.parameters?.docs?.source},description:{story:`Renders a named native section when the contained application content forms
a meaningful document region rather than a purely visual grouping.

@summary labelled semantic section surface`,...m.parameters?.docs?.description}}};try{d.displayName=`Surface`,d.__docgenInfo={description:`Renders a canonical background, border, and responsive inset treatment with
a constrained neutral or semantic section element.`,displayName:`Surface`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Surface/Surface.stories.tsx`,methods:[],props:{as:{defaultValue:{value:`div`},declarations:[{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`}],description:"Constrained semantic element. Defaults to `div`.",name:`as`,parent:{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`},required:!1,tags:{},type:{name:`SurfaceElement | undefined`}},border:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`}],description:"Border emphasis. Defaults to `default`.",name:`border`,parent:{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`},required:!1,tags:{},type:{name:`"default" | "none" | "strong" | undefined`}},padding:{defaultValue:{value:`lg`},declarations:[{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`}],description:"Responsive inset spacing. Defaults to `lg`.",name:`padding`,parent:{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`},required:!1,tags:{},type:{name:`ResponsiveSpace | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`}],description:`Ref to the rendered HTML element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},tone:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`}],description:"Semantic surface colour treatment. Defaults to `default`.",name:`tone`,parent:{fileName:`breeze-ui/src/primitives/Surface/Surface.tsx`,name:`SurfaceProps`},required:!1,tags:{},type:{name:`"canvas" | "default" | "inverse" | "subtle" | undefined`}}},tags:{summary:`canonical inset surface with bounded semantic elements`}}}catch{}try{f.displayName=`Playground`,f.__docgenInfo={description:`Shows the canonical default background, border, and inset spacing with
controls for the deliberately bounded surface presentation props.`,displayName:`Playground`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Surface/Surface.stories.tsx`,methods:[],props:{},tags:{summary:`default canonical surface treatment`}}}catch{}try{p.displayName=`TonesAndBorders`,p.__docgenInfo={description:`Compares all background tones and the borderless and strong-boundary
treatments so surrounding contrast can guide the semantic choice.`,displayName:`TonesAndBorders`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Surface/Surface.stories.tsx`,methods:[],props:{},tags:{summary:`complete surface tone and border comparison`}}}catch{}try{m.displayName=`SemanticSection`,m.__docgenInfo={description:`Renders a named native section when the contained application content forms
a meaningful document region rather than a purely visual grouping.`,displayName:`SemanticSection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Surface/Surface.stories.tsx`,methods:[],props:{},tags:{summary:`labelled semantic section surface`}}}catch{}h=[`Playground`,`TonesAndBorders`,`SemanticSection`]}));g();export{f as Playground,m as SemanticSection,p as TonesAndBorders,h as __namedExportsOrder,d as default,g as n,s as t};