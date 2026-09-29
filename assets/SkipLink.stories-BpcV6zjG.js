import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./SkipLink-DGP3jEtl.js";var a=t({KeyboardNavigation:()=>d,__namedExportsOrder:()=>f,default:()=>u}),o,s,c,l,u,d,f,p=e((()=>{r(),o=n(),{expect:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={args:{targetId:`skip-link-story-main`},component:i,title:`Accessibility/SkipLink`},d={play:async({canvasElement:e})=>{let t=l(e);await c.keyboard(`{Tab}`);let n=t.getByRole(`link`,{name:`Skip to main content`});await s(n).toHaveFocus(),await s(n).toBeVisible(),await s(n.getBoundingClientRect().width).toBeGreaterThan(1),await s(n.getBoundingClientRect().height).toBeGreaterThan(1),await c.keyboard(`{Enter}`),await s(t.getByRole(`main`)).toHaveFocus()},render:({targetId:e})=>(0,o.jsxs)(`div`,{className:`breeze-story-stack`,children:[(0,o.jsx)(i,{targetId:e}),(0,o.jsxs)(`main`,{id:e,tabIndex:-1,children:[(0,o.jsx)(`h1`,{children:`Page content`}),(0,o.jsx)(`p`,{children:`Keyboard focus arrives here after activating the skip link.`})]})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard('{Tab}');
    const skipLink = canvas.getByRole('link', {
      name: 'Skip to main content'
    });
    await expect(skipLink).toHaveFocus();
    await expect(skipLink).toBeVisible();
    await expect(skipLink.getBoundingClientRect().width).toBeGreaterThan(1);
    await expect(skipLink.getBoundingClientRect().height).toBeGreaterThan(1);
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('main')).toHaveFocus();
  },
  render: ({
    targetId
  }) => <div className="breeze-story-stack">
      <SkipLink targetId={targetId} />
      <main id={targetId} tabIndex={-1}>
        <h1>Page content</h1>
        <p>Keyboard focus arrives here after activating the skip link.</p>
      </main>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`The first Tab reveals a link that moves focus into the main landmark.`,...d.parameters?.docs?.description}}};try{u.displayName=`SkipLink`,u.__docgenInfo={description:`Lets keyboard users bypass repeated application chrome.`,displayName:`SkipLink`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/SkipLink/SkipLink.stories.tsx`,methods:[],props:{targetId:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`}],description:`Id of the focusable content landmark to receive focus.`,name:`targetId`,parent:{fileName:`breeze-ui/src/primitives/SkipLink/SkipLink.tsx`,name:`SkipLinkProps`},required:!0,tags:{},type:{name:`string`}}},tags:{summary:`A localized link that moves focus to the main content.`}}}catch{}try{d.displayName=`KeyboardNavigation`,d.__docgenInfo={description:`The first Tab reveals a link that moves focus into the main landmark.`,displayName:`KeyboardNavigation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/SkipLink/SkipLink.stories.tsx`,methods:[],props:{},tags:{}}}catch{}f=[`KeyboardNavigation`]}));p();export{d as KeyboardNavigation,f as __namedExportsOrder,u as default,p as n,a as t};