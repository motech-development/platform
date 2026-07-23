import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{n as r,t as i}from"./Inline-Cq76i5T1.js";import{n as a,t as o}from"./Avatar-CpuIMYrq.js";var s=e({EntityMarkers:()=>g,Image:()=>p,Initials:()=>f,Sizes:()=>m,SquareEntity:()=>h,__namedExportsOrder:()=>_,default:()=>d}),c,l,u,d,f,p,m,h,g,_,v=t((()=>{r(),a(),c=n(),{expect:l,within:u}=__STORYBOOK_MODULE_TEST__,d={component:o,title:`Foundation/Avatar`},f={args:{name:`Ada Lovelace`}},p={args:{name:`Grace Hopper`,src:`https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80`}},m={args:{name:`Alan Turing`},render:({name:e})=>(0,c.jsxs)(i,{gap:`md`,wrap:!1,children:[(0,c.jsx)(o,{name:e,size:`sm`}),(0,c.jsx)(o,{name:e,size:`md`}),(0,c.jsx)(o,{name:e,size:`lg`})]})},h={args:{initials:`E`,name:`Example Team`,shape:`square`,size:`sm`}},g={args:{name:`Entity`},play:async({canvasElement:e})=>{let t=u(e),n=t.getByRole(`img`,{name:`Compact entity`}),r=t.getByRole(`img`,{name:`Primary context`}),i=t.getByRole(`img`,{name:`Alternate context`}),a=e.ownerDocument.defaultView;await l(n.getBoundingClientRect().width).toBe(n.getBoundingClientRect().height),await l(r.getBoundingClientRect().width).toBe(r.getBoundingClientRect().height),await l(i.getBoundingClientRect().width).toBe(r.getBoundingClientRect().width),await l(a?.getComputedStyle(r).borderRadius).toBe(`0px`),await l(a?.getComputedStyle(i).backgroundColor).toBe(`rgb(242, 233, 255)`),await l(a?.getComputedStyle(i).color).toBe(`rgb(110, 54, 167)`)},render:()=>(0,c.jsxs)(i,{gap:`md`,wrap:!1,children:[(0,c.jsx)(o,{initials:`C`,name:`Compact entity`,shape:`square`,size:`sm`}),(0,c.jsx)(o,{initials:`P`,name:`Primary context`,shape:`square`,size:`md`}),(0,c.jsx)(o,{initials:`A`,name:`Alternate context`,shape:`square`,size:`md`,tone:`accent`})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Ada Lovelace'
  }
}`,...f.parameters?.docs?.source},description:{story:`Omits \`src\` so Avatar derives the deterministic initials “AL” from the
accessible person name; use this as the baseline fallback configuration.

@summary Deterministic initials fallback from a person name.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Grace Hopper',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80'
  }
}`,...p.parameters?.docs?.source},description:{story:`Supplies both \`src\` and \`name\`, showing the image presentation while
retaining the name for alternative text and automatic fallback if loading
fails.

@summary Image avatar with named fallback behaviour.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Alan Turing'
  },
  render: ({
    name
  }) => <Inline gap="md" wrap={false}>
      <Avatar name={name} size="sm" />
      <Avatar name={name} size="md" />
      <Avatar name={name} size="lg" />
    </Inline>
}`,...m.parameters?.docs?.source},description:{story:"Renders the same initials at `sm`, `md`, and `lg` to compare canonical\nperson-avatar sizes without changing identity or semantics.\n\n@summary Comparison of the three canonical avatar sizes.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    initials: 'E',
    name: 'Example Team',
    shape: 'square',
    size: 'sm'
  }
}`,...h.parameters?.docs?.source},description:{story:`Uses \`shape="square"\` with an explicit one-character initials override for a
compact non-person entity marker.

@summary Compact square marker for an entity rather than a person.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Entity'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const compact = canvas.getByRole('img', {
      name: 'Compact entity'
    });
    const primary = canvas.getByRole('img', {
      name: 'Primary context'
    });
    const accent = canvas.getByRole('img', {
      name: 'Alternate context'
    });
    const view = canvasElement.ownerDocument.defaultView;
    await expect(compact.getBoundingClientRect().width).toBe(compact.getBoundingClientRect().height);
    await expect(primary.getBoundingClientRect().width).toBe(primary.getBoundingClientRect().height);
    await expect(accent.getBoundingClientRect().width).toBe(primary.getBoundingClientRect().width);
    await expect(view?.getComputedStyle(primary).borderRadius).toBe('0px');
    await expect(view?.getComputedStyle(accent).backgroundColor).toBe('rgb(242, 233, 255)');
    await expect(view?.getComputedStyle(accent).color).toBe('rgb(110, 54, 167)');
  },
  render: () => <Inline gap="md" wrap={false}>
      <Avatar initials="C" name="Compact entity" shape="square" size="sm" />
      <Avatar initials="P" name="Primary context" shape="square" size="md" />
      <Avatar initials="A" name="Alternate context" shape="square" size="md" tone="accent" />
    </Inline>
}`,...g.parameters?.docs?.source},description:{story:`Compares compact and medium square entity markers in primary and accent
tones, verifying equal geometry, square corners, and the semantic accent
treatment.

@summary Square entity-marker sizes and semantic tones.`,...g.parameters?.docs?.description}}};try{d.displayName=`Avatar`,d.__docgenInfo={description:`Renders a named image with a deterministic initials fallback.`,displayName:`Avatar`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Avatar/Avatar.stories.tsx`,methods:[],props:{name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:`Accessible name for the represented person or entity.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!0,tags:{},type:{name:`string`}},initials:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:`Optional initials override for compact entity marks.`,name:`initials`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!1,tags:{},type:{name:`string | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:`Ref to the rendered span.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!1,tags:{},type:{name:`Ref<HTMLSpanElement> | undefined`}},shape:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:"Circular person mark or square entity mark. Defaults to `circle`.",name:`shape`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!1,tags:{},type:{name:`"circle" | "square" | undefined`}},size:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:"Canonical avatar size. Defaults to `md`.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!1,tags:{},type:{name:`"lg" | "md" | "sm" | undefined`}},src:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:`Optional image URL. Initials are shown when absent or unavailable.`,name:`src`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!1,tags:{},type:{name:`string | undefined`}},tone:{defaultValue:{value:`primary`},declarations:[{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`}],description:"Canonical entity-marker colour. Defaults to `primary`.",name:`tone`,parent:{fileName:`breeze-ui/src/primitives/Avatar/Avatar.tsx`,name:`AvatarProps`},required:!1,tags:{},type:{name:`AvatarTone | undefined`}}},tags:{summary:`named image with deterministic initials fallback`}}}catch{}try{f.displayName=`Initials`,f.__docgenInfo={description:"Omits `src` so Avatar derives the deterministic initials “AL” from the\naccessible person name; use this as the baseline fallback configuration.",displayName:`Initials`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Avatar/Avatar.stories.tsx`,methods:[],props:{},tags:{summary:`Deterministic initials fallback from a person name.`}}}catch{}try{p.displayName=`Image`,p.__docgenInfo={description:"Supplies both `src` and `name`, showing the image presentation while\nretaining the name for alternative text and automatic fallback if loading\nfails.",displayName:`Image`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Avatar/Avatar.stories.tsx`,methods:[],props:{},tags:{summary:`Image avatar with named fallback behaviour.`}}}catch{}try{m.displayName=`Sizes`,m.__docgenInfo={description:"Renders the same initials at `sm`, `md`, and `lg` to compare canonical\nperson-avatar sizes without changing identity or semantics.",displayName:`Sizes`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Avatar/Avatar.stories.tsx`,methods:[],props:{},tags:{summary:`Comparison of the three canonical avatar sizes.`}}}catch{}try{h.displayName=`SquareEntity`,h.__docgenInfo={description:'Uses `shape="square"` with an explicit one-character initials override for a\ncompact non-person entity marker.',displayName:`SquareEntity`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Avatar/Avatar.stories.tsx`,methods:[],props:{},tags:{summary:`Compact square marker for an entity rather than a person.`}}}catch{}try{g.displayName=`EntityMarkers`,g.__docgenInfo={description:`Compares compact and medium square entity markers in primary and accent
tones, verifying equal geometry, square corners, and the semantic accent
treatment.`,displayName:`EntityMarkers`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Avatar/Avatar.stories.tsx`,methods:[],props:{},tags:{summary:`Square entity-marker sizes and semantic tones.`}}}catch{}_=[`Initials`,`Image`,`Sizes`,`SquareEntity`,`EntityMarkers`]}));v();export{g as EntityMarkers,p as Image,f as Initials,m as Sizes,h as SquareEntity,_ as __namedExportsOrder,d as default,v as n,s as t};