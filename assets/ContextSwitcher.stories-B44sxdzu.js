import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-i3W5vvo3.js";import{N as r,t as i}from"./icons-Cg1FNHcV.js";import{n as a,t as o}from"./Avatar-DZUXAihR.js";import{n as s,t as c}from"./ContextSwitcher-gnWM5zQO.js";import{n as l,t as u}from"./IconTile-KGCX5FOw.js";import{n as d,t as f}from"./StoryConstraint-BuP2E5WZ.js";import{n as p,t as m}from"./Surface-DAbnRYpo.js";var h=e({Selection:()=>S,SelectionRequired:()=>C,__namedExportsOrder:()=>w,default:()=>x}),g,_,v,y,b,x,S,C,w,T=t((()=>{d(),r(),a(),l(),p(),s(),g=n(),{expect:_,fn:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x={component:c,decorators:[e=>(0,g.jsx)(f,{size:`application-rail`,children:(0,g.jsx)(m,{border:`none`,padding:`compact`,tone:`inverse`,children:(0,g.jsx)(e,{})})})],title:`Patterns/Application Shell/ContextSwitcher`},S={args:{"aria-label":`Switch context`,currentId:`design`,items:[{description:`Primary workspace`,icon:(0,g.jsx)(o,{initials:`D`,name:`Design Team`,shape:`square`,size:`md`}),id:`design`,name:`Design Team`},{description:`Secondary workspace`,icon:(0,g.jsx)(o,{initials:`R`,name:`Research Team`,shape:`square`,size:`md`,tone:`accent`}),id:`research`,name:`Research Team`}],manageLabel:`Manage contexts`,onChange:v(),onManage:v(),triggerLabel:`Current context`},play:async({args:e,canvasElement:t})=>{let n=b(t).getByRole(`button`,{name:`Switch context`}),r=b(n).getByRole(`img`,{name:`Design Team`});await _(r.getBoundingClientRect().width).toBe(36),await _(getComputedStyle(r).borderRadius).toBe(`0px`),await y.click(n);let i=b(document.body).getByRole(`img`,{name:`Research Team`});await _(i.getBoundingClientRect().width).toBe(36),await _(getComputedStyle(i).backgroundColor).toBe(`rgb(242, 233, 255)`),await y.click(b(document.body).getByRole(`menuitemradio`,{name:/Research Team/u})),await _(e.onChange).toHaveBeenCalledWith(`research`)}},C={args:{...S.args,currentId:null,emptyIcon:(0,g.jsx)(u,{bordered:!1,size:`sm`,children:(0,g.jsx)(i,{})}),emptyName:`Select context`,triggerLabel:`Context`},play:async({canvasElement:e})=>{let t=b(e).getByRole(`button`,{name:`Switch context`});await _(t).toHaveTextContent(`Context`),await _(t).toHaveTextContent(`Select context`);let n=t.querySelector(`svg`)?.parentElement;await _(n).not.toBeNull(),await _(n?.getBoundingClientRect().width).toBe(36),await _(n).toHaveStyle({borderWidth:`0px`})}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
    const currentMarker = within(trigger).getByRole('img', {
      name: 'Design Team'
    });
    await expect(currentMarker.getBoundingClientRect().width).toBe(36);
    await expect(getComputedStyle(currentMarker).borderRadius).toBe('0px');
    await userEvent.click(trigger);
    const alternateMarker = within(document.body).getByRole('img', {
      name: 'Research Team'
    });
    await expect(alternateMarker.getBoundingClientRect().width).toBe(36);
    await expect(getComputedStyle(alternateMarker).backgroundColor).toBe('rgb(242, 233, 255)');
    await userEvent.click(within(document.body).getByRole('menuitemradio', {
      name: /Research Team/u
    }));
    await expect(args.onChange).toHaveBeenCalledWith('research');
  }
}`,...S.parameters?.docs?.source},description:{story:`Opens a menu of application-owned contexts, preserves each visual marker and
supporting description, and reports the alternate stable id when selected.

@summary current context display and alternate selection`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source},description:{story:`Represents the required-selection state with application-authored prompt
copy and marker when no current context id is available.

@summary prompt state before a context is selected`,...C.parameters?.docs?.description}}};try{x.displayName=`ContextSwitcher`,x.__docgenInfo={description:`Switches one application-owned context through a keyboard-complete menu.`,displayName:`ContextSwitcher`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Accessible name for the menu trigger.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`string`}},currentId:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:"Current selected context key, or `null` when selection is required.",name:`currentId`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`string | null`}},emptyIcon:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Optional visual marker shown when selection is required.`,name:`emptyIcon`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`ReactNode`}},emptyName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Application-owned prompt shown when selection is required.`,name:`emptyName`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`ReactNode`}},items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Ordered application-owned contexts.`,name:`items`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`readonly ContextSwitcherItem[]`}},manageLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Optional label for a management action after the contexts.`,name:`manageLabel`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`string | undefined`}},onManage:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Called when the optional management action is selected.`,name:`onManage`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Called with the next selected context key.`,name:`onChange`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!0,tags:{},type:{name:`(id: string) => void`}},triggerLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`}],description:`Short text describing the selected context role.`,name:`triggerLabel`,parent:{fileName:`breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.tsx`,name:`ContextSwitcherProps`},required:!1,tags:{},type:{name:`ReactNode`}}},tags:{summary:`controlled application-context selection menu`}}}catch{}try{S.displayName=`Selection`,S.__docgenInfo={description:`Opens a menu of application-owned contexts, preserves each visual marker and
supporting description, and reports the alternate stable id when selected.`,displayName:`Selection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{},tags:{summary:`current context display and alternate selection`}}}catch{}try{C.displayName=`SelectionRequired`,C.__docgenInfo={description:`Represents the required-selection state with application-authored prompt
copy and marker when no current context id is available.`,displayName:`SelectionRequired`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/ContextSwitcher/ContextSwitcher.stories.tsx`,methods:[],props:{},tags:{summary:`prompt state before a context is selected`}}}catch{}w=[`Selection`,`SelectionRequired`]}));T();export{S as Selection,C as SelectionRequired,w as __namedExportsOrder,x as default,T as n,h as t};