import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i}from"./iframe-i3W5vvo3.js";import{n as a,t as o}from"./StoryConstraint-BuP2E5WZ.js";import{n as s,t as c}from"./Stack-DA68Fogw.js";import{n as l,s as u,t as d}from"./TextField-hx04eKQC.js";import{a as f,i as p,n as m,o as h,r as g,t as _}from"./Checkbox-C5ouD05s.js";var v=e({AnatomyAndUncontrolled:()=>D,ContentExtreme:()=>j,Controlled:()=>O,NativeForm:()=>A,ReadOnlyAndStates:()=>k,__namedExportsOrder:()=>M,default:()=>E});function y({label:e,size:t}){return(0,S.jsxs)(_.Control,{children:[(0,S.jsx)(_.Indicator,{size:t}),(0,S.jsx)(_.Label,{children:e})]})}function b(){let[e,t]=(0,x.useState)(!0);return(0,S.jsxs)(_.Root,{onChange:t,selected:e,children:[(0,S.jsx)(y,{label:`Controlled preference`}),(0,S.jsx)(_.Description,{children:e?`Enabled`:`Disabled`})]})}var x,S,C,w,T,E,D,O,k,A,j,M,N=t((()=>{x=n(r(),1),a(),s(),u(),h(),S=i(),{expect:C,userEvent:w,within:T}=__STORYBOOK_MODULE_TEST__,E={component:f,decorators:[e=>(Object.assign(_.Control,{displayName:`Checkbox.Control`}),Object.assign(_.Description,{displayName:`Checkbox.Description`}),Object.assign(_.Error,{displayName:`Checkbox.Error`}),Object.assign(_.Indicator,{displayName:`Checkbox.Indicator`}),Object.assign(_.Label,{displayName:`Checkbox.Label`}),Object.assign(_.Root,{displayName:`Checkbox.Root`}),(0,S.jsx)(e,{}))],subcomponents:{Control:m,Description:d,Error:l,Indicator:g,Label:p},title:`Selection/Checkbox`},D={args:{children:null},play:async({canvasElement:e})=>{let t=T(e).getByRole(`checkbox`,{name:`Email notifications`});t.focus(),await w.keyboard(` `),await C(t).toBeChecked(),await C(t).toHaveAccessibleDescription(`Receive weekly updates.`)},render:()=>(0,S.jsxs)(_.Root,{name:`notifications`,value:`email`,children:[(0,S.jsxs)(_.Control,{children:[(0,S.jsx)(_.Indicator,{}),(0,S.jsx)(_.Label,{children:`Email notifications`})]}),(0,S.jsx)(_.Description,{children:`Receive weekly updates.`})]})},O={args:{children:null},render:()=>(0,S.jsx)(b,{})},k={args:{children:null},render:()=>(0,S.jsxs)(c,{gap:`compact`,children:[(0,S.jsx)(_.Root,{readOnly:!0,selected:!0,children:(0,S.jsx)(y,{label:`Read-only selected`})}),(0,S.jsx)(_.Root,{disabled:!0,defaultSelected:!0,children:(0,S.jsx)(y,{label:`Disabled`,size:`sm`})}),(0,S.jsx)(_.Root,{indeterminate:!0,children:(0,S.jsx)(y,{label:`Indeterminate`})}),(0,S.jsxs)(_.Root,{invalid:!0,required:!0,children:[(0,S.jsx)(y,{label:`Required confirmation`,size:`lg`}),(0,S.jsx)(_.Error,{children:`Confirm before continuing.`})]})]})},A={args:{children:null},render:()=>(0,S.jsx)(`form`,{id:`settings`,onSubmit:e=>e.preventDefault(),children:(0,S.jsx)(_.Root,{defaultSelected:!0,form:`settings`,name:`updates`,value:`enabled`,children:(0,S.jsx)(y,{label:`Product updates`})})})},j={args:{children:null},render:()=>(0,S.jsx)(o,{size:`narrow-control`,children:(0,S.jsxs)(_.Root,{children:[(0,S.jsx)(y,{label:`A long persistent checkbox label that wraps across several lines without shrinking the interaction target`}),(0,S.jsx)(_.Description,{children:`Detailed guidance remains associated while wrapping in a constrained column.`})]})})},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Email notifications'
    });
    checkbox.focus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveAccessibleDescription('Receive weekly updates.');
  },
  render: () => <Checkbox.Root name="notifications" value="email">
      <Checkbox.Control>
        <Checkbox.Indicator />
        <Checkbox.Label>Email notifications</Checkbox.Label>
      </Checkbox.Control>
      <Checkbox.Description>Receive weekly updates.</Checkbox.Description>
    </Checkbox.Root>
}`,...D.parameters?.docs?.source},description:{story:`Composes every ordinary checkbox part, then uses Space to select the
uncontrolled native input and verifies its persistent description remains
programmatically associated.

@summary Uncontrolled checkbox anatomy with Space activation.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <ControlledExample />
}`,...O.parameters?.docs?.source},description:{story:`Keeps \`selected\` in application state and reflects the current Boolean value
in associated guidance, demonstrating the mutable controlled checkbox
contract.

@summary Application-controlled Boolean selection and status text.`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Stack gap="compact">
      <Checkbox.Root readOnly selected>
        <CheckboxControl label="Read-only selected" />
      </Checkbox.Root>
      <Checkbox.Root disabled defaultSelected>
        <CheckboxControl label="Disabled" size="sm" />
      </Checkbox.Root>
      <Checkbox.Root indeterminate>
        <CheckboxControl label="Indeterminate" />
      </Checkbox.Root>
      <Checkbox.Root invalid required>
        <CheckboxControl label="Required confirmation" size="lg" />
        <Checkbox.Error>Confirm before continuing.</Checkbox.Error>
      </Checkbox.Root>
    </Stack>
}`,...k.parameters?.docs?.source},description:{story:`Compares immutable selected, disabled, indeterminate, and required invalid
checkboxes while varying indicator size only where the supported visual
state calls for it.

