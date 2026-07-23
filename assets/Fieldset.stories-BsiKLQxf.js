import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{c as i,d as a,f as o,l as s,p as c,r as l,u}from"./iframe-CQHtwZcQ.js";import{n as d,t as f}from"./StoryConstraint-yY2orZcv.js";import{o as p,s as m}from"./TextField-Dwbgx1SD.js";function h(){let e=(0,b.useContext)(T);if(e===null)throw new globalThis.Error(`Fieldset parts must be rendered within Fieldset.Root.`);return e}function g({"aria-describedby":e,children:t,className:n,invalid:r=!1,ref:i,...o}){s();let c=(0,b.useId)(),l=`${c}-description`,u=`${c}-error`,d=a(i),f=(0,b.useMemo)(()=>({descriptionId:l,errorId:u}),[l,u]),p=[e,l,r?u:void 0].filter(Boolean).join(` `);return(0,b.createElement)(T.Provider,{value:f},(0,b.createElement)(`fieldset`,{...o,"aria-describedby":p,"aria-invalid":r||void 0,className:x({class:n}),ref:d},t))}function _({className:e,ref:t,...n}){let r=a(t);return(0,b.createElement)(`legend`,{...n,className:S({class:e}),ref:r})}function v({className:e,ref:t,...n}){let{descriptionId:r}=h(),i=a(t);return(0,b.createElement)(`p`,{...n,className:C({class:e}),id:r,ref:i})}function y({className:e,ref:t,...n}){let{errorId:r}=h(),i=a(t);return(0,b.createElement)(`p`,{...n,className:w({class:e}),id:r,ref:i})}var b,x,S,C,w,T,E,D=t((()=>{b=n(r(),1),o(),u(),i(),x=c({base:`m-0 flex min-w-0 flex-col gap-3 border-0 p-0 disabled:opacity-70`}),S=c({base:`mb-1 p-0 font-[family-name:var(--breeze-font-display)] text-base font-bold text-[var(--breeze-ink)]`}),C=c({base:`text-sm text-[var(--breeze-ink-soft)]`}),w=c({base:`text-sm font-medium text-[var(--breeze-danger)]`}),T=(0,b.createContext)(null),E={Description:v,Error:y,Legend:_,Root:g};try{g.displayName=`Root`,g.__docgenInfo={description:`Renders a native form-control group with associated compound guidance.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`}],description:`Legend, description, error, and related controls.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`},required:!0,tags:{},type:{name:`ReactNode`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`}],description:"Exposes invalid group state to assistive technology and error association. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`}],description:`Ref to the rendered fieldset.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`},required:!1,tags:{},type:{name:`Ref<HTMLFieldSetElement> | undefined`}}},tags:{}}}catch{}try{_.displayName=`Legend`,_.__docgenInfo={description:`Renders the native accessible name for a Fieldset.`,displayName:`Legend`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetLegendProps`}],description:`Persistent group name.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetLegendProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetLegendProps`}],description:`Ref to the rendered legend.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetLegendProps`},required:!1,tags:{},type:{name:`Ref<HTMLLegendElement> | undefined`}}},tags:{}}}catch{}try{v.displayName=`Description`,v.__docgenInfo={description:`Renders supporting guidance associated with a Fieldset.`,displayName:`Description`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetDescriptionProps`}],description:`Supporting guidance for the control group.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetDescriptionProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetDescriptionProps`}],description:`Ref to the rendered description.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetDescriptionProps`},required:!1,tags:{},type:{name:`Ref<HTMLParagraphElement> | undefined`}}},tags:{}}}catch{}try{y.displayName=`ErrorMessage`,y.__docgenInfo={description:`Renders a validation message associated with an invalid Fieldset.`,displayName:`ErrorMessage`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetErrorProps`}],description:`Validation message for the control group.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetErrorProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetErrorProps`}],description:`Ref to the rendered error message.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetErrorProps`},required:!1,tags:{},type:{name:`Ref<HTMLParagraphElement> | undefined`}}},tags:{}}}catch{}try{E.displayName=`Fieldset`,E.__docgenInfo={description:`Groups related form controls with native fieldset and legend semantics plus
associated guidance and group-level validation feedback.`,displayName:`Fieldset`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,methods:[],props:{},tags:{summary:`native form-control group with accessible compound guidance`}}}catch{}})),O=e({AnatomyAndKeyboard:()=>F,ContentExtreme:()=>z,Disabled:()=>L,Invalid:()=>I,NativeFormParticipation:()=>R,__namedExportsOrder:()=>B,default:()=>P});function k(){return(0,A.jsxs)(A.Fragment,{children:[(0,A.jsxs)(p.Root,{children:[(0,A.jsx)(p.Label,{children:`Email`}),(0,A.jsx)(p.Input,{name:`email`})]}),(0,A.jsxs)(p.Root,{children:[(0,A.jsx)(p.Label,{children:`Telephone`}),(0,A.jsx)(p.Input,{name:`telephone`,type:`tel`})]})]})}var A,j,M,N,P,F,I,L,R,z,B,V=t((()=>{d(),m(),D(),A=l(),{expect:j,userEvent:M,within:N}=__STORYBOOK_MODULE_TEST__,P={component:g,decorators:[e=>(Object.assign(E.Description,{displayName:`Fieldset.Description`}),Object.assign(E.Error,{displayName:`Fieldset.Error`}),Object.assign(E.Legend,{displayName:`Fieldset.Legend`}),Object.assign(E.Root,{displayName:`Fieldset.Root`}),(0,A.jsx)(e,{}))],subcomponents:{Description:v,Error:y,Legend:_},title:`Fields/Fieldset`},F={args:{children:null},play:async({canvasElement:e})=>{let t=N(e);await j(t.getByRole(`group`,{name:`Contact details`})).toHaveAccessibleDescription(`Provide at least one contact method.`),await M.tab(),await j(t.getByRole(`textbox`,{name:`Email`})).toHaveFocus()},render:()=>(0,A.jsxs)(E.Root,{children:[(0,A.jsx)(E.Legend,{children:`Contact details`}),(0,A.jsx)(E.Description,{children:`Provide at least one contact method.`}),(0,A.jsxs)(p.Root,{children:[(0,A.jsx)(p.Label,{children:`Email`}),(0,A.jsx)(p.Input,{name:`email`})]}),(0,A.jsxs)(p.Root,{children:[(0,A.jsx)(p.Label,{children:`Telephone`}),(0,A.jsx)(p.Input,{name:`telephone`,type:`tel`})]})]})},I={args:{children:null},render:()=>(0,A.jsxs)(E.Root,{invalid:!0,children:[(0,A.jsx)(E.Legend,{children:`Notification details`}),(0,A.jsx)(E.Description,{children:`Supply one route.`}),(0,A.jsx)(k,{}),(0,A.jsx)(E.Error,{children:`A contact route is required.`})]})},L={args:{children:null},render:()=>(0,A.jsxs)(E.Root,{disabled:!0,children:[(0,A.jsx)(E.Legend,{children:`Archived details`}),(0,A.jsx)(E.Description,{children:`This native fieldset disables all descendant controls.`}),(0,A.jsx)(k,{})]})},R={args:{children:null},render:()=>(0,A.jsx)(`form`,{onSubmit:e=>e.preventDefault(),children:(0,A.jsxs)(E.Root,{name:`contact`,children:[(0,A.jsx)(E.Legend,{children:`Form fields`}),(0,A.jsx)(k,{})]})})},z={args:{children:null},render:()=>(0,A.jsx)(f,{size:`narrow-control`,children:(0,A.jsxs)(E.Root,{children:[(0,A.jsx)(E.Legend,{children:`A long legend describing a tightly constrained group of related controls`}),(0,A.jsx)(E.Description,{children:`Long explanatory content wraps while retaining one group-level accessible description.`}),(0,A.jsx)(k,{})]})})},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', {
      name: 'Contact details'
    })).toHaveAccessibleDescription('Provide at least one contact method.');
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', {
      name: 'Email'
    })).toHaveFocus();
  },
  render: () => <Fieldset.Root>
      <Fieldset.Legend>Contact details</Fieldset.Legend>
      <Fieldset.Description>
        Provide at least one contact method.
      </Fieldset.Description>
      <TextField.Root>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input name="email" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Label>Telephone</TextField.Label>
        <TextField.Input name="telephone" type="tel" />
      </TextField.Root>
    </Fieldset.Root>
}`,...F.parameters?.docs?.source},description:{story:`Associates a native legend and description with two related controls and
verifies that Tab follows the form controls' document order.

@summary labelled fieldset anatomy and native keyboard order`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Fieldset.Root invalid>
      <Fieldset.Legend>Notification details</Fieldset.Legend>
      <Fieldset.Description>Supply one route.</Fieldset.Description>
      <ContactFields />
      <Fieldset.Error>A contact route is required.</Fieldset.Error>
    </Fieldset.Root>
}`,...I.parameters?.docs?.source},description:{story:`Exposes group-level invalid state and associates a persistent validation
message with the fieldset alongside its supporting description.

@summary invalid fieldset with associated error feedback`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Fieldset.Root disabled>
      <Fieldset.Legend>Archived details</Fieldset.Legend>
      <Fieldset.Description>
        This native fieldset disables all descendant controls.
      </Fieldset.Description>
      <ContactFields />
    </Fieldset.Root>
}`,...L.parameters?.docs?.source},description:{story:`Uses native fieldset disabling to prevent interaction with every descendant
form control while preserving group context and guidance.

@summary native disabling of all descendant controls`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <form onSubmit={event => event.preventDefault()}>
      <Fieldset.Root name="contact">
        <Fieldset.Legend>Form fields</Fieldset.Legend>
        <ContactFields />
      </Fieldset.Root>
    </form>
}`,...R.parameters?.docs?.source},description:{story:`Places the fieldset and named descendant inputs inside a native form without
taking ownership of submission or application validation.

