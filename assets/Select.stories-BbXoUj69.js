import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i}from"./iframe-CQHtwZcQ.js";import{n as a,t as o}from"./StoryConstraint-yY2orZcv.js";import{n as s,t as c}from"./Stack-CVdmyomW.js";import{i as l,n as u,s as d,t as f}from"./TextField-Dwbgx1SD.js";import{a as p,t as m}from"./ListBox-jJ1iDyjQ.js";import{a as h,i as g,n as _,o as v,r as y,s as b,t as x}from"./Select-Bm4PZGzt.js";var S=e({ControlledAndReadOnly:()=>N,EmptyCollection:()=>F,Extreme:()=>I,Items:()=>M,StatesAndForm:()=>P,StaticKeyboard:()=>j,__namedExportsOrder:()=>L,default:()=>A});function C(){return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(g.Label,{children:`Country`}),(0,E.jsx)(g.Trigger,{children:(0,E.jsx)(g.Value,{})}),(0,E.jsx)(g.Popover,{children:(0,E.jsxs)(g.ListBox,{children:[(0,E.jsx)(g.Item,{id:`gb`,textValue:`United Kingdom`,children:`United Kingdom`}),(0,E.jsx)(g.Item,{id:`fr`,textValue:`France`,children:`France`})]})})]})}function w(){let[e,t]=(0,T.useState)(`gb`);return(0,E.jsx)(g.Root,{onChange:t,value:e,children:(0,E.jsx)(C,{})})}var T,E,D,O,k,A,j,M,N,P,F,I,L,R=t((()=>{T=n(r(),1),a(),p(),s(),d(),b(),E=i(),{expect:D,userEvent:O,within:k}=__STORYBOOK_MODULE_TEST__,A={component:y,decorators:[e=>(Object.assign(g.Description,{displayName:`Select.Description`}),Object.assign(g.Error,{displayName:`Select.Error`}),Object.assign(g.Item,{displayName:`Select.Item`}),Object.assign(g.Label,{displayName:`Select.Label`}),Object.assign(g.ListBox,{displayName:`Select.ListBox`}),Object.assign(g.Popover,{displayName:`Select.Popover`}),Object.assign(g.Root,{displayName:`Select.Root`}),Object.assign(g.Trigger,{displayName:`Select.Trigger`}),Object.assign(g.Value,{displayName:`Select.Value`}),(0,E.jsx)(e,{}))],subcomponents:{Description:f,Error:u,Item:m,Label:l,ListBox:x,Popover:_,Trigger:h,Value:v},title:`Collections/Select`},j={args:{children:null},play:async({canvasElement:e})=>{let t=k(e).getByRole(`button`,{name:/Country/}),n=t.querySelector(`[data-breeze-select-indicator]`);await D(n).toBeVisible(),await D(n).toHaveAttribute(`aria-hidden`,`true`),t.focus(),await O.keyboard(`{ArrowDown}{Enter}`),await D(t).toHaveTextContent(`United Kingdom`)},render:()=>(0,E.jsxs)(g.Root,{children:[(0,E.jsx)(g.Label,{children:`Country`}),(0,E.jsx)(g.Trigger,{children:(0,E.jsx)(g.Value,{})}),(0,E.jsx)(g.Popover,{children:(0,E.jsxs)(g.ListBox,{children:[(0,E.jsx)(g.Item,{id:`gb`,textValue:`United Kingdom`,children:`United Kingdom`}),(0,E.jsx)(g.Item,{id:`fr`,textValue:`France`,children:`France`})]})})]})},M={args:{children:null},render:()=>(0,E.jsx)(g.Root,{children:(0,E.jsx)(C,{})})},N={args:{children:null},render:()=>(0,E.jsxs)(c,{gap:`md`,children:[(0,E.jsx)(w,{}),(0,E.jsx)(g.Root,{readOnly:!0,value:`fr`,children:(0,E.jsx)(C,{})})]})},P={args:{children:null},render:()=>(0,E.jsxs)(`form`,{id:`form`,children:[(0,E.jsx)(g.Root,{disabled:!0,name:`country`,children:(0,E.jsx)(C,{})}),(0,E.jsx)(g.Root,{invalid:!0,required:!0,name:`required`,children:(0,E.jsx)(C,{})})]})},F={args:{children:null},play:async({canvasElement:e})=>{let t=k(e).getByRole(`button`,{name:/Country/});await O.click(t),await D(t).toHaveAttribute(`aria-expanded`,`true`),await D(k(e.ownerDocument.body).getByRole(`option`,{name:`No countries`})).toBeVisible()},render:()=>(0,E.jsxs)(g.Root,{placeholder:`No countries available`,children:[(0,E.jsx)(g.Label,{children:`Country`}),(0,E.jsx)(g.Trigger,{children:(0,E.jsx)(g.Value,{})}),(0,E.jsx)(g.Popover,{children:(0,E.jsx)(g.ListBox,{emptyContent:`No countries`,children:null})})]})},I={args:{children:null},render:()=>(0,E.jsx)(o,{size:`narrow-control`,children:(0,E.jsx)(g.Root,{placeholder:`Choose an option with a long placeholder`,children:(0,E.jsx)(C,{})})})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: /Country/
    });
    const indicator = trigger.querySelector('[data-breeze-select-indicator]');
    await expect(indicator).toBeVisible();
    await expect(indicator).toHaveAttribute('aria-hidden', 'true');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(trigger).toHaveTextContent('United Kingdom');
  },
  render: () => <Select.Root>
      <Select.Label>Country</Select.Label>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox>
          <Select.Item id="gb" textValue="United Kingdom">
            United Kingdom
          </Select.Item>
          <Select.Item id="fr" textValue="France">
            France
          </Select.Item>
        </Select.ListBox>
      </Select.Popover>
    </Select.Root>
}`,...j.parameters?.docs?.source},description:{story:`Renders authored static options and verifies ArrowDown plus Enter opens the
popup, commits the first option, and updates the trigger value.

