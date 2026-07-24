import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{n as i,t as a}from"./dist-ByKaD744.js";import{n as o,r as s}from"./BreezeContext-BIB7r8Lx.js";import{t as c}from"./jsx-runtime-cM__dR4X.js";import{n as l,t as u}from"./Surface-BNgcQ4ww.js";function d({className:e,minHeight:t,...n}){return s(),(0,f.createElement)(`div`,{...n,className:p({class:e,minHeight:t})})}var f,p,m=t((()=>{f=e(r(),1),a(),o(),p=i({base:`grid place-items-center`,defaultVariants:{minHeight:`none`},variants:{minHeight:{none:``,screen:`min-h-screen`}}});try{d.displayName=`Center`,d.__docgenInfo={description:`Centres content horizontally and vertically without imposing presentation.`,displayName:`Center`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Center/Center.tsx`,methods:[],props:{minHeight:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Center/Center.tsx`,name:`CenterProps`}],description:"Minimum block size. Defaults to `none`; `screen` fills the viewport.",name:`minHeight`,parent:{fileName:`breeze-ui/src/primitives/Center/Center.tsx`,name:`CenterProps`},required:!1,tags:{},type:{name:`"none" | "screen" | undefined`}}},tags:{summary:`two-axis layout centring with optional viewport height`}}}catch{}})),h=n({Content:()=>b,FullViewport:()=>x,__namedExportsOrder:()=>S,default:()=>y}),g,_,v,y,b,x,S,C=t((()=>{l(),m(),g=c(),{expect:_,within:v}=__STORYBOOK_MODULE_TEST__,y={component:d,title:`Layout/Center`},b={args:{"aria-label":`Centred example`,children:(0,g.jsx)(u,{children:`Centred content`}),className:`min-h-64`},play:async({canvasElement:e})=>{await _(v(e).getByLabelText(`Centred example`)).toHaveTextContent(`Centred content`)}},x={args:{children:(0,g.jsx)(u,{children:`Full viewport centre`}),minHeight:`screen`},parameters:{layout:`fullscreen`}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Centred example',
    children: <Surface>Centred content</Surface>,
    className: 'min-h-64'
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByLabelText('Centred example')).toHaveTextContent('Centred content');
  }
}`,...b.parameters?.docs?.source},description:{story:`Centres a Surface within a fixed minimum block size and verifies the
labelled wrapper retains its child content without adding presentation to
the layout primitive.

@summary Two-axis centring inside a bounded region.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Surface>Full viewport centre</Surface>,
    minHeight: 'screen'
  },
  parameters: {
    layout: 'fullscreen'
  }
}`,...x.parameters?.docs?.source},description:{story:`Uses \`minHeight="screen"\` with fullscreen Storybook layout to document a
viewport-height centre suitable for isolated loading or empty compositions.

@summary Full-viewport centring with the screen minimum-height token.`,...x.parameters?.docs?.description}}};try{y.displayName=`Center`,y.__docgenInfo={description:`Centres content horizontally and vertically without imposing presentation.`,displayName:`Center`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Center/Center.stories.tsx`,methods:[],props:{minHeight:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Center/Center.tsx`,name:`CenterProps`}],description:"Minimum block size. Defaults to `none`; `screen` fills the viewport.",name:`minHeight`,parent:{fileName:`breeze-ui/src/primitives/Center/Center.tsx`,name:`CenterProps`},required:!1,tags:{},type:{name:`"none" | "screen" | undefined`}}},tags:{summary:`two-axis layout centring with optional viewport height`}}}catch{}try{b.displayName=`Content`,b.__docgenInfo={description:`Centres a Surface within a fixed minimum block size and verifies the
labelled wrapper retains its child content without adding presentation to
the layout primitive.`,displayName:`Content`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Center/Center.stories.tsx`,methods:[],props:{},tags:{summary:`Two-axis centring inside a bounded region.`}}}catch{}try{x.displayName=`FullViewport`,x.__docgenInfo={description:'Uses `minHeight="screen"` with fullscreen Storybook layout to document a\nviewport-height centre suitable for isolated loading or empty compositions.',displayName:`FullViewport`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Center/Center.stories.tsx`,methods:[],props:{},tags:{summary:`Full-viewport centring with the screen minimum-height token.`}}}catch{}S=[`Content`,`FullViewport`]}));C();export{b as Content,x as FullViewport,S as __namedExportsOrder,y as default,C as n,h as t};