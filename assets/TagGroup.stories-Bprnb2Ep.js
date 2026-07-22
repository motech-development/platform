import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i}from"./iframe-q_a4TWX4.js";import{n as a,t as o}from"./StoryConstraint-zHJlDOLD.js";import{i as s,s as c,t as l}from"./TextField-CiykLqt4.js";import{a as u,i as d,n as f,o as p,r as m,t as h}from"./Tag-DC-F6H6w.js";var g=e({ControlledAndReadOnly:()=>E,EmptyDisabled:()=>D,Extreme:()=>O,Items:()=>T,StaticKeyboard:()=>w,__namedExportsOrder:()=>k,default:()=>C});function _(){let[e,t]=(0,v.useState)([1]);return(0,y.jsxs)(u.Root,{onSelectionChange:t,selection:e,children:[(0,y.jsx)(u.Label,{children:`Controlled`}),(0,y.jsxs)(u.List,{children:[(0,y.jsx)(h,{id:1,textValue:`Open`,children:`Open`}),(0,y.jsx)(h,{id:2,textValue:`Paid`,children:`Paid`})]})]})}var v,y,b,x,S,C,w,T,E,D,O,k,A=t((()=>{v=n(r(),1),a(),f(),c(),p(),y=i(),{expect:b,userEvent:x,within:S}=__STORYBOOK_MODULE_TEST__,C={component:d,decorators:[e=>(Object.assign(u.Description,{displayName:`TagGroup.Description`}),Object.assign(u.Label,{displayName:`TagGroup.Label`}),Object.assign(u.List,{displayName:`TagGroup.List`}),Object.assign(u.Root,{displayName:`TagGroup.Root`}),(0,y.jsx)(e,{}))],subcomponents:{Description:l,Label:s,List:m},title:`Collections/TagGroup`},w={args:{children:null},play:async({canvasElement:e})=>{let t=S(e).getByRole(`row`,{name:`Open`});await x.click(t),await b(t).toHaveAttribute(`aria-selected`,`true`)},render:()=>(0,y.jsxs)(u.Root,{onSelectionChange:()=>void 0,children:[(0,y.jsx)(u.Label,{children:`Filters`}),(0,y.jsxs)(u.List,{children:[(0,y.jsx)(h,{id:`open`,textValue:`Open`,children:`Open`}),(0,y.jsx)(h,{id:`paid`,textValue:`Paid`,children:`Paid`})]})]})},T={args:{children:null},render:()=>(0,y.jsxs)(u.Root,{children:[(0,y.jsx)(u.Label,{children:`Items`}),(0,y.jsxs)(u.List,{children:[(0,y.jsx)(h,{id:1,textValue:`Open`,children:`Open`}),(0,y.jsx)(h,{id:2,textValue:`Paid`,children:`Paid`})]})]})},E={args:{children:null},render:()=>(0,y.jsxs)(`div`,{children:[(0,y.jsx)(_,{}),(0,y.jsxs)(u.Root,{readOnly:!0,selection:[1],children:[(0,y.jsx)(u.Label,{children:`Read only`}),(0,y.jsxs)(u.List,{children:[(0,y.jsx)(h,{id:1,textValue:`Open`,children:`Open`}),(0,y.jsx)(h,{id:2,textValue:`Paid`,children:`Paid`})]})]})]})},D={args:{children:null},render:()=>(0,y.jsxs)(u.Root,{disabledKeys:[2],children:[(0,y.jsx)(u.Label,{children:`States`}),(0,y.jsx)(u.List,{emptyContent:`No tags`,children:null})]})},O={args:{children:null},render:()=>(0,y.jsx)(o,{size:`narrow-control`,children:(0,y.jsxs)(u.Root,{children:[(0,y.jsx)(u.Label,{children:`Long labels`}),(0,y.jsx)(u.List,{children:(0,y.jsx)(h,{id:`long`,textValue:`Long`,children:`A very long tag that wraps`})})]})})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const tag = within(canvasElement).getByRole('row', {
      name: 'Open'
    });
    await userEvent.click(tag);
    await expect(tag).toHaveAttribute('aria-selected', 'true');
  },
  render: () => <TagGroup.Root onSelectionChange={() => undefined}>
      <TagGroup.Label>Filters</TagGroup.Label>
      <TagGroup.List>
        <Tag id="open" textValue="Open">
          Open
        </Tag>
        <Tag id="paid" textValue="Paid">
          Paid
        </Tag>
      </TagGroup.List>
    </TagGroup.Root>
}`,...w.parameters?.docs?.source},description:{story:`Selects a statically authored keyed tag through the collection interaction
model and exposes the resulting selected state semantically.

@summary static selectable tags with keyboard semantics`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <TagGroup.Root>
      <TagGroup.Label>Items</TagGroup.Label>
      <TagGroup.List>
        <Tag id={1} textValue="Open">
          Open
        </Tag>
        <Tag id={2} textValue="Paid">
          Paid
        </Tag>
      </TagGroup.List>
    </TagGroup.Root>
}`,...T.parameters?.docs?.source},description:{story:`Authors tags directly with stable numeric identities and visible text used
by the collection interaction model.

@summary statically authored tag collection items`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <div>
      <Controlled />
      <TagGroup.Root readOnly selection={[1]}>
        <TagGroup.Label>Read only</TagGroup.Label>
        <TagGroup.List>
          <Tag id={1} textValue="Open">
            Open
          </Tag>
          <Tag id={2} textValue="Paid">
            Paid
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>
    </div>
}`,...E.parameters?.docs?.source},description:{story:`Compares application-controlled multiple selection with an intentionally
immutable selected collection using the same keyed item model.

@summary controlled and read-only tag selections`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <TagGroup.Root disabledKeys={[2]}>
      <TagGroup.Label>States</TagGroup.Label>
      <TagGroup.List emptyContent="No tags">{null}</TagGroup.List>
    </TagGroup.Root>
}`,...D.parameters?.docs?.source},description:{story:`Demonstrates application-owned empty content while retaining the root-level
disabled-key contract used when items are later supplied.

@summary empty tag list with disabled-key configuration`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <TagGroup.Root>
        <TagGroup.Label>Long labels</TagGroup.Label>
        <TagGroup.List>
          <Tag id="long" textValue="Long">
            A very long tag that wraps
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>
    </StoryConstraint>
}`,...O.parameters?.docs?.source},description:{story:`Wraps a long selected-value label inside a narrow collection host to verify
that the tag group remains readable without horizontal overflow.

