import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i}from"./iframe-i3W5vvo3.js";import{n as a,t as o}from"./StoryConstraint-BuP2E5WZ.js";import{n as s,t as c}from"./Stack-DA68Fogw.js";import{a as l,i as u,n as d,r as f,t as p}from"./ListBox-D50MLZh2.js";var m=e({ContentExtreme:()=>E,ControlledAndReadOnly:()=>w,EmptyDisabledInvalid:()=>T,MultipleSelection:()=>C,StaticKeyboard:()=>S,VariableVirtualizationAndLoading:()=>D,__namedExportsOrder:()=>O,default:()=>x});function h(){let[e,t]=(0,g.useState)([1]);return(0,_.jsxs)(d.Root,{"aria-label":`Controlled`,onSelectionChange:t,selection:e,children:[(0,_.jsx)(d.Item,{id:1,textValue:`Alpha`,children:`Alpha`}),(0,_.jsx)(d.Item,{id:2,textValue:`Beta`,children:`Beta`})]})}var g,_,v,y,b,x,S,C,w,T,E,D,O,k=t((()=>{g=n(r(),1),a(),s(),l(),_=i(),{expect:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x={component:u,decorators:[e=>(Object.assign(d.Item,{displayName:`ListBox.Item`}),Object.assign(d.LoadMore,{displayName:`ListBox.LoadMore`}),Object.assign(d.Root,{displayName:`ListBox.Root`}),(0,_.jsx)(e,{}))],subcomponents:{Item:p,LoadMore:f},title:`Collections/ListBox`},S={args:{"aria-label":`People`,children:null},play:async({canvasElement:e})=>{b(e).getByRole(`listbox`).focus(),await y.keyboard(`b`),await v(b(e).getByRole(`option`,{name:`Bob`})).toHaveFocus()},render:()=>(0,_.jsxs)(d.Root,{"aria-label":`People`,children:[(0,_.jsx)(d.Item,{id:`ada`,textValue:`Ada`,children:`Ada`}),(0,_.jsx)(d.Item,{id:`bob`,textValue:`Bob`,children:`Bob`})]})},C={args:{"aria-label":`Items`,children:null},render:()=>(0,_.jsxs)(d.Root,{"aria-label":`Items`,multiple:!0,children:[(0,_.jsx)(d.Item,{id:1,textValue:`Alpha`,children:`Alpha`}),(0,_.jsx)(d.Item,{id:2,textValue:`Beta`,children:`Beta`})]})},w={args:{"aria-label":`State`,children:null},render:()=>(0,_.jsxs)(c,{gap:`md`,children:[(0,_.jsx)(h,{}),(0,_.jsx)(d.Root,{"aria-label":`Read only`,readOnly:!0,selection:[`one`],children:(0,_.jsx)(d.Item,{id:`one`,textValue:`One`,children:`One`})})]})},T={args:{"aria-label":`States`,children:null},play:async({canvasElement:e})=>{let t=b(e).getByRole(`listbox`,{name:`Invalid`});await v(t).toHaveAttribute(`aria-invalid`,`true`),await v(t).toHaveAttribute(`aria-required`,`true`)},render:()=>(0,_.jsxs)(c,{gap:`md`,children:[(0,_.jsx)(d.Root,{"aria-label":`Empty`,emptyContent:`No matches`,children:null}),(0,_.jsx)(d.Root,{"aria-label":`Invalid`,disabledKeys:[`off`],invalid:!0,required:!0,children:(0,_.jsx)(d.Item,{id:`off`,textValue:`Unavailable`,children:`Unavailable`})})]})},E={args:{"aria-label":`Long options`,children:null},render:()=>(0,_.jsx)(o,{size:`narrow-control`,children:(0,_.jsx)(d.Root,{"aria-label":`Long options`,children:(0,_.jsx)(d.Item,{id:`long`,textValue:`Long option`,children:`A very long option label that wraps in constrained layouts`})})})},D={args:{"aria-label":`Virtual options`,children:null},render:()=>(0,_.jsxs)(d.Root,{"aria-label":`Virtual options`,virtualization:{estimatedRowHeight:44,mode:`variable`,overscan:72,viewportHeight:132},children:[(0,_.jsx)(d.Item,{id:`one`,textValue:`One`,children:`One`}),(0,_.jsx)(d.Item,{id:`two`,textValue:`Two with wrapping content`,children:`Two with wrapping content that demonstrates live row measurement`}),(0,_.jsx)(d.LoadMore,{loading:!0,onLoadMore:()=>void 0,children:`Loading more options`})]})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'People',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const box = within(canvasElement).getByRole('listbox');
    box.focus();
    await userEvent.keyboard('b');
    await expect(within(canvasElement).getByRole('option', {
      name: 'Bob'
    })).toHaveFocus();
  },
  render: () => <ListBox.Root aria-label="People">
      <ListBox.Item id="ada" textValue="Ada">
        Ada
      </ListBox.Item>
      <ListBox.Item id="bob" textValue="Bob">
        Bob
      </ListBox.Item>
    </ListBox.Root>
}`,...S.parameters?.docs?.source},description:{story:`Uses static keyed options and verifies that typeahead moves focus to the
option whose text value matches the typed character.

@summary static options with keyboard typeahead focus`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Items',
    children: null
  },
  render: () => <ListBox.Root aria-label="Items" multiple>
      <ListBox.Item id={1} textValue="Alpha">
        Alpha
      </ListBox.Item>
      <ListBox.Item id={2} textValue="Beta">
        Beta
      </ListBox.Item>
    </ListBox.Root>
}`,...C.parameters?.docs?.source},description:{story:`Authors stable keyed items directly and enables multiple selection while
leaving selected-state ownership with ListBox.

@summary statically authored items with multiple selection`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'State',
    children: null
  },
  render: () => <Stack gap="md">
      <Controlled />
      <ListBox.Root aria-label="Read only" readOnly selection={['one']}>
        <ListBox.Item id="one" textValue="One">
          One
        </ListBox.Item>
      </ListBox.Root>
    </Stack>
}`,...w.parameters?.docs?.source},description:{story:`Compares application-controlled mutable selection with an intentionally
immutable selected option so state ownership remains explicit.

@summary controlled and read-only listbox selection contracts`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'States',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const invalidListBox = within(canvasElement).getByRole('listbox', {
      name: 'Invalid'
    });
    await expect(invalidListBox).toHaveAttribute('aria-invalid', 'true');
    await expect(invalidListBox).toHaveAttribute('aria-required', 'true');
  },
  render: () => <Stack gap="md">
      <ListBox.Root aria-label="Empty" emptyContent="No matches">
        {null}
      </ListBox.Root>
      <ListBox.Root aria-label="Invalid" disabledKeys={['off']} invalid required>
        <ListBox.Item id="off" textValue="Unavailable">
          Unavailable
        </ListBox.Item>
      </ListBox.Root>
    </Stack>
}`,...T.parameters?.docs?.source},description:{story:`Demonstrates application-owned empty content beside a required invalid
collection whose only option is disabled and unavailable for interaction.

@summary empty disabled required and invalid collection states`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Long options',
    children: null
  },
  render: () => <StoryConstraint size="narrow-control">
      <ListBox.Root aria-label="Long options">
        <ListBox.Item id="long" textValue="Long option">
          A very long option label that wraps in constrained layouts
        </ListBox.Item>
      </ListBox.Root>
    </StoryConstraint>
}`,...E.parameters?.docs?.source},description:{story:`Constrains a long option label to a narrow host to show that option content
wraps without losing listbox or option semantics.

