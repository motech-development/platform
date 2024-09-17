import{j as n,B as u}from"./BaseStyles-ba442780.js";import{d as r}from"./index-49721cb5.js";import{C as d}from"./Card-15d83a81.js";import{R as t,C as x}from"./Row-e21962a7.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./index-633d3215.js";const B={component:t,decorators:[r.withKnobs]},e={name:"Basic grid",render:()=>n.jsxs(n.Fragment,{children:[n.jsx(u,{}),[...Array(r.number("Rows",1))].map((l,i)=>n.jsx(t,{gutter:r.text("Gutter","1rem"),children:[...Array(r.number("Columns",12,{max:12,min:1,range:!0}))].map((c,o)=>n.jsx(x,{xs:r.number("xs",1,{max:12,min:1,range:!0}),sm:r.number("sm",0,{max:12,min:0,range:!0}),md:r.number("md",0,{max:12,min:0,range:!0}),lg:r.number("lg",0,{max:12,min:0,range:!0}),children:n.jsx(d,{children:"Hello"})},o))},i))]})};var m,a,s;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'Basic grid',
  render: () => <>
      <BaseStyles />

      {[...Array(number('Rows', 1))].map((_, i) =>
    // eslint-disable-next-line react/no-array-index-key
    <Row gutter={text('Gutter', '1rem')} key={i}>
          {[...Array(number('Columns', 12, {
        max: 12,
        min: 1,
        range: true
      }))].map((__, j) => <Col key={j} // eslint-disable-line react/no-array-index-key
      xs={number('xs', 1, {
        max: 12,
        min: 1,
        range: true
      })} sm={number('sm', 0, {
        max: 12,
        min: 0,
        range: true
      })} md={number('md', 0, {
        max: 12,
        min: 0,
        range: true
      })} lg={number('lg', 0, {
        max: 12,
        min: 0,
        range: true
      })}>
              <Card>Hello</Card>
            </Col>)}
        </Row>)}
    </>
}`,...(s=(a=e.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const R=["BasicGrid"];export{e as BasicGrid,R as __namedExportsOrder,B as default};
