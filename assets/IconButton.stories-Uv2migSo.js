import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-q_a4TWX4.js";import{n as r,t as i}from"./Inline-pSXcyftq.js";import{E as a,N as o,f as s,p as c,t as l}from"./icons-Cg1FNHcV.js";import{n as u,t as d}from"./Stack-CT7mlz7n.js";import{o as f,s as p}from"./TextField-CiykLqt4.js";import{n as m,t as h}from"./IconButton-BXs2oGuI.js";var g=e({Activation:()=>C,NativeFormBehaviors:()=>D,SemanticRemove:()=>E,SizesAndEmphasis:()=>w,States:()=>T,__namedExportsOrder:()=>O,default:()=>S}),_,v,y,b,x,S,C,w,T,E,D,O,k=t((()=>{o(),r(),u(),p(),m(),_=n(),{expect:v,fn:y,userEvent:b,within:x}=__STORYBOOK_MODULE_TEST__,S={component:h,title:`Actions/IconButton`},C={args:{"aria-label":`Add item`,children:(0,_.jsx)(l,{}),onAction:y()},play:async({args:e,canvasElement:t})=>{await b.click(x(t).getByRole(`button`,{name:`Add item`})),await v(e.onAction).toHaveBeenCalledOnce()}},w={args:{"aria-label":`Settings`,children:(0,_.jsx)(a,{})},render:()=>(0,_.jsxs)(i,{gap:`compact`,wrap:!1,children:[(0,_.jsx)(h,{"aria-label":`Settings small`,size:`sm`,children:(0,_.jsx)(a,{})}),(0,_.jsx)(h,{"aria-label":`Settings`,children:(0,_.jsx)(a,{})}),(0,_.jsx)(h,{"aria-label":`Delete`,appearance:`solid`,size:`lg`,variant:`danger`,children:(0,_.jsx)(c,{})})]})},T={args:{"aria-label":`Settings`,children:(0,_.jsx)(a,{})},render:()=>(0,_.jsxs)(i,{align:`stretch`,gap:`compact`,wrap:!1,children:[(0,_.jsx)(h,{"aria-label":`Disabled settings`,disabled:!0,children:(0,_.jsx)(a,{})}),(0,_.jsx)(h,{"aria-label":`Loading settings`,loading:!0,children:(0,_.jsx)(a,{})})]})},E={args:{appearance:`subtle`,"aria-label":`Remove category`,children:(0,_.jsx)(s,{}),variant:`danger`},play:async({canvasElement:e})=>{let t=x(e).getByRole(`button`,{name:`Remove category`}),n=getComputedStyle(t);await v(Number.parseFloat(n.width)).toBeGreaterThanOrEqual(44),await v(Number.parseFloat(n.height)).toBeGreaterThanOrEqual(44),await v(n.borderWidth).toBe(`0px`),await v(n.backgroundColor).toBe(`rgb(251, 234, 236)`),await b.tab(),await v(t).toHaveFocus();let r=getComputedStyle(t);await v(r.outlineStyle).toBe(`solid`),await v(r.outlineWidth).toBe(`2px`),await v(r.outlineColor).toBe(`rgb(79, 134, 255)`),await v(r.outlineOffset).toBe(`2px`)}},D={args:{"aria-label":`Button`,children:(0,_.jsx)(a,{})},render:()=>(0,_.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,_.jsxs)(d,{gap:`compact`,children:[(0,_.jsxs)(f.Root,{defaultValue:`Initial value`,children:[(0,_.jsx)(f.Label,{children:`Example value`}),(0,_.jsx)(f.Input,{})]}),(0,_.jsxs)(i,{gap:`compact`,children:[(0,_.jsx)(h,{"aria-label":`Button`,type:`button`,children:(0,_.jsx)(a,{})}),(0,_.jsx)(h,{"aria-label":`Submit`,type:`submit`,children:(0,_.jsx)(l,{})})]})]})})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Add item',
    children: <AddIcon />,
    onAction: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole('button', {
      name: 'Add item'
    }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  }
}`,...C.parameters?.docs?.source},description:{story:`Activates an icon-only add action and verifies that its semantic callback is
invoked once through the button's required accessible name.

@summary labelled icon-button activation`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Settings',
    children: <SettingsIcon />
  },
  render: () => <Inline gap="compact" wrap={false}>
      <IconButton aria-label="Settings small" size="sm">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Settings">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Delete" appearance="solid" size="lg" variant="danger">
        <DeleteIcon />
      </IconButton>
    </Inline>
}`,...w.parameters?.docs?.source},description:{story:`Compares canonical square sizes and uses solid danger emphasis for a
destructive action without changing the decorative status of its icon.

@summary icon-button sizes and semantic emphasis`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Settings',
    children: <SettingsIcon />
  },
  render: () => <Inline align="stretch" gap="compact" wrap={false}>
      <IconButton aria-label="Disabled settings" disabled>
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="Loading settings" loading>
        <SettingsIcon />
      </IconButton>
    </Inline>
}`,...T.parameters?.docs?.source},description:{story:`Compares disabled and loading icon actions so unavailable and in-progress
behavior remain accessible without replacing the button's name.