@summary Read-only, disabled, mixed, and invalid checkbox states.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <form id="settings" onSubmit={event => event.preventDefault()}>
      <Checkbox.Root defaultSelected form="settings" name="updates" value="enabled">
        <CheckboxControl label="Product updates" />
      </Checkbox.Root>
    </form>
}`,...A.parameters?.docs?.source},description:{story:`Supplies form, name, and submitted value to the hidden native checkbox,
documenting how an initially selected Breeze checkbox participates in
browser form data.

@summary Selected checkbox with explicit native form metadata.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <Checkbox.Root>
        <CheckboxControl label="A long persistent checkbox label that wraps across several lines without shrinking the interaction target" />
        <Checkbox.Description>
          Detailed guidance remains associated while wrapping in a constrained
          column.
        </Checkbox.Description>
      </Checkbox.Root>
    </StoryConstraint>
}`,...j.parameters?.docs?.source},description:{story:`Constrains a long label and description to a narrow column, showing that
copy wraps while the checkbox target and accessible description remain
intact.

@summary Long checkbox copy in a constrained column.`,...j.parameters?.docs?.description}}};try{E.displayName=`Root`,E.__docgenInfo={description:`Coordinates accessible checkbox state, validation, and native form participation.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Checkbox/Checkbox.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:`Compound control, description, and error parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:"Prevents focus and selection changes. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},form:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:`Associates the hidden native checkbox with an external form.`,name:`form`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`string | undefined`}},indeterminate:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:"Renders a mixed-state checkbox. Defaults to `false`.",name:`indeterminate`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:"Exposes invalid state to assistive technology and error styling. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:`Native form field name.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`string | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:"Marks the checkbox as required. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:`Ref to the rendered field container.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},inputRef:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:`Ref to the hidden native checkbox used for focus and form integration.`,name:`inputRef`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`RefObject<HTMLInputElement | null> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`}],description:"Native submitted value when selected. Defaults to `on`.",name:`value`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`CheckboxRootSharedProps`},required:!1,tags:{},type:{name:`string | undefined`}},selected:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ReadOnlyCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`UncontrolledCheckboxRootProps`}],description:`Current selected state.
Current immutable selected state.`,name:`selected`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ReadOnlyCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`UncontrolledCheckboxRootProps`}],description:`Called with the next selected state.`,name:`onChange`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},required:!1,tags:{},type:{name:`((selected: boolean) => void) | ((selected: boolean) => void) | undefined`}},defaultSelected:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ReadOnlyCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`UncontrolledCheckboxRootProps`}],description:"Initial selected state. Defaults to `false`.",name:`defaultSelected`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ReadOnlyCheckboxRootProps`},{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`UncontrolledCheckboxRootProps`}],description:`Marks a controlled selection as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Checkbox/Checkbox.tsx`,name:`ControlledCheckboxRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{D.displayName=`AnatomyAndUncontrolled`,D.__docgenInfo={description:`Composes every ordinary checkbox part, then uses Space to select the
uncontrolled native input and verifies its persistent description remains
programmatically associated.`,displayName:`AnatomyAndUncontrolled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Checkbox/Checkbox.stories.tsx`,methods:[],props:{},tags:{summary:`Uncontrolled checkbox anatomy with Space activation.`}}}catch{}try{O.displayName=`Controlled`,O.__docgenInfo={description:`Keeps \`selected\` in application state and reflects the current Boolean value
in associated guidance, demonstrating the mutable controlled checkbox
contract.`,displayName:`Controlled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Checkbox/Checkbox.stories.tsx`,methods:[],props:{},tags:{summary:`Application-controlled Boolean selection and status text.`}}}catch{}try{k.displayName=`ReadOnlyAndStates`,k.__docgenInfo={description:`Compares immutable selected, disabled, indeterminate, and required invalid
checkboxes while varying indicator size only where the supported visual
state calls for it.`,displayName:`ReadOnlyAndStates`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Checkbox/Checkbox.stories.tsx`,methods:[],props:{},tags:{summary:`Read-only, disabled, mixed, and invalid checkbox states.`}}}catch{}try{A.displayName=`NativeForm`,A.__docgenInfo={description:`Supplies form, name, and submitted value to the hidden native checkbox,
documenting how an initially selected Breeze checkbox participates in
browser form data.`,displayName:`NativeForm`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Checkbox/Checkbox.stories.tsx`,methods:[],props:{},tags:{summary:`Selected checkbox with explicit native form metadata.`}}}catch{}try{j.displayName=`ContentExtreme`,j.__docgenInfo={description:`Constrains a long label and description to a narrow column, showing that
copy wraps while the checkbox target and accessible description remain
intact.`,displayName:`ContentExtreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Checkbox/Checkbox.stories.tsx`,methods:[],props:{},tags:{summary:`Long checkbox copy in a constrained column.`}}}catch{}M=[`AnatomyAndUncontrolled`,`Controlled`,`ReadOnlyAndStates`,`NativeForm`,`ContentExtreme`]}));N();export{D as AnatomyAndUncontrolled,j as ContentExtreme,O as Controlled,A as NativeForm,k as ReadOnlyAndStates,M as __namedExportsOrder,E as default,N as n,v as t};