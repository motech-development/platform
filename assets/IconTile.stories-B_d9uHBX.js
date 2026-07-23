import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{n as r,t as i}from"./Inline-Cq76i5T1.js";import{M as a,N as o,a as s,n as c,r as l}from"./icons-Cg1FNHcV.js";import{n as u,t as d}from"./IconTile-szvIJ_pB.js";var f=e({BorderlessMarkers:()=>v,SemanticTiles:()=>_,__namedExportsOrder:()=>y,default:()=>g}),p,m,h,g,_,v,y,b=t((()=>{o(),r(),u(),p=n(),{expect:m,within:h}=__STORYBOOK_MODULE_TEST__,g={component:d,title:`Foundation/IconTile`},_={args:{children:(0,p.jsx)(s,{})},render:()=>(0,p.jsxs)(i,{align:`stretch`,gap:`compact`,wrap:!1,children:[(0,p.jsx)(d,{variant:`primary`,children:(0,p.jsx)(s,{})}),(0,p.jsx)(d,{variant:`warning`,children:(0,p.jsx)(a,{})}),(0,p.jsx)(d,{size:`lg`,variant:`danger`,children:(0,p.jsx)(a,{})})]})},v={args:{children:(0,p.jsx)(s,{})},play:async({canvasElement:e})=>{let t=h(e),n=[t.getByTestId(`income-marker`),t.getByTestId(`expense-marker`),t.getByTestId(`neutral-marker`)],r=t.getByTestId(`status-code`),i=e.ownerDocument.defaultView;await Promise.all(n.map(async e=>{let t=i?.getComputedStyle(e);await m(e.getBoundingClientRect().width).toBe(e.getBoundingClientRect().height),await m(e.getBoundingClientRect().width).toBeGreaterThan(0),await m(t?.borderTopWidth).toBe(`0px`),await m(Number.parseFloat(t?.borderRadius??`0`)).toBeGreaterThanOrEqual(18)})),await m(i?.getComputedStyle(t.getByTestId(`neutral-marker`)).backgroundColor).toBe(`rgb(223, 227, 233)`),await m(r.getBoundingClientRect().width).toBe(r.getBoundingClientRect().height),await m(r.getBoundingClientRect().width).toBeGreaterThan(0),await m(r).not.toHaveAttribute(`aria-hidden`),await m(i?.getComputedStyle(r).borderTopWidth).toBe(`0px`),await m(i?.getComputedStyle(r).fontFamily).toContain(`Cabin`),await m(i?.getComputedStyle(r).fontSize).toBe(`24px`)},render:()=>(0,p.jsxs)(i,{gap:`compact`,wrap:!1,children:[(0,p.jsx)(d,{bordered:!1,"data-testid":`income-marker`,shape:`circle`,size:`sm`,variant:`success`,children:(0,p.jsx)(l,{})}),(0,p.jsx)(d,{bordered:!1,"data-testid":`expense-marker`,shape:`circle`,size:`sm`,variant:`danger`,children:(0,p.jsx)(c,{})}),(0,p.jsx)(d,{bordered:!1,"data-testid":`neutral-marker`,shape:`circle`,size:`sm`,variant:`neutral`,children:(0,p.jsx)(c,{})}),(0,p.jsx)(d,{bordered:!1,"data-testid":`status-code`,decorative:!1,size:`lg`,children:`404`})]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    children: <CalendarIcon />
  },
  render: () => <Inline align="stretch" gap="compact" wrap={false}>
      <IconTile variant="primary">
        <CalendarIcon />
      </IconTile>
      <IconTile variant="warning">
        <WarningIcon />
      </IconTile>
      <IconTile size="lg" variant="danger">
        <WarningIcon />
      </IconTile>
    </Inline>
}`,..._.parameters?.docs?.source},description:{story:`Compares primary, warning, and danger marker tiles across canonical sizes so
surrounding content can express constrained semantic emphasis.

@summary bordered semantic marker variants and sizes`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    children: <CalendarIcon />
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const markers = [canvas.getByTestId('income-marker'), canvas.getByTestId('expense-marker'), canvas.getByTestId('neutral-marker')];
    const statusCode = canvas.getByTestId('status-code');
    const view = canvasElement.ownerDocument.defaultView;
    await Promise.all(markers.map(async marker => {
      const style = view?.getComputedStyle(marker);
      await expect(marker.getBoundingClientRect().width).toBe(marker.getBoundingClientRect().height);
      await expect(marker.getBoundingClientRect().width).toBeGreaterThan(0);
      await expect(style?.borderTopWidth).toBe('0px');
      await expect(Number.parseFloat(style?.borderRadius ?? '0')).toBeGreaterThanOrEqual(18);
    }));
    await expect(view?.getComputedStyle(canvas.getByTestId('neutral-marker')).backgroundColor).toBe('rgb(223, 227, 233)');
    await expect(statusCode.getBoundingClientRect().width).toBe(statusCode.getBoundingClientRect().height);
    await expect(statusCode.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(statusCode).not.toHaveAttribute('aria-hidden');
    await expect(view?.getComputedStyle(statusCode).borderTopWidth).toBe('0px');
    await expect(view?.getComputedStyle(statusCode).fontFamily).toContain('Cabin');
    await expect(view?.getComputedStyle(statusCode).fontSize).toBe('24px');
  },
  render: () => <Inline gap="compact" wrap={false}>
      <IconTile bordered={false} data-testid="income-marker" shape="circle" size="sm" variant="success">
        <ArrowRightIcon />
      </IconTile>
      <IconTile bordered={false} data-testid="expense-marker" shape="circle" size="sm" variant="danger">
        <ArrowLeftIcon />
      </IconTile>
      <IconTile bordered={false} data-testid="neutral-marker" shape="circle" size="sm" variant="neutral">
        <ArrowLeftIcon />
      </IconTile>
      <IconTile bordered={false} data-testid="status-code" decorative={false} size="lg">
        404
      </IconTile>
    </Inline>
}`,...v.parameters?.docs?.source},description:{story:`Shows circular borderless status markers plus a meaningful text marker that
deliberately remains exposed to assistive technology.

@summary borderless decorative icons and meaningful marker text`,...v.parameters?.docs?.description}}};try{g.displayName=`IconTile`,g.__docgenInfo={description:`Presents decorative or meaningful marker content with canonical geometry,
sizing, and constrained semantic colour emphasis.`,displayName:`IconTile`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconTile/IconTile.stories.tsx`,methods:[],props:{bordered:{defaultValue:{value:`true`},declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:"Adds the semantic variant border. Defaults to `true`.",name:`bordered`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:`The visual marker content rendered inside the tile.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!0,tags:{},type:{name:`ReactNode`}},decorative:{defaultValue:{value:`true`},declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:"Hides marker content from assistive technology. Defaults to `true`.",name:`decorative`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:`Ref to the rendered span.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!1,tags:{},type:{name:`Ref<HTMLSpanElement> | undefined`}},shape:{defaultValue:{value:`square`},declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:"Square or circular marker geometry. Defaults to `square`.",name:`shape`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!1,tags:{},type:{name:`"circle" | "square" | undefined`}},size:{defaultValue:{value:`md`},declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:"Canonical tile size. Defaults to `md`.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!1,tags:{},type:{name:`ControlSize | undefined`}},variant:{defaultValue:{value:`primary`},declarations:[{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`}],description:"Semantic colour. Defaults to `primary`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/IconTile/IconTile.tsx`,name:`IconTileProps`},required:!1,tags:{},type:{name:`IconTileVariant | undefined`}}},tags:{summary:`semantic presentation tile for icons and short markers`}}}catch{}try{_.displayName=`SemanticTiles`,_.__docgenInfo={description:`Compares primary, warning, and danger marker tiles across canonical sizes so
surrounding content can express constrained semantic emphasis.`,displayName:`SemanticTiles`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconTile/IconTile.stories.tsx`,methods:[],props:{},tags:{summary:`bordered semantic marker variants and sizes`}}}catch{}try{v.displayName=`BorderlessMarkers`,v.__docgenInfo={description:`Shows circular borderless status markers plus a meaningful text marker that
deliberately remains exposed to assistive technology.`,displayName:`BorderlessMarkers`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/IconTile/IconTile.stories.tsx`,methods:[],props:{},tags:{summary:`borderless decorative icons and meaningful marker text`}}}catch{}y=[`SemanticTiles`,`BorderlessMarkers`]}));b();export{v as BorderlessMarkers,_ as SemanticTiles,y as __namedExportsOrder,g as default,b as n,f as t};