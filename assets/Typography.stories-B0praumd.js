import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{n as r,t as i}from"./Typography-CB5sgMJ5.js";import{n as a,t as o}from"./Surface-CQL1S66t.js";import{n as s,t as c}from"./Stack-CVdmyomW.js";var l=e({ContentHandling:()=>_,InheritedAlignment:()=>v,Levels:()=>m,SemanticColours:()=>g,SemanticIndependence:()=>h,__namedExportsOrder:()=>y,default:()=>p}),u,d,f,p,m,h,g,_,v,y,b=t((()=>{s(),a(),r(),u=n(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p={component:i,title:`Foundation/Typography`},m={args:{children:`Typography`},play:async()=>{await document.fonts.load(`700 16px "Cabin Variable"`),await d(document.fonts.check(`700 16px "Cabin Variable"`)).toBe(!0)},render:()=>(0,u.jsxs)(`div`,{children:[(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`h1`,children:`h1: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`h2`,children:`h2: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`h3`,children:`h3: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`h4`,children:`h4: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`h5`,children:`h5: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`h6`,children:`h6: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`metric`,children:`metric: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`summary`,children:`summary: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`label`,children:`label: The quick brown fox 0123456789`}),(0,u.jsx)(i,{as:`div`,gutterBottom:!0,level:`body`,children:`body: The quick brown fox 0123456789`})]})},h={args:{as:`h2`,children:`A semantic h2 with h4 styling`,level:`h4`}},g={args:{children:`Typography`},render:()=>(0,u.jsxs)(c,{gap:`compact`,children:[(0,u.jsx)(o,{border:`none`,padding:`lg`,children:(0,u.jsx)(i,{colour:`primary`,children:`Primary action context`})}),(0,u.jsx)(o,{border:`none`,padding:`lg`,tone:`inverse`,children:(0,u.jsxs)(c,{gap:`compact`,children:[(0,u.jsx)(i,{colour:`inverse`,children:`Inverse text`}),(0,u.jsx)(i,{colour:`inverse-muted`,children:`Muted inverse text`})]})})]})},_={args:{children:`A long body of content demonstrates bounded line clamping without exposing general layout props. A long body of content demonstrates bounded line clamping without exposing general layout props.`,lineClamp:2}},v={args:{children:`Inherited alignment`},play:async({canvasElement:e})=>{let t=f(e).getByText(`Inherited alignment`),n=e.ownerDocument.defaultView;await d(n?.getComputedStyle(t).textAlign).toBe(`end`)},render:()=>(0,u.jsx)(i,{align:`end`,as:`div`,children:(0,u.jsx)(i,{children:`Inherited alignment`})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Typography'
  },
  play: async () => {
    await document.fonts.load('700 16px "Cabin Variable"');
    await expect(document.fonts.check('700 16px "Cabin Variable"')).toBe(true);
  },
  render: () => <div>
      <Typography as="div" gutterBottom level="h1">
        h1: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h2">
        h2: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h3">
        h3: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h4">
        h4: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h5">
        h5: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="h6">
        h6: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="metric">
        metric: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="summary">
        summary: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="label">
        label: The quick brown fox 0123456789
      </Typography>
      <Typography as="div" gutterBottom level="body">
        body: The quick brown fox 0123456789
      </Typography>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Renders every visual text level with letters and numerals and verifies the
bundled Cabin display font is available for heading and label treatments.

@summary complete visual typography level scale`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'h2',
    children: 'A semantic h2 with h4 styling',
    level: 'h4'
  }
}`,...h.parameters?.docs?.source},description:{story:`Renders a semantic second-level heading with fourth-level visual styling to
demonstrate that document structure and appearance are independent.

@summary semantic heading with an independent visual level`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Typography'
  },
  render: () => <Stack gap="compact">
      <Surface border="none" padding="lg">
        <Typography colour="primary">Primary action context</Typography>
      </Surface>
      <Surface border="none" padding="lg" tone="inverse">
        <Stack gap="compact">
          <Typography colour="inverse">Inverse text</Typography>
          <Typography colour="inverse-muted">Muted inverse text</Typography>
        </Stack>
      </Surface>
    </Stack>
}`,...g.parameters?.docs?.source},description:{story:`Compares primary text on a surface with inverse and muted-inverse text on the
shell, demonstrating semantic colours across contrasting contexts.

@summary semantic text colours on surface and shell contexts`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'A long body of content demonstrates bounded line clamping without exposing general layout props. A long body of content demonstrates bounded line clamping without exposing general layout props.',
    lineClamp: 2
  }
}`,..._.parameters?.docs?.source},description:{story:`Constrains a long body paragraph to two lines so bounded clamping can be
evaluated without introducing general layout or overflow props.

@summary long body copy with a two-line clamp`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Inherited alignment'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText('Inherited alignment');
    const view = canvasElement.ownerDocument.defaultView;
    await expect(view?.getComputedStyle(text).textAlign).toBe('end');
  },
  render: () => <Typography align="end" as="div">
      <Typography>Inherited alignment</Typography>
    </Typography>
}`,...v.parameters?.docs?.source},description:{story:`Leaves alignment unspecified inside an end-aligned parent and verifies the
text preserves ordinary CSS inheritance rather than forcing start alignment.

@summary typography inheriting alignment from its parent`,...v.parameters?.docs?.description}}};try{p.displayName=`Typography`,p.__docgenInfo={description:`Renders non-interactive text with independent semantic and visual choices.`,displayName:`Typography`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Typography/Typography.stories.tsx`,methods:[],props:{align:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:`Text alignment. Inherits from the containing layout by default.`,name:`align`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`"center" | "end" | "start" | undefined`}},as:{defaultValue:{value:`p`},declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:"Constrained semantic element. Defaults to `p`.",name:`as`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`TypographyElement | undefined`}},colour:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:"Semantic text colour. Defaults to `default`.",name:`colour`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`TypographyColour | undefined`}},gutterBottom:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:"Adds canonical bottom rhythm to block elements. Defaults to `false`.",name:`gutterBottom`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},level:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:"Visual level. Defaults from `as`, otherwise `body`.",name:`level`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`TypographyLevel | undefined`}},lineClamp:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:`Bounds text to a supported number of lines. Defaults to no clamp.`,name:`lineClamp`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`2 | 3 | 4 | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:`Ref to the rendered element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}},tabularNumbers:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:"Uses tabular numeral glyphs. Defaults to `false`.",name:`tabularNumbers`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},truncate:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:"Truncates one line with an ellipsis. Defaults to `false`.",name:`truncate`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},weight:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`}],description:`Font weight override. Defaults to the selected level.`,name:`weight`,parent:{fileName:`breeze-ui/src/primitives/Typography/Typography.tsx`,name:`TypographyProps`},required:!1,tags:{},type:{name:`"bold" | "medium" | "regular" | "semibold" | undefined`}}},tags:{summary:`semantic non-interactive text with a separate visual level`}}}catch{}try{m.displayName=`Levels`,m.__docgenInfo={description:`Renders every visual text level with letters and numerals and verifies the
bundled Cabin display font is available for heading and label treatments.`,displayName:`Levels`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Typography/Typography.stories.tsx`,methods:[],props:{},tags:{summary:`complete visual typography level scale`}}}catch{}try{h.displayName=`SemanticIndependence`,h.__docgenInfo={description:`Renders a semantic second-level heading with fourth-level visual styling to
demonstrate that document structure and appearance are independent.`,displayName:`SemanticIndependence`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Typography/Typography.stories.tsx`,methods:[],props:{},tags:{summary:`semantic heading with an independent visual level`}}}catch{}try{g.displayName=`SemanticColours`,g.__docgenInfo={description:`Compares primary text on a surface with inverse and muted-inverse text on the
shell, demonstrating semantic colours across contrasting contexts.`,displayName:`SemanticColours`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Typography/Typography.stories.tsx`,methods:[],props:{},tags:{summary:`semantic text colours on surface and shell contexts`}}}catch{}try{_.displayName=`ContentHandling`,_.__docgenInfo={description:`Constrains a long body paragraph to two lines so bounded clamping can be
evaluated without introducing general layout or overflow props.`,displayName:`ContentHandling`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Typography/Typography.stories.tsx`,methods:[],props:{},tags:{summary:`long body copy with a two-line clamp`}}}catch{}try{v.displayName=`InheritedAlignment`,v.__docgenInfo={description:`Leaves alignment unspecified inside an end-aligned parent and verifies the
text preserves ordinary CSS inheritance rather than forcing start alignment.`,displayName:`InheritedAlignment`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Typography/Typography.stories.tsx`,methods:[],props:{},tags:{summary:`typography inheriting alignment from its parent`}}}catch{}y=[`Levels`,`SemanticIndependence`,`SemanticColours`,`ContentHandling`,`InheritedAlignment`]}));b();export{_ as ContentHandling,v as InheritedAlignment,m as Levels,g as SemanticColours,h as SemanticIndependence,y as __namedExportsOrder,p as default,b as n,l as t};