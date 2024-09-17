import{j as e,B as i}from"./BaseStyles-ba442780.js";import{T as a}from"./TableCell-f4d1c509.js";import{D as o}from"./DataTable-d7737561.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./polished.esm-8995ec32.js";import"./TableHead-6c50aa64.js";const u={component:o},c=[{name:"Item 1",price:"£220.00"},{name:"Item 2",price:"£250.50"},{name:"Item 3",price:"£291.36"}],r={name:"Basic data table",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(i,{}),e.jsx(o,{items:c,header:e.jsxs(e.Fragment,{children:[e.jsx(a,{as:"th",children:"Name"}),e.jsx(a,{as:"th",children:"Price"})]}),row:({name:m,price:n})=>e.jsxs(e.Fragment,{children:[e.jsx(a,{children:m}),e.jsx(a,{children:n})]}),noResults:e.jsx("p",{children:"No data found"})})]})};var s,t,l;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  name: 'Basic data table',
  render: () => <>
      <BaseStyles />

      <DataTable items={data} header={<>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Price</TableCell>
          </>} row={({
      name,
      price
    }) => <>
            <TableCell>{name}</TableCell>
            <TableCell>{price}</TableCell>
          </>} noResults={<p>No data found</p>} />
    </>
}`,...(l=(t=r.parameters)==null?void 0:t.docs)==null?void 0:l.source}}};const C=["BasicDataTable"];export{r as BasicDataTable,C as __namedExportsOrder,u as default};
