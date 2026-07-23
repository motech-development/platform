import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,d as a,l as o,r as s,u as c}from"./iframe-CQHtwZcQ.js";import{n as l,t as u}from"./Link-a65hkmYx.js";import{n as d,t as f}from"./Button-BqpQ89mp.js";import{n as p,t as m}from"./ButtonGroup-kM-Z8qoe.js";function h({actions:e,back:t,className:n,description:r,ref:i,title:s,...c}){o();let l=(0,g.useId)();return(0,g.createElement)(`header`,{...c,"aria-labelledby":l,className:`grid gap-5 pb-6 sm:gap-8 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end ${n??``}`,ref:a(i)},(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)(`div`,{className:`grid min-w-0 gap-6`,children:[t==null?null:(0,_.jsx)(`div`,{className:`justify-self-start`,"data-page-header-back":!0,children:t}),(0,_.jsxs)(`div`,{className:`grid gap-2`,children:[(0,_.jsx)(`h1`,{className:`m-0 font-[family-name:var(--breeze-font-display)] text-[2rem] leading-[1.12] font-bold tracking-[-0.025em] sm:text-[2.5rem]`,id:l,children:s}),r==null?null:(0,_.jsx)(`div`,{className:`m-0 max-w-[65ch] text-base leading-[1.4] text-[var(--breeze-ink-soft)]`,children:r})]})]}),e==null?null:(0,_.jsx)(`div`,{className:`flex flex-col items-stretch sm:items-start lg:items-end`,children:e})]}))}var g,_,v=t((()=>{g=n(r(),1),c(),i(),_=s();try{h.displayName=`PageHeader`,h.__docgenInfo={description:`Establishes page hierarchy and responsive page-level actions.`,displayName:`PageHeader`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,methods:[],props:{actions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Page-level actions that stack below the title on compact layouts.`,name:`actions`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`ReactNode`}},back:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Optional back navigation displayed before the page heading.`,name:`back`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`ReactNode`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Concise page purpose or status.`,name:`description`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Ref to the rendered header.`,name:`ref`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Unique page heading.`,name:`title`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!0,tags:{},type:{name:`ReactNode`}}},tags:{summary:`responsive page heading with context, back link, and actions`}}}catch{}})),y=e({ActionsAndBack:()=>D,ActionsAndBackCompact:()=>O,MediumAction:()=>k,__namedExportsOrder:()=>A,default:()=>E});async function b(e){let t=T(e),n=t.getByRole(`link`,{name:`Back to projects`}),r=n.closest(`[data-page-header-back]`),i=t.getByRole(`heading`,{name:`Projects`}),a=i.closest(`header`),o=i.parentElement?.parentElement,s=e.ownerDocument.defaultView;await C(r).not.toBeNull(),await C(s?.getComputedStyle(r).justifySelf).toBe(`flex-start`),await C(n.getBoundingClientRect().width).toBeCloseTo(r.getBoundingClientRect().width,1),await C(n.getBoundingClientRect().width).toBeLessThan(o?.getBoundingClientRect().width??0),await C(r.getBoundingClientRect().width).toBeLessThan(a?.getBoundingClientRect().width??0),await C(i.getBoundingClientRect().top-r.getBoundingClientRect().bottom).toBe(24),await w.tab(),await C(n).toHaveFocus()}async function x(e,t){let n=T(e),r=n.getByRole(`group`,{name:`Project actions`}),i=n.getAllByRole(`button`),[a,o]=i,s=r.getBoundingClientRect(),c=o.getBoundingClientRect(),l=a.getBoundingClientRect();await C(i.map(({textContent:e})=>e)).toEqual([`View archived`,`Create project`]),t?(await C(c.top).toBeLessThan(l.top),await C(c.width).toBeCloseTo(s.width,1),await C(l.width).toBeCloseTo(s.width,1)):(await C(l.left).toBeLessThan(c.left),await C(l.top).toBeCloseTo(c.top,1)),await C(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth),await C(e.scrollWidth).toBeLessThanOrEqual(e.clientWidth),await w.tab(),await C(a).toHaveFocus(),await w.tab(),await C(o).toHaveFocus()}var S,C,w,T,E,D,O,k,A,j=t((()=>{d(),l(),p(),v(),S=s(),{expect:C,userEvent:w,within:T}=__STORYBOOK_MODULE_TEST__,E={component:h,title:`Patterns/Page Structure/PageHeader`,parameters:{docs:{description:{component:`Establishes one page heading with optional context, back navigation, and
responsive application-owned actions.

@summary responsive page heading with context, back link, and actions`}}}},D={args:{actions:(0,S.jsxs)(m,{"aria-label":`Project actions`,orientation:{base:`verticalReverse`,sm:`horizontal`},children:[(0,S.jsx)(f,{appearance:`outline`,children:`View archived`}),(0,S.jsx)(f,{children:`Create project`})]}),back:(0,S.jsx)(u,{href:`/projects`,children:`Back to projects`}),description:`Review and manage active projects.`,title:`Projects`},play:async({canvasElement:e})=>{await b(e),await x(e,!1)}},O={...D,globals:{viewport:{value:`mobile1`}},play:async({canvasElement:e})=>{await b(e),await x(e,!0)}},k={args:{actions:(0,S.jsx)(f,{children:`Open settings`}),description:`Configure how this workspace behaves.`,title:`Workspace settings`},globals:{viewport:{value:`tablet`}},play:async({canvasElement:e})=>{let t=T(e),n=T(e).getByRole(`button`,{name:`Open settings`}),r=t.getByText(`Configure how this workspace behaves.`),i=e.ownerDocument.defaultView;await C(n.getBoundingClientRect().width).toBeLessThan(220),await C(n.getBoundingClientRect().top-r.getBoundingClientRect().bottom).toBe(32),await C(i?.getComputedStyle(r).lineHeight).toBe(`22.4px`)}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    actions: <ButtonGroup aria-label="Project actions" orientation={{
      base: 'verticalReverse',
      sm: 'horizontal'
    }}>
        <Button appearance="outline">View archived</Button>
        <Button>Create project</Button>
      </ButtonGroup>,
    back: <Link href="/projects">Back to projects</Link>,
    description: 'Review and manage active projects.',
    title: 'Projects'
  },
  play: async ({
    canvasElement
  }) => {
    await expectContentSizedBack(canvasElement);
    await expectResponsiveActionOrder(canvasElement, false);
  }
}`,...D.parameters?.docs?.source},description:{story:`Composes a content-sized back destination, page description, and ordered
action group in the default wide presentation without changing tab order.

@summary wide page header with back navigation and ordered actions`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  ...ActionsAndBack,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  play: async ({
    canvasElement
  }) => {
    await expectContentSizedBack(canvasElement);
    await expectResponsiveActionOrder(canvasElement, true);
  }
}`,...O.parameters?.docs?.source},description:{story:`Uses the canonical compact viewport to stack full-width actions visually in
priority order while preserving the secondary-then-primary DOM and tab order.

@summary compact page header with priority-stacked full-width actions`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    actions: <Button>Open settings</Button>,
    description: 'Configure how this workspace behaves.',
    title: 'Workspace settings'
  },
  globals: {
    viewport: {
      value: 'tablet'
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const action = within(canvasElement).getByRole('button', {
      name: 'Open settings'
    });
    const description = canvas.getByText('Configure how this workspace behaves.');
    const view = canvasElement.ownerDocument.defaultView;
    await expect(action.getBoundingClientRect().width).toBeLessThan(220);
    await expect(action.getBoundingClientRect().top - description.getBoundingClientRect().bottom).toBe(32);
    await expect(view?.getComputedStyle(description).lineHeight).toBe('22.4px');
  }
}`,...k.parameters?.docs?.source},description:{story:`Demonstrates the intermediate layout where one action remains content-sized
below the title block before the wide two-column arrangement takes effect.

@summary medium-width page header with one content-sized action`,...k.parameters?.docs?.description}}};try{E.displayName=`PageHeader`,E.__docgenInfo={description:`Establishes page hierarchy and responsive page-level actions.`,displayName:`PageHeader`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/PageHeader/PageHeader.stories.tsx`,methods:[],props:{actions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Page-level actions that stack below the title on compact layouts.`,name:`actions`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`ReactNode`}},back:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Optional back navigation displayed before the page heading.`,name:`back`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`ReactNode`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Concise page purpose or status.`,name:`description`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Ref to the rendered header.`,name:`ref`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`}],description:`Unique page heading.`,name:`title`,parent:{fileName:`breeze-ui/src/patterns/PageHeader/PageHeader.tsx`,name:`PageHeaderProps`},required:!0,tags:{},type:{name:`ReactNode`}}},tags:{summary:`responsive page heading with context, back link, and actions`}}}catch{}try{D.displayName=`ActionsAndBack`,D.__docgenInfo={description:`Composes a content-sized back destination, page description, and ordered
action group in the default wide presentation without changing tab order.`,displayName:`ActionsAndBack`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/PageHeader/PageHeader.stories.tsx`,methods:[],props:{},tags:{summary:`wide page header with back navigation and ordered actions`}}}catch{}try{O.displayName=`ActionsAndBackCompact`,O.__docgenInfo={description:`Uses the canonical compact viewport to stack full-width actions visually in
priority order while preserving the secondary-then-primary DOM and tab order.`,displayName:`ActionsAndBackCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/PageHeader/PageHeader.stories.tsx`,methods:[],props:{},tags:{summary:`compact page header with priority-stacked full-width actions`}}}catch{}try{k.displayName=`MediumAction`,k.__docgenInfo={description:`Demonstrates the intermediate layout where one action remains content-sized
below the title block before the wide two-column arrangement takes effect.`,displayName:`MediumAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/PageHeader/PageHeader.stories.tsx`,methods:[],props:{},tags:{summary:`medium-width page header with one content-sized action`}}}catch{}A=[`ActionsAndBack`,`ActionsAndBackCompact`,`MediumAction`]}));j();export{D as ActionsAndBack,O as ActionsAndBackCompact,k as MediumAction,A as __namedExportsOrder,E as default,j as n,y as t};