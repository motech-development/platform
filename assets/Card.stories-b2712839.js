import{j as r,B as n}from"./BaseStyles-5cc577b5.js";import{d as s}from"./index-d8a6010f.js";import{C as o}from"./Card-fc232f28.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";const g={component:o,decorators:[s.withKnobs]},m={Large:"lg",Medium:"md",Small:"sm"},e={name:"Basic card",render:()=>r.jsxs(r.Fragment,{children:[r.jsx(n,{}),r.jsx(o,{padding:s.select("Padding",m,"md"),children:s.text("Text","Hello world")})]})};var a,d,t;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  name: 'Basic card',
  render: () => <>
      <BaseStyles />

      <Card padding={select('Padding', padding, 'md') as 'sm' | 'md' | 'lg'}>
        {text('Text', 'Hello world')}
      </Card>
    </>
}`,...(t=(d=e.parameters)==null?void 0:d.docs)==null?void 0:t.source}}};const B=["BasicCard"];export{e as BasicCard,B as __namedExportsOrder,g as default};
