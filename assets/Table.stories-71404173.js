import{j as a,B as b}from"./BaseStyles-5cc577b5.js";import{a as d,c as o,b as s,T as e}from"./TableCell-46befb50.js";import"./index-cb576d23.js";import"./_commonjsHelpers-de833af9.js";import"./polished.esm-8995ec32.js";const j={component:d},T=[{balance:500,date:"16th April 2019",transactions:[{amount:150,date:"2019-04-16T10:16:10.487Z",description:"Payment from Joe Bloggs",id:"48b45431-fecc-459b-948c-414b965289d6"},{amount:-5.25,date:"2019-04-17T12:11:10.487Z",description:"Lunch",id:"9a1170d0-6e4b-4fdb-84e4-0a87c98d8b72"}]},{balance:644.75,date:"20th April 2019",transactions:[{amount:150,date:"2019-04-20T10:16:10.487Z",description:"Payment from Joe Bloggs",id:"48b45431-fecc-459b-948c-414b965289d6"},{amount:-5.25,date:"2019-04-20T12:11:10.487Z",description:"Lunch",id:"9a1170d0-6e4b-4fdb-84e4-0a87c98d8b72"}]}],t={name:"Basic table",render:()=>a.jsxs(a.Fragment,{children:[a.jsx(b,{}),a.jsxs(d,{children:[T.map(l=>a.jsxs(o,{children:[a.jsxs(s,{colour:"primary",children:[a.jsx(e,{as:"th",children:"Date"}),a.jsx(e,{as:"th",children:"Balance"})]}),a.jsxs(s,{colour:"primary",children:[a.jsx(e,{as:"th",children:l.date}),a.jsxs(e,{as:"th",children:["£",l.balance.toString()]})]}),a.jsxs(s,{colour:"secondary",children:[a.jsx(e,{as:"th",children:"Transaction"}),a.jsx(e,{as:"th",children:"Value"})]}),l.transactions.map(r=>a.jsxs(s,{children:[a.jsx(e,{children:r.description}),a.jsxs(e,{children:["£",r.amount]})]},r.id))]},l.date)),a.jsx(o,{})]})]})};var n,c,i;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: 'Basic table',
  render: () => <>
      <BaseStyles />

      <Table>
        {data.map(item => <TableBody key={item.date}>
            <TableRow colour="primary">
              <TableCell as="th">Date</TableCell>
              <TableCell as="th">Balance</TableCell>
            </TableRow>

            <TableRow colour="primary">
              <TableCell as="th">{item.date}</TableCell>
              <TableCell as="th">£{item.balance.toString()}</TableCell>
            </TableRow>

            <TableRow colour="secondary">
              <TableCell as="th">Transaction</TableCell>
              <TableCell as="th">Value</TableCell>
            </TableRow>

            {item.transactions.map(transaction => <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>£{transaction.amount}</TableCell>
              </TableRow>)}
          </TableBody>)}

        <TableBody />
      </Table>
    </>
}`,...(i=(c=t.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};const C=["BasicTable"];export{t as BasicTable,C as __namedExportsOrder,j as default};