@summary static select options with keyboard selection`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Select.Root>
      <Parts />
    </Select.Root>
}`,...M.parameters?.docs?.source},description:{story:`Authors options directly while preserving stable ids, visible labels, and
the shared keyed option contract.

@summary statically authored select options`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <Stack gap="md">
      <Controlled />
      <Select.Root readOnly value="fr">
        <Parts />
      </Select.Root>
    </Stack>
}`,...N.parameters?.docs?.source},description:{story:`Compares an application-controlled select with an immutable selected value
whose trigger cannot open or change the option popup.

@summary controlled and read-only select values`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <form id="form">
      <Select.Root disabled name="country">
        <Parts />
      </Select.Root>
      <Select.Root invalid required name="required">
        <Parts />
      </Select.Root>
    </form>
}`,...P.parameters?.docs?.source},description:{story:`Places disabled and required invalid selects inside a native form to expose
field state, naming, and form-participation behavior.

@summary disabled and invalid select form states`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: /Country/
    });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(within(canvasElement.ownerDocument.body).getByRole('option', {
      name: 'No countries'
    })).toBeVisible();
  },
  render: () => <Select.Root placeholder="No countries available">
      <Select.Label>Country</Select.Label>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Popover>
        <Select.ListBox emptyContent="No countries">{null}</Select.ListBox>
      </Select.Popover>
    </Select.Root>
}`,...F.parameters?.docs?.source},description:{story:`Opens an empty collection and verifies authored empty content appears inside
the accessible option surface.

