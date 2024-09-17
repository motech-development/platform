import{j as n,B as m}from"./BaseStyles-ba442780.js";import{d as e}from"./index-49721cb5.js";import{C as i}from"./Card-15d83a81.js";import{T as s}from"./Typography-fc480bb2.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./index-633d3215.js";const C={component:s,decorators:[e.withKnobs]},l={H1:"h1",H2:"h2",H3:"h3",H4:"h4",H5:"h5",H6:"h6",Paragraph:"p"},p={...l,Lead:"lead"},c={Centre:"center",Left:"left",Right:"right"},g={Large:"lg",Medium:"md",None:"none",Small:"sm"},r={name:"Basic typography",render:()=>n.jsxs(n.Fragment,{children:[n.jsx(m,{}),n.jsx(i,{children:n.jsx(s,{align:e.select("Alignment",c,"left"),variant:e.select("Variant",p,"h1"),component:e.select("Component",l,"h1"),margin:e.select("Margin",g,"md"),rule:e.boolean("Horizontal rule",!1),children:e.text("Text","Hello world")})})]})};var t,a,o;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  name: 'Basic typography',
  render: () => <>
      <BaseStyles />

      <Card>
        <Typography align={select('Alignment', alignment, 'left') as 'left' | 'right' | 'center'} variant={select('Variant', variants, 'h1') as Components | 'lead'} component={select('Component', components, 'h1') as Components} margin={select('Margin', margin, 'md') as 'lg' | 'md' | 'sm' | 'none'} rule={boolean('Horizontal rule', false)}>
          {text('Text', 'Hello world')}
        </Typography>
      </Card>
    </>
}`,...(o=(a=r.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const T=["BasicTypography"];export{r as BasicTypography,T as __namedExportsOrder,C as default};
