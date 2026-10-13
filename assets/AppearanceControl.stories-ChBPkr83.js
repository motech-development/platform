import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Card-DssyqaHD.js";import{n as a,t as o}from"./AppearanceControl-D-3ANixF.js";var s=t({Default:()=>p,ThemeReactiveShadow:()=>m,__namedExportsOrder:()=>h,default:()=>f}),c,l,u,d,f,p,m,h,g=e((()=>{r(),a(),c=n(),{expect:l,userEvent:u,within:d}=__STORYBOOK_MODULE_TEST__,f={component:o,title:`Patterns/AppearanceControl`},p={},m={play:async({canvasElement:e})=>{let t=d(e),n=t.getByRole(`group`,{name:`Theme-reactive panel`});await u.click(t.getByRole(`radio`,{name:`Light`}));let r=getComputedStyle(n).boxShadow;await u.click(t.getByRole(`radio`,{name:`Dark`})),await l(getComputedStyle(n).boxShadow).not.toBe(r),await l(document.documentElement).toHaveAttribute(`data-theme`,`dark`)},render:()=>(0,c.jsxs)(`div`,{className:`breeze-story-stack`,children:[(0,c.jsx)(o,{}),(0,c.jsx)(i,{"aria-label":`Theme-reactive panel`,children:`Theme-reactive panel shadow`})]})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source},description:{story:`Light, automatic and dark choices backed by BreezeProvider.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const shadow = canvas.getByRole('group', {
      name: 'Theme-reactive panel'
    });
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Light'
    }));
    const lightShadow = getComputedStyle(shadow).boxShadow;
    await userEvent.click(canvas.getByRole('radio', {
      name: 'Dark'
    }));
    await expect(getComputedStyle(shadow).boxShadow).not.toBe(lightShadow);
    await expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  },
  render: () => <div className="breeze-story-stack">
      <AppearanceControl />
      <Card aria-label="Theme-reactive panel">Theme-reactive panel shadow</Card>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`The shipped panel shadow utility follows the resolved appearance.`,...m.parameters?.docs?.description}}};try{f.displayName=`AppearanceControl`,f.__docgenInfo={description:`Lets a person choose light, automatic or dark appearance.`,displayName:`AppearanceControl`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AppearanceControl/AppearanceControl.stories.tsx`,methods:[],props:{},tags:{summary:`A three-option appearance control backed by BreezeProvider.`}}}catch{}try{p.displayName=`Default`,p.__docgenInfo={description:`Light, automatic and dark choices backed by BreezeProvider.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AppearanceControl/AppearanceControl.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{m.displayName=`ThemeReactiveShadow`,m.__docgenInfo={description:`The shipped panel shadow utility follows the resolved appearance.`,displayName:`ThemeReactiveShadow`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AppearanceControl/AppearanceControl.stories.tsx`,methods:[],props:{},tags:{}}}catch{}h=[`Default`,`ThemeReactiveShadow`]}));g();export{p as Default,m as ThemeReactiveShadow,h as __namedExportsOrder,f as default,g as n,s as t};