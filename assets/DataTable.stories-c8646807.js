import{j as e,B as i}from"./BaseStyles-5cc577b5.js";import{T as a}from"./TableCell-15e9f521.js";import{D as o}from"./DataTable-42cc4a1f.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";import"./polished.esm-8995ec32.js";import"./TableHead-c071c9ef.js";const u={component:o},c=[{name:"Item 1",price:"£220.00"},{name:"Item 2",price:"£250.50"},{name:"Item 3",price:"£291.36"}],r={name:"Basic data table",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(i,{}),e.jsx(o,{items:c,header:e.jsxs(e.Fragment,{children:[e.jsx(a,{as:"th",children:"Name"}),e.jsx(a,{as:"th",children:"Price"})]}),row:({name:m,price:n})=>e.jsxs(e.Fragment,{children:[e.jsx(a,{children:m}),e.jsx(a,{children:n})]}),noResults:e.jsx("p",{children:"No data found"})})]})};var s,t,l;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
