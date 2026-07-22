import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-q_a4TWX4.js";import{n as r,t as i}from"./SkipLink-gF04WwzW.js";var a=e({KeyboardFocus:()=>d,__namedExportsOrder:()=>f,default:()=>u}),o,s,c,l,u,d,f,p=t((()=>{r(),o=n(),{expect:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={component:i,title:`Primitives/Navigation/SkipLink`,parameters:{docs:{description:{component:`Reveals a native main-content fragment link on keyboard focus so users can
bypass repeated application chrome.

@summary focus-revealed bypass link to a main-content target`}}}},d={args:{children:`Skip to main content`,targetId:`story-main`},play:async({canvasElement:e})=>{let t=l(e).getByRole(`link`,{name:`Skip to main content`});await s(t).toHaveAttribute(`href`,`#story-main`),await c.tab(),await s(t).toHaveFocus()},render:()=>(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i,{targetId:`story-main`,children:`Skip to main content`}),(0,o.jsx)(`header`,{children:`Repeated navigation`}),(0,o.jsx)(`main`,{id:`story-main`,tabIndex:-1,children:`Main content`})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Skip to main content',
    targetId: 'story-main'
  },
  play: async ({
    canvasElement
  }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Skip to main content'
    });
    await expect(link).toHaveAttribute('href', '#story-main');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
  render: () => <>
      <SkipLink targetId="story-main">Skip to main content</SkipLink>
      <header>Repeated navigation</header>
      <main id="story-main" tabIndex={-1}>
        Main content
      </main>
    </>
}`,...d.parameters?.docs?.source},description:{story:`Places the bypass link before repeated page chrome, verifies its native
fragment target, and reveals it as the first destination in keyboard order.

@summary first-tab bypass link targeting focusable main content`,...d.parameters?.docs?.description}}};try{u.displayName=`SkipLink`,u.__docgenInfo={description:`Reveals a native fragment link on focus so keyboard users can bypass
repeated content.`,displayName:`SkipLink`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/SkipLink/SkipLink.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`}],description:`Accessible link content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`},required:!0,tags:{},type:{name:`ReactNode`}},className:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`}],description:`Placement and composition classes.`,name:`className`,parent:{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`},required:!1,tags:{},type:{name:`string | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`}],description:`Ref to the rendered anchor.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`},required:!1,tags:{},type:{name:`Ref<HTMLAnchorElement> | undefined`}},targetId:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`}],description:`Id of the focusable main content target, without a leading hash.`,name:`targetId`,parent:{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`},required:!0,tags:{},type:{name:`string`}}},tags:{summary:`focus-revealed bypass link to a main-content target`}}}catch{}try{d.displayName=`KeyboardFocus`,d.__docgenInfo={description:`Places the bypass link before repeated page chrome, verifies its native
fragment target, and reveals it as the first destination in keyboard order.`,displayName:`KeyboardFocus`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/SkipLink/SkipLink.stories.tsx`,methods:[],props:{},tags:{summary:`first-tab bypass link targeting focusable main content`}}}catch{}f=[`KeyboardFocus`]}));p();export{d as KeyboardFocus,f as __namedExportsOrder,u as default,p as n,a as t};