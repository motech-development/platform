import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{n as r,r as i}from"./BreezeContext-D8B-y9s5.js";import{n as a,t as o}from"./Typography-CEt3x14j.js";import{n as s,t as c}from"./Stack-_A66K6E3.js";import{n as l,t as u}from"./Inline-COgaq7ET.js";function d({orientation:e=`horizontal`}){return i(),(0,f.jsx)(`hr`,{"aria-orientation":e,className:[p.base.separator,p.variant[e]].join(` `)})}var f,p,m=e((()=>{r(),f=n(),p={base:{separator:`breeze:m-0 breeze:shrink-0 breeze:border-0 breeze:bg-breeze-line breeze:forced-colors:bg-[CanvasText]`},compound:{},size:{},state:{},variant:{horizontal:`breeze:block-breeze-px breeze:inline-full`,vertical:`breeze:self-stretch breeze:inline-breeze-px`}};try{d.displayName=`Separator`,d.__docgenInfo={description:`Separates adjacent regions along a horizontal or vertical axis.`,displayName:`Separator`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Separator/Separator.tsx`,methods:[],props:{orientation:{defaultValue:{value:`horizontal`},declarations:[{fileName:`breeze-ui/src/primitives/Separator/Separator.tsx`,name:`SeparatorProps`}],description:"Sets the divider axis; vertical stretches to its `Inline` or `Grid` row. Defaults to `horizontal`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/Separator/Separator.tsx`,name:`SeparatorProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}}},tags:{summary:`A semantic one-token divider.`}}}catch{}})),h=t({Horizontal:()=>y,Vertical:()=>b,__namedExportsOrder:()=>x,default:()=>v}),g,_,v,y,b,x,S=e((()=>{l(),s(),a(),m(),g=n(),{expect:_}=__STORYBOOK_MODULE_TEST__,v={component:d,title:`Content/Separator`},y={},b={args:{orientation:`vertical`},play:async({canvasElement:e})=>{let t=e.querySelector(`hr`),n=t?.parentElement;if(!t||!n)throw Error(`Missing vertical separator row.`);let r=n.getBoundingClientRect().height;await _(r).toBeGreaterThan(0),await _(Math.abs(t.getBoundingClientRect().height-r)).toBeLessThan(1)},render:e=>(0,g.jsxs)(u,{gap:4,children:[(0,g.jsxs)(c,{gap:1,children:[(0,g.jsx)(o,{tone:`muted`,variant:`caption`,children:`Balance`}),(0,g.jsx)(o,{element:`span`,variant:`title`,children:`£24,180.50`})]}),(0,g.jsx)(d,{orientation:e.orientation}),(0,g.jsxs)(c,{gap:1,children:[(0,g.jsx)(o,{tone:`muted`,variant:`caption`,children:`VAT owed`}),(0,g.jsx)(o,{element:`span`,variant:`title`,children:`£3,120.00`})]})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{}`,...y.parameters?.docs?.source},description:{story:`A divider between vertically stacked regions.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical'
  },
  play: async ({
    canvasElement
  }) => {
    const separator = canvasElement.querySelector('hr');
    const row = separator?.parentElement;
    if (!separator || !row) throw new Error('Missing vertical separator row.');
    const rowHeight = row.getBoundingClientRect().height;
    await expect(rowHeight).toBeGreaterThan(0);
    await expect(Math.abs(separator.getBoundingClientRect().height - rowHeight)).toBeLessThan(1);
  },
  render: args => <Inline gap={4}>
      <Stack gap={1}>
        <Typography tone="muted" variant="caption">
          Balance
        </Typography>
        <Typography element="span" variant="title">
          £24,180.50
        </Typography>
      </Stack>
      <Separator orientation={args.orientation} />
      <Stack gap={1}>
        <Typography tone="muted" variant="caption">
          VAT owed
        </Typography>
        <Typography element="span" variant="title">
          £3,120.00
        </Typography>
      </Stack>
    </Inline>
}`,...b.parameters?.docs?.source},description:{story:"A divider that stretches to the height of an auto-height `Inline` row.",...b.parameters?.docs?.description}}};try{v.displayName=`Separator`,v.__docgenInfo={description:`Separates adjacent regions along a horizontal or vertical axis.`,displayName:`Separator`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Separator/Separator.stories.tsx`,methods:[],props:{orientation:{defaultValue:{value:`horizontal`},declarations:[{fileName:`breeze-ui/src/primitives/Separator/Separator.tsx`,name:`SeparatorProps`}],description:"Sets the divider axis; vertical stretches to its `Inline` or `Grid` row. Defaults to `horizontal`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/Separator/Separator.tsx`,name:`SeparatorProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}}},tags:{summary:`A semantic one-token divider.`}}}catch{}try{y.displayName=`Horizontal`,y.__docgenInfo={description:`A divider between vertically stacked regions.`,displayName:`Horizontal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Separator/Separator.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{b.displayName=`Vertical`,b.__docgenInfo={description:"A divider that stretches to the height of an auto-height `Inline` row.",displayName:`Vertical`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Separator/Separator.stories.tsx`,methods:[],props:{},tags:{}}}catch{}x=[`Horizontal`,`Vertical`]}));S();export{y as Horizontal,b as Vertical,x as __namedExportsOrder,v as default,S as n,h as t};