@summary long tag content in a narrow collection`,...O.parameters?.docs?.description}}};try{C.displayName=`Root`,C.__docgenInfo={description:`Coordinates tag selection, focus, and removal.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TagGroup/TagGroup.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`}],description:`Compound label, tag list, and supporting guidance parts.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},required:!0,tags:{},type:{name:`ReactNode`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`}],description:`Keys whose tags cannot receive focus, selection, actions, or removal.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},onRemove:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`}],description:`Called with the stable keys removed through keyboard interaction.`,name:`onRemove`,parent:{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`((keys: CollectionKey[]) => void) | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`}],description:`Ref to the rendered tag-group root.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`Shared`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`}],description:`Current selected tag keys, or every key for select-all state.
Current immutable selected tag keys.
Excluded when selection is uncontrolled.`,name:`selection`,required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`}],description:`Called with the next selected tag keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`}],description:`Excluded when selection is controlled.
Initial selected tag keys.`,name:`defaultSelection`,required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/primitives/TagGroup/TagGroup.tsx`,name:`TypeLiteral`}],description:`Controlled mutable state cannot be marked read-only.
Prevents selection changes and removal.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{w.displayName=`StaticKeyboard`,w.__docgenInfo={description:`Selects a statically authored keyed tag through the collection interaction
model and exposes the resulting selected state semantically.`,displayName:`StaticKeyboard`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TagGroup/TagGroup.stories.tsx`,methods:[],props:{},tags:{summary:`static selectable tags with keyboard semantics`}}}catch{}try{T.displayName=`Items`,T.__docgenInfo={description:`Authors tags directly with stable numeric identities and visible text used
by the collection interaction model.`,displayName:`Items`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TagGroup/TagGroup.stories.tsx`,methods:[],props:{},tags:{summary:`statically authored tag collection items`}}}catch{}try{E.displayName=`ControlledAndReadOnly`,E.__docgenInfo={description:`Compares application-controlled multiple selection with an intentionally
immutable selected collection using the same keyed item model.`,displayName:`ControlledAndReadOnly`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TagGroup/TagGroup.stories.tsx`,methods:[],props:{},tags:{summary:`controlled and read-only tag selections`}}}catch{}try{D.displayName=`EmptyDisabled`,D.__docgenInfo={description:`Demonstrates application-owned empty content while retaining the root-level
disabled-key contract used when items are later supplied.`,displayName:`EmptyDisabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TagGroup/TagGroup.stories.tsx`,methods:[],props:{},tags:{summary:`empty tag list with disabled-key configuration`}}}catch{}try{O.displayName=`Extreme`,O.__docgenInfo={description:`Wraps a long selected-value label inside a narrow collection host to verify
that the tag group remains readable without horizontal overflow.`,displayName:`Extreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/TagGroup/TagGroup.stories.tsx`,methods:[],props:{},tags:{summary:`long tag content in a narrow collection`}}}catch{}k=[`StaticKeyboard`,`Items`,`ControlledAndReadOnly`,`EmptyDisabled`,`Extreme`]}));A();export{E as ControlledAndReadOnly,D as EmptyDisabled,O as Extreme,T as Items,w as StaticKeyboard,k as __namedExportsOrder,C as default,A as n,g as t};