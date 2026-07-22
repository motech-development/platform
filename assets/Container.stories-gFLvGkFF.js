import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,f as a,l as o,p as s,r as c}from"./iframe-q_a4TWX4.js";import{n as l,r as u}from"./layout-DWJ-1DF-.js";import{n as d,t as f}from"./responsive-Dzd10QwO.js";import{n as p,t as m}from"./Surface-C6KI1ypY.js";function h({className:e,padding:t=v,...n}){return o(),(0,g.createElement)(`div`,{...n,className:_({class:[d(t,u),e]})})}var g,_,v,y=t((()=>{g=n(r(),1),a(),l(),f(),i(),_=s({base:`mx-auto w-full max-w-screen-2xl`}),v={base:`md`,lg:`page`,md:`xxl`,sm:`xl`};try{h.displayName=`Container`,h.__docgenInfo={description:`Centers content in a full-width workspace with responsive
page gutters.`,displayName:`Container`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Container/Container.tsx`,methods:[],props:{padding:{defaultValue:{value:`{
  base: 'md',
  lg: 'page',
  md: 'xxl',
  sm: 'xl',
}`},declarations:[{fileName:`breeze-ui/src/primitives/Container/Container.tsx`,name:`ContainerProps`}],description:"Responsive inline and block gutter. Defaults from `md` at base to `page` at `lg`.",name:`padding`,parent:{fileName:`breeze-ui/src/primitives/Container/Container.tsx`,name:`ContainerProps`},required:!1,tags:{},type:{name:`ResponsiveSpace | undefined`}}},tags:{summary:`bounded application workspace with responsive page gutters`}}}catch{}})),b=e({CustomResponsivePadding:()=>E,ResponsiveWorkspace:()=>T,__namedExportsOrder:()=>D,default:()=>w}),x,S,C,w,T,E,D,O=t((()=>{p(),y(),x=c(),{expect:S,within:C}=__STORYBOOK_MODULE_TEST__,w={component:h,parameters:{chromatic:{viewports:[360,800,1280]},layout:`fullscreen`},title:`Layout/Container`},T={args:{"aria-label":`Workspace`,children:(0,x.jsx)(m,{children:`Resize the canvas to inspect the page gutters.`})},play:async({canvasElement:e})=>{await S(C(e).getByLabelText(`Workspace`)).toHaveTextContent(`Resize the canvas`)}},E={args:{children:(0,x.jsx)(m,{children:`Compact first, spacious from medium.`}),padding:{base:`sm`,md:`page`}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Workspace',
    children: <Surface>Resize the canvas to inspect the page gutters.</Surface>
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByLabelText('Workspace')).toHaveTextContent('Resize the canvas');
  }
}`,...T.parameters?.docs?.source},description:{story:`Shows the bounded full-width workspace with its canonical breakpoint gutters
across the configured compact, medium, and wide visual-test viewports.

@summary canonical bounded workspace and responsive gutters`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Surface>Compact first, spacious from medium.</Surface>,
    padding: {
      base: 'sm',
      md: 'page'
    }
  }
}`,...E.parameters?.docs?.source},description:{story:`Overrides only the documented layout padding values, using a compact base
gutter and the page gutter from the medium breakpoint onward.

@summary custom breakpoint-responsive workspace padding`,...E.parameters?.docs?.description}}};try{w.displayName=`Container`,w.__docgenInfo={description:`Centers content in a full-width workspace with responsive
page gutters.`,displayName:`Container`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Container/Container.stories.tsx`,methods:[],props:{padding:{defaultValue:{value:`{
  base: 'md',
  lg: 'page',
  md: 'xxl',
  sm: 'xl',
}`},declarations:[{fileName:`breeze-ui/src/primitives/Container/Container.tsx`,name:`ContainerProps`}],description:"Responsive inline and block gutter. Defaults from `md` at base to `page` at `lg`.",name:`padding`,parent:{fileName:`breeze-ui/src/primitives/Container/Container.tsx`,name:`ContainerProps`},required:!1,tags:{},type:{name:`ResponsiveSpace | undefined`}}},tags:{summary:`bounded application workspace with responsive page gutters`}}}catch{}try{T.displayName=`ResponsiveWorkspace`,T.__docgenInfo={description:`Shows the bounded full-width workspace with its canonical breakpoint gutters
across the configured compact, medium, and wide visual-test viewports.`,displayName:`ResponsiveWorkspace`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Container/Container.stories.tsx`,methods:[],props:{},tags:{summary:`canonical bounded workspace and responsive gutters`}}}catch{}try{E.displayName=`CustomResponsivePadding`,E.__docgenInfo={description:`Overrides only the documented layout padding values, using a compact base
gutter and the page gutter from the medium breakpoint onward.`,displayName:`CustomResponsivePadding`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Container/Container.stories.tsx`,methods:[],props:{},tags:{summary:`custom breakpoint-responsive workspace padding`}}}catch{}D=[`ResponsiveWorkspace`,`CustomResponsivePadding`]}));O();export{E as CustomResponsivePadding,T as ResponsiveWorkspace,D as __namedExportsOrder,w as default,O as n,b as t};