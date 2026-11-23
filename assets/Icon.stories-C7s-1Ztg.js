import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{n,t as r}from"./Icon-ByXesrrx.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Typography-CEt3x14j.js";import{n as s,t as c}from"./Stack-_A66K6E3.js";import{n as l,t as u}from"./Inline-COgaq7ET.js";var d=t({Decorative:()=>y,Explained:()=>x,Gallery:()=>S,Named:()=>b,Sizes:()=>C,__namedExportsOrder:()=>w,default:()=>v}),f,p,m,h,g,_,v,y,b,x,S,C,w,T=e((()=>{l(),s(),a(),n(),f=i(),{expect:p,userEvent:m,within:h}=__STORYBOOK_MODULE_TEST__,g=[`overview`,`people`,`calendar`,`document`,`building`,`settings`,`notifications`,`add`,`warning`],_=[[`2xs`,14],[`xs`,15],[`sm`,16],[`md`,17],[`lg`,20],[`xl`,21],[`2xl`,22],[`3xl`,24],[`4xl`,26]],v={args:{name:`calendar`},component:r,title:`Content/Icon`},y={},b={args:{label:`Choose a date`}},x={args:{label:`Locked`,name:`lock`,tooltip:`This category is fixed and cannot be changed or removed`},play:async({canvasElement:e})=>{let t=h(e.ownerDocument.body);await m.tab(),await p(t.getByRole(`img`,{name:`Locked`})).toHaveFocus(),await p(await t.findByRole(`tooltip`)).toBeVisible()}},S={render:()=>(0,f.jsx)(u,{gap:5,wrap:!0,children:g.map(e=>(0,f.jsxs)(c,{gap:1,horizontalAlign:`center`,children:[(0,f.jsx)(r,{name:e}),(0,f.jsx)(o,{variant:`caption`,children:e})]},e))})},C={play:async({canvasElement:e})=>{let t=[...e.querySelectorAll(`svg`)],n=_.map(([,e])=>e);await p(t.map(e=>e.getBoundingClientRect().width)).toEqual(n),await p(t.map(e=>e.getBoundingClientRect().height)).toEqual(n)},render:()=>(0,f.jsx)(u,{gap:5,verticalAlign:`end`,wrap:!0,children:_.map(([e,t])=>(0,f.jsxs)(c,{gap:1,horizontalAlign:`center`,children:[(0,f.jsx)(r,{name:`calendar`,size:e}),(0,f.jsxs)(o,{variant:`caption`,children:[e,` · `,t,`px`]})]},e))})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{}`,...y.parameters?.docs?.source},description:{story:`Decorative artwork inherits the surrounding text colour.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Choose a date'
  }
}`,...b.parameters?.docs?.source},description:{story:`A named icon used without an accompanying text label.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Locked',
    name: 'lock',
    tooltip: 'This category is fixed and cannot be changed or removed'
  },
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await expect(page.getByRole('img', {
      name: 'Locked'
    })).toHaveFocus();
    await expect(await page.findByRole('tooltip')).toBeVisible();
  }
}`,...x.parameters?.docs?.source},description:{story:`A focusable icon explained on hover and keyboard focus.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Inline gap={5} wrap>
      {names.map(name => <Stack gap={1} horizontalAlign="center" key={name}>
          <Icon name={name} />
          <Typography variant="caption">{name}</Typography>
        </Stack>)}
    </Inline>
}`,...S.parameters?.docs?.source},description:{story:`A sample of the curated semantic artwork names.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const icons = [...canvasElement.querySelectorAll('svg')];
    const pixels = sizes.map(([, size]) => size);
    await expect(icons.map(icon => icon.getBoundingClientRect().width)).toEqual(pixels);
    await expect(icons.map(icon => icon.getBoundingClientRect().height)).toEqual(pixels);
  },
  render: () => <Inline gap={5} verticalAlign="end" wrap>
      {sizes.map(([size, pixels]) => <Stack gap={1} horizontalAlign="center" key={size}>
          <Icon name="calendar" size={size} />
          <Typography variant="caption">
            {size} · {pixels}px
          </Typography>
        </Stack>)}
    </Inline>
}`,...C.parameters?.docs?.source},description:{story:`Each size on the closed scale, labelled with its rendered square in pixels.`,...C.parameters?.docs?.description}}};try{v.displayName=`Icon`,v.__docgenInfo={description:`Renders one curated Lucide glyph under Breeze's semantic artwork names.`,displayName:`Icon`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Icon/Icon.stories.tsx`,methods:[],props:{name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`IconCommonProps`},{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`IconCommonProps`}],description:`Selects artwork from the curated Breeze icon set.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`IconCommonProps`},required:!0,tags:{},type:{name:`"add" | "back" | "building" | "calendar" | "camera" | "check" | "clock" | "close" | "delete" | "document" | "download" | "expand" | "forward" | "incoming" | "list" | "lock" | "more" | ... 7 more ... | "warning"`}},size:{defaultValue:{value:`sm`},declarations:[{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`IconCommonProps`},{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`IconCommonProps`}],description:"Selects dimensions from `2xs` (14px) to `4xl` (26px). Defaults to `sm` (16px).",name:`size`,parent:{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`IconCommonProps`},required:!1,tags:{},type:{name:`"2xl" | "2xs" | "3xl" | "4xl" | "lg" | "md" | "sm" | "xl" | "xs" | undefined`}},label:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`ExplainedIconProps`},{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`PlainIconProps`}],description:`Names the artwork.
Names meaningful artwork; omit for an icon already described by nearby text.`,name:`label`,parent:{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`ExplainedIconProps`},required:!1,tags:{},type:{name:`string | undefined`}},tooltip:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`ExplainedIconProps`},{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`PlainIconProps`}],description:"Short explanation shown on hover and keyboard focus; makes the icon focusable.\nRequires a `label`.",name:`tooltip`,parent:{fileName:`breeze-ui/src/primitives/Icon/Icon.tsx`,name:`ExplainedIconProps`},required:!1,tags:{},type:{name:`string | undefined`}}},tags:{summary:`The single dependency boundary for Breeze icon artwork.`}}}catch{}try{y.displayName=`Decorative`,y.__docgenInfo={description:`Decorative artwork inherits the surrounding text colour.`,displayName:`Decorative`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Icon/Icon.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{b.displayName=`Named`,b.__docgenInfo={description:`A named icon used without an accompanying text label.`,displayName:`Named`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Icon/Icon.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{x.displayName=`Explained`,x.__docgenInfo={description:`A focusable icon explained on hover and keyboard focus.`,displayName:`Explained`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Icon/Icon.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{S.displayName=`Gallery`,S.__docgenInfo={description:`A sample of the curated semantic artwork names.`,displayName:`Gallery`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Icon/Icon.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{C.displayName=`Sizes`,C.__docgenInfo={description:`Each size on the closed scale, labelled with its rendered square in pixels.`,displayName:`Sizes`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Icon/Icon.stories.tsx`,methods:[],props:{},tags:{}}}catch{}w=[`Decorative`,`Named`,`Explained`,`Gallery`,`Sizes`]}));T();export{y as Decorative,x as Explained,S as Gallery,b as Named,C as Sizes,w as __namedExportsOrder,v as default,T as n,d as t};