import{s as o,j as l,L as c}from"./BaseStyles-5cc577b5.js";import{c as u}from"./polished.esm-8995ec32.js";const f=o.div`
  border-bottom: 2px solid #007fa8;
  display: block;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`,p=o.table`
  ${({$fixed:e})=>`
    background-color: #fff;
    max-width: 100%;
    table-layout: ${e?"fixed":"auto"};
    width: 100%;
  `}
`,t=({children:e,fixed:a=!1,...r})=>l.jsx(f,{children:l.jsx(p,{$fixed:a,...r,children:e})}),h=t;try{t.displayName="Table",t.__docgenInfo={description:"",displayName:"Table",props:{fixed:{defaultValue:{value:"false"},description:"",name:"fixed",required:!1,type:{name:"boolean"}}}}}catch{}const d=o.tbody`
  background-color: #fff;
  color: #000;
`;try{d.displayName="TableBody",d.__docgenInfo={description:"",displayName:"TableBody",props:{ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"((instance: HTMLTableSectionElement | null) => void) | RefObject<HTMLTableSectionElement> | null"}},theme:{defaultValue:null,description:"",name:"theme",required:!1,type:{name:"DefaultTheme"}},as:{defaultValue:null,description:"",name:"as",required:!1,type:{name:"undefined"}},forwardedAs:{defaultValue:null,description:"",name:"forwardedAs",required:!1,type:{name:"undefined"}}}}}catch{}const b={default:{background:"#fff",border:"#eee",colour:"#000"},primary:{background:"#007fa8",border:u(.02,"#007fa8"),colour:"#fff"},secondary:{background:"#f6f9fc",border:"#eee",colour:"#333"}},m=o.tr`
  ${({$colour:e,theme:a})=>`
    background-color: ${a[e].background};
    border-bottom: 2px solid ${a[e].border};
    color: ${a[e].colour};
  `}
`,n=({colour:e="default",...a})=>l.jsx(c,{theme:b,children:l.jsx(m,{$colour:e,...a})});try{n.displayName="TableRow",n.__docgenInfo={description:"",displayName:"TableRow",props:{colour:{defaultValue:{value:"default"},description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"primary"'},{value:'"secondary"'}]}}}}}catch{}const i=(e,a="inherit")=>`
  padding: 10px;
  text-align: ${a};
  vertical-align: middle;
  ${e?"white-space: nowrap;":""}
`,y=o.td`
  ${({align:e,$noWrap:a})=>`
    ${i(a,e)}
    font-weight: 300;
  `}
`,_=o.th`
  ${({align:e,$noWrap:a})=>`
    ${i(a,e)}
    font-family: 'Cabin', sans-serif;
    font-weight: 600;
  `}
`,s=({as:e="td",noWrap:a=!0,...r})=>e==="td"?l.jsx(y,{$noWrap:a,...r}):l.jsx(_,{$noWrap:a,...r});try{s.displayName="TableCell",s.__docgenInfo={description:"",displayName:"TableCell",props:{as:{defaultValue:{value:"td"},description:"",name:"as",required:!1,type:{name:"enum",value:[{value:'"td"'},{value:'"th"'}]}},noWrap:{defaultValue:{value:"true"},description:"",name:"noWrap",required:!1,type:{name:"boolean"}}}}}catch{}export{s as T,h as a,n as b,d as c};
