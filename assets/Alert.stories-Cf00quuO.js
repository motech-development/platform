import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,d as a,f as o,l as s,p as c,r as l,u}from"./iframe-CQHtwZcQ.js";import{N as d,x as f}from"./icons-Cg1FNHcV.js";import{n as p,t as m}from"./Stack-CVdmyomW.js";function h(e){if(e===`assertive`)return`alert`;if(e===`polite`)return`status`}function g({announcement:e=`assertive`,className:t,ref:n,variant:r=`info`,...i}){return s(),(0,_.createElement)(`div`,{...i,"aria-atomic":e===`off`?void 0:`true`,"aria-live":e,className:v({class:t,variant:r}),"data-variant":r,ref:a(n),role:h(e)})}var _,v,y=t((()=>{_=n(r(),1),o(),u(),i(),v=c({base:`flex min-w-0 items-center gap-3 border px-4 py-3 font-[family-name:var(--breeze-font-body)] text-base leading-[1.4] forced-colors:border-[CanvasText]`,defaultVariants:{variant:`info`},variants:{variant:{danger:`border-[var(--breeze-danger)] bg-[var(--breeze-danger-soft)] text-[var(--breeze-ink)]`,dark:`border-[var(--breeze-shell)] bg-[var(--breeze-shell)] text-white`,info:`border-[var(--breeze-info-border)] bg-[var(--breeze-info-soft)] text-[var(--breeze-info-ink)]`,light:`border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]`,primary:`border-[var(--breeze-primary)] bg-[var(--breeze-primary-soft)] text-[var(--breeze-ink)]`,secondary:`border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink)]`,success:`border-[var(--breeze-success)] bg-[var(--breeze-success-soft)] text-[var(--breeze-ink)]`,warning:`border-[var(--breeze-warning)] bg-[var(--breeze-warning-soft)] text-[var(--breeze-ink)]`}}});try{g.displayName=`Alert`,g.__docgenInfo={description:`Displays persistent inline application feedback with explicit announcement
urgency.`,displayName:`Alert`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.tsx`,methods:[],props:{announcement:{defaultValue:{value:`assertive`},declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:"Announcement urgency. Defaults to `assertive`; use `off` for content already present when the page loads.",name:`announcement`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!1,tags:{},type:{name:`AlertAnnouncement | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:`Application-owned translated alert content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:`Ref to the rendered alert element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},variant:{defaultValue:{value:`info`},declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:"Breeze semantic colour. Defaults to `info`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!1,tags:{},type:{name:`VisualVariant | undefined`}}},tags:{summary:`persistent inline feedback with explicit announcement urgency`}}}catch{}})),b=e({Assertive:()=>E,InformationNotice:()=>O,InformationNoticeCompact:()=>k,Polite:()=>D,RightToLeft:()=>j,Variants:()=>A,__namedExportsOrder:()=>M,default:()=>T});async function x(e){let t=w(e).getByTestId(`information-notice`),n=t.querySelector(`svg`),r=t.getBoundingClientRect(),i=e.ownerDocument.defaultView?.getComputedStyle(t);await C(t).not.toHaveAttribute(`role`),await C(t).toHaveAttribute(`aria-live`,`off`),await C(r.height).toBeGreaterThan(0),await C(t.scrollHeight).toBeLessThanOrEqual(t.clientHeight),await C(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth),await C(i?.alignItems).toBe(`center`),await C(i?.backgroundColor).toBe(`rgb(227, 243, 250)`),await C(i?.borderTopColor).toBe(`rgb(77, 145, 176)`),await C(i?.borderTopWidth).toBe(`1px`),await C(i?.borderRightWidth).toBe(`1px`),await C(i?.borderBottomWidth).toBe(`1px`),await C(i?.borderLeftWidth).toBe(`1px`),await C(i?.color).toBe(`rgb(0, 73, 102)`),await C(i?.display).toBe(`flex`),await C(i?.fontSize).toBe(`16px`),await C(n?.getBoundingClientRect().height).toBe(16),await C(n?.getBoundingClientRect().width).toBe(16)}var S,C,w,T,E,D,O,k,A,j,M,N=t((()=>{d(),p(),y(),S=l(),{expect:C,within:w}=__STORYBOOK_MODULE_TEST__,T={component:g,title:`Feedback/Alert`},E={args:{children:`Request could not be completed.`,variant:`danger`}},D={args:{announcement:`polite`,children:`Your changes were saved.`,variant:`success`}},O={args:{announcement:`off`,children:`Reports are automatically deleted after 24 hours.`,variant:`info`},play:async({canvasElement:e})=>x(e),render:({announcement:e,children:t,variant:n})=>(0,S.jsxs)(g,{announcement:e,"data-testid":`information-notice`,variant:n,children:[(0,S.jsx)(f,{}),t]})},k={...O,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>x(e)},A={args:{children:`Alert`},render:()=>(0,S.jsxs)(m,{gap:`compact`,children:[(0,S.jsx)(g,{announcement:`off`,variant:`primary`,children:`Primary application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`secondary`,children:`Secondary application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`success`,children:`Success application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`danger`,children:`Danger application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`warning`,children:`Warning application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`info`,children:`Information application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`light`,children:`Light application feedback`}),(0,S.jsx)(g,{announcement:`off`,variant:`dark`,children:`Dark application feedback`})]})},j={args:{children:`Alert`},render:()=>(0,S.jsx)(`div`,{dir:`rtl`,children:(0,S.jsx)(g,{announcement:`off`,variant:`info`,children:`Your changes were saved.`})})},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Request could not be completed.',
    variant: 'danger'
  }
}`,...E.parameters?.docs?.source},description:{story:`Uses the default assertive announcement with danger styling for an urgent
failure that must be announced as soon as it is inserted.

@summary Urgent assertive failure feedback.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    announcement: 'polite',
    children: 'Your changes were saved.',
    variant: 'success'
  }
}`,...D.parameters?.docs?.source},description:{story:`Sets \`announcement="polite"\` for a successful save update that should wait
for the screen reader’s current speech rather than interrupting it.

@summary Non-interrupting polite success feedback.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    announcement: 'off',
    children: 'Reports are automatically deleted after 24 hours.',
    variant: 'info'
  },
  play: async ({
    canvasElement
  }) => expectInformationNotice(canvasElement),
  render: ({
    announcement,
    children,
    variant
  }) => <Alert announcement={announcement} data-testid="information-notice" variant={variant}>
      <InfoIcon />
      {children}
    </Alert>
}`,...O.parameters?.docs?.source},description:{story:`Combines an informational icon with \`announcement="off"\` for guidance
already present on page load, while testing the canonical bordered notice
treatment and single-line icon alignment.

@summary Persistent informational guidance without a live-region announcement.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  ...InformationNotice,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => expectInformationNotice(canvasElement)
}`,...k.parameters?.docs?.source},description:{story:`Renders the same non-live informational notice at the standard compact
viewport to verify the icon, text, border, and overflow behaviour remain
intact on a narrow screen.

@summary Compact viewport treatment for an informational notice.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Alert'
  },
  render: () => <Stack gap="compact">
      <Alert announcement="off" variant="primary">
        Primary application feedback
      </Alert>
      <Alert announcement="off" variant="secondary">
        Secondary application feedback
      </Alert>
      <Alert announcement="off" variant="success">
        Success application feedback
      </Alert>
      <Alert announcement="off" variant="danger">
        Danger application feedback
      </Alert>
      <Alert announcement="off" variant="warning">
        Warning application feedback
      </Alert>
      <Alert announcement="off" variant="info">
        Information application feedback
      </Alert>
      <Alert announcement="off" variant="light">
        Light application feedback
      </Alert>
      <Alert announcement="off" variant="dark">
        Dark application feedback
      </Alert>
    </Stack>
}`,...A.parameters?.docs?.source},description:{story:`Displays every semantic alert variant with announcements disabled, making
this the visual reference for choosing meaning-driven colour without
producing eight duplicate live-region messages.

@summary Visual comparison of all semantic alert variants.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Alert'
  },
  render: () => <div dir="rtl">
      <Alert announcement="off" variant="info">
        Your changes were saved.
      </Alert>
    </div>
}`,...j.parameters?.docs?.source},description:{story:`Places an informational alert in an explicit right-to-left container while
keeping English copy, verifying direction-aware alignment without coupling
direction to translated example content.

@summary Right-to-left alert layout with English content.`,...j.parameters?.docs?.description}}};try{T.displayName=`Alert`,T.__docgenInfo={description:`Displays persistent inline application feedback with explicit announcement
urgency.`,displayName:`Alert`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{announcement:{defaultValue:{value:`assertive`},declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:"Announcement urgency. Defaults to `assertive`; use `off` for content already present when the page loads.",name:`announcement`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!1,tags:{},type:{name:`AlertAnnouncement | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:`Application-owned translated alert content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:`Ref to the rendered alert element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},variant:{defaultValue:{value:`info`},declarations:[{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`}],description:"Breeze semantic colour. Defaults to `info`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Alert/Alert.tsx`,name:`AlertProps`},required:!1,tags:{},type:{name:`VisualVariant | undefined`}}},tags:{summary:`persistent inline feedback with explicit announcement urgency`}}}catch{}try{E.displayName=`Assertive`,E.__docgenInfo={description:`Uses the default assertive announcement with danger styling for an urgent
failure that must be announced as soon as it is inserted.`,displayName:`Assertive`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{},tags:{summary:`Urgent assertive failure feedback.`}}}catch{}try{D.displayName=`Polite`,D.__docgenInfo={description:'Sets `announcement="polite"` for a successful save update that should wait\nfor the screen reader’s current speech rather than interrupting it.',displayName:`Polite`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{},tags:{summary:`Non-interrupting polite success feedback.`}}}catch{}try{O.displayName=`InformationNotice`,O.__docgenInfo={description:`Combines an informational icon with \`announcement="off"\` for guidance
already present on page load, while testing the canonical bordered notice
treatment and single-line icon alignment.`,displayName:`InformationNotice`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{},tags:{summary:`Persistent informational guidance without a live-region announcement.`}}}catch{}try{k.displayName=`InformationNoticeCompact`,k.__docgenInfo={description:`Renders the same non-live informational notice at the standard compact
viewport to verify the icon, text, border, and overflow behaviour remain
intact on a narrow screen.`,displayName:`InformationNoticeCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{},tags:{summary:`Compact viewport treatment for an informational notice.`}}}catch{}try{A.displayName=`Variants`,A.__docgenInfo={description:`Displays every semantic alert variant with announcements disabled, making
this the visual reference for choosing meaning-driven colour without
producing eight duplicate live-region messages.`,displayName:`Variants`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{},tags:{summary:`Visual comparison of all semantic alert variants.`}}}catch{}try{j.displayName=`RightToLeft`,j.__docgenInfo={description:`Places an informational alert in an explicit right-to-left container while
keeping English copy, verifying direction-aware alignment without coupling
direction to translated example content.`,displayName:`RightToLeft`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Alert/Alert.stories.tsx`,methods:[],props:{},tags:{summary:`Right-to-left alert layout with English content.`}}}catch{}M=[`Assertive`,`Polite`,`InformationNotice`,`InformationNoticeCompact`,`Variants`,`RightToLeft`]}));N();export{E as Assertive,O as InformationNotice,k as InformationNoticeCompact,D as Polite,j as RightToLeft,A as Variants,M as __namedExportsOrder,T as default,N as n,b as t};