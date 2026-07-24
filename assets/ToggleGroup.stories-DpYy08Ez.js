import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Inline-B4SGPSRg.js";import{n as s,t as c}from"./ToggleButton-B2pSczIG.js";import{n as l,t as u}from"./ToggleGroup-CDNVUurD.js";var d=n({ControlledAndReadOnly:()=>C,MultipleSelection:()=>x,SingleSelection:()=>b,VerticalDisabled:()=>S,__namedExportsOrder:()=>w,default:()=>y});function f(){let[e,t]=(0,p.useState)([`grid`]);return(0,m.jsxs)(u,{"aria-label":`Controlled view mode`,onSelectionChange:t,selection:e,children:[(0,m.jsx)(c,{value:`grid`,children:`Grid`}),(0,m.jsx)(c,{value:`list`,children:`List`})]})}var p,m,h,g,_,v,y,b,x,S,C,w,T=t((()=>{p=e(r(),1),a(),s(),l(),m=i(),{expect:h,fn:g,userEvent:_,within:v}=__STORYBOOK_MODULE_TEST__,y={component:u,title:`Actions/ToggleGroup`},b={args:{"aria-label":`View mode`,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(c,{value:`grid`,children:`Grid`}),(0,m.jsx)(c,{value:`list`,children:`List`})]}),onSelectionChange:g()},play:async({args:e,canvasElement:t})=>{await _.click(v(t).getByRole(`radio`,{name:`List`})),await h(e.onSelectionChange).toHaveBeenCalledWith([`list`])}},x={args:{"aria-label":`Text formatting`,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(c,{value:`bold`,children:`Bold`}),(0,m.jsx)(c,{value:`italic`,children:`Italic`}),(0,m.jsx)(c,{value:`underline`,children:`Underline`})]}),defaultSelection:[`bold`],multiple:!0}},S={args:{"aria-label":`Disabled view mode`,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(c,{value:`grid`,children:`Grid`}),(0,m.jsx)(c,{value:`list`,children:`List`})]}),disabled:!0,orientation:`vertical`}},C={args:{"aria-label":`Controlled view mode`,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(c,{value:`grid`,children:`Grid`}),(0,m.jsx)(c,{value:`list`,children:`List`})]}),onSelectionChange:g(),selection:[`grid`]},render:()=>(0,m.jsxs)(o,{align:`stretch`,gap:`xl`,wrap:!1,children:[(0,m.jsx)(f,{}),(0,m.jsxs)(u,{"aria-label":`Read-only view mode`,readOnly:!0,selection:[`list`],children:[(0,m.jsx)(c,{value:`grid`,children:`Grid`}),(0,m.jsx)(c,{value:`list`,children:`List`})]})]})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'View mode',
    children: <>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </>,
    onSelectionChange: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole('radio', {
      name: 'List'
    }));
    await expect(args.onSelectionChange).toHaveBeenCalledWith(['list']);
  }
}`,...b.parameters?.docs?.source},description:{story:`Coordinates two valued ToggleButtons as a labelled radio-style group and
verifies the semantic callback reports the newly selected stable value.

@summary single-selection toggle group with stable values`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Text formatting',
    children: <>
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
        <ToggleButton value="underline">Underline</ToggleButton>
      </>,
    defaultSelection: ['bold'],
    multiple: true
  }
}`,...x.parameters?.docs?.source},description:{story:`Enables multiple selection for independent formatting toggles and starts
from one uncontrolled selected value.

@summary uncontrolled multiple-selection formatting toggles`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Disabled view mode',
    children: <>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </>,
    disabled: true,
    orientation: 'vertical'
  }
}`,...S.parameters?.docs?.source},description:{story:`Stacks the group on its vertical navigation axis while disabling every
contained toggle, documenting both orientation and group-wide state.

@summary vertical toggle group with all interaction disabled`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Controlled view mode',
    children: <>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </>,
    onSelectionChange: fn(),
    selection: ['grid']
  },
  render: () => <Inline align="stretch" gap="xl" wrap={false}>
      <ControlledToggleGroupExample />
      <ToggleGroup aria-label="Read-only view mode" readOnly selection={['list']}>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </ToggleGroup>
    </Inline>
}`,...C.parameters?.docs?.source},description:{story:`Compares application-controlled selection with an intentionally immutable
selection so consumers can distinguish the two ownership contracts.

@summary controlled and read-only toggle-group selections`,...C.parameters?.docs?.description}}};try{y.displayName=`ToggleGroup`,y.__docgenInfo={description:`Coordinates single or multiple toggle selection and arrow-key navigation.`,displayName:`ToggleGroup`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ToggleGroup/ToggleGroup.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`}],description:"ToggleButton children with stable `value` props.",name:`children`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`}],description:"Prevents all contained toggles from changing. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`}],description:"Allows more than one selected value. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},orientation:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`}],description:"Layout and keyboard navigation axis. Defaults to `horizontal`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`}],description:`Ref to the rendered group.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ToggleGroupSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ReadOnlyToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`UncontrolledToggleGroupProps`}],description:`Current selected values.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},required:!1,tags:{},type:{name:`string[] | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ReadOnlyToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`UncontrolledToggleGroupProps`}],description:`Called with the next selected values.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},required:!1,tags:{},type:{name:`((selection: string[]) => void) | ((selection: string[]) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ReadOnlyToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`UncontrolledToggleGroupProps`}],description:`Initial selected values. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},required:!1,tags:{},type:{name:`string[] | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ReadOnlyToggleGroupProps`},{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`UncontrolledToggleGroupProps`}],description:`Marks a controlled selection as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/ToggleGroup/ToggleGroup.tsx`,name:`ControlledToggleGroupProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`related toggle actions with single or multiple selection`}}}catch{}try{b.displayName=`SingleSelection`,b.__docgenInfo={description:`Coordinates two valued ToggleButtons as a labelled radio-style group and
verifies the semantic callback reports the newly selected stable value.`,displayName:`SingleSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ToggleGroup/ToggleGroup.stories.tsx`,methods:[],props:{},tags:{summary:`single-selection toggle group with stable values`}}}catch{}try{x.displayName=`MultipleSelection`,x.__docgenInfo={description:`Enables multiple selection for independent formatting toggles and starts
from one uncontrolled selected value.`,displayName:`MultipleSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ToggleGroup/ToggleGroup.stories.tsx`,methods:[],props:{},tags:{summary:`uncontrolled multiple-selection formatting toggles`}}}catch{}try{S.displayName=`VerticalDisabled`,S.__docgenInfo={description:`Stacks the group on its vertical navigation axis while disabling every
contained toggle, documenting both orientation and group-wide state.`,displayName:`VerticalDisabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ToggleGroup/ToggleGroup.stories.tsx`,methods:[],props:{},tags:{summary:`vertical toggle group with all interaction disabled`}}}catch{}try{C.displayName=`ControlledAndReadOnly`,C.__docgenInfo={description:`Compares application-controlled selection with an intentionally immutable
selection so consumers can distinguish the two ownership contracts.`,displayName:`ControlledAndReadOnly`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ToggleGroup/ToggleGroup.stories.tsx`,methods:[],props:{},tags:{summary:`controlled and read-only toggle-group selections`}}}catch{}w=[`SingleSelection`,`MultipleSelection`,`VerticalDisabled`,`ControlledAndReadOnly`]}));T();export{C as ControlledAndReadOnly,x as MultipleSelection,b as SingleSelection,S as VerticalDisabled,w as __namedExportsOrder,y as default,T as n,d as t};