@summary long option content in a narrow listbox`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Virtual options',
    children: null
  },
  render: () => <ListBox.Root aria-label="Virtual options" virtualization={{
    estimatedRowHeight: 44,
    mode: 'variable',
    overscan: 72,
    viewportHeight: 132
  }}>
      <ListBox.Item id="one" textValue="One">
        One
      </ListBox.Item>
      <ListBox.Item id="two" textValue="Two with wrapping content">
        Two with wrapping content that demonstrates live row measurement
      </ListBox.Item>
      <ListBox.LoadMore loading onLoadMore={() => undefined}>
        Loading more options
      </ListBox.LoadMore>
    </ListBox.Root>
}`,...D.parameters?.docs?.source},description:{story:`Enables variable-height windowing and renders the loading sentinel for an
application-owned pagination request at a bounded viewport height.

@summary variable-height listbox virtualization with loading sentinel`,...D.parameters?.docs?.description}}};try{x.displayName=`Root`,x.__docgenInfo={description:`Coordinates collection rendering, focus, typeahead, and semantic selection.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:"Generic items with stable `id` keys.\nExcluded when static compound item elements are supplied.",name:`items`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!1,tags:{},type:{name:`Iterable<Item> | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`},{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`StaticCollectionContentProps`}],description:`Renders one compound item for each generic item.
Static compound item elements.`,name:`children`,parent:{fileName:`breeze-ui/src/internal/types/collection.ts`,name:`DynamicCollectionContentProps`},required:!0,tags:{},type:{name:`((item: Item) => ReactElement<unknown, string | JSXElementConstructor<any>>) | ReactNode`}},disabledKeys:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:`Keys whose items cannot receive focus, selection, or actions.`,name:`disabledKeys`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`Iterable<CollectionKey> | undefined`}},emptyContent:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:`Content displayed when the collection has no items.`,name:`emptyContent`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`ReactNode`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:"Exposes invalid state to assistive technology and error styling. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},multiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:"Enables multiple selection. Defaults to `false`.",name:`multiple`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},orientation:{defaultValue:{value:`vertical`},declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:"Primary item layout and arrow-key navigation axis. Defaults to `vertical`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:"Marks the listbox as requiring a selection. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:`Ref to the rendered listbox.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},virtualization:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`}],description:`Optional fixed- or variable-height windowing configuration.`,name:`virtualization`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ListBoxRootSharedProps`},required:!1,tags:{},type:{name:`CollectionVirtualization | undefined`}},selection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`}],description:`Current selected keys.
Current immutable selected keys.
Excluded when selection is uncontrolled.`,name:`selection`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},onSelectionChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`}],description:`Called with the next selected keys.
Excluded because read-only selection cannot change.`,name:`onSelectionChange`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},required:!1,tags:{},type:{name:`((selection: CollectionSelection) => void) | ((selection: CollectionSelection) => void) | undefined`}},defaultSelection:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`}],description:`Excluded when selection is controlled.
Initial selected keys. Defaults to an empty selection.`,name:`defaultSelection`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},required:!1,tags:{},type:{name:`CollectionSelection | undefined`}},readOnly:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ReadOnlyListBoxRootProps`},{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`UncontrolledListBoxRootProps`}],description:`Controlled mutable state cannot be marked read-only.
Marks a controlled selection as intentionally immutable.
Uncontrolled state cannot be marked read-only.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/ListBox/ListBox.tsx`,name:`ControlledListBoxRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{S.displayName=`StaticKeyboard`,S.__docgenInfo={description:`Uses static keyed options and verifies that typeahead moves focus to the
option whose text value matches the typed character.`,displayName:`StaticKeyboard`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{},tags:{summary:`static options with keyboard typeahead focus`}}}catch{}try{C.displayName=`MultipleSelection`,C.__docgenInfo={description:`Authors stable keyed items directly and enables multiple selection while
leaving selected-state ownership with ListBox.`,displayName:`MultipleSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{},tags:{summary:`statically authored items with multiple selection`}}}catch{}try{w.displayName=`ControlledAndReadOnly`,w.__docgenInfo={description:`Compares application-controlled mutable selection with an intentionally
immutable selected option so state ownership remains explicit.`,displayName:`ControlledAndReadOnly`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{},tags:{summary:`controlled and read-only listbox selection contracts`}}}catch{}try{T.displayName=`EmptyDisabledInvalid`,T.__docgenInfo={description:`Demonstrates application-owned empty content beside a required invalid
collection whose only option is disabled and unavailable for interaction.`,displayName:`EmptyDisabledInvalid`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{},tags:{summary:`empty disabled required and invalid collection states`}}}catch{}try{E.displayName=`ContentExtreme`,E.__docgenInfo={description:`Constrains a long option label to a narrow host to show that option content
wraps without losing listbox or option semantics.`,displayName:`ContentExtreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{},tags:{summary:`long option content in a narrow listbox`}}}catch{}try{D.displayName=`VariableVirtualizationAndLoading`,D.__docgenInfo={description:`Enables variable-height windowing and renders the loading sentinel for an
application-owned pagination request at a bounded viewport height.`,displayName:`VariableVirtualizationAndLoading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/ListBox/ListBox.stories.tsx`,methods:[],props:{},tags:{summary:`variable-height listbox virtualization with loading sentinel`}}}catch{}O=[`StaticKeyboard`,`MultipleSelection`,`ControlledAndReadOnly`,`EmptyDisabledInvalid`,`ContentExtreme`,`VariableVirtualizationAndLoading`]}));k();export{E as ContentExtreme,w as ControlledAndReadOnly,T as EmptyDisabledInvalid,C as MultipleSelection,S as StaticKeyboard,D as VariableVirtualizationAndLoading,O as __namedExportsOrder,x as default,k as n,m as t};