@summary native form composition for grouped fields`,...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <Fieldset.Root>
        <Fieldset.Legend>
          A long legend describing a tightly constrained group of related
          controls
        </Fieldset.Legend>
        <Fieldset.Description>
          Long explanatory content wraps while retaining one group-level
          accessible description.
        </Fieldset.Description>
        <ContactFields />
      </Fieldset.Root>
    </StoryConstraint>
}`,...z.parameters?.docs?.source},description:{story:`Constrains a long legend and description to a narrow host to demonstrate
wrapping without losing the fieldset's accessible relationships.

@summary long fieldset content in a narrow layout`,...z.parameters?.docs?.description}}};try{P.displayName=`Root`,P.__docgenInfo={description:`Renders a native form-control group with associated compound guidance.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`}],description:`Legend, description, error, and related controls.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`},required:!0,tags:{},type:{name:`ReactNode`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`}],description:"Exposes invalid group state to assistive technology and error association. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`}],description:`Ref to the rendered fieldset.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Fieldset/Fieldset.tsx`,name:`FieldsetRootProps`},required:!1,tags:{},type:{name:`Ref<HTMLFieldSetElement> | undefined`}}},tags:{}}}catch{}try{F.displayName=`AnatomyAndKeyboard`,F.__docgenInfo={description:`Associates a native legend and description with two related controls and
verifies that Tab follows the form controls' document order.`,displayName:`AnatomyAndKeyboard`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.stories.tsx`,methods:[],props:{},tags:{summary:`labelled fieldset anatomy and native keyboard order`}}}catch{}try{I.displayName=`Invalid`,I.__docgenInfo={description:`Exposes group-level invalid state and associates a persistent validation
message with the fieldset alongside its supporting description.`,displayName:`Invalid`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.stories.tsx`,methods:[],props:{},tags:{summary:`invalid fieldset with associated error feedback`}}}catch{}try{L.displayName=`Disabled`,L.__docgenInfo={description:`Uses native fieldset disabling to prevent interaction with every descendant
form control while preserving group context and guidance.`,displayName:`Disabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.stories.tsx`,methods:[],props:{},tags:{summary:`native disabling of all descendant controls`}}}catch{}try{R.displayName=`NativeFormParticipation`,R.__docgenInfo={description:`Places the fieldset and named descendant inputs inside a native form without
taking ownership of submission or application validation.`,displayName:`NativeFormParticipation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.stories.tsx`,methods:[],props:{},tags:{summary:`native form composition for grouped fields`}}}catch{}try{z.displayName=`ContentExtreme`,z.__docgenInfo={description:`Constrains a long legend and description to a narrow host to demonstrate
wrapping without losing the fieldset's accessible relationships.`,displayName:`ContentExtreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Fieldset/Fieldset.stories.tsx`,methods:[],props:{},tags:{summary:`long fieldset content in a narrow layout`}}}catch{}B=[`AnatomyAndKeyboard`,`Invalid`,`Disabled`,`NativeFormParticipation`,`ContentExtreme`]}));V();export{F as AnatomyAndKeyboard,z as ContentExtreme,L as Disabled,I as Invalid,R as NativeFormParticipation,B as __namedExportsOrder,P as default,V as n,O as t};