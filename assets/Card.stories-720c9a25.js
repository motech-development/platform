import{j as r,B as n}from"./BaseStyles-ba442780.js";import{d as s}from"./index-49721cb5.js";import{C as o}from"./Card-15d83a81.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./index-633d3215.js";const B={component:o,decorators:[s.withKnobs]},m={Large:"lg",Medium:"md",Small:"sm"},e={name:"Basic card",render:()=>r.jsxs(r.Fragment,{children:[r.jsx(n,{}),r.jsx(o,{padding:s.select("Padding",m,"md"),children:s.text("Text","Hello world")})]})};var a,d,t;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  name: 'Basic card',
  render: () => <>
      <BaseStyles />

      <Card padding={select('Padding', padding, 'md') as 'sm' | 'md' | 'lg'}>
        {text('Text', 'Hello world')}
      </Card>
    </>
}`,...(t=(d=e.parameters)==null?void 0:d.docs)==null?void 0:t.source}}};const C=["BasicCard"];export{e as BasicCard,C as __namedExportsOrder,B as default};
