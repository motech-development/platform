import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{N as r,t as i}from"./icons-p-UCV5fK.js";import{n as a,t as o}from"./Avatar-CwdahOfU.js";import{n as s,t as c}from"./ContextSwitcher-KGTs8sNF.js";import{n as l,t as u}from"./IconTile-CG-auT1j.js";import{n as d,t as f}from"./StoryConstraint-DtKI6sgB.js";import{n as p,t as m}from"./Surface-BNgcQ4ww.js";var h=t({Selection:()=>C,SelectionRequired:()=>T,WithoutMarkers:()=>w,__namedExportsOrder:()=>E,default:()=>S});function g(){return null}var _,v,y,b,x,S,C,w,T,E,D=e((()=>{d(),r(),a(),l(),p(),s(),_=n(),{expect:v,fn:y,userEvent:b,within:x}=__STORYBOOK_MODULE_TEST__,S={component:c,decorators:[e=>(0,_.jsx)(f,{size:`application-rail`,children:(0,_.jsx)(m,{border:`none`,padding:`compact`,tone:`inverse`,children:(0,_.jsx)(e,{})})})],title:`Patterns/Application Shell/ContextSwitcher`},C={args:{"aria-label":`Switch context`,currentId:`design`,items:[{description:`Primary workspace`,icon:(0,_.jsx)(o,{initials:`D`,name:`Design Team`,shape:`square`,size:`md`}),id:`design`,name:`Design Team`},{description:`Secondary workspace`,icon:(0,_.jsx)(o,{initials:`R`,name:`Research Team`,shape:`square`,size:`md`,tone:`accent`}),id:`research`,name:`Research Team`}],manageLabel:`Manage contexts`,onChange:y(),onManage:y(),triggerLabel:`Current context`},play:async({args:e,canvasElement:t})=>{let n=x(t).getByRole(`button`,{name:`Switch context`}),r=x(n).getByText(`D`);await v(r.getBoundingClientRect().width).toBe(36),await v(getComputedStyle(r).borderRadius).toBe(`0px`),await b.click(n);let i=x(document.body).getByText(`R`);await v(i.getBoundingClientRect().width).toBe(36),await v(getComputedStyle(i).backgroundColor).toBe(`rgb(242, 233, 255)`),await b.click(x(document.body).getByRole(`menuitemradio`,{name:/Research Team/u})),await v(e.onChange).toHaveBeenCalledWith(`research`)}},w={args:{...C.args,items:[{description:`Primary workspace`,icon:(0,_.jsx)(g,{}),id:`design`,name:`Design Team`},{description:`Secondary workspace`,icon:[],id:`research`,name:`Research Team`}]},play:async({canvasElement:e})=>{let t=x(e).getByRole(`button`,{name:`Switch context`}),n=x(t).getByText(`Design Team`),r=getComputedStyle(t);await v(n.getBoundingClientRect().left).toBeCloseTo(t.getBoundingClientRect().left+Number.parseFloat(r.paddingLeft),1),await b.click(t);let i=x(document.body).getByRole(`menuitemradio`,{name:/Research Team/u}),a=x(i).getByText(`Research Team`),o=getComputedStyle(i);await v(a.getBoundingClientRect().left).toBeCloseTo(i.getBoundingClientRect().left+Number.parseFloat(o.paddingLeft),1)}},T={args:{...C.args,currentId:null,emptyIcon:(0,_.jsx)(u,{bordered:!1,size:`sm`,children:(0,_.jsx)(i,{})}),emptyName:`Select context`,triggerLabel:`Context`},play:async({canvasElement:e})=>{let t=x(e).getByRole(`button`,{name:`Switch context`});await v(t).toHaveTextContent(`Context`),await v(t).toHaveTextContent(`Select context`);let n=t.querySelector(`svg`)?.parentElement;await v(n).not.toBeNull(),await v(n?.getBoundingClientRect().width).toBe(36),await v(n).toHaveStyle({borderWidth:`0px`})}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Switch context',
    currentId: 'design',
    items: [{
      description: 'Primary workspace',
      icon: <Avatar initials="D" name="Design Team" shape="square" size="md" />,
      id: 'design',
      name: 'Design Team'
    }, {
      description: 'Secondary workspace',
      icon: <Avatar initials="R" name="Research Team" shape="square" size="md" tone="accent" />,
      id: 'research',
      name: 'Research Team'
    }],
    manageLabel: 'Manage contexts',
    onChange: fn(),
    onManage: fn(),
    triggerLabel: 'Current context'
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Switch context'
    });
    const currentMarker = within(trigger).getByText('D');
    await expect(currentMarker.getBoundingClientRect().width).toBe(36);
    await expect(getComputedStyle(currentMarker).borderRadius).toBe('0px');
    await userEvent.click(trigger);
    const alternateMarker = within(document.body).getByText('R');
    await expect(alternateMarker.getBoundingClientRect().width).toBe(36);
    await expect(getComputedStyle(alternateMarker).backgroundColor).toBe('rgb(242, 233, 255)');
    await userEvent.click(within(document.body).getByRole('menuitemradio', {
      name: /Research Team/u
    }));
    await expect(args.onChange).toHaveBeenCalledWith('research');
  }
}`,...C.parameters?.docs?.source},description:{story:`Opens a menu of application-owned contexts, preserves each visual marker and
supporting description, and reports the alternate stable id when selected.

