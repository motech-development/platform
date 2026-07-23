import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{a as r,c as i,i as a,n as o,o as s,r as c,s as l,t as u}from"./Menu-M-HpRBRw.js";var d=e({ReadOnlySelection:()=>y,StaticNestedKeyboardAndTouch:()=>v,__namedExportsOrder:()=>b,default:()=>_}),f,p,m,h,g,_,v,y,b,x=t((()=>{i(),f=n(),{expect:p,userEvent:m,waitFor:h,within:g}=__STORYBOOK_MODULE_TEST__,_={component:r,decorators:[e=>(Object.assign(c.Item,{displayName:`Menu.Item`}),Object.assign(c.List,{displayName:`Menu.List`}),Object.assign(c.Popover,{displayName:`Menu.Popover`}),Object.assign(c.Root,{displayName:`Menu.Root`}),Object.assign(c.Submenu,{displayName:`Menu.Submenu`}),Object.assign(c.Trigger,{displayName:`Menu.Trigger`}),(0,f.jsx)(e,{}))],subcomponents:{Item:u,List:o,Popover:a,Submenu:s,Trigger:l},title:`Primitives/Navigation/Menu`},v={args:{children:null},play:async({canvasElement:e})=>{let t=g(e),n=g(document.body);await m.click(t.getByRole(`button`,{name:`Actions`}));let r=n.getByRole(`menuitem`,{name:`Share`});r.focus(),await m.keyboard(`{ArrowRight}`),await p(n.getByRole(`menu`,{name:`Share`})).toBeVisible(),await m.keyboard(`{Escape}`),await p(n.queryByRole(`menu`,{name:`Share`})).not.toBeInTheDocument(),await p(n.getByRole(`menu`,{name:`Actions`})).toBeVisible(),await h(()=>p(r).toHaveFocus())},render:()=>(0,f.jsxs)(c.Root,{children:[(0,f.jsx)(c.Trigger,{children:`Actions`}),(0,f.jsx)(c.Popover,{children:(0,f.jsxs)(c.List,{"aria-label":`Actions`,children:[(0,f.jsx)(c.Item,{id:`edit`,textValue:`Edit`,children:`Edit`}),(0,f.jsx)(c.Item,{disabled:!0,id:2,textValue:`Archive`,children:`Archive`}),(0,f.jsxs)(c.Submenu,{children:[(0,f.jsx)(c.Item,{id:`share`,textValue:`Share`,children:`Share`}),(0,f.jsx)(c.Popover,{children:(0,f.jsx)(c.List,{"aria-label":`Share`,children:(0,f.jsx)(c.Item,{id:`email`,textValue:`Email`,children:`Email`})})})]})]})})]})},y={args:{children:null},render:()=>(0,f.jsxs)(c.Root,{defaultOpen:!0,children:[(0,f.jsx)(c.Trigger,{children:`Density`}),(0,f.jsx)(c.Popover,{children:(0,f.jsxs)(c.List,{"aria-label":`Density`,readOnly:!0,selection:[1],children:[(0,f.jsx)(c.Item,{id:1,textValue:`Compact`,children:`Compact`}),(0,f.jsx)(c.Item,{id:`comfortable`,textValue:`Comfortable`,children:`Comfortable`})]})})]})},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Actions'
    }));
    const share = page.getByRole('menuitem', {
      name: 'Share'
    });
    share.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(page.getByRole('menu', {
      name: 'Share'
    })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(page.queryByRole('menu', {
      name: 'Share'
    })).not.toBeInTheDocument();
    await expect(page.getByRole('menu', {
      name: 'Actions'
    })).toBeVisible();
    await waitFor(() => expect(share).toHaveFocus());
  },
  render: () => <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Popover>
        <Menu.List aria-label="Actions">
          <Menu.Item id="edit" textValue="Edit">
            Edit
          </Menu.Item>
          <Menu.Item disabled id={2} textValue="Archive">
            Archive
          </Menu.Item>
          <Menu.Submenu>
            <Menu.Item id="share" textValue="Share">
              Share
            </Menu.Item>
            <Menu.Popover>
              <Menu.List aria-label="Share">
                <Menu.Item id="email" textValue="Email">
                  Email
                </Menu.Item>
              </Menu.List>
            </Menu.Popover>
          </Menu.Submenu>
        </Menu.List>
      </Menu.Popover>
    </Menu.Root>
}`,...v.parameters?.docs?.source},description:{story:`Opens a static action menu, enters a nested submenu with ArrowRight, and
verifies Escape returns focus and context to the parent menu.

@summary static nested menu keyboard focus lifecycle`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Menu.Root defaultOpen>
      <Menu.Trigger>Density</Menu.Trigger>
      <Menu.Popover>
        <Menu.List aria-label="Density" readOnly selection={[1]}>
          <Menu.Item id={1} textValue="Compact">
            Compact
          </Menu.Item>
          <Menu.Item id="comfortable" textValue="Comfortable">
            Comfortable
          </Menu.Item>
        </Menu.List>
      </Menu.Popover>
    </Menu.Root>
}`,...y.parameters?.docs?.source},description:{story:`Authors density choices directly with an intentionally immutable selected
key in an initially open menu.

@summary statically authored menu items with read-only selection`,...y.parameters?.docs?.description}}};try{_.displayName=`Root`,_.__docgenInfo={description:`Coordinates popup state, trigger focus, and dismissal.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuRootSharedProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuRootSharedProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuRootSharedProps`}],description:`Trigger and popover parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ReadOnlyMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuRootProps`}],description:`Current popup state.
Current immutable popup state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ReadOnlyMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuRootProps`}],description:`Called with the next popup state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ReadOnlyMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuRootProps`}],description:"Initial popup state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ReadOnlyMenuRootProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuRootProps`}],description:`Marks controlled popup state as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{v.displayName=`StaticNestedKeyboardAndTouch`,v.__docgenInfo={description:`Opens a static action menu, enters a nested submenu with ArrowRight, and
verifies Escape returns focus and context to the parent menu.`,displayName:`StaticNestedKeyboardAndTouch`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{summary:`static nested menu keyboard focus lifecycle`}}}catch{}try{y.displayName=`ReadOnlySelection`,y.__docgenInfo={description:`Authors density choices directly with an intentionally immutable selected
key in an initially open menu.`,displayName:`ReadOnlySelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{summary:`statically authored menu items with read-only selection`}}}catch{}b=[`StaticNestedKeyboardAndTouch`,`ReadOnlySelection`]}));x();export{y as ReadOnlySelection,v as StaticNestedKeyboardAndTouch,b as __namedExportsOrder,_ as default,x as n,d as t};