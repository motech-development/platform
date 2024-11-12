import{s as o,j as l}from"./BaseStyles-5cc577b5.js";const n={lg:1,md:.5,none:0,sm:.25},h=o.p`
  ${({$align:e,$breakWord:t,$margin:a,$truncate:u,$variant:r})=>`
    margin: ${n[a]?`0 0 ${n[a]}rem`:"0"};
    text-align: ${e};

    ${t?`
      hyphens: auto;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
      word-break: break-word;
    `:""}

    ${u?`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `:""}

    ${(()=>{switch(r){case"p":return`
            color: inherit;
            line-height: 1.5;
          `;case"lead":return`
            font-size: 1.25rem;
            font-weight: 300;
            line-height: 1.5;
          `;default:return`
            color: inherit;
            font-family: 'Cabin', sans-serif;
            font-size: ${(()=>{switch(r){case"h6":return"1rem";case"h5":return"1.25rem";case"h4":return"1.5rem";case"h3":return"1.75rem";case"h2":return"2rem";default:return"2.5rem"}})()};
            font-weight: 600;
            line-height: 1.2;
        `}})()}
  `}
`,f=o.hr`
  ${({$margin:e})=>`
    border: 0;
    border-top: 2.5px solid #007fa8;
    margin: ${n[e]?`${n[e]}rem 0`:"0"};
    padding: 0;

  `}
`,i=({align:e="left",breakWord:t=!1,children:a,className:u="",component:r,id:d,margin:s="md",rule:p=!1,truncate:m=!1,variant:c})=>l.jsxs(l.Fragment,{children:[l.jsx(h,{id:d,as:r,className:u,$align:e,$breakWord:t,$margin:s,$truncate:m,$variant:c,children:a}),p&&l.jsx(f,{$margin:s})]}),g=i;try{i.displayName="Typography",i.__docgenInfo={description:"",displayName:"Typography",props:{align:{defaultValue:{value:"left"},description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"left"'},{value:'"right"'}]}},breakWord:{defaultValue:{value:"false"},description:"",name:"breakWord",required:!1,type:{name:"boolean"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string"}},component:{defaultValue:null,description:"",name:"component",required:!0,type:{name:"enum",value:[{value:'"h1"'},{value:'"h2"'},{value:'"h3"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"p"'}]}},id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string"}},margin:{defaultValue:{value:"md"},description:"",name:"margin",required:!1,type:{name:"enum",value:[{value:'"none"'},{value:'"lg"'},{value:'"md"'},{value:'"sm"'}]}},rule:{defaultValue:{value:"false"},description:"",name:"rule",required:!1,type:{name:"boolean"}},truncate:{defaultValue:{value:"false"},description:"",name:"truncate",required:!1,type:{name:"boolean"}},variant:{defaultValue:null,description:"",name:"variant",required:!0,type:{name:"enum",value:[{value:'"h1"'},{value:'"h2"'},{value:'"h3"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"p"'},{value:'"lead"'}]}}}}}catch{}export{g as T};
