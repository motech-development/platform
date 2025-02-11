import{s as o,j as e,L as M,B as N}from"./BaseStyles-5cc577b5.js";import{d as a}from"./index-89a01c4d.js";import{F as T,b as W,c as L}from"./index.es-75513cd4.js";import{r as i}from"./index-cb576d23.js";import{u as O}from"./usePopper-6b5093f0.js";import{B as H}from"./Button-a584e6c0.js";import{D as K}from"./DataTable-44d7f070.js";import{u as G}from"./useOutsideClick-0a907122.js";import{T as w}from"./TableCell-020911ae.js";import{T as J}from"./Typography-fd0859c4.js";import"./_commonjsHelpers-de833af9.js";import"./index-d600d685.js";import"./BaseButton-da33bdb9.js";import"./polished.esm-8995ec32.js";import"./Loader-96caa853.js";import"./TableHead-a9df8dbe.js";const Q=o.div`
  height: 0;
  position: absolute;
  width: 0;
  border-bottom: 5px solid #007fa8;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  top: -5px;
`,U=o(H)`
  background: none;
  color: inherit;

  :hover {
    background: none;
    color: inherit;
  }
`,X=o.div`
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
`,Y=o.div`
  position: relative;
`,Z=o.div`
  background-color: rgb(199, 56, 79);
  border-radius: 50%;
  color: #fff;
  padding: 5px;
  pointer-events: none;
  position: absolute;
  right: 5px;
  top: -5px;
  transform: scale(0.5);
  z-index: 1;
`,ee=()=>e.jsx(Z,{children:e.jsx(T,{icon:L})});function d({alert:r,cols:t=1,items:c,label:s,noResults:V,onClose:k,placement:q="bottom",row:S}){const f=i.useRef(!0),[n,x]=i.useState(!1),[h,R]=i.useState(null),[F,D]=i.useState(null),[$,z]=i.useState(null),{attributes:P,styles:b}=O(h,$,{modifiers:[{name:"arrow",options:{element:F}}],placement:q,strategy:"fixed"}),I=()=>{x(!n)};return G(h,()=>{x(!1)}),i.useEffect(()=>{if(f.current){f.current=!1;return}n||Promise.resolve().then(k,()=>{})},[n]),e.jsxs(Y,{ref:R,children:[r&&e.jsx(ee,{}),e.jsx(U,{"aria-label":s,size:"sm",onClick:I,children:e.jsx(T,{icon:W})}),n&&e.jsxs(X,{ref:z,style:b.popper,...P.popper,children:[e.jsx(K,{header:e.jsx(w,{as:"th",align:"left",colSpan:t,children:s}),items:c,noResults:V,row:S}),e.jsx(Q,{ref:D,style:b.arrow})]})]})}try{d.displayName="Notifications",d.__docgenInfo={description:"",displayName:"Notifications",props:{alert:{defaultValue:null,description:"",name:"alert",required:!0,type:{name:"boolean"}},cols:{defaultValue:{value:"1"},description:"",name:"cols",required:!1,type:{name:"number"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"T[]"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},noResults:{defaultValue:null,description:"",name:"noResults",required:!0,type:{name:"ReactNode"}},placement:{defaultValue:{value:"bottom"},description:"",name:"placement",required:!1,type:{name:"enum",value:[{value:'"bottom"'},{value:'"bottom-end"'},{value:'"bottom-start"'}]}},row:{defaultValue:null,description:"",name:"row",required:!0,type:{name:"(item: T) => ReactNode"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!0,type:{name:"() => void | Promise<void>"}}}}}catch{}const re=o.div`
  align-items: center;
  display: flex;
  min-height: 64px;
  padding: 0 1rem;
`,oe=o.header`
  ${({$colour:r,theme:t})=>`
    background-color: ${t[r].background};
    border-bottom: 1px solid ${t[r].border};
    box-sizing: border-box;
    color: ${t[r].colour};
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    user-select: none;
    width: 100%;
    z-index: 1100;
  `}
`,te={primary:{background:"#161616",border:"#222",colour:"#fff"},secondary:{background:"#f6f9fc",border:"#ccc",colour:"#333"}},ae=o.div`
  ${({$fixed:r})=>`
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
      0 1px 14px 0 rgba(0, 0, 0, 0.12);
    flex-grow: 1;
    left: 0;
    position: ${r?"fixed":"relative"};
    top: 0;
    width: 100%;
    z-index: 10;
  `}
`,m=({children:r,colour:t="primary",element:c="header",fixed:s=!1})=>e.jsx(M,{theme:te,children:e.jsx(ae,{$fixed:s,children:e.jsx(oe,{as:c,$colour:t,children:e.jsx(re,{children:r})})})}),u=m;try{m.displayName="AppBar",m.__docgenInfo={description:"",displayName:"AppBar",props:{colour:{defaultValue:{value:"primary"},description:"",name:"colour",required:!1,type:{name:"string | number"}},element:{defaultValue:{value:"header"},description:"",name:"element",required:!1,type:{name:"enum",value:[{value:'"div"'},{value:'"header"'}]}},fixed:{defaultValue:{value:"false"},description:"",name:"fixed",required:!1,type:{name:"boolean"}}}}}catch{}const Be={component:u,decorators:[a.withKnobs]},_=o(J)`
  && {
    margin: 0;
  }
`,E={Div:"div",Header:"header"},C={Primary:"primary",Secondary:"secondary"},l={name:"Basic app bar",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(N,{}),e.jsx(u,{colour:a.select("Colour",C,"primary"),element:a.select("Element",E,"header"),fixed:a.boolean("Fixed",!1),children:e.jsx(_,{component:"h1",variant:"h5",children:"Motech Development"})})]})},p={name:"App bar with notifications",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(N,{}),e.jsxs(u,{colour:a.select("Colour",C,"primary"),element:a.select("Element",E,"header"),fixed:a.boolean("Fixed",!1),children:[e.jsx(_,{component:"h1",variant:"h5",children:"Motech Development"}),e.jsx(d,{alert:!0,items:[{message:"This is a notification"},{message:"This is another notification"}],label:"Notifications",noResults:e.jsx("div",{}),row:({message:r})=>e.jsx(w,{children:r}),onClose:()=>{}})]})]})};var g,y,v;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Basic app bar',
  render: () => <>
      <BaseStyles />

      <AppBar colour={select('Colour', colours, 'primary')} element={select('Element', elements, 'header') as 'header' | 'div'} fixed={boolean('Fixed', false)}>
        <Title component="h1" variant="h5">
          Motech Development
        </Title>
      </AppBar>
    </>
}`,...(v=(y=l.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var B,j,A;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'App bar with notifications',
  render: () => <>
      <BaseStyles />

      <AppBar colour={select('Colour', colours, 'primary')} element={select('Element', elements, 'header') as 'header' | 'div'} fixed={boolean('Fixed', false)}>
        <Title component="h1" variant="h5">
          Motech Development
        </Title>

        <Notifications alert items={[{
        message: 'This is a notification'
      }, {
        message: 'This is another notification'
      }]} label="Notifications" noResults={<div />} row={({
        message
      }) => <TableCell>{message}</TableCell>} onClose={() => {}} />
      </AppBar>
    </>
}`,...(A=(j=p.parameters)==null?void 0:j.docs)==null?void 0:A.source}}};const je=["BasicAppBar","AppBarWithNotifications"];export{p as AppBarWithNotifications,l as BasicAppBar,je as __namedExportsOrder,Be as default};
