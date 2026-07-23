import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{n as r,t as i}from"./Grid-CuyrxTy3.js";import{n as a,t as o}from"./Inline-Cq76i5T1.js";import{n as s,t as c}from"./Typography-CB5sgMJ5.js";import{n as l,t as u}from"./StoryConstraint-yY2orZcv.js";import{n as d,t as f}from"./Surface-CQL1S66t.js";import{n as p,t as m}from"./Stack-CVdmyomW.js";import{n as h,t as g}from"./Skeleton-B1-oo4q9.js";var _=e({InlineText:()=>C,Shapes:()=>w,Text:()=>S,Tones:()=>T,__namedExportsOrder:()=>E,default:()=>x}),v,y,b,x,S,C,w,T,E,D=t((()=>{l(),r(),a(),p(),d(),s(),h(),v=n(),{expect:y,within:b}=__STORYBOOK_MODULE_TEST__,x={component:g,title:`Feedback/Skeleton`},S={args:{},play:async({canvasElement:e})=>{let t=b(e).getByTestId(`text-skeleton`);await y(getComputedStyle(t).height).toBe(`14px`),await y(t).toHaveAttribute(`aria-hidden`,`true`)},render:()=>(0,v.jsx)(g,{"data-testid":`text-skeleton`})},C={args:{},play:async({canvasElement:e})=>{let t=b(e),n=t.getByTestId(`inline-skeleton`);await y(n.tagName).toBe(`SPAN`),await y(n).toHaveAttribute(`aria-hidden`,`true`),await y(t.getByRole(`heading`)).toHaveAccessibleName(`Loading project summary`)},render:()=>(0,v.jsxs)(o,{gap:`compact`,wrap:!1,children:[(0,v.jsx)(c,{as:`h2`,children:`Loading project summary`}),(0,v.jsx)(g,{as:`span`,className:`inline-block w-24`,"data-testid":`inline-skeleton`})]})},w={args:{},decorators:[e=>(0,v.jsx)(u,{size:`bounded-control`,children:(0,v.jsx)(e,{})})],render:()=>(0,v.jsxs)(i,{className:`grid-cols-[auto_1fr]`,gap:`md`,children:[(0,v.jsx)(g,{shape:`circle`}),(0,v.jsxs)(m,{gap:`sm`,justify:`center`,children:[(0,v.jsx)(g,{className:`w-2/3`}),(0,v.jsx)(g,{})]}),(0,v.jsx)(g,{className:`col-span-2 min-h-32`,shape:`rectangle`})]})},T={args:{},play:async({canvasElement:e})=>{let t=b(e),n=e.ownerDocument.defaultView;await y(n?.getComputedStyle(t.getByTestId(`default`)).backgroundColor).toBe(`rgb(223, 228, 235)`),await y(n?.getComputedStyle(t.getByTestId(`inverse`)).backgroundColor).toBe(`rgb(86, 97, 116)`),await y(n?.getComputedStyle(t.getByTestId(`danger`)).backgroundColor).toBe(`rgb(243, 218, 221)`)},render:()=>(0,v.jsx)(u,{size:`bounded-control`,children:(0,v.jsx)(f,{border:`none`,padding:`md`,tone:`inverse`,children:(0,v.jsxs)(m,{gap:`md`,children:[(0,v.jsx)(g,{"data-testid":`inverse`,tone:`inverse`}),(0,v.jsx)(f,{border:`none`,padding:`md`,children:(0,v.jsxs)(m,{gap:`md`,children:[(0,v.jsx)(g,{"data-testid":`default`}),(0,v.jsx)(g,{"data-testid":`danger`,tone:`danger`})]})})]})})})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {},
  play: async ({
    canvasElement
  }) => {
    const placeholder = within(canvasElement).getByTestId('text-skeleton');
    await expect(getComputedStyle(placeholder).height).toBe('14px');
    await expect(placeholder).toHaveAttribute('aria-hidden', 'true');
  },
  render: () => <Skeleton data-testid="text-skeleton" />
}`,...S.parameters?.docs?.source},description:{story:`Shows the canonical full-width text-line placeholder and verifies its visual
height while keeping the decorative shape non-announcing.

@summary canonical non-announcing text skeleton`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {},
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const placeholder = canvas.getByTestId('inline-skeleton');
    await expect(placeholder.tagName).toBe('SPAN');
    await expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByRole('heading')).toHaveAccessibleName('Loading project summary');
  },
  render: () => <Inline gap="compact" wrap={false}>
      <Typography as="h2">Loading project summary</Typography>
      <Skeleton as="span" className="inline-block w-24" data-testid="inline-skeleton" />
    </Inline>
}`,...C.parameters?.docs?.source},description:{story:`Renders a typed span placeholder alongside a real heading name so the inline
shape remains decorative without obscuring meaningful loading context.

@summary inline span skeleton beside accessible loading text`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <StoryConstraint size="bounded-control">
        <Story />
      </StoryConstraint>],
  render: () => <Grid className="grid-cols-[auto_1fr]" gap="md">
      <Skeleton shape="circle" />
      <Stack gap="sm" justify="center">
        <Skeleton className="w-2/3" />
        <Skeleton />
      </Stack>
      <Skeleton className="col-span-2 min-h-32" shape="rectangle" />
    </Grid>
}`,...w.parameters?.docs?.source},description:{story:`Composes circular, text-line, and rectangular placeholders into an
application-owned loading layout that approximates avatar and content rows.

@summary composed circle text and rectangle skeleton shapes`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {},
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const view = canvasElement.ownerDocument.defaultView;
    await expect(view?.getComputedStyle(canvas.getByTestId('default')).backgroundColor).toBe('rgb(223, 228, 235)');
    await expect(view?.getComputedStyle(canvas.getByTestId('inverse')).backgroundColor).toBe('rgb(86, 97, 116)');
    await expect(view?.getComputedStyle(canvas.getByTestId('danger')).backgroundColor).toBe('rgb(243, 218, 221)');
  },
  render: () => <StoryConstraint size="bounded-control">
      <Surface border="none" padding="md" tone="inverse">
        <Stack gap="md">
          <Skeleton data-testid="inverse" tone="inverse" />
          <Surface border="none" padding="md">
            <Stack gap="md">
              <Skeleton data-testid="default" />
              <Skeleton data-testid="danger" tone="danger" />
            </Stack>
          </Surface>
        </Stack>
      </Surface>
    </StoryConstraint>
}`,...T.parameters?.docs?.source},description:{story:`Compares inverse, default, and danger placeholders on their intended dark
and ordinary surfaces and verifies each semantic background token.

@summary surface-aware default inverse and danger skeleton tones`,...T.parameters?.docs?.description}}};try{x.displayName=`Skeleton`,x.__docgenInfo={description:`Reserves loading layout without adding content to the accessibility tree.`,displayName:`Skeleton`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Skeleton/Skeleton.stories.tsx`,methods:[],props:{as:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Skeleton/Skeleton.tsx`,name:`TypeLiteral`}],description:"Render as a `span` when the placeholder must sit inside text content.",name:`as`,required:!1,tags:{},type:{name:`SkeletonElement | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Skeleton/Skeleton.tsx`,name:`TypeLiteral`}],description:`Ref to the rendered placeholder element.`,name:`ref`,required:!1,tags:{},type:{name:`RefObject<SkeletonElementNode<Element> | null> | ((instance: SkeletonElementNode<Element> | null) => void | (() => VoidOrUndefinedOnly)) | null | undefined`}},shape:{defaultValue:{value:`text`},declarations:[{fileName:`breeze-ui/src/primitives/Skeleton/Skeleton.tsx`,name:`TypeLiteral`}],description:"Placeholder geometry. Defaults to `text`.",name:`shape`,required:!1,tags:{},type:{name:`"circle" | "rectangle" | "text" | undefined`}},tone:{defaultValue:{value:`default`},declarations:[{fileName:`breeze-ui/src/primitives/Skeleton/Skeleton.tsx`,name:`TypeLiteral`}],description:"Surface-aware placeholder colour. Defaults to `default`.",name:`tone`,required:!1,tags:{},type:{name:`"danger" | "default" | "inverse" | undefined`}}},tags:{summary:`non-announcing loading placeholder with canonical shapes`}}}catch{}try{S.displayName=`Text`,S.__docgenInfo={description:`Shows the canonical full-width text-line placeholder and verifies its visual
height while keeping the decorative shape non-announcing.`,displayName:`Text`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Skeleton/Skeleton.stories.tsx`,methods:[],props:{},tags:{summary:`canonical non-announcing text skeleton`}}}catch{}try{C.displayName=`InlineText`,C.__docgenInfo={description:`Renders a typed span placeholder alongside a real heading name so the inline
shape remains decorative without obscuring meaningful loading context.`,displayName:`InlineText`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Skeleton/Skeleton.stories.tsx`,methods:[],props:{},tags:{summary:`inline span skeleton beside accessible loading text`}}}catch{}try{w.displayName=`Shapes`,w.__docgenInfo={description:`Composes circular, text-line, and rectangular placeholders into an
application-owned loading layout that approximates avatar and content rows.`,displayName:`Shapes`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Skeleton/Skeleton.stories.tsx`,methods:[],props:{},tags:{summary:`composed circle text and rectangle skeleton shapes`}}}catch{}try{T.displayName=`Tones`,T.__docgenInfo={description:`Compares inverse, default, and danger placeholders on their intended dark
and ordinary surfaces and verifies each semantic background token.`,displayName:`Tones`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Skeleton/Skeleton.stories.tsx`,methods:[],props:{},tags:{summary:`surface-aware default inverse and danger skeleton tones`}}}catch{}E=[`Text`,`InlineText`,`Shapes`,`Tones`]}));D();export{C as InlineText,w as Shapes,S as Text,T as Tones,E as __namedExportsOrder,x as default,D as n,_ as t};