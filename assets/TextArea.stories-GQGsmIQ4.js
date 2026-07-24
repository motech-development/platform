import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{n as i,t as a}from"./dist-ByKaD744.js";import{a as o,i as s}from"./BreezeContext-BIB7r8Lx.js";import{t as c}from"./jsx-runtime-cM__dR4X.js";import{n as l,t as u}from"./StoryConstraint-DtKI6sgB.js";import{n as d,t as f}from"./Stack-0pHCj1U7.js";import{a as p,d as m,i as h,m as g,n as _,o as v,s as y,t as b}from"./TextField-DUkhVOns.js";function x({className:e,ref:t,size:n,...r}){let i=o(t);return(0,S.createElement)(g,{...r,className:C({class:e,size:n}),ref:i})}var S,C,w,T=t((()=>{S=e(r(),1),m(),a(),s(),y(),C=i({base:`block w-full resize-y border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)] transition-colors duration-[var(--breeze-duration-fast)] placeholder:text-[var(--breeze-ink-muted)] disabled:cursor-not-allowed disabled:bg-[var(--breeze-surface-subtle)] disabled:opacity-70 aria-invalid:border-[var(--breeze-danger)]`,defaultVariants:{size:`md`},variants:{size:{lg:`min-h-32 px-4 py-3 text-base`,md:`min-h-24 px-3 py-2 text-sm`,sm:`min-h-20 px-2.5 py-1.5 text-xs`}}}),w={Control:x,Description:v.Description,Error:v.Error,Label:v.Label,Root:v.Root};try{x.displayName=`Control`,x.__docgenInfo={description:`Renders the editable native multiline control for a TextArea.`,displayName:`Control`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.tsx`,methods:[],props:{className:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextArea/TextArea.tsx`,name:`TextAreaControlProps`}],description:`Placement and composition classes.`,name:`className`,parent:{fileName:`breeze-ui/src/primitives/TextArea/TextArea.tsx`,name:`TextAreaControlProps`},required:!1,tags:{},type:{name:`string | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextArea/TextArea.tsx`,name:`TextAreaControlProps`}],description:`Ref to the rendered textarea.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/TextArea/TextArea.tsx`,name:`TextAreaControlProps`},required:!1,tags:{},type:{name:`Ref<HTMLTextAreaElement> | undefined`}},size:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextArea/TextArea.tsx`,name:`TextAreaControlProps`}],description:"Canonical control size. Defaults to `md`.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/TextArea/TextArea.tsx`,name:`TextAreaControlProps`},required:!1,tags:{},type:{name:`ControlSize | undefined`}}},tags:{}}}catch{}try{w.displayName=`TextArea`,w.__docgenInfo={description:`Accessible compound multiline text-entry primitive.`,displayName:`TextArea`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.tsx`,methods:[],props:{},tags:{summary:`labelled multiline text entry with validation anatomy`}}}catch{}})),E=n({AnatomyAndUncontrolled:()=>P,ContentExtreme:()=>R,Controlled:()=>F,KeyboardAndA11y:()=>L,ReadOnlyAndStates:()=>I,__namedExportsOrder:()=>z,default:()=>N});function D(){let[e,t]=(0,O.useState)(`Opening line`);return(0,k.jsxs)(w.Root,{onChange:t,value:e,children:[(0,k.jsx)(w.Label,{children:`Controlled notes`}),(0,k.jsx)(w.Control,{rows:5}),(0,k.jsxs)(w.Description,{children:[e.length,` characters`]})]})}var O,k,A,j,M,N,P,F,I,L,R,z,B=t((()=>{O=e(r(),1),l(),d(),y(),T(),k=c(),{expect:A,userEvent:j,within:M}=__STORYBOOK_MODULE_TEST__,N={component:p,decorators:[e=>(Object.assign(w.Control,{displayName:`TextArea.Control`}),Object.assign(w.Description,{displayName:`TextArea.Description`}),Object.assign(w.Error,{displayName:`TextArea.Error`}),Object.assign(w.Label,{displayName:`TextArea.Label`}),Object.assign(w.Root,{displayName:`TextArea.Root`}),(0,k.jsx)(e,{}))],subcomponents:{Control:x,Description:b,Error:_,Label:h},title:`Fields/TextArea`},P={args:{children:null},play:async({canvasElement:e})=>{let t=M(e).getByRole(`textbox`,{name:`Notes`});await j.type(t,`Line one{enter}Line two`),await A(t).toHaveValue(`Line one
Line two`)},render:()=>(0,k.jsxs)(w.Root,{children:[(0,k.jsx)(w.Label,{children:`Notes`}),(0,k.jsx)(w.Control,{name:`notes`,placeholder:`Add context`,rows:5}),(0,k.jsx)(w.Description,{children:`Use plain text.`})]})},F={args:{children:null},render:()=>(0,k.jsx)(D,{})},I={args:{children:null},render:()=>(0,k.jsx)(u,{size:`bounded`,children:(0,k.jsxs)(f,{gap:`lg`,children:[(0,k.jsxs)(w.Root,{readOnly:!0,value:`Archived content`,children:[(0,k.jsx)(w.Label,{children:`Read-only`}),(0,k.jsx)(w.Control,{})]}),(0,k.jsxs)(w.Root,{disabled:!0,defaultValue:`Unavailable`,children:[(0,k.jsx)(w.Label,{children:`Disabled`}),(0,k.jsx)(w.Control,{size:`sm`})]}),(0,k.jsxs)(w.Root,{invalid:!0,required:!0,children:[(0,k.jsx)(w.Label,{children:`Required summary`}),(0,k.jsx)(w.Control,{size:`lg`}),(0,k.jsx)(w.Error,{children:`Enter a summary.`})]})]})})},L={args:{children:null},play:async({canvasElement:e})=>{await j.tab(),await A(M(e).getByRole(`textbox`,{name:`Keyboard notes`})).toHaveFocus()},render:()=>(0,k.jsxs)(w.Root,{children:[(0,k.jsx)(w.Label,{children:`Keyboard notes`}),(0,k.jsx)(w.Control,{}),(0,k.jsx)(w.Description,{children:`Tab enters and leaves the control; Enter inserts a new line.`})]})},R={args:{children:null},render:()=>(0,k.jsx)(u,{size:`narrow-control`,children:(0,k.jsxs)(w.Root,{defaultValue:`A long paragraph demonstrates wrapping. `.repeat(12),children:[(0,k.jsx)(w.Label,{children:`A detailed multiline content label`}),(0,k.jsx)(w.Control,{rows:10}),(0,k.jsx)(w.Description,{children:`Long content remains scrollable and the control remains resizable.`})]})})},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const control = within(canvasElement).getByRole('textbox', {
      name: 'Notes'
    });
    await userEvent.type(control, 'Line one{enter}Line two');
    await expect(control).toHaveValue('Line one\\nLine two');
  },
  render: () => <TextArea.Root>
      <TextArea.Label>Notes</TextArea.Label>
      <TextArea.Control name="notes" placeholder="Add context" rows={5} />
      <TextArea.Description>Use plain text.</TextArea.Description>
    </TextArea.Root>
}`,...P.parameters?.docs?.source},description:{story:`Composes the full labelled multiline anatomy and verifies native typing plus
line breaks in an internally managed textarea value.

@summary uncontrolled multiline entry with complete field anatomy`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <ControlledExample />
}`,...F.parameters?.docs?.source},description:{story:`Stores multiline content in application state and reflects the current
character count through associated supporting guidance.

@summary application-controlled multiline value and character count`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="bounded">
      <Stack gap="lg">
        <TextArea.Root readOnly value="Archived content">
          <TextArea.Label>Read-only</TextArea.Label>
          <TextArea.Control />
        </TextArea.Root>
        <TextArea.Root disabled defaultValue="Unavailable">
          <TextArea.Label>Disabled</TextArea.Label>
          <TextArea.Control size="sm" />
        </TextArea.Root>
        <TextArea.Root invalid required>
          <TextArea.Label>Required summary</TextArea.Label>
          <TextArea.Control size="lg" />
          <TextArea.Error>Enter a summary.</TextArea.Error>
        </TextArea.Root>
      </Stack>
    </StoryConstraint>
}`,...I.parameters?.docs?.source},description:{story:`Compares immutable, disabled, and required-invalid textareas across the
supported control sizes so their distinct semantics remain visible.

@summary read-only disabled and invalid multiline field states`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole('textbox', {
      name: 'Keyboard notes'
    })).toHaveFocus();
  },
  render: () => <TextArea.Root>
      <TextArea.Label>Keyboard notes</TextArea.Label>
      <TextArea.Control />
      <TextArea.Description>
        Tab enters and leaves the control; Enter inserts a new line.
      </TextArea.Description>
    </TextArea.Root>
}`,...L.parameters?.docs?.source},description:{story:`Verifies Tab reaches the labelled textarea while documenting that native
Enter and text-editing behavior remain available inside the control.

