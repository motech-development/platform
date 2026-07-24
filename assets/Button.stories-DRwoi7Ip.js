import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Inline-B4SGPSRg.js";import{N as a,t as o}from"./icons-p-UCV5fK.js";import{n as s,t as c}from"./Button-BEpHfrRB.js";import{n as l,t as u}from"./Stack-0pHCj1U7.js";import{o as d,s as f}from"./TextField-DUkhVOns.js";var p=t({Activation:()=>b,NativeFormBehaviors:()=>T,SizesAndIcon:()=>S,States:()=>w,TextAction:()=>C,Variants:()=>x,__namedExportsOrder:()=>E,default:()=>y}),m,h,g,_,v,y,b,x,S,C,w,T,E,D=e((()=>{a(),r(),l(),f(),s(),m=n(),{expect:h,fn:g,userEvent:_,within:v}=__STORYBOOK_MODULE_TEST__,y={component:c,title:`Actions/Button`},b={args:{children:`Save changes`,onAction:g()},play:async({args:e,canvasElement:t})=>{await _.click(v(t).getByRole(`button`,{name:`Save changes`})),await h(e.onAction).toHaveBeenCalledOnce()}},x={args:{children:`Action`},render:()=>(0,m.jsxs)(u,{gap:`compact`,children:[(0,m.jsxs)(i,{align:`stretch`,gap:`sm`,children:[(0,m.jsx)(c,{appearance:`solid`,variant:`primary`,children:`Primary`}),(0,m.jsx)(c,{appearance:`solid`,variant:`secondary`,children:`Secondary`}),(0,m.jsx)(c,{appearance:`solid`,variant:`success`,children:`Success`}),(0,m.jsx)(c,{appearance:`solid`,variant:`danger`,children:`Danger`}),(0,m.jsx)(c,{appearance:`solid`,variant:`warning`,children:`Warning`}),(0,m.jsx)(c,{appearance:`solid`,variant:`info`,children:`Information`}),(0,m.jsx)(c,{appearance:`solid`,variant:`light`,children:`Light`}),(0,m.jsx)(c,{appearance:`solid`,variant:`dark`,children:`Dark`})]}),(0,m.jsxs)(i,{align:`stretch`,gap:`sm`,children:[(0,m.jsx)(c,{appearance:`subtle`,variant:`primary`,children:`Primary`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`secondary`,children:`Secondary`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`success`,children:`Success`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`danger`,children:`Danger`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`warning`,children:`Warning`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`info`,children:`Information`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`light`,children:`Light`}),(0,m.jsx)(c,{appearance:`subtle`,variant:`dark`,children:`Dark`})]}),(0,m.jsxs)(i,{align:`stretch`,gap:`sm`,children:[(0,m.jsx)(c,{appearance:`outline`,variant:`primary`,children:`Primary`}),(0,m.jsx)(c,{appearance:`outline`,variant:`secondary`,children:`Secondary`}),(0,m.jsx)(c,{appearance:`outline`,variant:`success`,children:`Success`}),(0,m.jsx)(c,{appearance:`outline`,variant:`danger`,children:`Danger`}),(0,m.jsx)(c,{appearance:`outline`,variant:`warning`,children:`Warning`}),(0,m.jsx)(c,{appearance:`outline`,variant:`info`,children:`Information`}),(0,m.jsx)(c,{appearance:`outline`,variant:`light`,children:`Light`}),(0,m.jsx)(c,{appearance:`outline`,variant:`dark`,children:`Dark`})]}),(0,m.jsxs)(i,{align:`stretch`,gap:`sm`,children:[(0,m.jsx)(c,{appearance:`ghost`,variant:`primary`,children:`Primary`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`secondary`,children:`Secondary`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`success`,children:`Success`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`danger`,children:`Danger`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`warning`,children:`Warning`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`info`,children:`Information`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`light`,children:`Light`}),(0,m.jsx)(c,{appearance:`ghost`,variant:`dark`,children:`Dark`})]})]})},S={args:{children:`Create`},render:()=>(0,m.jsxs)(i,{gap:`compact`,wrap:!1,children:[(0,m.jsxs)(c,{size:`sm`,children:[(0,m.jsx)(o,{}),`Create`]}),(0,m.jsxs)(c,{children:[(0,m.jsx)(o,{}),`Create`]}),(0,m.jsxs)(c,{size:`lg`,children:[(0,m.jsx)(o,{}),`Create`]})]})},C={args:{appearance:`text`,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{}),` Add category`]})}},w={args:{children:`Save`},render:()=>(0,m.jsxs)(i,{align:`stretch`,gap:`compact`,wrap:!1,children:[(0,m.jsx)(c,{disabled:!0,children:`Disabled`}),(0,m.jsx)(c,{loading:!0,children:`Saving`})]})},T={args:{children:`Button`},render:()=>(0,m.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,m.jsxs)(u,{gap:`compact`,children:[(0,m.jsxs)(d.Root,{defaultValue:`Initial value`,children:[(0,m.jsx)(d.Label,{children:`Example value`}),(0,m.jsx)(d.Input,{})]}),(0,m.jsxs)(i,{gap:`compact`,children:[(0,m.jsx)(c,{type:`button`,children:`Button`}),(0,m.jsx)(c,{type:`submit`,children:`Submit`})]})]})})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Save changes',
    onAction: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole('button', {
      name: 'Save changes'
    }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  }
}`,...b.parameters?.docs?.source},description:{story:`Activates a labelled button through the pointer and verifies \`onAction\` is
called exactly once, documenting the component’s semantic callback contract.

@summary Single semantic action callback on activation.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Action'
  },
  render: () => <Stack gap="compact">
      <Inline align="stretch" gap="sm">
        <Button appearance="solid" variant="primary">
          Primary
        </Button>
        <Button appearance="solid" variant="secondary">
          Secondary
        </Button>
        <Button appearance="solid" variant="success">
          Success
        </Button>
        <Button appearance="solid" variant="danger">
          Danger
        </Button>
        <Button appearance="solid" variant="warning">
          Warning
        </Button>
        <Button appearance="solid" variant="info">
          Information
        </Button>
        <Button appearance="solid" variant="light">
          Light
        </Button>
        <Button appearance="solid" variant="dark">
          Dark
        </Button>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Button appearance="subtle" variant="primary">
          Primary
        </Button>
        <Button appearance="subtle" variant="secondary">
          Secondary
        </Button>
        <Button appearance="subtle" variant="success">
          Success
        </Button>
        <Button appearance="subtle" variant="danger">
          Danger
        </Button>
        <Button appearance="subtle" variant="warning">
          Warning
        </Button>
        <Button appearance="subtle" variant="info">
          Information
        </Button>
        <Button appearance="subtle" variant="light">
          Light
        </Button>
        <Button appearance="subtle" variant="dark">
          Dark
        </Button>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Button appearance="outline" variant="primary">
          Primary
        </Button>
        <Button appearance="outline" variant="secondary">
          Secondary
        </Button>
        <Button appearance="outline" variant="success">
          Success
        </Button>
        <Button appearance="outline" variant="danger">
          Danger
        </Button>
        <Button appearance="outline" variant="warning">
          Warning
        </Button>
        <Button appearance="outline" variant="info">
          Information
        </Button>
        <Button appearance="outline" variant="light">
          Light
        </Button>
        <Button appearance="outline" variant="dark">
          Dark
        </Button>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Button appearance="ghost" variant="primary">
          Primary
        </Button>
        <Button appearance="ghost" variant="secondary">
          Secondary
        </Button>
        <Button appearance="ghost" variant="success">
          Success
        </Button>
        <Button appearance="ghost" variant="danger">
          Danger
        </Button>
        <Button appearance="ghost" variant="warning">
          Warning
        </Button>
        <Button appearance="ghost" variant="info">
          Information
        </Button>
        <Button appearance="ghost" variant="light">
          Light
        </Button>
        <Button appearance="ghost" variant="dark">
          Dark
        </Button>
      </Inline>
    </Stack>
}`,...x.parameters?.docs?.source},description:{story:`Crosses the solid, subtle, outline, and ghost appearances with every
semantic colour so meaning and visual emphasis can be evaluated
independently.

@summary Complete button appearance and semantic-variant matrix.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Create'
  },
  render: () => <Inline gap="compact" wrap={false}>
      <Button size="sm">
        <AddIcon />
        Create
      </Button>
      <Button>
        <AddIcon />
        Create
      </Button>
      <Button size="lg">
        <AddIcon />
        Create
      </Button>
    </Inline>
}`,...S.parameters?.docs?.source},description:{story:"Places the decorative Add icon beside visible Create text at `sm`, `md`, and\n`lg`, showing canonical control sizing without making the icon the\naccessible name.\n\n@summary Button sizes with a decorative leading icon.",...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'text',
    children: <>
        <AddIcon /> Add category
      </>
  }
}`,...C.parameters?.docs?.source},description:{story:`Uses the text appearance for a low-emphasis Add category action that must
remain a button rather than being mistaken for navigation.

