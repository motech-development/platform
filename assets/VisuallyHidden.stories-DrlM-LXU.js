import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{N as r,S as i}from"./icons-Cg1FNHcV.js";import{n as a,t as o}from"./Button-BqpQ89mp.js";import{n as s,t as c}from"./VisuallyHidden-Di00j2Nl.js";var l=e({AccessibleIconAction:()=>m,__namedExportsOrder:()=>h,default:()=>p}),u,d,f,p,m,h,g=t((()=>{r(),a(),s(),u=n(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p={component:c,title:`Foundation/VisuallyHidden`,parameters:{docs:{description:{component:`Keeps concise supporting text available to assistive technology while
removing the span from ordinary visual layout.

@summary visually concealed text available to assistive technology`}}}},m={args:{children:`Open navigation`},play:async({canvasElement:e})=>{await d(f(e).getByRole(`button`,{name:`Open navigation`})).toBeVisible()},render:({children:e})=>(0,u.jsxs)(o,{children:[(0,u.jsx)(i,{}),(0,u.jsx)(c,{children:e})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Open navigation'
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('button', {
      name: 'Open navigation'
    })).toBeVisible();
  },
  render: ({
    children
  }) => <Button>
      <MenuIcon />
      <VisuallyHidden>{children}</VisuallyHidden>
    </Button>
}`,...m.parameters?.docs?.source},description:{story:`Adds screen-reader-only text beside a decorative menu icon so an otherwise
icon-only button receives a concise accessible name without visible copy.

@summary accessible icon action named by visually hidden text`,...m.parameters?.docs?.description}}};try{p.displayName=`VisuallyHidden`,p.__docgenInfo={description:`Preserves accessible content while removing it from visual layout.`,displayName:`VisuallyHidden`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/VisuallyHidden/VisuallyHidden.stories.tsx`,methods:[],props:{ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/VisuallyHidden/VisuallyHidden.tsx`,name:`VisuallyHiddenProps`}],description:`Ref to the rendered span.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/VisuallyHidden/VisuallyHidden.tsx`,name:`VisuallyHiddenProps`},required:!1,tags:{},type:{name:`Ref<HTMLSpanElement> | undefined`}}},tags:{summary:`visually concealed span that remains available to assistive technology`}}}catch{}try{m.displayName=`AccessibleIconAction`,m.__docgenInfo={description:`Adds screen-reader-only text beside a decorative menu icon so an otherwise
icon-only button receives a concise accessible name without visible copy.`,displayName:`AccessibleIconAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/VisuallyHidden/VisuallyHidden.stories.tsx`,methods:[],props:{},tags:{summary:`accessible icon action named by visually hidden text`}}}catch{}h=[`AccessibleIconAction`]}));g();export{m as AccessibleIconAction,h as __namedExportsOrder,p as default,g as n,l as t};