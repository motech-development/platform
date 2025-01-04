import{s as t,j as e,B as m}from"./BaseStyles-5cc577b5.js";import{d as n}from"./index-89a01c4d.js";import{T as g}from"./Typography-e17563a6.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";const o=t(g)`
  line-height: 1.4;
  margin: 0 0 0.2rem;
`,u=t.span`
  background-color: #007fa8;
  box-decoration-break: clone;
  color: #fff;
  display: inline;
  padding: 0.25rem 0.5rem;
`,y=t.span`
  background-color: #f8f8f8;
  box-decoration-break: clone;
  color: #000;
  display: inline;
  padding: 0.25rem 0.5rem;
`,x=t.hr`
  border: 0;
  margin: 0;
  padding: 0;
`,h=t.div`
  margin-bottom: 1rem;
  padding: 0 0.25rem 0 0;
`,i=({subTitle:a=null,title:d})=>e.jsxs(h,{children:[e.jsx(o,{component:"h2",variant:"h2",children:e.jsx(u,{children:d})}),e.jsx(x,{}),a&&e.jsx(o,{component:"p",variant:"lead",margin:"none",children:e.jsx(y,{children:a})})]}),c=i;try{i.displayName="PageTitle",i.__docgenInfo={description:"",displayName:"PageTitle",props:{subTitle:{defaultValue:{value:"null"},description:"",name:"subTitle",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}}}}}catch{}const P={component:c,decorators:[n.withKnobs]},r={name:"Basic typography",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(m,{}),e.jsx(c,{title:n.text("Title","Page title"),subTitle:n.text("Subtitle","")})]})};var s,l,p;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  name: 'Basic typography',
  render: () => <>
      <BaseStyles />

      <PageTitle title={text('Title', 'Page title')} subTitle={text('Subtitle', '')} />
    </>
}`,...(p=(l=r.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const B=["BasicTypography"];export{r as BasicTypography,B as __namedExportsOrder,P as default};
