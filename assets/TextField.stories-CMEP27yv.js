import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i}from"./iframe-CQHtwZcQ.js";import{n as a,t as o}from"./StoryConstraint-yY2orZcv.js";import{n as s,t as c}from"./Stack-CVdmyomW.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./TextField-Dwbgx1SD.js";var g=e({AnatomyAndUncontrolled:()=>w,ContentExtreme:()=>O,Controlled:()=>T,KeyboardAndNativeForm:()=>D,ReadOnlyAndStates:()=>E,__namedExportsOrder:()=>k,default:()=>C});function _(){let[e,t]=(0,v.useState)(`PROJECT-2026`);return(0,y.jsxs)(f.Root,{onChange:t,value:e,children:[(0,y.jsx)(f.Label,{children:`Project reference`}),(0,y.jsx)(f.Input,{}),(0,y.jsxs)(f.Description,{children:[`Current value: `,e]})]})}var v,y,b,x,S,C,w,T,E,D,O,k,A=t((()=>{v=n(r(),1),a(),s(),m(),y=i(),{expect:b,userEvent:x,within:S}=__STORYBOOK_MODULE_TEST__,C={component:l,decorators:[e=>(Object.assign(f.Description,{displayName:`TextField.Description`}),Object.assign(f.Error,{displayName:`TextField.Error`}),Object.assign(f.Input,{displayName:`TextField.Input`}),Object.assign(f.Label,{displayName:`TextField.Label`}),Object.assign(f.Root,{displayName:`TextField.Root`}),(0,y.jsx)(e,{}))],subcomponents:{Description:h,Error:d,Input:p,Label:u},title:`Fields/TextField`},w={args:{children:null},play:async({canvasElement:e})=>{let t=S(e).getByRole(`textbox`,{name:`Email address`});await x.type(t,`team@example.com`),await b(t).toHaveValue(`team@example.com`),await b(t).toHaveAccessibleDescription(`Used for workspace notices.`)},render:()=>(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(f.Label,{children:`Email address`}),(0,y.jsx)(f.Input,{name:`email`,placeholder:`team@example.com`,type:`email`}),(0,y.jsx)(f.Description,{children:`Used for workspace notices.`})]})},T={args:{children:null},render:()=>(0,y.jsx)(_,{})},E={args:{children:null},render:()=>(0,y.jsx)(o,{size:`bounded`,children:(0,y.jsxs)(c,{gap:`lg`,children:[(0,y.jsxs)(f.Root,{readOnly:!0,value:`Immutable value`,children:[(0,y.jsx)(f.Label,{children:`Read-only`}),(0,y.jsx)(f.Input,{})]}),(0,y.jsxs)(f.Root,{disabled:!0,defaultValue:`Unavailable`,children:[(0,y.jsx)(f.Label,{children:`Disabled`}),(0,y.jsx)(f.Input,{size:`sm`})]}),(0,y.jsxs)(f.Root,{invalid:!0,required:!0,children:[(0,y.jsx)(f.Label,{children:`Required reference`}),(0,y.jsx)(f.Input,{size:`lg`}),(0,y.jsx)(f.Error,{children:`Enter a reference.`})]})]})})},D={args:{children:null},play:async({canvasElement:e})=>{await x.tab(),await b(S(e).getByRole(`textbox`,{name:`Project code`})).toHaveFocus()},render:()=>(0,y.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,y.jsxs)(f.Root,{defaultValue:`BRZ-3`,required:!0,children:[(0,y.jsx)(f.Label,{children:`Project code`}),(0,y.jsx)(f.Input,{autoComplete:`off`,name:`projectCode`}),(0,y.jsx)(f.Description,{children:`Submitted through the native form.`})]})})},O={args:{children:null},render:()=>(0,y.jsx)(o,{size:`narrow-control`,children:(0,y.jsxs)(f.Root,{defaultValue:`A very long field value that remains usable in a constrained application column`,children:[(0,y.jsx)(f.Label,{children:`A persistent label with unusually detailed wording`}),(0,y.jsx)(f.Input,{}),(0,y.jsx)(f.Description,{children:`Long guidance wraps without changing the field's accessible relationships.`})]})})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Email address'
    });
    await userEvent.type(input, 'team@example.com');
    await expect(input).toHaveValue('team@example.com');
    await expect(input).toHaveAccessibleDescription('Used for workspace notices.');
  },
  render: () => <TextField.Root>
      <TextField.Label>Email address</TextField.Label>
      <TextField.Input name="email" placeholder="team@example.com" type="email" />
      <TextField.Description>Used for workspace notices.</TextField.Description>
    </TextField.Root>
}`,...w.parameters?.docs?.source},description:{story:`Composes the complete labelled field anatomy and verifies native typing plus
the accessible relationship to persistent supporting guidance.