@summary disabled and loading icon-button states`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'subtle',
    'aria-label': 'Remove category',
    children: <CloseIcon />,
    variant: 'danger'
  },
  play: async ({
    canvasElement
  }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Remove category'
    });
    const defaultStyle = getComputedStyle(button);
    await expect(Number.parseFloat(defaultStyle.width)).toBeGreaterThanOrEqual(44);
    await expect(Number.parseFloat(defaultStyle.height)).toBeGreaterThanOrEqual(44);
    await expect(defaultStyle.borderWidth).toBe('0px');
    await expect(defaultStyle.backgroundColor).toBe('rgb(251, 234, 236)');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    const focusedStyle = getComputedStyle(button);
    await expect(focusedStyle.outlineStyle).toBe('solid');
    await expect(focusedStyle.outlineWidth).toBe('2px');
    await expect(focusedStyle.outlineColor).toBe('rgb(79, 134, 255)');
    await expect(focusedStyle.outlineOffset).toBe('2px');
  }
}`,...E.parameters?.docs?.source},description:{story:`Uses a subtle danger treatment for removal and verifies the minimum target,
semantic surface colour, and visible keyboard focus indicator.

@summary subtle danger removal action and focus treatment`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Button',
    children: <SettingsIcon />
  },
  render: () => <form onSubmit={event => event.preventDefault()}>
      <Stack gap="compact">
        <TextField.Root defaultValue="Initial value">
          <TextField.Label>Example value</TextField.Label>
          <TextField.Input />
        </TextField.Root>
        <Inline gap="compact">
          <IconButton aria-label="Button" type="button">
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label="Submit" type="submit">
            <AddIcon />
          </IconButton>
        </Inline>
      </Stack>
    </form>
}`,...D.parameters?.docs?.source},description:{story:`Demonstrates the deliberately bounded native button and submit types inside
a form while leaving form submission behavior application-owned.

@summary safe native button and submit behavior`,...D.parameters?.docs?.description}}};try{S.displayName=`IconButton`,S.__docgenInfo={description:`Performs an application action through a compact icon-only control whose
required accessible label supplies its semantic name.`,displayName:`IconButton`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconButton/IconButton.stories.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:`Accessible action name.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!0,tags:{},type:{name:`string`}},appearance:{defaultValue:{value:`ghost`},declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:"Visual emphasis treatment. Defaults to `ghost`.",name:`appearance`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`VisualAppearance | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:`Decorative icon.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!0,tags:{},type:{name:`ReactNode`}},className:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:`Placement and composition classes.`,name:`className`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`string | undefined`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:"Prevents interaction. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:"Shows and announces an in-progress state while preventing activation. Defaults to `false`.",name:`loading`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:`Called once when the user activates the button.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:`Ref to the rendered button.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`Ref<HTMLButtonElement> | undefined`}},size:{defaultValue:{value:`md`},declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:"Canonical square control size. Defaults to `md`.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`ControlSize | undefined`}},type:{defaultValue:{value:`button`},declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:"Constrained native form behavior: `button` or `submit`. Defaults to `button`.",name:`type`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`NativeButtonType | undefined`}},variant:{defaultValue:{value:`secondary`},declarations:[{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`}],description:"Semantic colour. Defaults to `secondary`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/IconButton/IconButton.tsx`,name:`IconButtonProps`},required:!1,tags:{},type:{name:`VisualVariant | undefined`}}},tags:{summary:`icon-only action with a mandatory accessible label`}}}catch{}try{C.displayName=`Activation`,C.__docgenInfo={description:`Activates an icon-only add action and verifies that its semantic callback is
invoked once through the button's required accessible name.`,displayName:`Activation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconButton/IconButton.stories.tsx`,methods:[],props:{},tags:{summary:`labelled icon-button activation`}}}catch{}try{w.displayName=`SizesAndEmphasis`,w.__docgenInfo={description:`Compares canonical square sizes and uses solid danger emphasis for a
destructive action without changing the decorative status of its icon.`,displayName:`SizesAndEmphasis`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconButton/IconButton.stories.tsx`,methods:[],props:{},tags:{summary:`icon-button sizes and semantic emphasis`}}}catch{}try{T.displayName=`States`,T.__docgenInfo={description:`Compares disabled and loading icon actions so unavailable and in-progress
behavior remain accessible without replacing the button's name.`,displayName:`States`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconButton/IconButton.stories.tsx`,methods:[],props:{},tags:{summary:`disabled and loading icon-button states`}}}catch{}try{E.displayName=`SemanticRemove`,E.__docgenInfo={description:`Uses a subtle danger treatment for removal and verifies the minimum target,
semantic surface colour, and visible keyboard focus indicator.`,displayName:`SemanticRemove`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconButton/IconButton.stories.tsx`,methods:[],props:{},tags:{summary:`subtle danger removal action and focus treatment`}}}catch{}try{D.displayName=`NativeFormBehaviors`,D.__docgenInfo={description:`Demonstrates the deliberately bounded native button and submit types inside
a form while leaving form submission behavior application-owned.`,displayName:`NativeFormBehaviors`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconButton/IconButton.stories.tsx`,methods:[],props:{},tags:{summary:`safe native button and submit behavior`}}}catch{}O=[`Activation`,`SizesAndEmphasis`,`States`,`SemanticRemove`,`NativeFormBehaviors`]}));k();export{C as Activation,D as NativeFormBehaviors,E as SemanticRemove,w as SizesAndEmphasis,T as States,O as __namedExportsOrder,S as default,k as n,g as t};