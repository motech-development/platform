import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{a as r,n as i,o as a,t as o}from"./Tag-DtPEcTlb.js";var s=t({Action:()=>_,Disabled:()=>h,Extreme:()=>v,NumberKey:()=>g,Static:()=>m,__namedExportsOrder:()=>y,default:()=>p}),c,l,u,d,f,p,m,h,g,_,v,y,b=e((()=>{a(),i(),c=n(),{expect:l,fn:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p={component:o,render:e=>(0,c.jsxs)(r.Root,{children:[(0,c.jsx)(r.Label,{children:`Tag example`}),(0,c.jsx)(r.List,{children:(0,c.jsx)(o,{disabled:e.disabled,id:e.id,onAction:e.onAction,textValue:e.textValue,children:e.children})})]}),title:`Collections/Tag`},m={args:{children:`Open`,id:`open`,textValue:`Open`}},h={args:{children:`Unavailable`,disabled:!0,id:`off`,textValue:`Unavailable`}},g={args:{children:`Numeric key`,id:42,textValue:`Numeric key`}},_={args:{children:`Action tag`,id:`action`,onAction:u(),textValue:`Action tag`},play:async({args:e,canvasElement:t})=>{await d.dblClick(f(t).getByRole(`row`,{name:`Action tag`})),await l(e.onAction).toHaveBeenCalledWith(`action`)}},v={args:{children:`A very long standalone tag label`,id:`long`,textValue:`A very long standalone tag label`}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Open',
    id: 'open',
    textValue: 'Open'
  }
}`,...m.parameters?.docs?.source},description:{story:`Renders one ordinary keyed tag inside the required labelled TagGroup
collection so focus and collection semantics are available.

@summary static keyed tag in a labelled collection`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Unavailable',
    disabled: true,
    id: 'off',
    textValue: 'Unavailable'
  }
}`,...h.parameters?.docs?.source},description:{story:`Prevents focus, selection, semantic actions, and removal for a tag that
remains visible as unavailable collection content.

@summary disabled tag collection item`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Numeric key',
    id: 42,
    textValue: 'Numeric key'
  }
}`,...g.parameters?.docs?.source},description:{story:`Uses a stable numeric collection key to demonstrate that tag identity may be
a string or number without leaking application record objects.

@summary tag with a stable numeric key`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Action tag',
    id: 'action',
    onAction: fn(),
    textValue: 'Action tag'
  },
  play: async ({
    args,
    canvasElement
  }) => {
    await userEvent.dblClick(within(canvasElement).getByRole('row', {
      name: 'Action tag'
    }));
    await expect(args.onAction).toHaveBeenCalledWith('action');
  }
}`,..._.parameters?.docs?.source},description:{story:`Invokes an application-owned semantic action with the stable tag key while
the containing group retains collection focus behaviour.

@summary actionable tag reporting its stable key`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'A very long standalone tag label',
    id: 'long',
    textValue: 'A very long standalone tag label'
  }
}`,...v.parameters?.docs?.source},description:{story:`Uses an intentionally long visible label to show content pressure within a
single tag and the boundary for choosing ordinary text instead.

@summary long standalone tag label content`,...v.parameters?.docs?.description}}};try{m.displayName=`Static`,m.__docgenInfo={description:`Renders one ordinary keyed tag inside the required labelled TagGroup
collection so focus and collection semantics are available.`,displayName:`Static`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Tag/Tag.stories.tsx`,methods:[],props:{},tags:{summary:`static keyed tag in a labelled collection`}}}catch{}try{h.displayName=`Disabled`,h.__docgenInfo={description:`Prevents focus, selection, semantic actions, and removal for a tag that
remains visible as unavailable collection content.`,displayName:`Disabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Tag/Tag.stories.tsx`,methods:[],props:{},tags:{summary:`disabled tag collection item`}}}catch{}try{g.displayName=`NumberKey`,g.__docgenInfo={description:`Uses a stable numeric collection key to demonstrate that tag identity may be
a string or number without leaking application record objects.`,displayName:`NumberKey`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Tag/Tag.stories.tsx`,methods:[],props:{},tags:{summary:`tag with a stable numeric key`}}}catch{}try{_.displayName=`Action`,_.__docgenInfo={description:`Invokes an application-owned semantic action with the stable tag key while
the containing group retains collection focus behaviour.`,displayName:`Action`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Tag/Tag.stories.tsx`,methods:[],props:{},tags:{summary:`actionable tag reporting its stable key`}}}catch{}try{v.displayName=`Extreme`,v.__docgenInfo={description:`Uses an intentionally long visible label to show content pressure within a
single tag and the boundary for choosing ordinary text instead.`,displayName:`Extreme`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Tag/Tag.stories.tsx`,methods:[],props:{},tags:{summary:`long standalone tag label content`}}}catch{}y=[`Static`,`Disabled`,`NumberKey`,`Action`,`Extreme`]}));b();export{_ as Action,h as Disabled,v as Extreme,g as NumberKey,m as Static,y as __namedExportsOrder,p as default,b as n,s as t};