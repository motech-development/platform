import{s as r,j as a,L as c}from"./BaseStyles-5cc577b5.js";import{b as f,B as h}from"./BaseButton-9ff2d943.js";import{L as v}from"./Loader-96caa853.js";const l={lg:{height:"36px",margin:"-18px 0 0 -18px",width:"36px"},md:{height:"28px",margin:"-14px 0 0 -14px",width:"28px"},sm:{height:"20px",margin:"-10px 0 0 -10px",width:"20px"}},y=r(v)`
  ${({$size:e})=>`
    height: ${l[e].height};
    margin: ${l[e].margin};
    width: ${l[e].width};
  `}
`,x=r.span`
  ${({$isLoading:e})=>`
    visibility: ${e?"hidden":"visible"};
  `}
`,n=({block:e=!1,children:o,colour:s="primary",disabled:u=!1,loading:t=!1,size:i="md",type:d="button",...p})=>{const m=s==="secondary"?"default":"secondary";return a.jsx(c,{theme:f,children:a.jsxs(h,{block:e,colour:s,type:d,size:i,disabled:u||t,...p,children:[t&&a.jsx(y,{colour:m,$size:i}),a.jsx(x,{$isLoading:t,children:o})]})})},_=n;try{n.displayName="Button",n.__docgenInfo={description:"",displayName:"Button",props:{block:{defaultValue:{value:"false"},description:"",name:"block",required:!1,type:{name:"boolean"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},loading:{defaultValue:{value:"false"},description:"",name:"loading",required:!1,type:{name:"boolean"}},type:{defaultValue:{value:"button"},description:"",name:"type",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"submit"'},{value:'"reset"'}]}},colour:{defaultValue:{value:"primary"},description:"",name:"colour",required:!1,type:{name:"enum",value:[{value:'"primary"'},{value:'"secondary"'},{value:'"danger"'},{value:'"success"'}]}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}}}}}catch{}export{_ as B};
