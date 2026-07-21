import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-i3W5vvo3.js";import{n as r,t as i}from"./Inline-BxTMf2Et.js";import{N as a,g as o}from"./icons-Cg1FNHcV.js";import{n as s,t as c}from"./Link-Ch4ogZQ-.js";var l=e({External:()=>g,Internal:()=>m,Variants:()=>h,__namedExportsOrder:()=>_,default:()=>p}),u,d,f,p,m,h,g,_,v=t((()=>{a(),r(),s(),u=n(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p={component:c,title:`Foundation/Link`},m={args:{children:`Preferences`,href:`/preferences`},play:async({canvasElement:e})=>{await d(f(e).getByRole(`link`,{name:`Preferences`})).toHaveAttribute(`href`,`/preferences`)}},h={args:{children:`Link`,href:`/target`},render:()=>(0,u.jsxs)(i,{align:`stretch`,gap:`md`,wrap:!1,children:[(0,u.jsx)(c,{href:`/primary`,children:`Primary`}),(0,u.jsx)(c,{href:`/muted`,variant:`muted`,children:`Muted`}),(0,u.jsx)(c,{href:`/remove`,variant:`danger`,children:`Danger`}),(0,u.jsx)(c,{disabled:!0,href:`/disabled`,children:`Disabled`})]})},g={args:{children:(0,u.jsxs)(u.Fragment,{children:[`Example website `,(0,u.jsx)(o,{})]}),href:`https://example.com`,rel:`noreferrer`,target:`_blank`}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Preferences',
    href: '/preferences'
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('link', {
      name: 'Preferences'
    })).toHaveAttribute('href', '/preferences');
  }
}`,...m.parameters?.docs?.source},description:{story:`Renders an internal destination with a real href so the provider router can
enhance ordinary activation without changing native link semantics.

@summary internal router-neutral destination with a native href`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Link',
    href: '/target'
  },
  render: () => <Inline align="stretch" gap="md" wrap={false}>
      <Link href="/primary">Primary</Link>
      <Link href="/muted" variant="muted">
        Muted
      </Link>
      <Link href="/remove" variant="danger">
        Danger
      </Link>
      <Link disabled href="/disabled">
        Disabled
      </Link>
    </Inline>
}`,...h.parameters?.docs?.source},description:{story:`Compares semantic text colours with the disabled state so inline navigation
emphasis can match its surrounding content and consequence.

@summary semantic link variants and disabled navigation`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        Example website <ExternalLinkIcon />
      </>,
    href: 'https://example.com',
    rel: 'noreferrer',
    target: '_blank'
  }
}`,...g.parameters?.docs?.source},description:{story:`Opens an external destination in a new browsing context with a decorative
icon while preserving the browser's native target and rel behaviour.

@summary external destination with native alternate-target behaviour`,...g.parameters?.docs?.description}}};try{p.displayName=`Link`,p.__docgenInfo={description:`Navigates with the provider router for local URLs and native browser behaviour otherwise.`,displayName:`Link`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:`Link content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!0,tags:{},type:{name:`ReactNode`}},className:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:`Placement and composition classes.`,name:`className`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!1,tags:{},type:{name:`string | undefined`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:"Prevents navigation. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},download:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:`Prompts download instead of navigation when provided.`,name:`download`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!1,tags:{},type:{name:`string | boolean | undefined`}},href:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:`Native destination URL.`,name:`href`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!0,tags:{},type:{name:`string`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:`Called after semantic link activation.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:`Ref to the rendered anchor.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!1,tags:{},type:{name:`Ref<HTMLAnchorElement> | undefined`}},variant:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`}],description:"Semantic text colour. Defaults to `primary`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkProps`},required:!1,tags:{},type:{name:`"danger" | "inverse" | "muted" | "primary" | undefined`}}},tags:{summary:`router-neutral inline navigation with native browser behaviour`}}}catch{}try{m.displayName=`Internal`,m.__docgenInfo={description:`Renders an internal destination with a real href so the provider router can
enhance ordinary activation without changing native link semantics.`,displayName:`Internal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{summary:`internal router-neutral destination with a native href`}}}catch{}try{h.displayName=`Variants`,h.__docgenInfo={description:`Compares semantic text colours with the disabled state so inline navigation
emphasis can match its surrounding content and consequence.`,displayName:`Variants`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{summary:`semantic link variants and disabled navigation`}}}catch{}try{g.displayName=`External`,g.__docgenInfo={description:`Opens an external destination in a new browsing context with a decorative
icon while preserving the browser's native target and rel behaviour.`,displayName:`External`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{summary:`external destination with native alternate-target behaviour`}}}catch{}_=[`Internal`,`Variants`,`External`]}));v();export{g as External,m as Internal,h as Variants,_ as __namedExportsOrder,p as default,v as n,l as t};