@summary keyboard focus and native multiline editing behavior`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <TextArea.Root defaultValue={'A long paragraph demonstrates wrapping. '.repeat(12)}>
        <TextArea.Label>A detailed multiline content label</TextArea.Label>
        <TextArea.Control rows={10} />
        <TextArea.Description>
          Long content remains scrollable and the control remains resizable.
        </TextArea.Description>
      </TextArea.Root>
    </StoryConstraint>
}`,...R.parameters?.docs?.source},description:{story:`Places a long wrapping value, label, and description in a narrow host to
demonstrate scrolling and user-controlled vertical resizing.

@summary long multiline content constrained to a narrow field`,...R.parameters?.docs?.description}}};try{N.displayName=`Root`,N.__docgenInfo={description:`Coordinates accessible text field state and compound anatomy.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:`Compound label, input, description, and error parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:"Prevents editing and focus. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:"Exposes invalid state to assistive technology and error styling. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:"Marks the field as required for native validation and assistive technology. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`}],description:`Ref to the rendered field container.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`TextFieldRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Current text value.
Current immutable text value.`,name:`value`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`string | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Called with the next text value.`,name:`onChange`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`((value: string) => void) | ((value: string) => void) | undefined`}},defaultValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Initial text value. Defaults to an empty string.`,name:`defaultValue`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`string | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ReadOnlyTextFieldRootProps`},{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`UncontrolledTextFieldRootProps`}],description:`Marks a controlled value as intentionally immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/TextField/TextField.tsx`,name:`ControlledTextFieldRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{P.displayName=`AnatomyAndUncontrolled`,P.__docgenInfo={description:`Composes the full labelled multiline anatomy and verifies native typing plus
line breaks in an internally managed textarea value.`,displayName:`AnatomyAndUncontrolled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.stories.tsx`,methods:[],props:{},tags:{summary:`uncontrolled multiline entry with complete field anatomy`}}}catch{}try{F.displayName=`Controlled`,F.__docgenInfo={description:`Stores multiline content in application state and reflects the current
character count through associated supporting guidance.`,displayName:`Controlled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.stories.tsx`,methods:[],props:{},tags:{summary:`application-controlled multiline value and character count`}}}catch{}try{I.displayName=`ReadOnlyAndStates`,I.__docgenInfo={description:`Compares immutable, disabled, and required-invalid textareas across the
supported control sizes so their distinct semantics remain visible.`,displayName:`ReadOnlyAndStates`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.stories.tsx`,methods:[],props:{},tags:{summary:`read-only disabled and invalid multiline field states`}}}catch{}try{L.displayName=`KeyboardAndA11y`,L.__docgenInfo={description:`Verifies Tab reaches the labelled textarea while documenting that native
Enter and text-editing behavior remain available inside the control.`,displayName:`KeyboardAndA11y`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.stories.tsx`,methods:[],props:{},tags:{summary:`keyboard focus and native multiline editing behavior`}}}catch{}try{R.displayName=`ContentExtreme`,R.__docgenInfo={description:`Places a long wrapping value, label, and description in a narrow host to
demonstrate scrolling and user-controlled vertical resizing.`,displayName:`ContentExtreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TextArea/TextArea.stories.tsx`,methods:[],props:{},tags:{summary:`long multiline content constrained to a narrow field`}}}catch{}z=[`AnatomyAndUncontrolled`,`Controlled`,`ReadOnlyAndStates`,`KeyboardAndA11y`,`ContentExtreme`]}));B();export{P as AnatomyAndUncontrolled,R as ContentExtreme,F as Controlled,L as KeyboardAndA11y,I as ReadOnlyAndStates,z as __namedExportsOrder,N as default,B as n,E as t};