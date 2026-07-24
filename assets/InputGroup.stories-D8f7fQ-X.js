import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,t as i}from"./Button-BEpHfrRB.js";import{n as a,t as o}from"./StoryConstraint-DtKI6sgB.js";import{n as s,t as c}from"./Stack-0pHCj1U7.js";import{o as l,s as u}from"./TextField-DUkhVOns.js";import{i as d,n as f,r as p,t as m}from"./InputGroup-Bc4flLhg.js";var h=t({ContentExtreme:()=>k,ExplicitGroupSemantics:()=>O,PrefixAndSuffix:()=>w,RelatedAction:()=>T,RightToLeftPrefixAndSuffix:()=>A,RightToLeftRelatedAction:()=>E,SizesAndStates:()=>D,__namedExportsOrder:()=>j,default:()=>C});function g(e){let t=e.closest(`[data-breeze-input-group]`);if(!t)throw Error(`Expected an InputGroup root.`);return t}async function _(e){let t=getComputedStyle(e,`::after`);await b([t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth]).toEqual([`1px`,`1px`,`1px`,`1px`]),await b([t.borderTopColor,t.borderRightColor,t.borderBottomColor,t.borderLeftColor]).toEqual([t.borderTopColor,t.borderTopColor,t.borderTopColor,t.borderTopColor])}async function v(e,t){let n=e.querySelector(`input`),r=Array.from(e.querySelectorAll(`[data-breeze-input-group-addon]`));if(!n||r.length===0)throw Error(`Expected an input and at least one InputGroup addon.`);let i=getComputedStyle(n);await b(Number.parseFloat(i.paddingInlineStart)).toBe(t),await b(Number.parseFloat(i.paddingInlineEnd)).toBe(t),await Promise.all(r.map(async e=>{let r=getComputedStyle(e),a=e.previousElementSibling?0:t,o=e.nextElementSibling?0:t;await b(Number.parseFloat(r.paddingInlineStart)).toBe(a),await b(Number.parseFloat(r.paddingInlineEnd)).toBe(o),e.nextElementSibling===n&&await b(Number.parseFloat(r.paddingInlineEnd)+Number.parseFloat(i.paddingInlineStart)).toBe(t),e.previousElementSibling===n&&await b(Number.parseFloat(i.paddingInlineEnd)+Number.parseFloat(r.paddingInlineStart)).toBe(t)}))}var y,b,x,S,C,w,T,E,D,O,k,A,j,M=e((()=>{a(),r(),s(),u(),d(),y=n(),{expect:b,userEvent:x,within:S}=__STORYBOOK_MODULE_TEST__,C={component:p,decorators:[e=>(Object.assign(f.Addon,{displayName:`InputGroup.Addon`}),Object.assign(f.Root,{displayName:`InputGroup.Root`}),(0,y.jsx)(e,{}))],subcomponents:{Addon:m},title:`Fields/InputGroup`},w={args:{children:null},play:async({canvasElement:e})=>{let t=S(e).getByRole(`textbox`,{name:`Budget`});await x.clear(t),await x.type(t,`250`),await b(t).toHaveValue(`250`);let n=g(t),[r,,i]=Array.from(n.children),a=getComputedStyle(t);await _(n),await v(n,12),await b(n).toHaveAttribute(`data-focus-within`),await b(r).toHaveAttribute(`data-breeze-input-group-addon`),await b(i).toHaveAttribute(`data-breeze-input-group-addon`),await b(getComputedStyle(r).backgroundColor).toBe(`rgba(0, 0, 0, 0)`),await b(getComputedStyle(i).backgroundColor).toBe(`rgba(0, 0, 0, 0)`),await b(getComputedStyle(r).borderWidth).toBe(`0px`),await b(a.borderTopWidth).toBe(`0px`),await b(a.borderRightWidth).toBe(`0px`),await b(a.borderBottomWidth).toBe(`0px`),await b(a.borderLeftWidth).toBe(`0px`),await b(getComputedStyle(i).borderWidth).toBe(`0px`),t.blur(),await x.click(t),await b(t).not.toHaveAttribute(`data-focus-visible`),await b(getComputedStyle(n).outlineStyle).toBe(`none`),t.blur(),await x.tab(),await b(t).toHaveFocus(),await b(t).toHaveAttribute(`data-focus-visible`),await b(getComputedStyle(n).outlineStyle).toBe(`solid`),await b(getComputedStyle(n).outlineWidth).toBe(`2px`)},render:()=>(0,y.jsxs)(l.Root,{defaultValue:`100`,children:[(0,y.jsx)(l.Label,{children:`Budget`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(f.Addon,{"aria-hidden":`true`,children:`£`}),(0,y.jsx)(l.Input,{name:`budget`,inputMode:`decimal`}),(0,y.jsx)(f.Addon,{children:`GBP`})]}),(0,y.jsx)(l.Description,{children:`Submitted as the numeric text value.`})]})},T={args:{children:null},play:async({canvasElement:e})=>{let t=S(e),n=t.getByRole(`textbox`,{name:`Invitee`}),r=t.getByRole(`button`,{name:`Add`}),i=g(n),a=n.getBoundingClientRect(),o=r.getBoundingClientRect();await _(i),await b(a.height).toBeGreaterThanOrEqual(44),await b(o.height).toBe(a.height),await b(a.right).toBe(o.left),await b(getComputedStyle(r).borderLeftWidth).toBe(`1px`),await b(getComputedStyle(r).paddingInlineStart).toBe(`16px`),await b(getComputedStyle(r).paddingInlineEnd).toBe(`16px`)},render:()=>(0,y.jsxs)(l.Root,{children:[(0,y.jsx)(l.Label,{children:`Invitee`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(l.Input,{type:`email`}),(0,y.jsx)(i,{size:`md`,children:`Add`})]})]})},E={args:{children:null},play:async({canvasElement:e})=>{let t=S(e),n=t.getByRole(`textbox`,{name:`Invitee`}),r=t.getByRole(`button`,{name:`Add`}),i=n.getBoundingClientRect(),a=r.getBoundingClientRect(),o=getComputedStyle(r);await b(a.right).toBe(i.left),await b(o.borderInlineStartWidth).toBe(`1px`),await b(o.borderRightWidth).toBe(`1px`),await b(o.borderLeftWidth).toBe(`0px`),await b(o.paddingInlineStart).toBe(`16px`),await b(o.paddingInlineEnd).toBe(`16px`)},render:()=>(0,y.jsx)(`div`,{dir:`rtl`,children:(0,y.jsxs)(l.Root,{children:[(0,y.jsx)(l.Label,{children:`Invitee`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(l.Input,{type:`email`}),(0,y.jsx)(i,{size:`md`,children:`Add`})]})]})})},D={args:{children:null},play:async({canvasElement:e})=>{let t=S(e),n=t.getByRole(`textbox`,{name:`Small disabled`}),r=t.getByRole(`textbox`,{name:`Large invalid`}),i=g(n),a=g(r),o=i.querySelector(`[data-breeze-input-group-addon]`),s=getComputedStyle(a,`::after`);if(!o)throw Error(`Expected the disabled InputGroup addon.`);await _(i),await _(a),await v(i,10),await v(a,16),await b(i).toHaveAttribute(`data-disabled`),await b(i.getBoundingClientRect().height).toBe(32),await b(getComputedStyle(o).backgroundColor).toBe(`rgba(0, 0, 0, 0)`),await b(a).toHaveAttribute(`data-invalid`),await b(a.getBoundingClientRect().height).toBe(48),await b(s.borderTopColor).toBe(getComputedStyle(r).borderTopColor)},render:()=>(0,y.jsx)(o,{size:`bounded`,children:(0,y.jsxs)(c,{gap:`lg`,children:[(0,y.jsxs)(l.Root,{disabled:!0,defaultValue:`disabled`,children:[(0,y.jsx)(l.Label,{children:`Small disabled`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(f.Addon,{size:`sm`,children:`ID`}),(0,y.jsx)(l.Input,{size:`sm`}),(0,y.jsx)(f.Addon,{size:`sm`,children:`code`})]})]}),(0,y.jsxs)(l.Root,{invalid:!0,children:[(0,y.jsx)(l.Label,{children:`Large invalid`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(f.Addon,{size:`lg`,children:`https://`}),(0,y.jsx)(l.Input,{size:`lg`}),(0,y.jsx)(f.Addon,{size:`lg`,children:`.example`})]}),(0,y.jsx)(l.Error,{children:`Enter a valid host.`})]})]})})},O={args:{children:null},play:async({canvasElement:e})=>{let t=S(e).getByRole(`group`,{name:`Website address with protocol`});await b(t).toHaveAttribute(`data-breeze-input-group`),await _(t),await v(t,12)},render:()=>(0,y.jsxs)(l.Root,{children:[(0,y.jsx)(l.Label,{children:`Website`}),(0,y.jsxs)(f.Root,{"aria-label":`Website address with protocol`,role:`group`,children:[(0,y.jsx)(f.Addon,{children:`https://`}),(0,y.jsx)(l.Input,{})]})]})},k={args:{children:null},play:async({canvasElement:e})=>{let t=g(S(e).getByRole(`textbox`,{name:`Constrained address`}));await _(t),await v(t,12),await b(t.getBoundingClientRect().width).toBe(256),await b(t.scrollWidth).toBe(t.clientWidth)},render:()=>(0,y.jsx)(o,{size:`narrow-control`,children:(0,y.jsxs)(l.Root,{defaultValue:`very-long-host-name-that-overflows-the-visible-control.example`,children:[(0,y.jsx)(l.Label,{children:`Constrained address`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(f.Addon,{children:`https://`}),(0,y.jsx)(l.Input,{}),(0,y.jsx)(f.Addon,{children:`.example`})]})]})})},A={args:{children:null},play:async({canvasElement:e})=>{let t=g(S(e).getByRole(`textbox`,{name:`Website`})),[n,,r]=Array.from(t.children),i=getComputedStyle(n),a=getComputedStyle(r);await b(getComputedStyle(t).direction).toBe(`rtl`),await v(t,12),await b(i.paddingRight).toBe(`12px`),await b(i.paddingLeft).toBe(`0px`),await b(a.paddingRight).toBe(`0px`),await b(a.paddingLeft).toBe(`12px`)},render:()=>(0,y.jsx)(`div`,{dir:`rtl`,children:(0,y.jsxs)(l.Root,{children:[(0,y.jsx)(l.Label,{children:`Website`}),(0,y.jsxs)(f.Root,{children:[(0,y.jsx)(f.Addon,{children:`https://`}),(0,y.jsx)(l.Input,{}),(0,y.jsx)(f.Addon,{children:`.example`})]})]})})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Budget'
    });
    await userEvent.clear(input);
    await userEvent.type(input, '250');
    await expect(input).toHaveValue('250');
    const group = getInputGroup(input);
    const [prefix,, suffix] = Array.from(group.children) as HTMLElement[];
    const inputStyle = getComputedStyle(input);
    await expectUniformPerimeter(group);
    await expectIntegralAddonSpacing(group, 12);
    await expect(group).toHaveAttribute('data-focus-within');
    await expect(prefix).toHaveAttribute('data-breeze-input-group-addon');
    await expect(suffix).toHaveAttribute('data-breeze-input-group-addon');
    await expect(getComputedStyle(prefix).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(suffix).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(prefix).borderWidth).toBe('0px');
    await expect(inputStyle.borderTopWidth).toBe('0px');
    await expect(inputStyle.borderRightWidth).toBe('0px');
    await expect(inputStyle.borderBottomWidth).toBe('0px');
    await expect(inputStyle.borderLeftWidth).toBe('0px');
    await expect(getComputedStyle(suffix).borderWidth).toBe('0px');
    input.blur();
    await userEvent.click(input);
    await expect(input).not.toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('none');
    input.blur();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(group).outlineStyle).toBe('solid');
    await expect(getComputedStyle(group).outlineWidth).toBe('2px');
  },
  render: () => <TextField.Root defaultValue="100">
      <TextField.Label>Budget</TextField.Label>
      <InputGroup.Root>
        <InputGroup.Addon aria-hidden="true">£</InputGroup.Addon>
        <TextField.Input name="budget" inputMode="decimal" />
        <InputGroup.Addon>GBP</InputGroup.Addon>
      </InputGroup.Root>
      <TextField.Description>
        Submitted as the numeric text value.
      </TextField.Description>
    </TextField.Root>
}`,...w.parameters?.docs?.source},description:{story:`Composes a currency prefix and suffix around an editable text field, then
verifies unified focus treatment and the field's native text entry.