@summary Low-emphasis text action with visible icon and label.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Save'
  },
  render: () => <Inline align="stretch" gap="compact" wrap={false}>
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
    </Inline>
}`,...w.parameters?.docs?.source},description:{story:`Compares disabled and loading buttons, documenting that both prevent
activation while loading additionally exposes an announced busy state and
progress indicator.

@summary Disabled and in-progress button states.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <form onSubmit={event => event.preventDefault()}>
      <Stack gap="compact">
        <TextField.Root defaultValue="Initial value">
          <TextField.Label>Example value</TextField.Label>
          <TextField.Input />
        </TextField.Root>
        <Inline gap="compact">
          <Button type="button">Button</Button>
          <Button type="submit">Submit</Button>
        </Inline>
      </Stack>
    </form>
}`,...T.parameters?.docs?.source},description:{story:"Breeze deliberately supports only safe `button` and `submit` form behavior.\n\n@summary Constrained native button and submit form behaviours.",...T.parameters?.docs?.description}}};try{y.displayName=`Button`,y.__docgenInfo={description:`Performs an application action through pointer or keyboard activation.`,displayName:`Button`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{appearance:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:"Visual emphasis treatment. Defaults to `solid`.",name:`appearance`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`ButtonAppearance | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:`Button content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!0,tags:{},type:{name:`ReactNode`}},className:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:`Placement and composition classes.`,name:`className`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`string | undefined`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:"Prevents interaction. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:"Shows and announces an in-progress state while preventing activation. Defaults to `false`.",name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:`Called once when the user activates the button.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:`Ref to the rendered button.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`Ref<HTMLButtonElement> | undefined`}},size:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:"Canonical control size. Defaults to `md`.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`ControlSize | undefined`}},type:{defaultValue:{value:`button`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:"Constrained native form behavior: `button` or `submit`. Defaults to `button`.",name:`type`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`NativeButtonType | undefined`}},variant:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`}],description:"Semantic colour. Defaults to `primary`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonProps`},required:!1,tags:{},type:{name:`VisualVariant | undefined`}}},tags:{summary:`semantic action with accessible disabled and loading states`}}}catch{}try{b.displayName=`Activation`,b.__docgenInfo={description:"Activates a labelled button through the pointer and verifies `onAction` is\ncalled exactly once, documenting the component’s semantic callback contract.",displayName:`Activation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{summary:`Single semantic action callback on activation.`}}}catch{}try{x.displayName=`Variants`,x.__docgenInfo={description:`Crosses the solid, subtle, outline, and ghost appearances with every
semantic colour so meaning and visual emphasis can be evaluated
independently.`,displayName:`Variants`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{summary:`Complete button appearance and semantic-variant matrix.`}}}catch{}try{S.displayName=`SizesAndIcon`,S.__docgenInfo={description:"Places the decorative Add icon beside visible Create text at `sm`, `md`, and\n`lg`, showing canonical control sizing without making the icon the\naccessible name.",displayName:`SizesAndIcon`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{summary:`Button sizes with a decorative leading icon.`}}}catch{}try{C.displayName=`TextAction`,C.__docgenInfo={description:`Uses the text appearance for a low-emphasis Add category action that must
remain a button rather than being mistaken for navigation.`,displayName:`TextAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{summary:`Low-emphasis text action with visible icon and label.`}}}catch{}try{w.displayName=`States`,w.__docgenInfo={description:`Compares disabled and loading buttons, documenting that both prevent
activation while loading additionally exposes an announced busy state and
progress indicator.`,displayName:`States`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{summary:`Disabled and in-progress button states.`}}}catch{}try{T.displayName=`NativeFormBehaviors`,T.__docgenInfo={description:"Breeze deliberately supports only safe `button` and `submit` form behavior.",displayName:`NativeFormBehaviors`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{summary:`Constrained native button and submit form behaviours.`}}}catch{}E=[`Activation`,`Variants`,`SizesAndIcon`,`TextAction`,`States`,`NativeFormBehaviors`]}));D();export{b as Activation,T as NativeFormBehaviors,S as SizesAndIcon,w as States,C as TextAction,x as Variants,E as __namedExportsOrder,y as default,D as n,p as t};