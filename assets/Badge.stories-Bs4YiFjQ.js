import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Badge-BOZ9Ncf_.js";import{n as a,t as o}from"./Inline-COgaq7ET.js";var s=t({Default:()=>p,Loading:()=>h,Treatments:()=>m,__namedExportsOrder:()=>g,default:()=>f}),c,l,u,d,f,p,m,h,g,_=e((()=>{a(),r(),c=n(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d=[`neutral`,`brand`,`positive`,`warning`,`danger`],f={args:{children:`Pending`},component:i,title:`Content/Badge`},p={},m={play:async({canvasElement:e})=>{let t=u(e).getByText(`warning`).parentElement;if(!t)throw Error(`The warning badge was not rendered.`);let n=getComputedStyle(t);await l({fontSize:n.fontSize,fontWeight:n.fontWeight,letterSpacing:n.letterSpacing,paddingBlock:n.paddingBlockStart,paddingInline:n.paddingInlineStart}).toEqual({fontSize:`11px`,fontWeight:`600`,letterSpacing:`normal`,paddingBlock:`1px`,paddingInline:`6px`})},render:()=>(0,c.jsx)(o,{gap:2,wrap:!0,children:d.map(e=>(0,c.jsx)(i,{variant:e,children:e},e))})},h={args:{loading:!0}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source},description:{story:`The neutral treatment for ordinary metadata.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const badge = within(canvasElement).getByText('warning').parentElement;
    if (!badge) {
      throw new Error('The warning badge was not rendered.');
    }
    const style = getComputedStyle(badge);
    await expect({
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      paddingBlock: style.paddingBlockStart,
      paddingInline: style.paddingInlineStart
    }).toEqual({
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: 'normal',
      paddingBlock: '1px',
      paddingInline: '6px'
    });
  },
  render: () => <Inline gap={2} wrap>
      {variants.map(variant => <Badge key={variant} variant={variant}>
          {variant}
        </Badge>)}
    </Inline>
}`,...m.parameters?.docs?.source},description:{story:`Badge's own five status treatments.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...h.parameters?.docs?.source},description:{story:`Preserves the badge shape while its status is loading.`,...h.parameters?.docs?.description}}};try{f.displayName=`Badge`,f.__docgenInfo={description:`Marks a short status or count with a Badge-specific treatment.`,displayName:`Badge`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Badge/Badge.stories.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`}],description:`Provides expanded screen-reader text when the visible badge is abbreviated.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`},required:!1,tags:{},type:{name:`string | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`}],description:`Short status text or a numeric count displayed by the badge.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`},required:!0,tags:{},type:{name:`string | number`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`}],description:`Replaces the status with an accessible placeholder while preserving its size.`,name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},variant:{defaultValue:{value:`neutral`},declarations:[{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`}],description:"Selects the semantic colour treatment. Defaults to `neutral`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Badge/Badge.tsx`,name:`BadgeProps`},required:!1,tags:{},type:{name:`"brand" | "danger" | "neutral" | "positive" | "warning" | undefined`}}},tags:{summary:`Compact, non-interactive status content.`}}}catch{}try{p.displayName=`Default`,p.__docgenInfo={description:`The neutral treatment for ordinary metadata.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Badge/Badge.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{m.displayName=`Treatments`,m.__docgenInfo={description:`Badge's own five status treatments.`,displayName:`Treatments`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Badge/Badge.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{h.displayName=`Loading`,h.__docgenInfo={description:`Preserves the badge shape while its status is loading.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Badge/Badge.stories.tsx`,methods:[],props:{},tags:{}}}catch{}g=[`Default`,`Treatments`,`Loading`]}));_();export{p as Default,h as Loading,m as Treatments,g as __namedExportsOrder,f as default,_ as n,s as t};