@summary currency addons around an editable field control`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Invitee'
    });
    const button = canvas.getByRole('button', {
      name: 'Add'
    });
    const group = getInputGroup(input);
    const inputBounds = input.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    await expectUniformPerimeter(group);
    await expect(inputBounds.height).toBeGreaterThanOrEqual(44);
    await expect(buttonBounds.height).toBe(inputBounds.height);
    await expect(inputBounds.right).toBe(buttonBounds.left);
    await expect(getComputedStyle(button).borderLeftWidth).toBe('1px');
    await expect(getComputedStyle(button).paddingInlineStart).toBe('16px');
    await expect(getComputedStyle(button).paddingInlineEnd).toBe('16px');
  },
  render: () => <TextField.Root>
      <TextField.Label>Invitee</TextField.Label>
      <InputGroup.Root>
        <TextField.Input type="email" />
        <Button size="md">Add</Button>
      </InputGroup.Root>
    </TextField.Root>
}`,...T.parameters?.docs?.source},description:{story:`Places a related Add action beside an email input while preserving one
visual perimeter and matching control heights.

@summary input and related action on one unified surface`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', {
      name: 'Invitee'
    });
    const button = canvas.getByRole('button', {
      name: 'Add'
    });
    const inputBounds = input.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    const buttonStyle = getComputedStyle(button);
    await expect(buttonBounds.right).toBe(inputBounds.left);
    await expect(buttonStyle.borderInlineStartWidth).toBe('1px');
    await expect(buttonStyle.borderRightWidth).toBe('1px');
    await expect(buttonStyle.borderLeftWidth).toBe('0px');
    await expect(buttonStyle.paddingInlineStart).toBe('16px');
    await expect(buttonStyle.paddingInlineEnd).toBe('16px');
  },
  render: () => <div dir="rtl">
      <TextField.Root>
        <TextField.Label>Invitee</TextField.Label>
        <InputGroup.Root>
          <TextField.Input type="email" />
          <Button size="md">Add</Button>
        </InputGroup.Root>
      </TextField.Root>
    </div>
}`,...E.parameters?.docs?.source},description:{story:`Repeats the related-action composition in right-to-left direction to show
that logical borders, spacing, and action placement reverse correctly.

