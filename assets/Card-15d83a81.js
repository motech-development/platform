import{s as r,j as n,L as p}from"./BaseStyles-ba442780.js";const s={lg:{padding:"20px"},md:{padding:"10px"},none:{padding:"0"},sm:{padding:"5px"}},i=r.div`
  ${({$padding:d,theme:a})=>`
    background: #f8f8f8;
    color: #000;
    padding: ${a[d].padding}
  `}
`,e=({children:d,padding:a="md"})=>n.jsx(p,{theme:s,children:n.jsx(i,{$padding:a,children:d})}),t=e;try{e.displayName="Card",e.__docgenInfo={description:"",displayName:"Card",props:{padding:{defaultValue:{value:"md"},description:"",name:"padding",required:!1,type:{name:"enum",value:[{value:'"none"'},{value:'"lg"'},{value:'"md"'},{value:'"sm"'}]}}}}}catch{}export{t as C};
