import{j as e}from"./BaseStyles-5cc577b5.js";import{a as s,b as l,c as m}from"./TableCell-15e9f521.js";import{T as p}from"./TableHead-c071c9ef.js";function t({header:a=null,items:r,noResults:n,row:u,theme:i="primary"}){return r.length===0?e.jsx(e.Fragment,{children:n}):e.jsxs(s,{children:[a&&e.jsx(p,{children:e.jsx(l,{colour:i,children:a})}),e.jsx(m,{children:r.map((d,o)=>e.jsx(l,{children:u(d)},o))})]})}try{t.displayName="DataTable",t.__docgenInfo={description:"",displayName:"DataTable",props:{header:{defaultValue:{value:"null"},description:"",name:"header",required:!1,type:{name:"ReactNode"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"T[]"}},noResults:{defaultValue:null,description:"",name:"noResults",required:!0,type:{name:"ReactNode"}},theme:{defaultValue:{value:"primary"},description:"",name:"theme",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"primary"'},{value:'"secondary"'}]}},row:{defaultValue:null,description:"",name:"row",required:!0,type:{name:"(item: T) => ReactNode"}}}}}catch{}export{t as D};