@summary right-to-left input and related action composition`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const disabledInput = canvas.getByRole('textbox', {
      name: 'Small disabled'
    });
    const invalidInput = canvas.getByRole('textbox', {
      name: 'Large invalid'
    });
    const disabledGroup = getInputGroup(disabledInput);
    const invalidGroup = getInputGroup(invalidInput);
    const disabledAddon = disabledGroup.querySelector<HTMLElement>('[data-breeze-input-group-addon]');
    const invalidPerimeter = getComputedStyle(invalidGroup, '::after');
    if (!disabledAddon) {
      throw new Error('Expected the disabled InputGroup addon.');
    }
    await expectUniformPerimeter(disabledGroup);
    await expectUniformPerimeter(invalidGroup);
    await expectIntegralAddonSpacing(disabledGroup, 10);
    await expectIntegralAddonSpacing(invalidGroup, 16);
    await expect(disabledGroup).toHaveAttribute('data-disabled');
    await expect(disabledGroup.getBoundingClientRect().height).toBe(32);
    await expect(getComputedStyle(disabledAddon).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(invalidGroup).toHaveAttribute('data-invalid');
    await expect(invalidGroup.getBoundingClientRect().height).toBe(48);
    await expect(invalidPerimeter.borderTopColor).toBe(getComputedStyle(invalidInput).borderTopColor);
  },
  render: () => <StoryConstraint size="bounded">
      <Stack gap="lg">
        <TextField.Root disabled defaultValue="disabled">
          <TextField.Label>Small disabled</TextField.Label>
          <InputGroup.Root>
            <InputGroup.Addon size="sm">ID</InputGroup.Addon>
            <TextField.Input size="sm" />
            <InputGroup.Addon size="sm">code</InputGroup.Addon>
          </InputGroup.Root>
        </TextField.Root>
        <TextField.Root invalid>
          <TextField.Label>Large invalid</TextField.Label>
          <InputGroup.Root>
            <InputGroup.Addon size="lg">https://</InputGroup.Addon>
            <TextField.Input size="lg" />
            <InputGroup.Addon size="lg">.example</InputGroup.Addon>
          </InputGroup.Root>
          <TextField.Error>Enter a valid host.</TextField.Error>
        </TextField.Root>
      </Stack>
    </StoryConstraint>
}`,...D.parameters?.docs?.source},description:{story:`Aligns addon and field sizes while comparing disabled and invalid groups,
including the shared disabled surface and invalid perimeter.

@summary matched addon sizes with disabled and invalid states`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Website address with protocol'
    });
    await expect(group).toHaveAttribute('data-breeze-input-group');
    await expectUniformPerimeter(group);
    await expectIntegralAddonSpacing(group, 12);
  },
  render: () => <TextField.Root>
      <TextField.Label>Website</TextField.Label>
      <InputGroup.Root aria-label="Website address with protocol" role="group">
        <InputGroup.Addon>https://</InputGroup.Addon>
        <TextField.Input />
      </InputGroup.Root>
    </TextField.Root>
}`,...O.parameters?.docs?.source},description:{story:`Opts into an explicitly named group when the protocol and input must be
announced as one composition rather than remaining presentation-only.