@summary uncontrolled single-line entry with complete field anatomy`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <ControlledExample />
}`,...T.parameters?.docs?.source},description:{story:`Stores the text value in application state and mirrors each change through
associated description content without moving validation into Breeze.

@summary application-controlled text value with reflected guidance`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="bounded">
      <Stack gap="lg">
        <TextField.Root readOnly value="Immutable value">
          <TextField.Label>Read-only</TextField.Label>
          <TextField.Input />
        </TextField.Root>
        <TextField.Root disabled defaultValue="Unavailable">
          <TextField.Label>Disabled</TextField.Label>
          <TextField.Input size="sm" />
        </TextField.Root>
        <TextField.Root invalid required>
          <TextField.Label>Required reference</TextField.Label>
          <TextField.Input size="lg" />
          <TextField.Error>Enter a reference.</TextField.Error>
        </TextField.Root>
      </Stack>
    </StoryConstraint>
}`,...E.parameters?.docs?.source},description:{story:`Compares immutable, disabled, and required-invalid inputs across all control
sizes so consumers can distinguish their semantics and presentation.

@summary read-only disabled and invalid text-field states`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole('textbox', {
      name: 'Project code'
    })).toHaveFocus();
  },
  render: () => <form onSubmit={event => event.preventDefault()}>
      <TextField.Root defaultValue="BRZ-3" required>
        <TextField.Label>Project code</TextField.Label>
        <TextField.Input autoComplete="off" name="projectCode" />
        <TextField.Description>
          Submitted through the native form.
        </TextField.Description>
      </TextField.Root>
    </form>
}`,...D.parameters?.docs?.source},description:{story:`Verifies Tab reaches the labelled input while demonstrating a stable name,
required state, initial value, and native form participation.

@summary keyboard focus with native form field integration`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <TextField.Root defaultValue="A very long field value that remains usable in a constrained application column">
        <TextField.Label>
          A persistent label with unusually detailed wording
        </TextField.Label>
        <TextField.Input />
        <TextField.Description>
          Long guidance wraps without changing the field&apos;s accessible
          relationships.
        </TextField.Description>
      </TextField.Root>
    </StoryConstraint>
}`,...O.parameters?.docs?.source},description:{story:`Places unusually long label, value, and description content in a narrow
column to verify wrapping without breaking accessible relationships.

@summary long single-line field content in a narrow column`,...O.parameters?.docs?.description}}};try{C.displayName=`Root`,C.__docgenInfo={description:`Coordinates accessible text field state and compound anatomy.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextField/TextField.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:`Compound label, input, description, and error parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:"Prevents editing and focus. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:"Exposes invalid state to assistive technology and error styling. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:"Marks the field as required for native validation and assistive technology. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:`Ref to the rendered field container.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Current text value.
Current immutable text value.`,name:`value`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`string | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Called with the next text value.`,name:`onChange`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`((value: string) => void) | ((value: string) => void) | undefined`}},defaultValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Initial text value. Defaults to an empty string.`,name:`defaultValue`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`string | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Marks a controlled value as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{w.displayName=`AnatomyAndUncontrolled`,w.__docgenInfo={description:`Composes the complete labelled field anatomy and verifies native typing plus
the accessible relationship to persistent supporting guidance.`,displayName:`AnatomyAndUncontrolled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextField/TextField.stories.tsx`,methods:[],props:{},tags:{summary:`uncontrolled single-line entry with complete field anatomy`}}}catch{}try{T.displayName=`Controlled`,T.__docgenInfo={description:`Stores the text value in application state and mirrors each change through
associated description content without moving validation into Breeze.`,displayName:`Controlled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextField/TextField.stories.tsx`,methods:[],props:{},tags:{summary:`application-controlled text value with reflected guidance`}}}catch{}try{E.displayName=`ReadOnlyAndStates`,E.__docgenInfo={description:`Compares immutable, disabled, and required-invalid inputs across all control
sizes so consumers can distinguish their semantics and presentation.`,displayName:`ReadOnlyAndStates`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextField/TextField.stories.tsx`,methods:[],props:{},tags:{summary:`read-only disabled and invalid text-field states`}}}catch{}try{D.displayName=`KeyboardAndNativeForm`,D.__docgenInfo={description:`Verifies Tab reaches the labelled input while demonstrating a stable name,
required state, initial value, and native form participation.`,displayName:`KeyboardAndNativeForm`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextField/TextField.stories.tsx`,methods:[],props:{},tags:{summary:`keyboard focus with native form field integration`}}}catch{}try{O.displayName=`ContentExtreme`,O.__docgenInfo={description:`Places unusually long label, value, and description content in a narrow
column to verify wrapping without breaking accessible relationships.`,displayName:`ContentExtreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextField/TextField.stories.tsx`,methods:[],props:{},tags:{summary:`long single-line field content in a narrow column`}}}catch{}k=[`AnatomyAndUncontrolled`,`Controlled`,`ReadOnlyAndStates`,`KeyboardAndNativeForm`,`ContentExtreme`]}));A();export{w as AnatomyAndUncontrolled,O as ContentExtreme,T as Controlled,D as KeyboardAndNativeForm,E as ReadOnlyAndStates,k as __namedExportsOrder,C as default,A as n,g as t};