@summary open select with application-owned empty content`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <Select.Root placeholder="Choose an option with a long placeholder">
        <Parts />
      </Select.Root>
    </StoryConstraint>
}`,...I.parameters?.docs?.source},description:{story:`Constrains a select with a long placeholder to document trigger truncation
and stable field width before any option is selected.

@summary long select placeholder in a narrow field`,...I.parameters?.docs?.description}}};try{A.displayName=`Root`,A.__docgenInfo={description:`Coordinates select state, validation, and native form participation.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:`Compound label, trigger, popover, listbox, description, and error parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!0,tags:{},type:{name:`ReactNode`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:"Prevents focus and selection. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`boolean | undefined`}},form:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:`Associates the native form value with an external form.`,name:`form`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`string | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:"Exposes invalid state. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`boolean | undefined`}},name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:`Native form field name.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`string | undefined`}},placeholder:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:`Placeholder shown before selection.`,name:`placeholder`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`string | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:"Marks the select as required. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`}],description:`Ref to the rendered field root.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`SharedRoot`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`ReadOnly`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Uncontrolled`}],description:"Current selected key, or `null` when no option is selected.\nCurrent immutable selected key, or `null` when no option is selected.\nExcluded when value is uncontrolled.",name:`value`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},required:!1,tags:{},type:{name:`CollectionKey | null | undefined`}},onChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`ReadOnly`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Uncontrolled`}],description:`Called when the selected key changes.
Excluded because read-only values cannot change.`,name:`onChange`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},required:!1,tags:{},type:{name:`((value: CollectionKey | null) => void) | ((value: CollectionKey | null) => void) | undefined`}},defaultValue:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`ReadOnly`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Uncontrolled`}],description:`Excluded when value is controlled.
Initial selected key.`,name:`defaultValue`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},required:!1,tags:{},type:{name:`CollectionKey | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`ReadOnly`},{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Uncontrolled`}],description:`Controlled mutable state cannot be marked read-only.
Prevents interaction with the controlled value.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Select/Select.tsx`,name:`Controlled`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{j.displayName=`StaticKeyboard`,j.__docgenInfo={description:`Renders authored static options and verifies ArrowDown plus Enter opens the
popup, commits the first option, and updates the trigger value.`,displayName:`StaticKeyboard`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{},tags:{summary:`static select options with keyboard selection`}}}catch{}try{M.displayName=`Items`,M.__docgenInfo={description:`Authors options directly while preserving stable ids, visible labels, and
the shared keyed option contract.`,displayName:`Items`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{},tags:{summary:`statically authored select options`}}}catch{}try{N.displayName=`ControlledAndReadOnly`,N.__docgenInfo={description:`Compares an application-controlled select with an immutable selected value
whose trigger cannot open or change the option popup.`,displayName:`ControlledAndReadOnly`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{},tags:{summary:`controlled and read-only select values`}}}catch{}try{P.displayName=`StatesAndForm`,P.__docgenInfo={description:`Places disabled and required invalid selects inside a native form to expose
field state, naming, and form-participation behavior.`,displayName:`StatesAndForm`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{},tags:{summary:`disabled and invalid select form states`}}}catch{}try{F.displayName=`EmptyCollection`,F.__docgenInfo={description:`Opens an empty collection and verifies authored empty content appears inside
the accessible option surface.`,displayName:`EmptyCollection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{},tags:{summary:`open select with application-owned empty content`}}}catch{}try{I.displayName=`Extreme`,I.__docgenInfo={description:`Constrains a select with a long placeholder to document trigger truncation
and stable field width before any option is selected.`,displayName:`Extreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Select/Select.stories.tsx`,methods:[],props:{},tags:{summary:`long select placeholder in a narrow field`}}}catch{}L=[`StaticKeyboard`,`Items`,`ControlledAndReadOnly`,`StatesAndForm`,`EmptyCollection`,`Extreme`]}));R();export{N as ControlledAndReadOnly,F as EmptyCollection,I as Extreme,M as Items,P as StatesAndForm,j as StaticKeyboard,L as __namedExportsOrder,A as default,R as n,S as t};