@summary explicitly labelled semantic input group`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Constrained address'
    });
    const group = getInputGroup(input);
    await expectUniformPerimeter(group);
    await expectIntegralAddonSpacing(group, 12);
    await expect(group.getBoundingClientRect().width).toBe(256);
    await expect(group.scrollWidth).toBe(group.clientWidth);
  },
  render: () => <StoryConstraint size="narrow-control">
      <TextField.Root defaultValue="very-long-host-name-that-overflows-the-visible-control.example">
        <TextField.Label>Constrained address</TextField.Label>
        <InputGroup.Root>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <TextField.Input />
          <InputGroup.Addon>.example</InputGroup.Addon>
        </InputGroup.Root>
      </TextField.Root>
    </StoryConstraint>
}`,...k.parameters?.docs?.source},description:{story:`Constrains a long address and two addons to a narrow host to demonstrate
overflow-safe composition without breaking the shared perimeter.

@summary long address content in a constrained input group`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Website'
    });
    const group = getInputGroup(input);
    const [prefix,, suffix] = Array.from(group.children) as HTMLElement[];
    const prefixStyle = getComputedStyle(prefix);
    const suffixStyle = getComputedStyle(suffix);
    await expect(getComputedStyle(group).direction).toBe('rtl');
    await expectIntegralAddonSpacing(group, 12);
    await expect(prefixStyle.paddingRight).toBe('12px');
    await expect(prefixStyle.paddingLeft).toBe('0px');
    await expect(suffixStyle.paddingRight).toBe('0px');
    await expect(suffixStyle.paddingLeft).toBe('12px');
  },
  render: () => <div dir="rtl">
      <TextField.Root>
        <TextField.Label>Website</TextField.Label>
        <InputGroup.Root>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <TextField.Input />
          <InputGroup.Addon>.example</InputGroup.Addon>
        </InputGroup.Root>
      </TextField.Root>
    </div>
}`,...A.parameters?.docs?.source},description:{story:`Places protocol and domain addons around a field in right-to-left direction
to verify logical addon padding follows the authored order.