@summary current context display and alternate selection`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    ...Selection.args,
    items: [{
      description: 'Primary workspace',
      icon: <EmptyMarker />,
      id: 'design',
      name: 'Design Team'
    }, {
      description: 'Secondary workspace',
      icon: [],
      id: 'research',
      name: 'Research Team'
    }]
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Switch context'
    });
    const currentName = within(trigger).getByText('Design Team');
    const triggerStyle = getComputedStyle(trigger);
    await expect(currentName.getBoundingClientRect().left).toBeCloseTo(trigger.getBoundingClientRect().left + Number.parseFloat(triggerStyle.paddingLeft), 1);
    await userEvent.click(trigger);
    const alternateItem = within(document.body).getByRole('menuitemradio', {
      name: /Research Team/u
    });
    const alternateName = within(alternateItem).getByText('Research Team');
    const alternateStyle = getComputedStyle(alternateItem);
    await expect(alternateName.getBoundingClientRect().left).toBeCloseTo(alternateItem.getBoundingClientRect().left + Number.parseFloat(alternateStyle.paddingLeft), 1);
  }
}`,...w.parameters?.docs?.source},description:{story:`Keeps text aligned to the content edge when contexts do not provide visual
markers.

@summary context selection without optional markers`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    ...Selection.args,
    currentId: null,
    emptyIcon: <IconTile bordered={false} size="sm">
        <AddIcon />
      </IconTile>,
    emptyName: 'Select context',
    triggerLabel: 'Context'
  },
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Switch context'
    });
    await expect(trigger).toHaveTextContent('Context');
    await expect(trigger).toHaveTextContent('Select context');
    const emptyMarker = trigger.querySelector('svg')?.parentElement;
    await expect(emptyMarker).not.toBeNull();
    await expect(emptyMarker?.getBoundingClientRect().width).toBe(36);
    await expect(emptyMarker).toHaveStyle({
      borderWidth: '0px'
    });
  }
}`,...T.parameters?.docs?.source},description:{story:`Represents the required-selection state with application-authored prompt
copy and marker when no current context id is available.

@summary prompt state before a context is selected`,...T.parameters?.docs?.description}}};try{S.displayName=`ContextSwitcher`,S.__docgenInfo={description:`Switches one application-owned context through a keyboard-complete menu.`,displayName:`ContextSwitcher`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Accessible name for the menu trigger.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`string`}},currentId:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:"Current selected context key, or `null` when selection is required.",name:`currentId`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`string | null`}},emptyIcon:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Optional visual marker shown when selection is required.`,name:`emptyIcon`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`ReactNode`}},emptyName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Application-owned prompt shown when selection is required.`,name:`emptyName`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`ReactNode`}},items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Ordered application-owned contexts.`,name:`items`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`readonly ContextSwitcherItem[]`}},manageLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Optional label for a management action after the contexts.`,name:`manageLabel`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`string | undefined`}},onManage:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Called when the optional management action is selected.`,name:`onManage`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Called with the next selected context key.`,name:`onChange`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`(id: string) => void`}},triggerLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Short text describing the selected context role.`,name:`triggerLabel`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`ReactNode`}}},tags:{summary:`controlled application-context selection menu`}}}catch{}try{C.displayName=`Selection`,C.__docgenInfo={description:`Opens a menu of application-owned contexts, preserves each visual marker and
supporting description, and reports the alternate stable id when selected.`,displayName:`Selection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{},tags:{summary:`current context display and alternate selection`}}}catch{}try{w.displayName=`WithoutMarkers`,w.__docgenInfo={description:`Keeps text aligned to the content edge when contexts do not provide visual
markers.`,displayName:`WithoutMarkers`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{},tags:{summary:`context selection without optional markers`}}}catch{}try{T.displayName=`SelectionRequired`,T.__docgenInfo={description:`Represents the required-selection state with application-authored prompt
copy and marker when no current context id is available.`,displayName:`SelectionRequired`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{},tags:{summary:`prompt state before a context is selected`}}}catch{}E=[`Selection`,`WithoutMarkers`,`SelectionRequired`]}));D();export{C as Selection,T as SelectionRequired,w as WithoutMarkers,E as __namedExportsOrder,S as default,D as n,h as t};