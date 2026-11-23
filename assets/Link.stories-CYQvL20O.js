import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./iframe-CWSiKWtU.js";import{n as s,t as c}from"./Button-CVjiIIUE.js";import{n as l,t as u}from"./Link-BXS_Ks0X.js";import{n as d,t as f}from"./Typography-CEt3x14j.js";import{n as p,t as m}from"./Card-BTAhI8Fz.js";import{n as h,t as g}from"./Inline-COgaq7ET.js";var _=n({ButtonTreatments:()=>j,Default:()=>D,PanelAction:()=>k,RouterNavigation:()=>M,Subtle:()=>O,Treatments:()=>A,__namedExportsOrder:()=>N,default:()=>E});function v(){let[e,t]=(0,y.useState)(`/accounts`),[n,r]=(0,y.useState)(``);return(0,b.jsx)(o,{locale:`en-GB`,router:(0,y.useMemo)(()=>({navigate:(e,n)=>{t(e),r(n.transitionTypes.join(`, `)||`none`)}}),[]),children:(0,b.jsxs)(`div`,{className:`breeze-story-stack`,children:[(0,b.jsx)(u,{href:`/accounts/activity`,target:`_self`,transitionTypes:[`nav`],children:`Activity`}),(0,b.jsx)(`output`,{"aria-live":`polite`,children:`${e} · ${n}`})]})})}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P=t((()=>{y=e(r(),1),a(),s(),p(),h(),d(),l(),b=i(),{expect:x,userEvent:S,within:C}=__STORYBOOK_MODULE_TEST__,w=[`default`,`subtle`],T=e=>{let t=getComputedStyle(e);return{backgroundColor:t.backgroundColor,borderColor:t.borderTopColor,fontSize:t.fontSize,fontWeight:t.fontWeight,height:e.getBoundingClientRect().height,paddingInline:t.paddingInlineStart,textDecoration:t.textDecorationLine}},E={args:{children:`View account activity`,href:`/accounts/activity`},component:u,title:`Navigation/Link`},D={},O={args:{children:`View details`,variant:`subtle`}},k={play:async({canvasElement:e})=>{let t=C(e).getByRole(`link`,{name:`View all money`}),n=getComputedStyle(t);await x({fontSize:n.fontSize,fontWeight:n.fontWeight,height:t.getBoundingClientRect().height,paddingInline:n.paddingInlineStart,textDecoration:n.textDecorationLine}).toEqual({fontSize:`13px`,fontWeight:`400`,height:18.84375,paddingInline:`4px`,textDecoration:`none`})},render:()=>(0,b.jsx)(m,{action:(0,b.jsx)(u,{href:`#money`,children:`View all money`}),element:`section`,title:`Recent activity`,children:(0,b.jsx)(f,{tone:`secondary`,children:`Your latest transactions.`})})},A={render:()=>(0,b.jsx)(g,{gap:4,children:w.map(e=>(0,b.jsx)(u,{href:`/accounts/activity`,variant:e,children:`${e} link`},e))})},j={play:async({canvasElement:e})=>{let t=C(e);await x(T(t.getByRole(`link`,{name:`Back to overview`}))).toEqual(T(t.getByRole(`button`,{name:`Create report`}))),await x(T(t.getByRole(`link`,{name:`Open year end`}))).toEqual(T(t.getByRole(`button`,{name:`Cancel`}))),await x(T(t.getByRole(`link`,{name:`Download`}))).toEqual(T(t.getByRole(`button`,{name:`Remove`})))},render:()=>(0,b.jsxs)(`div`,{className:`breeze-story-stack`,children:[(0,b.jsxs)(g,{gap:2,children:[(0,b.jsx)(u,{href:`/overview`,variant:`primary`,children:`Back to overview`}),(0,b.jsx)(u,{href:`/year-end`,variant:`secondary`,children:`Open year end`}),(0,b.jsx)(u,{download:!0,href:`/reports/2026.csv`,size:`sm`,variant:`secondary`,children:`Download`})]}),(0,b.jsxs)(g,{gap:2,children:[(0,b.jsx)(c,{children:`Create report`}),(0,b.jsx)(c,{variant:`secondary`,children:`Cancel`}),(0,b.jsx)(c,{size:`sm`,variant:`secondary`,children:`Remove`})]})]})},M={play:async({canvasElement:e})=>{let t=C(e);await S.click(t.getByRole(`link`,{name:`Activity`})),await x(t.getByRole(`status`)).toHaveTextContent(`/accounts/activity · nav`)},render:()=>(0,b.jsx)(v,{})},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{}`,...D.parameters?.docs?.source},description:{story:`A same-document link with the default brand treatment.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'View details',
    variant: 'subtle'
  }
}`,...O.parameters?.docs?.source},description:{story:`A lower-emphasis link for supporting destinations.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'View all money'
    });
    const style = getComputedStyle(link);
    await expect({
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: link.getBoundingClientRect().height,
      paddingInline: style.paddingInlineStart,
      textDecoration: style.textDecorationLine
    }).toEqual({
      fontSize: '13px',
      fontWeight: '400',
      height: 18.84375,
      paddingInline: '4px',
      textDecoration: 'none'
    });
  },
  render: () => <Card action={<Link href="#money">View all money</Link>} element="section" title="Recent activity">
      <Typography tone="secondary">Your latest transactions.</Typography>
    </Card>
}`,...k.parameters?.docs?.source},description:{story:`A panel header's navigation action.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <Inline gap={4}>
      {variants.map(variant => <Link href="/accounts/activity" key={variant} variant={variant}>
          {\`\${variant} link\`}
        </Link>)}
    </Inline>
}`,...A.parameters?.docs?.source},description:{story:`Both closed visual treatments.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(buttonStyle(canvas.getByRole('link', {
      name: 'Back to overview'
    }))).toEqual(buttonStyle(canvas.getByRole('button', {
      name: 'Create report'
    })));
    await expect(buttonStyle(canvas.getByRole('link', {
      name: 'Open year end'
    }))).toEqual(buttonStyle(canvas.getByRole('button', {
      name: 'Cancel'
    })));
    await expect(buttonStyle(canvas.getByRole('link', {
      name: 'Download'
    }))).toEqual(buttonStyle(canvas.getByRole('button', {
      name: 'Remove'
    })));
  },
  render: () => <div className="breeze-story-stack">
      <Inline gap={2}>
        <Link href="/overview" variant="primary">
          Back to overview
        </Link>
        <Link href="/year-end" variant="secondary">
          Open year end
        </Link>
        <Link download href="/reports/2026.csv" size="sm" variant="secondary">
          Download
        </Link>
      </Inline>
      <Inline gap={2}>
        <Button>Create report</Button>
        <Button variant="secondary">Cancel</Button>
        <Button size="sm" variant="secondary">
          Remove
        </Button>
      </Inline>
    </div>
}`,...j.parameters?.docs?.source},description:{story:`Navigation and download links that look like primary and secondary buttons.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', {
      name: 'Activity'
    }));
    await expect(canvas.getByRole('status')).toHaveTextContent('/accounts/activity · nav');
  },
  render: () => <RouterExample />
}`,...M.parameters?.docs?.source},description:{story:`A router receives only the caller's opt-in transition types.`,...M.parameters?.docs?.description}}};try{E.displayName=`Link`,E.__docgenInfo={description:`Navigates to a resource while preserving native anchor behavior.`,displayName:`Link`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{size:{defaultValue:{value:`md`},declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`ButtonLinkProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`TextLinkProps`}],description:"Selects the button size. Defaults to `md`.\nText links have one size.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`ButtonLinkProps`},required:!1,tags:{},type:{name:`LinkSize | undefined`}},variant:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`ButtonLinkProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`TextLinkProps`}],description:"Gives the link a primary or secondary button treatment.\nSelects the text treatment. Defaults to `default`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`ButtonLinkProps`},required:!1,tags:{},type:{name:`"default" | "subtle" | ButtonLinkVariant | undefined`}},"aria-describedby":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Identifies additional elements that describe the link.`,name:`aria-describedby`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Provides an accessible name when it differs from the visible content.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},"aria-labelledby":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Identifies elements that provide the link's accessible name.`,name:`aria-labelledby`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},"aria-current":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Identifies the current page or location when this link represents it.`,name:`aria-current`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`"date" | "false" | "location" | "page" | "step" | "time" | "true" | boolean | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Visible link content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!0,tags:{},type:{name:`ReactNode`}},download:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Downloads the destination instead of navigating when the browser allows it.`,name:`download`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | boolean | undefined`}},href:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`The link destination.`,name:`href`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!0,tags:{},type:{name:`string`}},hrefLang:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Language of the linked resource.`,name:`hrefLang`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:"Sets the rendered link's HTML `id`.",name:`id`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},lang:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Language for the link content.`,name:`lang`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},rel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Relation between the current page and the destination.`,name:`rel`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Provides access to the rendered anchor element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`Ref<HTMLAnchorElement> | undefined`}},target:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Names the browsing context for the destination.`,name:`target`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`HTMLAttributeAnchorTarget | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Supplies advisory information about the destination.`,name:`title`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},type:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`MIME type of the linked resource.`,name:`type`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},transitionTypes:{defaultValue:{value:`[]`},declarations:[{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`}],description:`Transition types offered to the configured router for this navigation.`,name:`transitionTypes`,parent:{fileName:`breeze-ui/src/primitives/Link/Link.tsx`,name:`LinkCommonProps`},required:!1,tags:{},type:{name:`readonly ViewTransitionType[] | undefined`}}},tags:{}}}catch{}try{D.displayName=`Default`,D.__docgenInfo={description:`A same-document link with the default brand treatment.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{O.displayName=`Subtle`,O.__docgenInfo={description:`A lower-emphasis link for supporting destinations.`,displayName:`Subtle`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`PanelAction`,k.__docgenInfo={description:`A panel header's navigation action.`,displayName:`PanelAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{A.displayName=`Treatments`,A.__docgenInfo={description:`Both closed visual treatments.`,displayName:`Treatments`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{j.displayName=`ButtonTreatments`,j.__docgenInfo={description:`Navigation and download links that look like primary and secondary buttons.`,displayName:`ButtonTreatments`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{M.displayName=`RouterNavigation`,M.__docgenInfo={description:`A router receives only the caller's opt-in transition types.`,displayName:`RouterNavigation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Link/Link.stories.tsx`,methods:[],props:{},tags:{}}}catch{}N=[`Default`,`Subtle`,`PanelAction`,`Treatments`,`ButtonTreatments`,`RouterNavigation`]}));P();export{j as ButtonTreatments,D as Default,k as PanelAction,M as RouterNavigation,O as Subtle,A as Treatments,N as __namedExportsOrder,E as default,P as n,_ as t};