@summary right-to-left prefix and suffix addon spacing`,...A.parameters?.docs?.description}}};try{C.displayName=`Root`,C.__docgenInfo={description:`Visually composes a field control with ordered addons or related actions.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/InputGroup/InputGroup.tsx`,name:`InputGroupRootProps`}],description:`Field control, addons, and related actions in visual order.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/InputGroup/InputGroup.tsx`,name:`InputGroupRootProps`},required:!0,tags:{},type:{name:`ReactNode`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/InputGroup/InputGroup.tsx`,name:`InputGroupRootProps`}],description:`Ref to the rendered group.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/InputGroup/InputGroup.tsx`,name:`InputGroupRootProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},role:{defaultValue:{value:`presentation`},declarations:[{fileName:`breeze-ui/src/primitives/InputGroup/InputGroup.tsx`,name:`InputGroupRootProps`}],description:"Accessible grouping role. Defaults to `presentation` for visual-only composition.",name:`role`,parent:{fileName:`breeze-ui/src/primitives/InputGroup/InputGroup.tsx`,name:`InputGroupRootProps`},required:!1,tags:{},type:{name:`"group" | "presentation" | "region" | undefined`}}},tags:{}}}catch{}try{w.displayName=`PrefixAndSuffix`,w.__docgenInfo={description:`Composes a currency prefix and suffix around an editable text field, then
verifies unified focus treatment and the field's native text entry.`,displayName:`PrefixAndSuffix`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`currency addons around an editable field control`}}}catch{}try{T.displayName=`RelatedAction`,T.__docgenInfo={description:`Places a related Add action beside an email input while preserving one
visual perimeter and matching control heights.`,displayName:`RelatedAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`input and related action on one unified surface`}}}catch{}try{E.displayName=`RightToLeftRelatedAction`,E.__docgenInfo={description:`Repeats the related-action composition in right-to-left direction to show
that logical borders, spacing, and action placement reverse correctly.`,displayName:`RightToLeftRelatedAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`right-to-left input and related action composition`}}}catch{}try{D.displayName=`SizesAndStates`,D.__docgenInfo={description:`Aligns addon and field sizes while comparing disabled and invalid groups,
including the shared disabled surface and invalid perimeter.`,displayName:`SizesAndStates`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`matched addon sizes with disabled and invalid states`}}}catch{}try{O.displayName=`ExplicitGroupSemantics`,O.__docgenInfo={description:`Opts into an explicitly named group when the protocol and input must be
announced as one composition rather than remaining presentation-only.`,displayName:`ExplicitGroupSemantics`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`explicitly labelled semantic input group`}}}catch{}try{k.displayName=`ContentExtreme`,k.__docgenInfo={description:`Constrains a long address and two addons to a narrow host to demonstrate
overflow-safe composition without breaking the shared perimeter.`,displayName:`ContentExtreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`long address content in a constrained input group`}}}catch{}try{A.displayName=`RightToLeftPrefixAndSuffix`,A.__docgenInfo={description:`Places protocol and domain addons around a field in right-to-left direction
to verify logical addon padding follows the authored order.`,displayName:`RightToLeftPrefixAndSuffix`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/InputGroup/InputGroup.stories.tsx`,methods:[],props:{},tags:{summary:`right-to-left prefix and suffix addon spacing`}}}catch{}j=[`PrefixAndSuffix`,`RelatedAction`,`RightToLeftRelatedAction`,`SizesAndStates`,`ExplicitGroupSemantics`,`ContentExtreme`,`RightToLeftPrefixAndSuffix`]}));M();export{k as ContentExtreme,O as ExplicitGroupSemantics,w as PrefixAndSuffix,T as RelatedAction,A as RightToLeftPrefixAndSuffix,E as RightToLeftRelatedAction,D as SizesAndStates,j as __namedExportsOrder,C as default,M as n,h as t};